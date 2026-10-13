import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Avatar } from './Avatar.jsx';
import { TEACHER_PATH } from './world.js';
import { followTarget, rotateToward } from '../characters/characterController.js';

export function Teacher({ phase, dispatch, reducedMotion }) {
  const entity = useRef({ x:TEACHER_PATH[0][0],z:TEACHER_PATH[0][1],yaw:0,vx:0,vz:0,animation:'idle',visible:false });
  const waypoint = useRef(1), previous = useRef('');
  useFrame((state,delta) => {
    const e=entity.current, dt=Math.min(delta,.05);
    if (previous.current!==phase) {
      previous.current=phase;
      if (phase==='TeacherEntering') {
        Object.assign(e,{ x:TEACHER_PATH[0][0],z:TEACHER_PATH[0][1],yaw:0,visible:true });
        waypoint.current=1;
      }
      if (['Waiting','Ended','Error'].includes(phase)) { e.visible=false; e.animation='idle'; }
    }
    if (phase==='TeacherEntering' || phase==='TeacherApproaching') {
      const [x,z]=TEACHER_PATH[waypoint.current];
      const motor = { ...e, yaw: e.yaw + Math.PI };
      const nextPoint = TEACHER_PATH[waypoint.current + 1];
      const reached = followTarget(motor, { x, z }, dt, {}, nextPoint ? { x: nextPoint[0], z: nextPoint[1] } : null);
      Object.assign(e, motor, { yaw: motor.yaw - Math.PI });
      if (reached) {
        if (waypoint.current===1) dispatch('ENTERED');
        if (waypoint.current===TEACHER_PATH.length-1) { e.animation='idle'; e.vx=e.vz=0; e.velocity={x:0,z:0}; dispatch('ARRIVED'); }
        else waypoint.current++;
      }
    }
    if (phase==='PreparingLecture') {
      const difference=Math.atan2(Math.sin(Math.PI-e.yaw),Math.cos(Math.PI-e.yaw));
      e.yaw=rotateToward(e.yaw,Math.PI,dt);
      if (Math.abs(difference)<.025) dispatch('PREPARED');
    }
    if (phase==='LecturePlaying' && !reducedMotion) e.waveUntil = Math.sin(state.clock.elapsedTime*.25)>.985 ? state.clock.elapsedTime+.4 : 0;
  });
  return <Avatar entity={entity} teacher reducedMotion={reducedMotion} />;
}
