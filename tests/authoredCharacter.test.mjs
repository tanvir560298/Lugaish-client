import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import { MeshBasicMaterial } from 'three';
import { validateAuthoredCharacter, prepareAuthoredCharacter, createFaceMotion } from '../src/characters/authoredCharacter.js';
import { characterModel } from '../src/characters/characterModels.js';
const file=readFileSync(new URL('../public/models/student/student.glb',import.meta.url));
const reference=await new Promise((resolve,reject)=>new GLTFLoader().parse(file.buffer.slice(file.byteOffset,file.byteOffset+file.byteLength),'',resolve,reject));
const candidate=()=>({scene:clone(reference.scene),animations:[]});
test('compatibility gate accepts the existing weighted armature; this is not visual approval',()=>{
 const authored=candidate(),result=validateAuthoredCharacter(authored,reference);
 assert.ok(result.bones>=50);assert.ok(result.blendedVertices>0);assert.ok(result.triangles<60000);
 assert.equal(validateAuthoredCharacter(authored,reference),result);
 prepareAuthoredCharacter(authored.scene);authored.scene.traverse(m=>{if(m.isSkinnedMesh){assert.equal(m.frustumCulled,true);assert.ok(m.boundingSphere.radius>0);}});
});
test('bone orientation changes are rejected instead of applying incompatible bundled animations',()=>{
 const authored=candidate();let changed=false;authored.scene.traverse(b=>{if(b.isBone&&!changed&&b.name.includes('forearm')){b.rotation.z+=.2;changed=true;}});
 assert.equal(changed,true);assert.throws(()=>validateAuthoredCharacter(authored,reference),/Bind transform differs/);
});
test('single-bone weights and unlit materials cannot be approved as an authored replacement',()=>{
 const rigid=candidate();rigid.scene.traverse(m=>{if(m.isSkinnedMesh){m.geometry=m.geometry.clone();const w=m.geometry.attributes.skinWeight;for(let i=0;i<w.count;i++)w.setXYZW(i,1,0,0,0);}});
 assert.throws(()=>validateAuthoredCharacter(rigid,reference),/Rigid single-bone/);
 const unlit=candidate();unlit.scene.traverse(m=>{if(m.isMesh)m.material=new MeshBasicMaterial();});assert.throws(()=>validateAuthoredCharacter(unlit,reference),/PBR material/);
});
test('malformed weights are rejected and approved assets retain shared PBR materials',()=>{
 const broken=candidate();let changed=false;broken.scene.traverse(m=>{if(m.isSkinnedMesh&&!changed){m.geometry=m.geometry.clone();m.geometry.attributes.skinWeight.setXYZW(0,.5,0,0,0);changed=true;}});
 assert.throws(()=>validateAuthoredCharacter(broken,reference),/invalid skin weights/);
 const authored=candidate();let mesh;authored.scene.traverse(m=>{if(m.isMesh)mesh=m;});const material=mesh.material;prepareAuthoredCharacter(authored.scene);assert.equal(mesh.material,material);
});
test('blink channels animate only supported morphs and leave unrelated expressions intact',()=>{
 const mesh={morphTargetDictionary:{eyeBlinkLeft:0,eyeBlinkRight:1,Smile:2},morphTargetInfluences:[0,0,.3]};
 const motion=createFaceMotion({traverse:fn=>fn(mesh)});assert.equal(motion.supported,true);
 motion.update(.04);assert.ok(mesh.morphTargetInfluences[0]>.5);assert.equal(mesh.morphTargetInfluences[0],mesh.morphTargetInfluences[1]);assert.equal(mesh.morphTargetInfluences[2],.3);
 for(let i=0;i<5;i++)motion.update(.04);assert.equal(mesh.morphTargetInfluences[0],0);
 assert.equal(createFaceMotion({traverse:()=>{}}).supported,false);
});
test('no missing premium asset is silently represented as an authored model',()=>{
 for(const id of ['maya','noor','zain'])assert.equal(characterModel(id),null);
});

test('incorrect inverse bind matrices are rejected before distorted animation can render',()=>{
 const authored=candidate();let changed=false;authored.scene.traverse(m=>{if(m.isSkinnedMesh&&!changed){m.skeleton.boneInverses=m.skeleton.boneInverses.map(v=>v.clone());m.skeleton.boneInverses[0].elements[12]+=.1;changed=true;}});
 assert.throws(()=>validateAuthoredCharacter(authored,reference),/Inverse bind differs/);
});
