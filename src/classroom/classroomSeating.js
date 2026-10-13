import { HALL_SEATS, aisleRoute } from '../../server/study/hallLayout.js';
import { motionForSeat } from '../../server/study/movementTimeline.js';
export { poseAt } from '../../server/study/movementTimeline.js';
export function seatMotion(previous,next,now,direct=false,route=null) {
  const old=HALL_SEATS.find(s=>s.id===previous),target=HALL_SEATS.find(s=>s.id===next);
  if(!target)throw new Error('Choose a valid classroom seat.');
  return motionForSeat(old,target,route||aisleRoute(previous,target),now,direct);
}
