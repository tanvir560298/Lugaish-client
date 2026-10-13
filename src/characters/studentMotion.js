import { LoopRepeat } from "three";
import { angleDelta, rotateToward } from "./characterController.js";

// Speeds measured from grounded toe travel in the bundled CC0 clips, in m/s.
export const CLIP_SPEED = { walk: 1.055, run: 5.84 };
export function createStudentMotion({
  actions,
  response = 14,
  clipSpeeds = CLIP_SPEED,
}) {
  if (!actions.idle || !actions.walk)
    throw new Error("Student motion needs idle and in-place walk clips.");
  const entries = Object.entries(actions).filter(([name]) =>
    ["idle", "walk", "run"].includes(name),
  );
  const weights = { idle: 1, walk: 0, run: 0 };
  let disposed = false,
    phase = 0,
    previousSpeed = 0,
    state = "idle",
    stateTime = 0;
  for (const [name, action] of entries) {
    action.stopFading();
    action.stopWarping();
    action.reset();
    action.enabled = true;
    action.clampWhenFinished = false;
    action.setLoop(LoopRepeat, Infinity);
    action.setEffectiveTimeScale(name === "idle" ? 1 : 0);
    action.setEffectiveWeight(weights[name]);
    action.play();
  }
  return {
    get state() {
      return state;
    },
    get phase() {
      return phase;
    },
    update(delta, velocity, visualRoot, facing) {
      if (
        disposed ||
        !Number.isFinite(delta) ||
        delta <= 0 ||
        !Number.isFinite(velocity.x) ||
        !Number.isFinite(velocity.z)
      )
        return;
      const dt = Math.min(delta, 0.05),
        speed = Math.hypot(velocity.x, velocity.z);
      const moving = speed > 0.015;
      const targetYaw = moving ? Math.atan2(velocity.x, velocity.z) : facing;
      const error =
        visualRoot && targetYaw !== undefined
          ? angleDelta(visualRoot.rotation.y, targetYaw)
          : 0;
      const turning = Math.abs(error) > 0.035;
      const oldYaw = visualRoot?.rotation.y || 0;
      if (visualRoot && targetYaw !== undefined)
        visualRoot.rotation.y = rotateToward(
          visualRoot.rotation.y,
          targetYaw,
          dt,
        );
      let next =
        !moving && turning
          ? "turn"
          : !moving
            ? previousSpeed > 0.015 || (state === "stop" && stateTime < 0.18)
              ? "stop"
              : "idle"
            : Math.abs(error) > 0.3
              ? "turn"
              : state === "idle" ||
                  state === "stop" ||
                  (state === "start" && stateTime < 0.18)
                ? "start"
                : "walk";
      if (next !== state) {
        state = next;
        stateTime = 0;
      } else stateTime += dt;
      const running = actions.run
        ? Math.max(0, Math.min(1, (speed - 2) / 0.8))
        : 0;
      const target = {
        idle: moving ? 0 : turning ? 0.35 : 1,
        walk: moving ? 1 - running : turning ? 0.65 : 0,
        run: moving ? running : 0,
      };
      for (const [name, action] of entries) {
        weights[name] +=
          (target[name] - weights[name]) * (1 - Math.exp(-response * dt));
        action.setEffectiveWeight(weights[name]);
      }
      // A stopped or obstructed controller freezes its gait instead of marching in place.
      const stride =
        (1 - running) * clipSpeeds.walk * actions.walk.getClip().duration +
        running * clipSpeeds.run * (actions.run?.getClip().duration || 1);
      phase =
        (phase +
          (speed * dt) / stride +
          (!moving && turning
            ? Math.abs(angleDelta(oldYaw, visualRoot.rotation.y)) / Math.PI
            : 0)) %
        1;
      for (const name of ["walk", "run"])
        if (actions[name])
          actions[name].time = phase * actions[name].getClip().duration;
      previousSpeed = speed;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const [, action] of entries) action.stop();
    },
  };
}
