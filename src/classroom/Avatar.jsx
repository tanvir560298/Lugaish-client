import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RiggedStudent } from "../characters/RiggedStudent.jsx";

// The classroom, campus and study rooms share the same skeleton and gait pipeline.
export function Avatar({ entity, teacher = false, reducedMotion = false }) {
  const root = useRef(),
    greeting = useRef();
  const motion = useRef({ velocity: { x: 0, z: 0 }, facing: 0 });
  const previous = useRef(null);
  useFrame(({ clock }, delta) => {
    const e = entity.current;
    if (!root.current || !e) return;
    root.current.visible = e.visible !== false;
    root.current.position.set(e.x, e.y || 0, e.z);
    const old = previous.current;
    const vx = e.velocity?.x ?? (old && delta > 0 ? (e.x - old.x) / delta : 0);
    const vz = e.velocity?.z ?? (old && delta > 0 ? (e.z - old.z) / delta : 0);
    const waving = (e.waveUntil || 0) > clock.elapsedTime;
    motion.current = {
      velocity: { x: vx, z: vz },
      facing: e.yaw + Math.PI,
      grounded: e.grounded !== false,
      seated: e.seated === true,
      state:
        e.seatingState === "seated" && !e.seated
          ? "locomotion"
          : e.seatingState,
      transitionProgress: e.transitionProgress,
      reducedMotion,
      greeting: waving && !reducedMotion,
    };
    previous.current = { x: e.x, z: e.z };
    if (greeting.current)
      greeting.current.style.display = waving ? "block" : "none";
  }, -0.5);
  return (
    <group ref={root}>
      <Suspense fallback={null}>
        <RiggedStudent
          motion={motion}
          characterId={teacher ? "zain" : undefined}
        />
      </Suspense>
      {!teacher && (
        <Html position={[0, 2.04, 0]} center zIndexRange={[8, 0]}>
          <span
            ref={greeting}
            className="cr-greeting"
            style={{ display: "none" }}
          >
            Hi!
          </span>
        </Html>
      )}
    </group>
  );
}
