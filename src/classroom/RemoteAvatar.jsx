import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Avatar } from './Avatar.jsx';
import { interpolateSnapshot } from './session.js';

// Reserved rendering adapter; V1 does not mount pretend connected students.
// A real transport supplies validated snapshots at 10–20 Hz, never local input.
export function RemoteAvatar({ previous, latest, reducedMotion=false }) {
  const entity=useRef({x:0,z:0,yaw:0,animation:'idle',visible:false});
  useFrame(()=> {
    if(!previous || !latest){entity.current.visible=false;return;}
    Object.assign(entity.current,interpolateSnapshot(previous,latest,Date.now()-100),{visible:true});
  });
  return <Avatar entity={entity} reducedMotion={reducedMotion} />;
}
