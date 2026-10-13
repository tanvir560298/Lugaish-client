import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { AnimationMixer, Group, Vector3 } from "three";
import { quaterniusTemplate } from "../src/characters/quaterniusCharacter.js";
import { createNativeSeating } from "../src/characters/nativeSeating.js";
import { createStudentMotion } from "../src/characters/studentMotion.js";
const bytes = readFileSync(
  new URL(
    "../public/models/student/quaternius/casual-character.glb",
    import.meta.url,
  ),
);
const source = await new GLTFLoader().parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    "",
  ),
  template = quaterniusTemplate(source);
function rig(callbacks = {}) {
  const scene = clone(template.scene),
    root = new Group(),
    visual = new Group(),
    scale = new Group(),
    floor = new Group();
  scale.scale.setScalar(template.scale);
  floor.position.y = template.floorOffset;
  root.add(visual);
  visual.add(scale);
  scale.add(floor);
  floor.add(scene);
  const mixer = new AnimationMixer(scene),
    actions = Object.fromEntries(
      Object.entries(template.clips).map(([k, c]) => [k, mixer.clipAction(c)]),
    );
  const walk = createStudentMotion({ actions, clipSpeeds: template.speeds });
  mixer.update(0);
  root.updateMatrixWorld(true);
  return {
    scene,
    root,
    visual,
    mixer,
    actions,
    walk,
    seating: createNativeSeating({
      scene,
      visual,
      mixer,
      actions,
      ...callbacks,
    }),
  };
}
const point = (r, n) =>
  r.scene.getObjectByName(n).getWorldPosition(new Vector3());
test("authored clips map to the native rig and seated skin contacts chair and floor without limb stretching", () => {
  const r = rig();
  let lengths = [
    point(r, "UpperLegL").distanceTo(point(r, "LowerLegL")),
    point(r, "UpperArmL").distanceTo(point(r, "LowerArmL")),
    point(r, "LowerArmL").distanceTo(point(r, "WristL")),
  ];
  r.seating.update(
    { seated: true, state: "seated", restoreSeated: true, facing: 0 },
    0.016,
    {},
  );
  r.root.updateMatrixWorld(true);
  assert.equal(r.seating.mode, "seated");
  for (const name of ["sitDown", "seated", "standUp"])
    for (const track of template.clips[name].tracks)
      assert.ok(r.scene.getObjectByName(track.name.split(".")[0]));
  const after = [
    point(r, "UpperLegL").distanceTo(point(r, "LowerLegL")),
    point(r, "UpperArmL").distanceTo(point(r, "LowerArmL")),
    point(r, "LowerArmL").distanceTo(point(r, "WristL")),
  ];
  after.forEach((v, i) => assert.ok(Math.abs(v - lengths[i]) < 0.001));
  let feet = [],
    butt = [],
    hands = [];
  r.scene.traverse((o) => {
    if (!o.isSkinnedMesh) return;
    for (let i = 0; i < o.geometry.attributes.position.count; i++) {
      let v = o.getVertexPosition(i, new Vector3());
      o.localToWorld(v);
      if (o.name.includes("Feet")) feet.push(v.y);
      if (
        o.name.includes("Legs") &&
        Math.abs(v.x) < 0.25 &&
        v.z < -0.085 &&
        v.z > -0.55 &&
        v.y > 0.25
      )
        butt.push(v.y);
      if (o.name.includes("Body") && v.z > 0.42 && Math.abs(v.x) < 0.28)
        hands.push(v.y);
    }
  });
  assert.ok(Math.min(...feet) > -0.008 && Math.min(...feet) < 0.008);
  assert.ok(Math.abs(Math.min(...butt) - 0.505) < 0.012);
  assert.ok(Math.min(...hands) > 0.779, String(Math.min(...hands)));
  assert.ok(point(r, "LowerLegL").z > point(r, "UpperLegL").z + 0.3);
});
test("confirmed sit and stand progress preserves mesh identity, planted feet and once-only callbacks", () => {
  let seated = 0,
    standing = 0;
  const r = rig({ onSeated: () => seated++, onStanding: () => standing++ });
  const mesh = r.scene.getObjectByName("Casual2_Body_1"),
    geometry = mesh.geometry;
  const approach = 0.505,
    seat = 0.33;
  r.root.position.z = approach;
  r.root.updateMatrixWorld(true);
  const foot = point(r, "FootL").clone();
  for (let i = 0; i <= 60; i++) {
    const p = i / 60,
      smooth = p * p * (3 - 2 * p);
    r.root.position.z = approach + (seat - approach) * smooth;
    r.root.updateMatrixWorld(true);
    r.seating.update(
      { seated: true, state: "sit", transitionProgress: p, facing: 0 },
      1 / 60,
      {},
    );
    assert.equal(mesh.geometry, geometry);
    assert.ok(point(r, "FootL").distanceTo(foot) < 0.002);
  }
  assert.equal(seated, 0);
  r.seating.update({ seated: true, state: "seated", facing: 0 }, 1 / 60, {});
  r.seating.update({ seated: true, state: "seated", facing: 0 }, 1 / 60, {});
  assert.equal(seated, 1);
  assert.ok(point(r, "FootL").distanceTo(foot) < 0.002);
  for (let i = 0; i <= 60; i++) {
    const p = i / 60,
      smooth = p * p * (3 - 2 * p);
    r.root.position.z = seat + (approach - seat) * smooth;
    r.root.updateMatrixWorld(true);
    r.seating.update(
      { seated: false, state: "stand", transitionProgress: p, facing: 0 },
      1 / 60,
      {
        restart() {
          r.walk.dispose();
          r.walk = createStudentMotion({
            actions: r.actions,
            clipSpeeds: template.speeds,
          });
        },
      },
    );
    if (i < 60) assert.ok(point(r, "FootL").distanceTo(foot) < 0.002);
  }
  assert.equal(standing, 1);
  assert.equal(r.seating.mode, "locomotion");
  r.mixer.update(0);
  assert.equal(r.scene.getObjectByName("Casual2_Body_1"), mesh);
});
test("instances, mixers and restored/reduced-motion poses stay independent", () => {
  const a = rig(),
    b = rig(),
    before = point(b, "Body").clone();
  a.seating.update(
    {
      state: "seated",
      seated: true,
      restoreSeated: true,
      reducedMotion: true,
      facing: 0,
    },
    0.016,
    {},
  );
  const head = a.scene.getObjectByName("Head").quaternion.clone();
  for (let i = 0; i < 10; i++)
    a.seating.update(
      { state: "seated", seated: true, reducedMotion: true, facing: 0 },
      0.1,
      {},
    );
  assert.ok(head.angleTo(a.scene.getObjectByName("Head").quaternion) < 1e-6);
  assert.ok(point(b, "Body").distanceTo(before) < 1e-8);
  assert.notEqual(
    a.scene.getObjectByName("Body"),
    b.scene.getObjectByName("Body"),
  );
  assert.equal(
    a.scene.getObjectByName("Casual2_Body_1").geometry,
    b.scene.getObjectByName("Casual2_Body_1").geometry,
  );
  assert.notEqual(
    a.scene.getObjectByName("Casual2_Body_1").skeleton,
    b.scene.getObjectByName("Casual2_Body_1").skeleton,
  );
  assert.equal(
    b.seating.update({ seated: false, state: "idle" }, 0.1, {}),
    false,
  );
});

