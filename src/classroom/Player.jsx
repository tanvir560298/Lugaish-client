import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { typingTarget } from "./immersive.js";
import { Avatar } from "./Avatar.jsx";
import {
  SPAWN,
  ROOM,
  PLAYER_ENVIRONMENT,
  cameraFraction,
  simulatePlayer,
  thirdPersonFov,
} from "./world.js";

import { HALL_SEATS } from "../shared/learningHall.js";
import { planPath } from "../characters/navigation.js";
import { seatMotion, poseAt } from "./classroomSeating.js";

const isTyping = typingTarget;
export function Player({
  session,
  cameraMode,
  controlsRef,
  onLockChange,
  reducedMotion,
  onInputError,
  onMovementChange,
}) {
  const { gl, camera, clock } = useThree();
  const entity = useRef({
    ...SPAWN,
    vx: 0,
    vz: 0,
    yaw: 0,
    animation: "idle",
    visible: true,
    waveUntil: 0,
  });
  const input = useRef({
    keys: new Set(),
    touch: { x: 0, z: 0 },
    yaw: 0,
    pitch: -0.08,
  });
  const moving = useRef(false),
    seatCamera = useRef(0);
  const target = useRef(new Vector3());
  const eye = useRef(new Vector3());
  const sendAt = useRef(0);
  const route = useRef(null),
    seatedAt = useRef(null);
  useEffect(() => {
    const canvas = gl.domElement;
    const clear = () => {
      input.current.keys.clear();
      input.current.touch = { x: 0, z: 0 };
      entity.current.vx = 0;
      entity.current.vz = 0;
    };
    const locked = () => document.pointerLockElement === canvas;
    const wave = () => {
      if (entity.current.waveUntil > clock.elapsedTime) return;
      session.emit("player.emote", { emote: "wave" });
    };
    const unsubscribe = session.subscribe((event) => {
      if (event.type === "player.emote" && event.payload.emote === "wave")
        entity.current.waveUntil = clock.elapsedTime + 2.2;
    });
    const down = (event) => {
      if (!locked() || isTyping(event.target)) return;
      if (
        [
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "ShiftLeft",
          "ShiftRight",
          "KeyE",
        ].includes(event.code)
      )
        event.preventDefault();
      input.current.keys.add(event.code);
      if (event.code === "KeyE" && !event.repeat) wave();
    };
    const up = (event) => input.current.keys.delete(event.code);
    const look = (event) => {
      if (!locked()) return;
      input.current.yaw -= event.movementX * 0.002;
      input.current.pitch = Math.max(
        -0.65,
        Math.min(0.65, input.current.pitch - event.movementY * 0.002),
      );
    };
    const lockChange = () => {
      clear();
      onLockChange(locked());
    };
    const lockError = () =>
      onInputError(
        "Mouse capture was blocked. Click Walk around again, or exit fullscreen and retry.",
      );
    const blur = () => {
      clear();
      if (locked()) document.exitPointerLock();
    };
    const focus = (event) => {
      if (isTyping(event.target)) blur();
    };
    let drag = null;
    const touchStart = (e) => {
      if (e.pointerType !== "touch" || document.querySelector("dialog[open]"))
        return;
      document.activeElement?.blur?.();
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    };
    const touchLook = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      input.current.yaw -= (e.clientX - drag.x) * 0.004;
      input.current.pitch = Math.max(
        -0.65,
        Math.min(0.65, input.current.pitch - (e.clientY - drag.y) * 0.004),
      );
      drag.x = e.clientX;
      drag.y = e.clientY;
    };
    const touchEnd = (e) => {
      if (drag?.id === e.pointerId) drag = null;
    };
    const controls = {
      move: (x, z) => {
        input.current.touch = {
          x: Number.isFinite(x) ? Math.max(-1, Math.min(1, x)) : 0,
          z: Number.isFinite(z) ? Math.max(-1, Math.min(1, z)) : 0,
        };
      },
      walk: async () => {
        try {
          document.activeElement?.blur?.();
          await canvas.requestPointerLock();
        } catch {
          lockError();
        }
      },
      wave,
      seat: (id) => {
        if (route.current && Date.now() < route.current.endsAt) {
          onInputError("Please wait until your current movement finishes.");
          return;
        }
        const seat = HALL_SEATS.find((s) => s.id === id);
        if (!seat) return;
        const old = HALL_SEATS.find((s) => s.id === seatedAt.current);
        const start = old
          ? { x: old.approach[0], z: old.approach[2] }
          : { x: entity.current.x, z: entity.current.z };
        const path = planPath(
          start,
          { x: seat.approach[0], z: seat.approach[2] },
          PLAYER_ENVIRONMENT,
          { minX: -11.6, maxX: 11.6, minZ: -14.6, maxZ: 14.6 },
        );
        if (!path) {
          onInputError(
            "That desk is blocked from here. Move into an aisle and try again.",
          );
          return;
        }
        const points = old
          ? [[entity.current.x, 0, entity.current.z], old.approach]
          : [[entity.current.x, 0, entity.current.z]];
        points.push(...path.map((p) => [p.x, 0, p.z]));
        route.current = seatMotion(
          seatedAt.current,
          id,
          Date.now(),
          false,
          points,
        );
        seatedAt.current = id;
        input.current.keys.clear();
        onInputError("");
      },
      recover: () => {
        clear();
        route.current = null;
        seatedAt.current = null;
        Object.assign(entity.current, SPAWN, {
          yaw: 0,
          seated: false,
          y: 0,
          vy: 0,
        });
        input.current.yaw = 0;
        input.current.pitch = -0.08;
      },
      release: blur,
    };
    controlsRef.current = controls;
    canvas.addEventListener("pointerdown", touchStart);
    canvas.addEventListener("pointermove", touchLook);
    canvas.addEventListener("pointerup", touchEnd);
    canvas.addEventListener("pointercancel", touchEnd);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("mousemove", look);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", blur);
    document.addEventListener("focusin", focus);
    document.addEventListener("pointerlockchange", lockChange);
    document.addEventListener("pointerlockerror", lockError);
    return () => {
      blur();
      unsubscribe();
      if (controlsRef.current === controls) controlsRef.current = null;
      canvas.removeEventListener("pointerdown", touchStart);
      canvas.removeEventListener("pointermove", touchLook);
      canvas.removeEventListener("pointerup", touchEnd);
      canvas.removeEventListener("pointercancel", touchEnd);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("mousemove", look);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", blur);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("pointerlockchange", lockChange);
      document.removeEventListener("pointerlockerror", lockError);
    };
  }, [gl, clock, session, controlsRef, onLockChange, onInputError]);
  useFrame((state, dt) => {
    const { keys, yaw, pitch, touch } = input.current;
    const active =
      cameraMode !== "lesson" &&
      document.pointerLockElement === gl.domElement &&
      !isTyping(document.activeElement);
    const movementInput = {
      x:
        cameraMode !== "lesson" && !isTyping(document.activeElement)
          ? active
            ? Number(keys.has("KeyD")) - Number(keys.has("KeyA"))
            : touch.x
          : 0,
      z:
        cameraMode !== "lesson" && !isTyping(document.activeElement)
          ? active
            ? Number(keys.has("KeyS")) - Number(keys.has("KeyW"))
            : touch.z
          : 0,
      running: active && (keys.has("ShiftLeft") || keys.has("ShiftRight")),
    };
    const now = Date.now();
    if (
      seatedAt.current &&
      (movementInput.x || movementInput.z) &&
      (!route.current || now >= route.current.endsAt)
    ) {
      const seat = HALL_SEATS.find((s) => s.id === seatedAt.current),
        from = [entity.current.x, 0, entity.current.z];
      route.current = {
        points: [from, seat.approach],
        stages: [
          {
            type: "stand",
            from,
            to: seat.approach,
            facing: seat.facing,
            start: 0,
            duration: 1000,
          },
        ],
        startedAt: now,
        endsAt: now + 1000,
        facing: seat.facing,
      };
      seatedAt.current = null;
    }
    if (route.current) {
      const pose = poseAt(route.current, now);
      Object.assign(entity.current, {
        x: pose.position[0],
        z: pose.position[2],
        yaw: pose.facing - Math.PI,
        velocity: pose.velocity,
        vx: pose.velocity.x,
        vz: pose.velocity.z,
        seated: Boolean(
          seatedAt.current && (pose.state === "sit" || pose.state === "seated"),
        ),
        seatingState: pose.state,
        transitionProgress: pose.progress,
      });
      if (now >= route.current.endsAt) route.current = null;
    } else if (!seatedAt.current) {
      entity.current.seatingState = "locomotion";
      entity.current.transitionProgress = undefined;
      simulatePlayer(entity.current, movementInput, yaw, dt);
    }
    const e = entity.current;
    const isMoving = Math.hypot(e.vx || 0, e.vz || 0) > 0.08;
    if (isMoving !== moving.current) {
      moving.current = isMoving;
      onMovementChange?.(isMoving);
    }
    // Hide the entire local avatar in first person to avoid head/shoulder obstruction.
    const viewFov = cameraMode === "third" ? camera.fov : 62;
    if (camera.fov !== viewFov) {
      camera.fov = viewFov;
      camera.updateProjectionMatrix();
    }
    e.visible = cameraMode !== "first" && cameraMode !== "lesson";
    if (cameraMode === "lesson") {
      const distance = Math.max(
        4.68,
        2.05 / (Math.tan((camera.fov * Math.PI) / 360) * camera.aspect),
      );
      eye.current.set(0, 1.7, -14.78 + Math.min(18, distance));
      camera.position.lerp(
        eye.current,
        reducedMotion ? 1 : 1 - Math.exp(-dt * 5),
      );
      target.current.set(0, 2, -14.78);
      camera.lookAt(target.current);
      return;
    }
    const progress = Math.max(0, Math.min(1, e.transitionProgress || 0)),
      smooth = progress * progress * (3 - 2 * progress);
    const desiredSeat =
      e.seatingState === "sit"
        ? smooth
        : e.seatingState === "stand"
          ? 1 - smooth
          : Number(e.seated);
    seatCamera.current +=
      (desiredSeat - seatCamera.current) *
      (reducedMotion ? 1 : 1 - Math.exp(-dt * 8));
    const seatBlend = seatCamera.current,
      eyeHeight = 1.62 - 0.46 * seatBlend;
    eye.current.set(e.x, (e.y || 0) + eyeHeight, e.z);
    const fx = -Math.sin(yaw) * Math.cos(pitch),
      fz = -Math.cos(yaw) * Math.cos(pitch);
    if (cameraMode === "first") {
      camera.position.copy(eye.current);
      target.current.set(
        e.x + fx,
        (e.y || 0) + eyeHeight + Math.sin(pitch),
        e.z + fz,
      );
    } else {
      // The collision proxy fills the chair up to 1.12m; trace above it rather
      // than compressing the seated shoulder camera into the desk and hiding Zain.
      target.current.set(e.x, 1.38 - 0.08 * seatBlend, e.z);
      const distance = 5.2 - 2 * seatBlend,
        shoulder = 1.1 + 0.35 * seatBlend;
      const desired = [
        e.x - fx * distance + Math.cos(yaw) * shoulder,
        Math.max(
          1.3,
          Math.min(3.65, 3.05 - 0.9 * seatBlend - Math.sin(pitch) * distance),
        ),
        e.z - fz * distance - Math.sin(yaw) * shoulder,
      ];
      const f = cameraFraction(target.current.toArray(), desired);
      eye.current.set(
        target.current.x + (desired[0] - target.current.x) * f,
        target.current.y + (desired[1] - target.current.y) * f,
        target.current.z + (desired[2] - target.current.z) * f,
      );
      camera.position.lerp(
        eye.current,
        reducedMotion ? 1 : 1 - Math.exp(-dt * 8),
      );
      const safe = cameraFraction(
        target.current.toArray(),
        camera.position.toArray(),
      );
      if (safe < 1)
        camera.position.lerpVectors(
          target.current,
          camera.position.clone(),
          safe,
        );
      // Rear wall includes a doorway; camera still stays inside the room.
      camera.position.x = Math.max(
        -ROOM.width / 2 + 0.14,
        Math.min(ROOM.width / 2 - 0.14, camera.position.x),
      );
      camera.position.z = Math.max(
        -ROOM.depth / 2 + 0.14,
        Math.min(ROOM.depth / 2 - 0.14, camera.position.z),
      );
      const clearance = camera.position.distanceTo(target.current);
      const framedFov = thirdPersonFov(clearance, camera.aspect < 0.8);
      if (Math.abs(camera.fov - framedFov) > 0.05) {
        camera.fov = framedFov;
        camera.updateProjectionMatrix();
      }
      e.visible = clearance > 0.6;
      target.current.set(
        e.x + fx * 1.3,
        1.16 + Math.sin(pitch),
        e.z + fz * 1.3,
      );
    }
    camera.lookAt(target.current);
    if (state.clock.elapsedTime - sendAt.current > 0.1) {
      sendAt.current = state.clock.elapsedTime;
      session.emit("player.snapshot", {
        x: e.x,
        z: e.z,
        yaw: e.yaw,
        animation: e.animation,
        timestamp: Date.now(),
      });
    }
  }, -1);
  return <Avatar entity={entity} reducedMotion={reducedMotion} />;
}
