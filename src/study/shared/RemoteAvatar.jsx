import { seatedRoot } from "../../shared/learningHall.js";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { SEATS, ENTRY } from "../../../server/study/seating.js";
import { pointAt } from "./motion.js";
import { createRenderClock } from "./renderState.js";
import { RiggedStudent } from "../../characters/RiggedStudent.jsx";
const AVATAR_COLORS = ["#3b6b55", "#49667d", "#966348", "#6d5a80", "#857139"];
export default function RemoteAvatar({
  person,
  index,
  room,
  clock,
  showLabel = true,
}) {
  const root = useRef(),
    renderClock = useRef(createRenderClock()),
    hiddenUntil = useRef(0);
  const motion = useRef({
    velocity: { x: 0, z: 0 },
    facing: Math.PI,
    seated: false,
  });
  const reduced = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduced.current = preference.matches;
      invalidate();
    };
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, [invalidate]);
  const seat = SEATS.find((s) => s.id === person.seat);
  useFrame(({ camera }, delta) => {
    const sampled = renderClock.current.sample(
        delta,
        Date.now() + clock.current,
      ),
      now = sampled.now;
    if (sampled.corrected && !reduced.current)
      hiddenUntil.current = Date.now() + 120;
    const moving = person.motion && now < person.motion.endsAt;
    const pose =
      moving && !reduced.current
        ? pointAt(person.motion, now)
        : {
            position: seat
              ? seatedRoot(seat)
              : person.motion?.points.at(-1) || ENTRY,
            facing: seat?.facing ?? person.motion?.facing ?? Math.PI,
            state: seat ? "seated" : "idle",
            velocity: { x: 0, z: 0 },
          };
    if (root.current) {
      root.current.position.set(pose.position[0], 0, pose.position[2]);
      root.current.visible = Date.now() >= hiddenUntil.current;
    }
    const friend = room.members.find((m) => m.id === person.greeting?.target),
      friendSeat = SEATS.find((s) => s.id === friend?.seat);
    const greeting = Boolean(friendSeat && person.greeting?.until > now);
    let facing = pose.facing;
    if (!moving && !seat && greeting)
      facing = Math.atan2(
        friendSeat.position[0] - pose.position[0],
        friendSeat.position[2] - pose.position[2],
      );
    motion.current = {
      velocity: pose.velocity || { x: 0, z: 0 },
      facing,
      seated: Boolean(
        seat &&
          (!moving ||
            pose.state === "sit" ||
            (pose.state === "greet" && pose.seated)),
      ),
      restoreSeated: Boolean(
        seat && (!moving || (pose.state === "greet" && pose.seated)),
      ),
      studyDesk: Boolean(seat) || pose.state === "stand",
      state: pose.state,
      transitionProgress: pose.progress,
      instant: reduced.current,
      reducedMotion: reduced.current,
      greeting: greeting || pose.state === "greet",
      distant: root.current
        ? camera.position.distanceToSquared(root.current.position) > 225
        : false,
    };
  }, -0.5);
  return (
    <group ref={root}>
      <RiggedStudent
        motion={motion}
        tint={AVATAR_COLORS[index % AVATAR_COLORS.length]}
        characterId={person.characterId || "maya"}
      />
      {showLabel && (
        <Html
          position={[0, 1.95, 0]}
          center
          distanceFactor={3.2}
          zIndexRange={[20, 0]}
        >
          <div className="sr-avatar-label">
            <strong>{person.name}</strong>
            {person.greeting?.text ||
              (person.phase === "studying"
                ? "Studying"
                : person.phase === "break"
                  ? "On a break"
                  : person.phase === "reconnecting"
                    ? "Reconnecting"
                    : "Paused")}
          </div>
        </Html>
      )}
    </group>
  );
}
