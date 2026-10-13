import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { AnimationMixer, Vector3, Quaternion, LoopOnce } from "three";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import { QUATERNIUS_URL, quaterniusTemplate } from "./quaterniusCharacter.js";
import { instanceResourceCleanup } from "./characterResources.js";
import { createStudentMotion } from "./studentMotion.js";
import { createNativeSeating } from "./nativeSeating.js";
export function QuaterniusStudent({ motion, onSeated, onStanding }) {
  const gltf = useGLTF(QUATERNIUS_URL),
    visual = useRef();
  const rig = useMemo(() => {
    const template = quaterniusTemplate(gltf),
      scene = clone(template.scene),
      mixer = new AnimationMixer(scene);
    const actions = Object.fromEntries(
      Object.entries(template.clips).map(([name, clip]) => [
        name,
        mixer.clipAction(clip),
      ]),
    );
    return {
      ...template,
      scene,
      mixer,
      actions,
      speeds: template.speeds,
      dispose: instanceResourceCleanup(scene, template.scene),
    };
  }, [gltf]);
  const waving = useRef(false),
    seating = useRef(),
    callbacks = useRef({ onSeated, onStanding });
  callbacks.current = { onSeated, onStanding };
  const control = useRef(),
    velocity = useMemo(() => new Vector3(), []),
    q = useMemo(() => new Quaternion(), []);
  useEffect(() => {
    control.current = createStudentMotion({
      actions: rig.actions,
      clipSpeeds: rig.speeds,
    });
    seating.current = createNativeSeating({
      scene: rig.scene,
      visual: visual.current,
      actions: rig.actions,
      mixer: rig.mixer,
      onSeated: () => callbacks.current.onSeated?.(),
      onStanding: () => callbacks.current.onStanding?.(),
    });
    return () => {
      seating.current?.dispose();
      control.current?.dispose();
      rig.mixer.stopAllAction();

      rig.dispose();
    };
  }, [rig]);
  useFrame((_, delta) => {
    const m = motion?.current ?? motion;
    if (!m || !control.current) return;
    if (!visual.current) return;
    visual.current.userData.motionState =
      m.state || (m.seated ? "seated" : "idle");
    visual.current.userData.seatProgress = m.transitionProgress;
    const wantsWave = Boolean(m.greeting && !m.reducedMotion);
    if (wantsWave !== waving.current) {
      waving.current = wantsWave;
      if (wantsWave)
        rig.actions.wave
          .reset()
          .setLoop(LoopOnce, 1)
          .setEffectiveWeight(1)
          .fadeIn(0.15)
          .play();
      else rig.actions.wave.fadeOut(0.2);
    }
    if (
      seating.current?.update(m, delta, {
        restart: () => {
          control.current.dispose();
          control.current = createStudentMotion({
            actions: rig.actions,
            clipSpeeds: rig.speeds,
          });
        },
      })
    )
      return;
    velocity.set(m.velocity?.x || 0, 0, m.velocity?.z || 0);
    if (visual.current.parent) {
      visual.current.parent.getWorldQuaternion(q);
      velocity.applyQuaternion(q.invert());
    }
    control.current.update(delta, velocity, visual.current, m.facing);
    if (m.reducedMotion) {
      rig.actions.idle.setEffectiveWeight(1);
      rig.actions.walk.setEffectiveWeight(0);
      rig.actions.run.setEffectiveWeight(0);
      rig.actions.wave.setEffectiveWeight(0);
      rig.actions.idle.time = 0;
      rig.mixer.update(0);
    } else rig.mixer.update(Math.min(delta, 0.05));
    visual.current.userData.animation = control.current.state;
  });
  return (
    <group
      ref={visual}
      userData={{
        nativeCharacter: "quaternius-casual",
        clipSpeeds: rig.speeds,
      }}
    >
      <group scale={rig.scale}>
        <group position={[0, rig.floorOffset, 0]}>
          <primitive object={rig.scene} dispose={null} />
        </group>
      </group>
    </group>
  );
}
