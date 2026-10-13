// Kinematic vertical capsule against static AABBs. Feet are the position origin.
export const MOTION = { walkSpeed: 1.45, runSpeed: 3.1, acceleration: 4.5, braking: 6, turnRate: 3.8, radius: .24, height: 1.75, stepHeight: .18, gravity: 18 };
export const angleDelta = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export function rotateToward(yaw, target, dt, rate = MOTION.turnRate) {
  return yaw + clamp(angleDelta(yaw, target), -rate * dt, rate * dt);
}
export function capsuleBlocked(x, y, z, boxes, radius = MOTION.radius, height = MOTION.height) {
  return boxes.some(b => {
    if (b.max[1] <= y + .025 || b.min[1] >= y + height) return false;
    const nx = clamp(x, b.min[0], b.max[0]), nz = clamp(z, b.min[2], b.max[2]);
    return (x - nx) ** 2 + (z - nz) ** 2 < radius ** 2 - 1e-9;
  });
}
export function sweepCapsule(position, dx, dz, { boxes = [], radius = MOTION.radius, height = MOTION.height, ground = () => 0 } = {}) {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / (radius * .25)));
  let { x, z } = position; const y = position.y || 0;
  const free = (nx, nz) => {
    const floor = ground(nx, nz);
    return (floor === null || floor <= y + MOTION.stepHeight) && !capsuleBlocked(nx, Math.max(y, floor ?? y), nz, boxes, radius, height);
  };
  for (let i = 0; i < steps; i++) {
    const sx = dx / steps, sz = dz / steps;
    if (free(x + sx, z + sz)) { x += sx; z += sz; continue; }
    // Slide along the obstacle; binary search retains the last safe point.
    for (const axis of ['x', 'z']) {
      const movement = axis === 'x' ? sx : sz;
      let low = 0, high = 1;
      for (let j = 0; j < 12; j++) {
        const f = (low + high) / 2;
        if (free(x + (axis === 'x' ? movement * f : 0), z + (axis === 'z' ? movement * f : 0))) low = f; else high = f;
      }
      if (axis === 'x') x += movement * low; else z += movement * low;
    }
  }
  return { x, z };
}
export function stepCharacter(s, intent, delta, environment = {}) {
  if (!Number.isFinite(delta) || delta <= 0) return s;
  const elapsed = Math.min(delta, .1), steps = Math.ceil(elapsed * 120), dt = elapsed / steps;
  s.vx ??= 0; s.vz ??= 0; s.vy ??= 0; s.y ??= 0; s.yaw ??= 0;
  const startX = s.x, startZ = s.z;
  const maxSpeed = intent.running ? MOTION.runSpeed : MOTION.walkSpeed;
  const magnitude = Math.hypot(intent.x || 0, intent.z || 0);
  const desiredYaw = magnitude > .001 ? Math.atan2(intent.x, intent.z) : (intent.facing ?? s.yaw);
  for (let i = 0; i < steps; i++) {
    s.yaw = rotateToward(s.yaw, desiredYaw, dt);
    const alignment = Math.max(0, Math.cos(angleDelta(s.yaw, desiredYaw)));
    const speed = Math.min(1, magnitude) * maxSpeed * alignment ** 2;
    const tx = Math.sin(s.yaw) * speed, tz = Math.cos(s.yaw) * speed;
    const change = Math.hypot(tx - s.vx, tz - s.vz);
    const acceleration = speed < Math.hypot(s.vx, s.vz) ? MOTION.braking : MOTION.acceleration;
    const blend = change ? Math.min(1, acceleration * dt / change) : 1;
    s.vx += (tx - s.vx) * blend; s.vz += (tz - s.vz) * blend;
    const oldX = s.x, oldZ = s.z;
    Object.assign(s, sweepCapsule(s, s.vx * dt, s.vz * dt, environment));
    // Animation and subsequent integration use achieved motion, including wall sliding.
    s.vx = (s.x - oldX) / dt; s.vz = (s.z - oldZ) / dt;
    const floor = (environment.ground || (() => 0))(s.x, s.z);
    const wasGrounded = s.grounded !== false;
    if (floor !== null && wasGrounded && Math.abs(floor - s.y) <= MOTION.stepHeight) {
      s.y = floor; s.vy = 0; s.grounded = true;
    } else {
      s.vy -= MOTION.gravity * dt; s.y += s.vy * dt;
      s.grounded = floor !== null && s.y <= floor;
      if (s.grounded) { s.y = floor; s.vy = 0; }
    }
  }
  s.velocity = { x: (s.x - startX) / elapsed, z: (s.z - startZ) / elapsed };
  const speed = Math.hypot(s.velocity.x, s.velocity.z);
  s.blocked = magnitude > .1 && speed < .015 && Math.abs(angleDelta(s.yaw, desiredYaw)) < .2;
  s.animation = speed > .015 ? (speed > 2 ? 'run' : 'walk') : 'idle';
  return s;
}
// Arrival braking and anticipatory corner slowing; no destination snapping.
export function followTarget(s, target, delta, environment = {}, next = null) {
  const dx = target.x - s.x, dz = target.z - s.z, distance = Math.hypot(dx, dz);
  const currentSpeed = Math.hypot(s.vx || 0, s.vz || 0);
  const corner = next ? Math.abs(angleDelta(Math.atan2(dx, dz), Math.atan2(next.x - target.x, next.z - target.z))) : Math.PI;
  const terminalSpeed = next ? MOTION.walkSpeed * Math.max(.05, Math.cos(corner / 2) ** 3) : 0;
  const desired = Math.min(MOTION.walkSpeed, Math.sqrt(terminalSpeed ** 2 + 2 * MOTION.braking * Math.max(0, distance - .015)), distance / Math.max(delta, .001));
  stepCharacter(s, { x: distance > .015 ? dx / distance * desired / MOTION.walkSpeed : 0, z: distance > .015 ? dz / distance * desired / MOTION.walkSpeed : 0 }, delta, environment);
  return distance < .035 && (next || currentSpeed < .15);
}