test("unsafe native bone mappings are rejected before animation binding", () => {
  const scene = clone(source.scene);
  scene.getObjectByName("Body").name = "UnsupportedBody";
  assert.throws(
    () => quaterniusTemplate({ ...source, scene }),
    /Invalid seated bone mapping/,
  );
  assert.throws(
    () =>
      quaterniusTemplate({
        ...source,
        scene: clone(source.scene),
        animations: source.animations.filter((c) => !c.name.endsWith("|Walk")),
      }),
    /native walk animation/,
  );
});
test("reduced-motion standing completes once even while a confirmed transition state remains active", () => {
  let calls = 0;
  const r = rig({ onStanding: () => calls++ });
  r.seating.update(
    { state: "seated", seated: true, reducedMotion: true, restoreSeated: true },
    0.016,
    {},
  );
  for (let i = 0; i < 5; i++)
    r.seating.update(
      {
        state: "stand",
        seated: false,
        reducedMotion: true,
        transitionProgress: 0.1 * i,
      },
      0.016,
      {
        restart() {
          r.walk.dispose();
          r.walk = createStudentMotion({
            actions: r.actions,
            clipSpeeds: template.speeds,
          });
        },
      },
    );
  assert.equal(calls, 1);
  assert.equal(r.seating.mode, "locomotion");
});

test("a model loaded midway through confirmed sitting initializes at the authoritative pose", () => {
  const r = rig();
  r.seating.update(
    { state: "sit", seated: true, transitionProgress: 0.5, facing: 0 },
    0.016,
    {},
  );
  const y = point(r, "Body").y;
  assert.ok(y > 0.65 && y < 0.69, String(y));
  assert.equal(r.seating.mode, "sitDown");
});
