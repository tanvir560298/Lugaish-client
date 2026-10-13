import { LoopOnce, LoopRepeat, Vector3, Quaternion } from "three";
import {
  nativeChain,
  solveNativeChain,
  worldQuaternion,
} from "./nativeRigIK.js";
export function seatingRequest(m) {
  if (m.state === "stand") return "standUp";
  if (m.state === "sit") return "sitDown";
  if (m.state === "seated" || m.seated) return "seated";
  return "locomotion";
}
export function createNativeSeating({
  scene,
  visual,
  actions,
  mixer,
  onSeated,
  onStanding,
}) {
  let mode = "locomotion",
    elapsed = 0,
    weight = 0,
    legs = null,
    anchors = null,
    initialized = false,
    finishedSeat = false,
    completedStand = false;
  const clips = ["sitDown", "seated", "standUp"];
  for (const name of clips)
    if (!actions[name]) throw Error("Missing native seated animation " + name);
  const start = (next) => {
    for (const name of clips) actions[name].stop();
    const fromLocomotion = mode === "locomotion";
    mode = next;
    elapsed = 0;
    weight = 0;
    const a = actions[next];
    a.reset()
      .setEffectiveWeight(1)
      .setLoop(
        next === "seated" ? LoopRepeat : LoopOnce,
        next === "seated" ? Infinity : 1,
      );
    a.clampWhenFinished = true;
    a.play();
    if (fromLocomotion) {
      legs = null;
      anchors = null;
    }
  };
  const notifySeat = () => {
    if (!finishedSeat) {
      finishedSeat = true;
      onSeated?.();
    }
  };
  const notifyStanding = () => {
    if (finishedSeat || mode === "standUp") {
      ((finishedSeat = false), (completedStand = false));
      onStanding?.();
    }
  };
  return {
    get mode() {
      return mode;
    },
    update(m, delta, locomotion) {
      const dt = Math.min(Math.max(delta, 0), 0.25),
        request = seatingRequest(m),
        explicit = !!m.state;
      const restored =
        !initialized &&
        (m.restoreSeated ||
          m.reducedMotion ||
          m.instant ||
          m.state === "seated" ||
          ((m.state === "sit" || m.state === "stand") &&
            Number.isFinite(m.transitionProgress)));
      initialized = true;
      if (request !== "standUp") completedStand = false;
      if (mode === "locomotion" && request === "standUp" && completedStand)
        return false;
      if (mode === "locomotion" && request !== "locomotion")
        start(
          request === "seated" ? (restored ? "seated" : "sitDown") : request,
        );
      else if (request === "standUp" && mode !== "standUp") start("standUp");
      else if (
        request === "locomotion" &&
        (mode === "seated" || mode === "sitDown")
      )
        start("standUp");
      else if (request === "seated" && explicit && mode === "sitDown") {
        start("seated");
        weight = 1;
        notifySeat();
      }
      if (mode === "locomotion") return false;
      elapsed += dt;
      if (m.facing !== undefined) visual.rotation.y = m.facing;
      const action = actions[mode],
        duration = action.getClip().duration;
      const timed =
        (mode === "sitDown" && m.state === "sit") ||
        (mode === "standUp" && m.state === "stand");
      const progress =
        m.reducedMotion || m.instant
          ? 1
          : timed && Number.isFinite(m.transitionProgress)
            ? Math.max(0, Math.min(1, m.transitionProgress))
            : Math.min(1, elapsed / duration);
      action.paused = mode !== "seated" || !!m.reducedMotion;
      if (mode !== "seated") action.time = progress * duration;
      else if (m.reducedMotion) action.time = 0;
      weight =
        restored || m.reducedMotion || mode === "seated" || mode === "standUp"
          ? 1
          : Math.min(1, elapsed / 0.12);
      for (const n of ["idle", "walk", "run"])
        actions[n].setEffectiveWeight((1 - weight) * (n === "idle" ? 1 : 0));
      action.setEffectiveWeight(weight);
      if (m.reducedMotion && actions.wave) actions.wave.setEffectiveWeight(0);
      mixer.update(mode === "seated" && !m.reducedMotion ? dt : 0);
      scene.updateWorldMatrix(true, true);
      if (!legs) {
        legs = ["L", "R"].map((s) =>
          nativeChain(scene, "UpperLeg" + s, "LowerLeg" + s, "Foot" + s),
        );
        anchors = legs.map((l) => l.end.getWorldPosition(new Vector3()));
      }
      const pole = new Vector3(0, 0, 1).applyQuaternion(
        visual.getWorldQuaternion(new Quaternion()),
      );
      for (let i = 0; i < legs.length; i++) {
        solveNativeChain(legs[i], anchors[i], pole);
        worldQuaternion(legs[i].end, legs[i].rotationEnd);
      }
      const completed =
        mode !== "seated" &&
        (timed ? progress >= 0.99999 : elapsed >= duration);
      if (mode === "sitDown" && completed && !timed) {
        start("seated");
        weight = 1;
        notifySeat();
      } else if (mode === "seated") notifySeat();
      else if (
        mode === "standUp" &&
        (completed || (explicit && request === "locomotion"))
      ) {
        notifyStanding();
        completedStand = request === "standUp";
        for (const n of clips) actions[n].stop();
        mode = "locomotion";
        legs = null;
        anchors = null;
        locomotion.restart?.();
      }
      visual.userData.animation = mode;
      return mode !== "locomotion";
    },
    dispose() {
      for (const n of clips) actions[n].stop();
    },
  };
}
