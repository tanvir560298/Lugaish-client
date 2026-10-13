import { followTarget, stepCharacter, rotateToward } from '../characters/characterController.js';
export const DOORS = { classroom: -4, study: 0, speaking: 4 };
// Actual tops of GrandStairs' four overlapping 7 cm treads.
export function getStairsElevation(z) {
  if (z > .6) return 0;
  if (z > .3) return .07;
  if (z > 0) return .14;
  if (z > -.3) return .21;
  return .28;
}
export function createJourney() {
  return { x: 0, y: 0, z: 4.2, yaw: Math.PI, vx: 0, vz: 0, vy: 0, grounded: true, index: 0, door: 0, speed: 0, phase: 'idle', velocity: { x: 0, z: 0 }, destination: null };
}
export const turn = rotateToward;
const box = (min, max) => ({ min, max });
export function stepJourney(s, id, ready, delta) {
  const dt = Math.min(.05, Math.max(0, delta));
  if (!(id in DOORS)) {
    stepCharacter(s, { x: 0, z: 0 }, dt, { ground: (_, z) => getStairsElevation(z) });
    s.phase = 'idle'; s.destination = null; s.index = 0;
    s.door *= Math.exp(-5 * dt); return s;
  }
  if (s.destination !== id) { s.destination = id; s.index = 0; s.phase = 'turning'; }
  if (s.phase === 'arrived') { s.velocity = { x: 0, z: 0 }; return s; }
  const x = DOORS[id];
  const points = [{ x: x * .45, z: 1.8 }, { x, z: .4 }, { x, z: -.8 }, { x, z: -2 }, { x, z: -3.8 }];
  const nearDoor = Math.abs(s.x - x) < .75 && s.z < -.6;
  if (nearDoor && ready) s.door += (1.52 - s.door) * (1 - Math.exp(-5 * dt));
  const boxes = [box([-7.7, 0, -6], [-7.5, 4, 6]), box([7.5, 0, -6], [7.7, 4, 6]), box([-8, 0, -5.7], [8, 4, -5.5])];
  const gap = s.door > 1.15 && ready ? .65 : 0;
  boxes.push(box([-8, .28, -3.1], [x - gap, 4, -2.5]), box([x + gap, .28, -3.1], [8, 4, -2.5]));
  const environment = { boxes, ground: (_, z) => getStairsElevation(z) };
  if (s.index === 4 && (!ready || s.door < 1.15)) {
    stepCharacter(s, { x: 0, z: 0 }, dt, environment); s.phase = ready ? 'opening' : 'loading'; return s;
  }
  const target = points[s.index];
  if (!target) { s.phase = 'arrived'; return s; }
  const reached = followTarget(s, target, dt, environment, points[s.index + 1]);
  s.speed = Math.hypot(s.velocity.x, s.velocity.z);
  s.phase = s.blocked ? 'blocked' : s.speed < .05 ? 'turning' : 'walking';
  if (reached) { s.index++; if (s.index === points.length) s.phase = 'arrived'; }
  return s;
}
