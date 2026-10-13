import {Vector3,Quaternion,Euler} from 'three';
import {solveLeg,findBone} from './footPlanting.js';
// The seated clip supplies hips, feet and bent arms. Small additive changes
// follow mixer evaluation, so they cannot accumulate into a distorted pose.
export function createStudyPose(scene){
 const spine=findBone(scene,'DEF-spine.001');
 const head=findBone(scene,'DEF-head'),chest=findBone(scene,'DEF-spine.002');
 const skin=scene.getObjectByName('LugaishCartoonSkin');
 const arms=['L','R'].map((side,i)=>({upper:findBone(scene,`DEF-upper_arm.${side}`),fore:findBone(scene,`DEF-forearm.${side}`),hand:findBone(scene,`DEF-hand.${side}`),target:new Vector3(i===0?.15:-.15,.82,.35)})).filter(a=>a.upper&&a.fore&&a.hand);
 const current=new Vector3(),target=new Vector3(),world=new Quaternion(),orientation=new Quaternion().setFromEuler(new Euler(Math.PI/2,0,0));
 const axis=new Vector3(),rotation=new Quaternion(),boneRotation=new Quaternion(),parentRotation=new Quaternion();
 const tilt=(bone,amount)=>{if(!bone)return;bone.getWorldQuaternion(boneRotation);rotation.setFromAxisAngle(axis,amount);boneRotation.premultiply(rotation);bone.quaternion.copy(bone.parent.getWorldQuaternion(parentRotation).invert().multiply(boneRotation));bone.updateWorldMatrix(false,true);};
 const affected=[head,chest,spine,...arms.flatMap(a=>[a.upper,a.fore,a.hand])].filter(Boolean),bases=new Map();
 let time=0,weight=0,nextBlink=3+Math.random()*4;
 const phase=Math.random()*5;
 return {restore(){for(const [bone,base]of bases)bone.quaternion.copy(base);bases.clear();},update(dt,{seated,reduced,distant,desk=false}){
  for(const bone of affected)bases.set(bone,bone.quaternion.clone());
  time+=dt;weight=reduced?Number(seated):weight+(Number(seated)-weight)*(1-Math.exp(-5*dt));
  scene.updateWorldMatrix(true,true);scene.getWorldQuaternion(world);axis.set(1,0,0).applyQuaternion(world);
  if(desk&&weight>.001){tilt(spine,.22*weight);tilt(chest,.20*weight);}
  if(head&&weight>.001)head.rotateX(.055*weight+(reduced||distant?0:Math.sin(time*.37+phase)*.008*weight));
  if(chest&&weight>.001&&!reduced&&!distant)chest.rotateZ(Math.sin(time*.22+phase)*.004*weight);
  if(desk&&weight>.001&&!distant){scene.updateWorldMatrix(true,true);scene.getWorldQuaternion(world);for(const arm of arms){arm.hand.getWorldPosition(current);target.copy(arm.target);scene.localToWorld(target);target.lerpVectors(current,target,weight);const before=arm.hand.getWorldQuaternion(new Quaternion());solveLeg(arm.upper,arm.fore,arm.hand,target);const desired=before.slerp(world.clone().multiply(orientation),weight);arm.hand.quaternion.copy(arm.hand.parent.getWorldQuaternion(new Quaternion()).invert().multiply(desired));arm.hand.updateWorldMatrix(false,true);}}
  if(skin?.morphTargetInfluences){const cycle=time-nextBlink,blink=cycle>=0&&cycle<.18?Math.sin(cycle/.18*Math.PI):0;if(cycle>=.18)nextBlink=time+3+Math.random()*5;skin.morphTargetInfluences[0]=reduced||distant?0:blink;skin.morphTargetInfluences[1]=seated&&!reduced&&!distant?(Math.sin(time*1.15+phase)+1)*.5:0;}
 }};
}
