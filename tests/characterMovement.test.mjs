import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer, Vector3, Group } from 'three';
import { stepCharacter, capsuleBlocked, MOTION, angleDelta, followTarget } from '../src/characters/characterController.js';
import { simulatePlayer, SPAWN, ROOM, PLAYER_ENVIRONMENT } from '../src/classroom/world.js';
import { createJourney, stepJourney, getStairsElevation } from '../src/university/journey.js';
import { STUDY_ENVIRONMENT } from '../src/study/studyWorld.js';
import { planPath } from '../src/characters/navigation.js';
import { createStudentMotion } from '../src/characters/studentMotion.js';
import { createFootPlanting, findBone } from '../src/characters/footPlanting.js';
import { bakeCartoonSkin } from '../src/characters/bakeCartoonSkin.js';
import { attachCartoonStudent } from '../src/characters/CartoonStudent.js';
import { getCharacterPreset } from '../src/characters/characterPresets.js';
const box = { min: [-1, 0, 1], max: [1, 2, 1.2] };
test('capsule stops at obstacles and stops reporting walking velocity', () => {
  const s = { x: 0, z: 0, yaw: 0 };
  for (let i=0;i<360;i++) stepCharacter(s, {x:0,z:1,running:true},1/60,{boxes:[box]});
  assert.ok(s.z <= 1-MOTION.radius+.001); assert.ok(Math.hypot(s.velocity.x,s.velocity.z)<.001); assert.equal(s.animation,'idle'); assert.equal(s.blocked,true);
});
test('diagonal collisions slide without penetrating and long frames do not tunnel', () => {
  const s = { x: -.5, z: 0, yaw: Math.PI/4 };
  for(let i=0;i<80;i++){stepCharacter(s,{x:.6,z:1,running:true},.1,{boxes:[box]});assert.equal(capsuleBlocked(s.x,s.y,s.z,[box]),false);}
  assert.ok(s.x>1.5);
});
test('gravity lands on floor and small steps keep stable ground contact', () => {
  const s={x:0,y:2,z:0,yaw:0,grounded:false};
  for(let i=0;i<180;i++)stepCharacter(s,{x:0,z:0},1/60);
  assert.equal(s.y,0);assert.equal(s.vy,0);assert.equal(s.grounded,true);
  for(let i=0;i<100;i++)stepCharacter(s,{x:0,z:1},1/60,{ground:(_,z)=>z>.4?.1:0});
  assert.equal(s.y,.1);assert.equal(s.grounded,true);
});
test('turning is bounded, cannot reverse instantaneously, and brakes to idle', () => {
  const s={x:0,z:0,yaw:0};stepCharacter(s,{x:0,z:-1},1/60);
  assert.ok(Math.abs(s.yaw)<=MOTION.turnRate/60+.001);assert.ok(Math.abs(s.z)<.001);
  for(let i=0;i<180;i++)stepCharacter(s,{x:0,z:-1},1/60);
  const z=s.z;for(let i=0;i<60;i++)stepCharacter(s,{x:0,z:0},1/60);
  assert.equal(s.animation,'idle');assert.ok(Math.abs(s.z-z)<.3);
});
test('classroom player remains inside room and outside desks under sustained inputs', () => {
  const s={...SPAWN,vx:0,vz:0,yaw:0};
  for(const input of [{x:0,z:-1},{x:1,z:0},{x:0,z:1},{x:-1,z:0}])for(let i=0;i<500;i++){
    simulatePlayer(s,{...input,running:true},0,1/60);
    assert.ok(s.x>=-ROOM.width/2+MOTION.radius-.001&&s.x<=ROOM.width/2-MOTION.radius+.001&&s.z>=-ROOM.depth/2+MOTION.radius-.001&&s.z<=ROOM.depth/2-MOTION.radius+.001);
    assert.equal(capsuleBlocked(s.x,s.y,s.z,PLAYER_ENVIRONMENT.boxes),false);
  }
});
test('every study seat is reachable from spawn and other seats without crossing furniture', () => {
  const goals=[{x:-3.2,z:.35},{x:-.4,z:-.07},{x:1.1,z:2.3}];
  for(const start of [{x:0,z:2.6},...goals])for(const goal of goals){
    const path=planPath(start,goal,STUDY_ENVIRONMENT);assert.ok(path,`No path ${JSON.stringify(start)} -> ${JSON.stringify(goal)}`);
    const s={...start,yaw:Math.PI};let index=0;
    for(let frame=0;frame<4000&&index<path.length;frame++){
      if(followTarget(s,path[index],1/60,STUDY_ENVIRONMENT,path[index+1]))index++;
      assert.equal(capsuleBlocked(s.x,s.y,s.z,STUDY_ENVIRONMENT.boxes),false);
    }
    assert.equal(index,path.length);assert.ok(Math.hypot(s.x-goal.x,s.z-goal.z)<.04);
  }
});
test('unreachable navigation reports no path',()=>{
  assert.equal(planPath({x:0,z:2.6},{x:-.4,z:.6},STUDY_ENVIRONMENT),null);
});
test('all campus journeys finish, ground on actual stairs, and wait for readiness',()=>{
  for(const id of ['classroom','study','speaking']){
    const s=createJourney();
    for(let i=0;i<1600&&s.phase!=='arrived';i++){
      const x=s.x,z=s.z,yaw=s.yaw;stepJourney(s,id,true,1/60);
      assert.ok(Math.hypot(s.x-x,s.z-z)<=MOTION.walkSpeed/60+.002);
      assert.ok(Math.abs(angleDelta(yaw,s.yaw))<=MOTION.turnRate/60+.001);
      assert.equal(s.y,getStairsElevation(s.z));
    }
    assert.equal(s.phase,'arrived',id);
  }
  const s=createJourney();for(let i=0;i<1600;i++)stepJourney(s,'study',false,1/60);
  assert.equal(s.phase,'loading');assert.ok(s.z>-2.5);
  const x=s.x,z=s.z;stepJourney(s,null,true,1/60);assert.ok(Math.hypot(s.x-x,s.z-z)<.03);
});
async function loadRig(){const b=readFileSync(new URL('../public/models/student/student.glb',import.meta.url));return new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');}
test('real skeletal clips resolve bones, freeze gait when blocked, and retain valid IK segment lengths',async()=>{
  const g=await loadRig();attachCartoonStudent(g.scene,getCharacterPreset('maya'));
  const mixer=new AnimationMixer(g.scene),actions=Object.fromEntries(g.animations.map(c=>[c.name,mixer.clipAction(c)]));
  const control=createStudentMotion({actions}),plant=createFootPlanting(g.scene),root=new Group();root.add(g.scene);
  const baseline={};
  for(const side of ['L','R']){root.updateMatrixWorld(true);const thigh=findBone(g.scene,`DEF-thigh.${side}`),shin=findBone(g.scene,`DEF-shin.${side}`),foot=findBone(g.scene,`DEF-foot.${side}`);assert.ok(thigh&&shin&&foot);baseline[side]=[thigh.getWorldPosition(new Vector3()).distanceTo(shin.getWorldPosition(new Vector3())),shin.getWorldPosition(new Vector3()).distanceTo(foot.getWorldPosition(new Vector3()))];assert.ok(foot.children.some(c=>c.isMesh));}
  let lowestShoe = Infinity;
  for(let frame=0;frame<240;frame++){
    root.position.z+=1.45/60;control.update(1/60,{x:0,z:1.45},root);mixer.update(1/60);plant.update();
    for(const side of ['L','R']){
      const [h,k,a]=['thigh','shin','foot'].map(n=>findBone(g.scene,`DEF-${n}.${side}`).getWorldPosition(new Vector3()));
      assert.ok(h.toArray().every(Number.isFinite)&&k.toArray().every(Number.isFinite)&&a.toArray().every(Number.isFinite));
      for (const mesh of findBone(g.scene, `DEF-foot.${side}`).children.filter(o => o.isMesh)) {
        const e = mesh.matrixWorld.elements; lowestShoe = Math.min(lowestShoe, e[13] - Math.hypot(e[1], e[5], e[9]));
      }
      assert.ok(Math.abs(h.distanceTo(k)-baseline[side][0])<.0001);assert.ok(Math.abs(k.distanceTo(a)-baseline[side][1])<.0001);
    }
  }
  assert.ok(lowestShoe >= -.01, `Shoe penetrates floor by ${-lowestShoe}m`);
  const phase=control.phase;for(let i=0;i<60;i++){control.update(1/60,{x:0,z:0},root);mixer.update(1/60);}
  assert.equal(control.phase,phase);assert.equal(control.state,'idle');
  const yaw=root.rotation.y;control.update(1/60,{x:0,z:0},root,Math.PI);mixer.update(1/60);
  assert.equal(control.state,'turn');assert.ok(control.phase!==phase);assert.ok(Math.abs(angleDelta(yaw,root.rotation.y))<=MOTION.turnRate/60+.001);
  control.dispose();
});

test('combined cartoon skin follows the original bone-attached artwork',async()=>{
  const g=await loadRig();attachCartoonStudent(g.scene,getCharacterPreset('noor'));g.scene.updateMatrixWorld(true);
  const sources=[];g.scene.traverse(o=>{if(o.isMesh&&o.visible)sources.push(o);});
  const mesh=bakeCartoonSkin(g.scene),mixer=new AnimationMixer(g.scene);mixer.clipAction(g.animations.find(c=>c.name==='walk')).play();mixer.update(.4);g.scene.updateMatrixWorld(true);mesh.skeleton.update();
  let offset=0;
  for(const source of sources){
    const expected=new Vector3().fromBufferAttribute(source.geometry.attributes.position,0).applyMatrix4(source.matrixWorld);
    const actual=mesh.getVertexPosition(offset,new Vector3()).applyMatrix4(mesh.matrixWorld);
    assert.ok(expected.distanceTo(actual)<.0001,source.name);offset+=source.geometry.attributes.position.count;
  }
  assert.equal(mesh.geometry.attributes.position.count,offset);
  assert.equal(mesh.material.vertexColors,true);
});
