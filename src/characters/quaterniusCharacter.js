import { Box3, Vector3, AnimationClip, AnimationMixer } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import studyClips from "./animations/quaternius-study.js";
const templates = new WeakMap();
export const QUATERNIUS_URL = "/models/student/quaternius/casual-character.glb";
export function quaterniusTemplate(gltf) {
  if (templates.has(gltf)) return templates.get(gltf);
  const clips = {};
  for (const [name, suffix] of Object.entries({
    idle: "Idle_Neutral",
    walk: "Walk",
    run: "Run",
  })) {
    const clip = gltf.animations.find(
      (c) => c.name === `CharacterArmature|${suffix}`,
    );
    if (!clip)
      throw Error(`Casual Character requires native ${name} animation`);
    clips[name] = clip;
  }
  const wave = gltf.animations.find((c) => c.name === "CharacterArmature|Wave");
  if (wave)
    clips.wave = new AnimationClip(
      "native-upper-body-wave",
      wave.duration,
      wave.tracks
        .filter((track) =>
          /^(Shoulder|UpperArm|LowerArm|Wrist|Index|Middle|Ring|Pinky|Thumb)/.test(
            track.name,
          ),
        )
        .map((track) => track.clone()),
    );
  if (studyClips.rig !== "quaternius-casual-62-v1")
    throw Error("Unreviewed sitting rig");
  for (const [name, source] of Object.entries({
    sitDown: "zainSitDown",
    seated: "zainSeatedIdle",
    standUp: "zainStandUp",
  })) {
    const data = studyClips.clips.find((c) => c.name === source);
    if (!data) throw Error("Missing authored sitting clip " + source);
    const clip = AnimationClip.parse(data);
    if (
      clip.tracks.some(
        (track) => !gltf.scene.getObjectByName(track.name.split(".")[0]),
      )
    )
      throw Error("Invalid seated bone mapping");
    clips[name] = clip;
  }
  let count = 0;
  gltf.scene.traverse((o) => {
    if (o.isSkinnedMesh) {
      count++;
      if (
        !o.geometry.attributes.skinWeight ||
        !o.geometry.attributes.skinIndex ||
        o.skeleton.bones.length !== 62
      )
        throw Error("Unexpected Casual Character skin");
    }
  });
  if (count !== 10) throw Error("Unexpected Casual Character mesh structure");
  gltf.scene.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(gltf.scene),
    height = bounds.getSize(new Vector3()).y;
  if (!Number.isFinite(height) || height < 0.5 || height > 3)
    throw Error("Invalid character dimensions");
  // Never mutate cached source assets. Material adjustments are shared by native instances.
  const scene = clone(gltf.scene);
  const materials = new Map();
  scene.traverse((o) => {
    if (o.isMesh) {
      const prepare = (m) => {
        if (!materials.has(m)) {
          const next = m.clone();
          next.metalness = 0;
          next.roughness = 0.8;
          materials.set(m, next);
        }
        return materials.get(m);
      };
      o.material = Array.isArray(o.material)
        ? o.material.map(prepare)
        : prepare(o.material);
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;
    }
  });
  const value = {
    scene,
    clips,
    scale: 1.7 / height,
    floorOffset: -bounds.min.y,
  };
  const calibrationScene = clone(scene),
    mixer = new AnimationMixer(calibrationScene);
  value.speeds = {
    walk: measureNativeGait(calibrationScene, mixer, clips.walk, value.scale),
    run: measureNativeGait(calibrationScene, mixer, clips.run, value.scale),
  };
  mixer.stopAllAction();
  mixer.uncacheRoot(calibrationScene);
  const skeletons = new Set();
  calibrationScene.traverse((o) => {
    if (o.isSkinnedMesh) skeletons.add(o.skeleton);
  });
  skeletons.forEach((s) => s.dispose());
  templates.set(gltf, value);
  return value;
}
// Native foot travel during low-foot stance determines gait speed rather than reusing another rig's calibration.
export function measureNativeGait(scene, mixer, clip, scale = 1) {
  const foot = scene.getObjectByName("FootL");
  if (!foot) throw Error("Native foot missing");
  const action = mixer.clipAction(clip);
  action.reset().play();
  const samples = [];
  for (let i = 0; i <= 120; i++) {
    mixer.setTime((i * clip.duration) / 120);
    scene.updateMatrixWorld(true);
    samples.push(foot.getWorldPosition(new Vector3()).multiplyScalar(scale));
  }
  action.stop();
  mixer.setTime(0);
  const low = Math.min(...samples.map((p) => p.y));
  let distance = 0,
    time = 0;
  for (let i = 1; i < samples.length; i++)
    if (samples[i].y < low + 0.06 && samples[i - 1].y < low + 0.06) {
      distance += Math.hypot(
        samples[i].x - samples[i - 1].x,
        samples[i].z - samples[i - 1].z,
      );
      time += clip.duration / 120;
    }
  if (time === 0 || distance / time < 0.1)
    throw Error("Native gait could not be calibrated");
  return distance / time;
}
