import { Vector3 } from 'three';
import { STUDY_TABLES, STUDY_SEATS } from '../../../server/study/tableLayout.js';
import { LIBRARY_SHELVES } from './libraryLayout.js';
import { cameraFraction } from '../../classroom/world.js';
import { STUDY_HALL } from '../../../server/study/tableLayout.js';
export const ENTRANCE_CAMERA={eye:[0,3.2,15.8],target:[0,1.05,-5]};
export function entranceChoiceState({connected,room,mine,now}){
 return {canReturn:Boolean(connected&&room&&mine?.seat&&mine.arrivesAt<=now&&mine.phase!=='reconnecting'),canStudyAlone:!room,checking:!connected};
}
export const LIBRARY_BOUNDS={min:[-STUDY_HALL.width/2,0,-STUDY_HALL.depth/2],max:[STUDY_HALL.width/2,5.4,STUDY_HALL.depth/2]};
// Fit every actual bounding-box corner in camera space, including portrait
// viewports. fill is the usable fraction, not an arbitrary orbit distance.
export function fitLibraryCamera(bounds,aspect,fov=48,fill=.82){
 const target=new Vector3(...bounds.min).add(new Vector3(...bounds.max)).multiplyScalar(.5);
 const forward=new Vector3(.8,.85,1).normalize(),right=new Vector3(0,1,0).cross(forward).normalize(),up=forward.clone().cross(right).normalize();
 const vertical=Math.tan(fov*Math.PI/360)*fill,horizontal=vertical*Math.max(.1,aspect);
 let distance=0;
 for(const x of [bounds.min[0],bounds.max[0]])for(const y of [bounds.min[1],bounds.max[1]])for(const z of [bounds.min[2],bounds.max[2]]){
  const corner=new Vector3(x,y,z).sub(target),depth=corner.dot(forward);
  distance=Math.max(distance,depth+Math.abs(corner.dot(right))/horizontal,depth+Math.abs(corner.dot(up))/vertical);
 }
 return {eye:target.clone().addScaledVector(forward,distance),target};
}

const solid=(x,z,w,d)=>({min:[x-w/2,0,z-d/2],max:[x+w/2,2.3,z+d/2]});
export const EXPLORE_SOLIDS=[...STUDY_TABLES.map(t=>solid(t.x,t.z,2.8,1.5)),...STUDY_SEATS.map(s=>solid(s.position[0],s.position[2],.52,.52)),...LIBRARY_SHELVES.map(s=>solid(s.x,s.z,s.width,s.depth)),...[-10,10].map(x=>solid(x,15.25,3,1)),...[-14.6,14.6].map(x=>solid(x,15.3,.8,.8))];
export function constrainExplore(previous,wanted){
 const destination=[Math.max(-15.2,Math.min(15.2,wanted[0])),1.65,Math.max(-16.2,Math.min(16.2,wanted[2]))];
 const fraction=cameraFraction(previous,destination,EXPLORE_SOLIDS);
 return previous.map((n,i)=>i===1?1.65:n+(destination[i]-n)*fraction);
}

// Orbit cameras use actual furniture height, unlike the walking camera's
// deliberately tall obstacles. The map is an intentional architectural cutaway.
export const LIBRARY_CAMERA_SOLIDS=[
 ...STUDY_TABLES.map(t=>({min:[t.x-1.4,0,t.z-.75],max:[t.x+1.4,.79,t.z+.75]})),
 ...STUDY_SEATS.map(s=>({min:[s.position[0]-.26,0,s.position[2]-.26],max:[s.position[0]+.26,1,s.position[2]+.26]})),
 ...LIBRARY_SHELVES.map(s=>({min:[s.x-s.width/2,0,s.z-s.depth/2],max:[s.x+s.width/2,3.3,s.z+s.depth/2]})),
];
export function constrainLibraryOrbit(eye,target,mode){
 if(mode==='overview')return [...eye];
 const bounded=[Math.max(-15.75,Math.min(15.75,eye[0])),Math.max(.6,Math.min(5.2,eye[1])),Math.max(-16.75,Math.min(16.75,eye[2]))];
 const f=cameraFraction(target,bounded,LIBRARY_CAMERA_SOLIDS);
 return target.map((n,i)=>n+(bounded[i]-n)*f);
}
