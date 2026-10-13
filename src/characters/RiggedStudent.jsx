import { QuaterniusStudent } from "./QuaterniusStudent.jsx";
import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  AnimationMixer,
  LoopOnce,
  LoopRepeat,
  Quaternion,
  Vector3,
} from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { createStudentMotion } from "./studentMotion.js";
import { useCharacter } from "./useCharacter.js";
import { getCharacterPreset } from "./characterPresets.js";
import { fallbackCharacterTemplate } from "./fallbackCharacter.js";
import { instanceResourceCleanup } from "./characterResources.js";
import { characterModel } from "./characterModels.js";
import {
  validateAuthoredCharacter,
  prepareAuthoredCharacter,
  createFaceMotion,
} from "./authoredCharacter.js";
import { createStudyPose } from "./studyPose.js";
import { createFootPlanting, findBone } from "./footPlanting.js";

export const STUDENT_URL = "/models/student/student.glb";
export function preloadStudent() {
  useGLTF.preload(STUDENT_URL);
  for (const id of ["maya", "noor", "zain"]) {
    const asset = characterModel(id);
    if (asset) useGLTF.preload(asset.url);
  }
}

// Every instance clones its skeleton and owns exactly one mixer.
function LegacyRiggedStudent({
  motion,
  onSeated,
  tint,
  characterId: propCharacterId,
  onStanding,
}) {
  const { preset: contextPreset } = useCharacter();
  const activePreset = propCharacterId
    ? getCharacterPreset(propCharacterId)
    : contextPreset;
  const authored = characterModel(activePreset.id);
  const reference = useGLTF(STUDENT_URL);
  const gltf = useGLTF(authored?.url || STUDENT_URL);
  const visual = useRef();
  const finish = useRef(onSeated);
  finish.current = onSeated;
  const standing = useRef(onStanding);
  standing.current = onStanding;

  const rig = useMemo(() => {
    if (authored) validateAuthoredCharacter(gltf, reference);
    const template = authored
      ? gltf.scene
      : fallbackCharacterTemplate(gltf.scene, activePreset);
    const scene = clone(template);

    if (authored) prepareAuthoredCharacter(scene);

    const mixer = new AnimationMixer(scene);
    const actions = Object.fromEntries(
      reference.animations.map((c) => [c.name, mixer.clipAction(c)]),
    );

    return {
      scene,
      mixer,
      actions,
      study: createStudyPose(scene),
      feet: createFootPlanting(scene),
      face: createFaceMotion(scene, Math.random() * 4.7),
      authored: Boolean(authored),
      dispose: instanceResourceCleanup(scene, template),
    };
  }, [gltf, reference, activePreset, authored]);

  const control = useRef(null);
  const mode = useRef("locomotion");
  const current = useRef(null);
  const wave = useRef(0);
  const poseInitialized = useRef(false);
  const localVelocity = useMemo(() => new Vector3(), []);
  const parentPosition = useMemo(() => new Vector3(), []);
  const parentQ = useMemo(() => new Quaternion(), []);

  useEffect(() => {
    control.current = createStudentMotion({ actions: rig.actions });
    mode.current = "locomotion";
    current.current = null;
    poseInitialized.current = false;

    const ended = (event) => {
      if (event.action === rig.actions.sitDown) {
        play("seated");
        finish.current?.();
      }
      if (event.action === rig.actions.standUp) {
        standing.current?.();
        current.current?.fadeOut(0.18);
        control.current?.dispose();
        control.current = createStudentMotion({ actions: rig.actions });
        mode.current = "locomotion";
        current.current = null;
      }
    };

    const play = (name) => {
      current.current?.fadeOut(0.2);
      const action = rig.actions[name];
      if (action) {
        action
          .reset()
          .setEffectiveWeight(1)
          .setEffectiveTimeScale(1)
          .setLoop(
            name === "seated" ? LoopRepeat : LoopOnce,
            name === "seated" ? Infinity : 1,
          );
        action.clampWhenFinished = true;
        action.fadeIn(0.2).play();
        current.current = action;
        mode.current = name;
      }
    };

    rig.play = play;
    rig.mixer.addEventListener("finished", ended);

    return () => {
      control.current?.dispose();
      rig.mixer.removeEventListener("finished", ended);
      rig.mixer.stopAllAction();
      rig.dispose();
    };
  }, [rig]);

  useFrame((_, delta) => {
    const m = motion?.current ?? motion;
    const dt = Math.min(delta, 0.25);
    if (!m || !control.current) return;

    rig.study.restore();
    if (!poseInitialized.current) {
      poseInitialized.current = true;
      if (m.facing !== undefined) visual.current.rotation.y = m.facing;
      if (m.state === "stand") rig.play("standUp");
      if (m.seated && m.restoreSeated) {
        for (const name of ["idle", "walk", "run"])
          rig.actions[name]?.setEffectiveWeight(0);
        rig.play("seated");
      }
    }
    const desired = m.seated ? "seated" : "locomotion";
    if (desired === "seated" && mode.current === "locomotion") {
      for (const name of ["idle", "walk", "run"])
        rig.actions[name]?.fadeOut(0.2);
      rig.play(m.instant ? "seated" : "sitDown");
      if (m.instant) finish.current?.();
    } else if (
      desired === "locomotion" &&
      (mode.current === "seated" || mode.current === "sitDown")
    ) {
      if (m.instant) {
        current.current?.stop();
        control.current?.dispose();
        control.current = createStudentMotion({ actions: rig.actions });
        mode.current = "locomotion";
        current.current = null;
        standing.current?.();
      } else rig.play("standUp");
    }

    const vx = mode.current === "standUp" ? 0 : m.velocity?.x || 0;
    const vz = mode.current === "standUp" ? 0 : m.velocity?.z || 0;
    const speed = Math.hypot(vx, vz);

    if (mode.current === "locomotion") {
      localVelocity.set(vx, 0, vz);
      if (visual.current?.parent) {
        visual.current.parent.getWorldQuaternion(parentQ);
        localVelocity.applyQuaternion(parentQ.invert());
      }
      control.current.update(dt, localVelocity, visual.current, m.facing);
    }

    if (m.instant && m.facing !== undefined)
      visual.current.rotation.y = m.facing;

    // Match chair transition clips to the same authoritative stage as root
    // motion, including late joins and low frame rates. Other contexts retain
    // their existing mixer-driven transitions.
    const transition =
      m.state === "sit"
        ? rig.actions.sitDown
        : m.state === "stand"
          ? rig.actions.standUp
          : null;
    if (transition && Number.isFinite(m.transitionProgress)) {
      transition.time =
        Math.min(0.9999, m.transitionProgress) * transition.getClip().duration;
      transition.paused = true;
    } else if (current.current) current.current.paused = false;
    if (m.state === "seated" && mode.current === "sitDown") {
      rig.play("seated");
      finish.current?.();
    }
    if (m.state && m.state !== "stand" && mode.current === "standUp") {
      current.current?.fadeOut(0.18);
      control.current?.dispose();
      control.current = createStudentMotion({ actions: rig.actions });
      mode.current = "locomotion";
      current.current = null;
      standing.current?.();
    }
    rig.mixer.update(dt);
    visual.current.parent.getWorldPosition(parentPosition);
    if (rig.authored && !m.distant && !m.reducedMotion) rig.face.update(dt);
    rig.study.update(dt, {
      seated: mode.current === "seated",
      reduced: m.reducedMotion,
      distant: m.distant,
      desk: m.studyDesk,
    });
    if (!m.distant)
      rig.feet.update({
        grounded: m.grounded !== false,
        seated: mode.current !== "locomotion",
        ground: m.ground || (() => parentPosition.y),
      });
    const head = findBone(rig.scene, "DEF-head");
    if (
      head &&
      !m.reducedMotion &&
      speed < 0.015 &&
      mode.current === "locomotion"
    )
      head.rotateY(Math.sin(rig.mixer.time * 0.43) * 0.035);

    wave.current +=
      ((m.greeting ? 1 : 0) - wave.current) * (1 - Math.exp(-10 * dt));
    const arm = findBone(rig.scene, "DEF-upper_arm.R");
    const forearm = findBone(rig.scene, "DEF-forearm.R");
    if (arm && forearm && wave.current > 0.001) {
      arm.rotateZ(-0.9 * wave.current);
      forearm.rotateX(
        (-1.3 + Math.sin(rig.mixer.time * 9) * 0.16) * wave.current,
      );
    }
  });

  return (
    <group ref={visual}>
      <primitive object={rig.scene} dispose={null} />
    </group>
  );
}

class NativeAssetBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export function RiggedStudent(props) {
  const { characterId } = useCharacter();
  const id = props.characterId || characterId;
  const fallback = <LegacyRiggedStudent {...props} />;
  if (id !== "zain") return fallback;
  return (
    <NativeAssetBoundary fallback={fallback}>
      <Suspense fallback={null}>
        <QuaterniusStudent
          motion={props.motion}
          onSeated={props.onSeated}
          onStanding={props.onStanding}
        />
      </Suspense>
    </NativeAssetBoundary>
  );
}
