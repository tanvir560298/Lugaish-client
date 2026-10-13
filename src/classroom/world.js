import { capsuleBlocked, sweepCapsule, stepCharacter } from '../characters/characterController.js';
import { HALL, HALL_SEATS } from '../shared/learningHall.js';
export const ROOM = HALL;
export const SPAWN = { x: -10.8, z: 13.4 };
export const PLAYER_RADIUS = .24;
export const DESKS = HALL_SEATS.map(s=>({id:s.id,x:s.desk[0],z:s.desk[2],chairZ:s.position[2]}));
export const TEACHER_PATH = [[-10.8,14.5],[-10.8,13.3],[-10.8,-13.5],[-2.65,-13.5]];
const box=(x,y,z,w,h,d)=>({min:[x-w/2,y-h/2,z-d/2],max:[x+w/2,y+h/2,z+d/2]});
export const SOLIDS = [
  box(-12.1,2.1,0,.2,4.2,30.4),box(12.1,2.1,0,.2,4.2,30.4),
  box(0,2.1,-15.1,24,4.2,.2),box(0,2.1,15.1,24,4.2,.2),
  box(2.8,.4,-13.5,1.8,.8,.8),
  box(11.35,.75,-13.7,.6,1.5,.6), // Classroom planter.
  ...DESKS.flatMap(({x,z,chairZ})=>[box(x,.39,z,1.35,.78,.65),box(x,.5,chairZ,.52,1,.52)]),
];
export const PLAYER_ENVIRONMENT={boxes:SOLIDS,ground:()=>0};
export function isBlocked(x, z, radius = PLAYER_RADIUS) {
  return x < -ROOM.width/2 + radius || x > ROOM.width/2 - radius || z < -ROOM.depth/2 + radius || z > ROOM.depth/2 - radius || capsuleBlocked(x, 0, z, SOLIDS, radius);
}
export function moveWithCollisions(position, dx, dz) {
  return sweepCapsule(position, dx, dz, PLAYER_ENVIRONMENT);
}
export function simulatePlayer(player, input, yaw, dt) {
  // Classroom cameras face -Z; the shared skeleton/controller face +Z.
  const state = { ...player, yaw: player.yaw + Math.PI };
  const magnitude = Math.max(1, Math.hypot(input.x, input.z));
  stepCharacter(state, {
    x: (input.x * Math.cos(yaw) + input.z * Math.sin(yaw)) / magnitude,
    z: (-input.x * Math.sin(yaw) + input.z * Math.cos(yaw)) / magnitude,
    running: input.running,
  }, dt, PLAYER_ENVIRONMENT);
  Object.assign(player, state, { yaw: state.yaw - Math.PI });
}
// Swept segment against expanded AABBs, also used by the third-person camera.
export function cameraFraction(origin, destination, boxes = SOLIDS) {
  let nearest = 1;
  for (const b of boxes) {
    let low = 0, high = 1;
    for (let axis=0; axis<3; axis++) {
      const delta = destination[axis]-origin[axis];
      const min = b.min[axis]-.12, max = b.max[axis]+.12;
      if (Math.abs(delta)<1e-8) { if (origin[axis]<min || origin[axis]>max) { low=2; break; } }
      else {
        let a=(min-origin[axis])/delta, c=(max-origin[axis])/delta;
        if (a>c) [a,c]=[c,a];
        low=Math.max(low,a); high=Math.min(high,c);
        if (low>high) break;
      }
    }
    if (low<=high && low<=1 && high>=0) nearest=Math.min(nearest,Math.max(0,low-.02));
  }
  return nearest;
}

// Widen a collision-compressed shoulder camera without moving through the wall.
export function thirdPersonFov(distance, portrait=false) {
  const base=portrait?82:62;
  const compression=Math.max(0,Math.min(1,(4-distance)/2.5));
  return base+(portrait?8:24)*compression;
}
