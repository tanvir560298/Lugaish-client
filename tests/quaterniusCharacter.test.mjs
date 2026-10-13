import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { AnimationMixer, Vector3 } from "three";
import { createStudentMotion } from "../src/characters/studentMotion.js";
import {
  quaterniusTemplate,
  measureNativeGait,
} from "../src/characters/quaterniusCharacter.js";
test("verified native GLB keeps independent valid skeletons and its own gait calibration", async () => {
  const b = readFileSync(
    new URL(
      "../public/models/student/quaternius/casual-character.glb",
      import.meta.url,
    ),
  );
  assert.equal(b.toString("ascii", 0, 4), "glTF");
  assert.equal(b.readUInt32LE(4), 2);
  assert.equal(b.readUInt32LE(8), b.length);
  assert.equal(
    createHash("sha256").update(b).digest("hex"),
    "fea7e71271203e7073f1a073fa1208de7402df276f87f80e149bf7589b5d46b4",
  );
  const g = await new GLTFLoader().parseAsync(
    b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength),
    "",
  );
  assert.equal(g.animations.length, 24);
  assert.equal(
    g.animations.some((c) => /sit/i.test(c.name)),
    false,
  );
  const t = quaterniusTemplate(g),
    a = clone(t.scene),
    other = clone(t.scene);
  let count = 0;
  a.traverse((o) => {
    if (!o.isSkinnedMesh) return;
    count++;
    assert.equal(o.skeleton.bones.length, 62);
    assert.ok(o.skeleton.bones.every(Boolean));
    const twin = other.getObjectByName(o.name);
    assert.notEqual(o.skeleton, twin.skeleton);
    assert.notEqual(o.skeleton.bones[0], twin.skeleton.bones[0]);
    assert.equal(o.geometry, twin.geometry);
    assert.equal(o.material, twin.material);
  });
  assert.equal(count, 10);
  const mixer = new AnimationMixer(a);
  const walk = measureNativeGait(a, mixer, t.clips.walk, t.scale),
    run = measureNativeGait(a, mixer, t.clips.run, t.scale);
  assert.ok(walk > 1 && walk < 1.6);
  assert.ok(run > 2.5 && run < 3.2);
  assert.ok(t.scale > 0.9 && t.scale < 1);

  const actions = Object.fromEntries(
    Object.entries(t.clips).map(([k, c]) => [k, mixer.clipAction(c)]),
  );
  for (let i = 0; i < 2; i++) {
    const controller = createStudentMotion({ actions, clipSpeeds: t.speeds });
    controller.update(0.016, new Vector3(0, 0, 1.3), a, 0);
    mixer.update(0.016);
    for (let frame = 0; frame < 90; frame++) {
      controller.update(1 / 60, new Vector3(0, 0, 5.84), a, 0);
      mixer.update(1 / 60);
    }
    assert.ok(actions.run.getEffectiveWeight() > 0.98);
    assert.ok(actions.walk.getEffectiveWeight() < 0.02);
    controller.dispose();
    mixer.stopAllAction();
  }
  assert.equal(quaterniusTemplate(g), t);
  assert.ok(
    Math.abs(
      g.scene.getObjectByName("Casual2_Feet_1").material.metalness - 0.4,
    ) < 1e-6,
  );
});
