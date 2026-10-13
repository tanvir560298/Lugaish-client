import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  AnimationMixer,
  AnimationClip,
  QuaternionKeyframeTrack,
  VectorKeyframeTrack,
  Vector3,
  Quaternion,
  Box3,
} from "three";
import {
  nativeChain,
  solveNativeChain,
  worldPosition,
  worldQuaternion,
} from "../src/characters/nativeRigIK.js";
const path = new URL(
    "../public/models/student/quaternius/casual-character.glb",
    import.meta.url,
  ),
  bytes = readFileSync(path),
  sha = createHash("sha256").update(bytes).digest("hex");
if (sha !== "fea7e71271203e7073f1a073fa1208de7402df276f87f80e149bf7589b5d46b4")
  throw Error("Authoring source changed; re-review the rig");
const gltf = await new GLTFLoader().parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    "",
  ),
  scene = gltf.scene,
  mixer = new AnimationMixer(scene);
const scale = 1.7 / new Box3().setFromObject(scene).getSize(new Vector3()).y;
const idle = mixer
  .clipAction(
    gltf.animations.find((c) => c.name === "CharacterArmature|Idle_Neutral"),
  )
  .play();
mixer.setTime(0);
scene.updateMatrixWorld(true);
const bones = [];
scene.traverse((o) => {
  if (o.isBone) bones.push(o);
});
const rest = new Map(
  bones.map((o) => [
    o,
    { position: o.position.clone(), quaternion: o.quaternion.clone() },
  ]),
);
const body = scene.getObjectByName("Body"),
  hips = scene.getObjectByName("Hips"),
  head = scene.getObjectByName("Head");
const bodyBase = body.getWorldPosition(new Vector3()),
  hipQ = hips.getWorldQuaternion(new Quaternion()),
  headQ = head.getWorldQuaternion(new Quaternion());
const legs = ["L", "R"].map((s) =>
  nativeChain(scene, "UpperLeg" + s, "LowerLeg" + s, "Foot" + s),
);
const arms = ["L", "R"].map((s) =>
  nativeChain(scene, "UpperArm" + s, "LowerArm" + s, "Wrist" + s),
);
const feet = legs.map((l) => l.end.getWorldPosition(new Vector3())),
  wrists = arms.map((a) => a.end.getWorldPosition(new Vector3()));
const flatWrists = arms.map((a, i) => {
  const finger = scene
    .getObjectByName("Middle3" + (i === 0 ? "L" : "R"))
    .getWorldPosition(new Vector3())
    .sub(wrists[i])
    .normalize();
  return new Quaternion()
    .setFromUnitVectors(finger, new Vector3(0, 0, 1))
    .multiply(a.rotationEnd);
});
const ease = (t) => t * t * (3 - 2 * t),
  xAxis = new Vector3(1, 0, 0);
let worstReach = 0;
function pose(t, idleTime = 0) {
  for (const [bone, r] of rest) {
    bone.position.copy(r.position);
    bone.quaternion.copy(r.quaternion);
  }
  scene.updateMatrixWorld(true);
  const p = ease(t),
    lean = 0.48 * p + Math.sin(Math.PI * t) * 0.12;
  worldPosition(
    body,
    bodyBase
      .clone()
      .lerp(new Vector3(bodyBase.x, 0.535 / scale, -0.26 / scale), p),
  );
  worldQuaternion(
    hips,
    new Quaternion().setFromAxisAngle(xAxis, lean).multiply(hipQ),
  );
  // Use the current parent's orientation so the head follows the leaning trunk.
  head.quaternion.copy(rest.get(head).quaternion);
  head.rotateX(
    0.1 * p + (idleTime ? Math.sin((idleTime * Math.PI * 2) / 4) * 0.008 : 0),
  );
  scene.updateMatrixWorld(true);
  legs.forEach((l, i) => {
    const target = feet[i].clone().add(new Vector3(0, 0, (0.175 * p) / scale));
    const r = solveNativeChain(l, target, new Vector3(0, 0, 1));
    worstReach = Math.max(worstReach, r.reachError * scale);
    worldQuaternion(l.end, l.rotationEnd);
  });
  arms.forEach((a, i) => {
    const target = wrists[i]
      .clone()
      .lerp(
        new Vector3(
          (i === 0 ? 0.18 : -0.18) / scale,
          0.842 / scale,
          0.34 / scale,
        ),
        p,
      );
    const r = solveNativeChain(
      a,
      target,
      new Vector3(i === 0 ? 0.35 : -0.35, -1, 0),
    );
    worstReach = Math.max(worstReach, r.reachError * scale);
    const flat = flatWrists[i];
    worldQuaternion(a.end, a.rotationEnd.clone().slerp(flat, p));
  });
  scene.updateMatrixWorld(true);
}
function bake(name, duration, progress) {
  const samples = Math.ceil(duration * 30),
    times = [],
    values = new Map(bones.map((b) => [b, { p: [], q: [] }]));
  for (let i = 0; i <= samples; i++) {
    const seconds = (i / samples) * duration;
    times.push(seconds);
    pose(progress(i / samples), name === "zainSeatedIdle" ? seconds : 0);
    for (const b of bones) {
      const v = values.get(b);
      v.p.push(...b.position.toArray());
      v.q.push(...b.quaternion.toArray());
    }
  }
  const tracks = [];
  for (const b of bones) {
    const v = values.get(b);
    const track = (Kind, suffix, array, size) => {
      const constant = array.every(
        (n, i) => Math.abs(n - array[i % size]) < 1e-8,
      );
      return new Kind(
        b.name + suffix,
        constant ? [0, duration] : times,
        constant ? [...array.slice(0, size), ...array.slice(0, size)] : array,
      );
    };
    tracks.push(
      track(VectorKeyframeTrack, ".position", v.p, 3),
      track(QuaternionKeyframeTrack, ".quaternion", v.q, 4),
    );
  }

  const json = AnimationClip.toJSON(new AnimationClip(name, duration, tracks));
  json.uuid = "lugaish-" + name + "-v1";
  return json;
}
const clips = [
  bake("zainSitDown", 1.291667, (t) => t),
  bake("zainSeatedIdle", 4, () => 1),
  bake("zainStandUp", 1, (t) => 1 - t),
];
if (worstReach > 0.012)
  throw Error("Unsafe arm/leg target reach " + worstReach);
const data = {
  author: "Lugaish native-rig authoring script",
  license: "CC0-1.0",
  sourceSha256: sha,
  rig: "quaternius-casual-62-v1",
  normalizedHeight: 1.7,
  seatTop: 0.505,
  chairForwardOffset: 0.33,
  rootTravel: 0.175,
  maxTargetReachError: worstReach,
  clips,
};
writeFileSync(
  new URL("../src/characters/animations/quaternius-study.js", import.meta.url),
  "// Generated by scripts/author-quaternius-study.mjs; original native skeletal animation, CC0-1.0.\nexport default " +
    JSON.stringify(data, (k, v) =>
      typeof v === "number" ? Number(v.toFixed(7)) : v,
    ) +
    ";\n",
);
console.log({
  scale,
  bytes: JSON.stringify(data).length,
  clips: clips.map((c) => [c.name, c.duration]),
  worstReach,
});
