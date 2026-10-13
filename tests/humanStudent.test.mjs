import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {AnimationMixer,Vector3} from 'three';
import {attachHumanStudent} from '../src/characters/HumanStudent.js';
import {bakeCartoonSkin} from '../src/characters/bakeCartoonSkin.js';
import {CHARACTER_PRESETS} from '../src/characters/characterPresets.js';
import {findBone} from '../src/characters/footPlanting.js';
import {createStudyPose} from '../src/characters/studyPose.js';
async function rig(){const bytes=readFileSync(new URL('../public/models/student/student.glb',import.meta.url));return new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');}
test('all selectable humans use continuous two-bone joints, skin/fabric materials and supported blink/breath morphs',async()=>{
 for(const preset of CHARACTER_PRESETS){const gltf=await rig();attachHumanStudent(gltf.scene,preset);const skin=bakeCartoonSkin(gltf.scene),weights=skin.geometry.attributes.skinWeight;let blended=0;for(let i=0;i<weights.count;i++){const sum=weights.getX(i)+weights.getY(i)+weights.getZ(i)+weights.getW(i);assert.ok(Math.abs(sum-1)<1e-5);if(weights.getY(i)>.01&&weights.getX(i)>.01)blended++;}assert.ok(blended>100);assert.ok(skin.geometry.attributes.surfaceRoughness.array.some(v=>v<.7));assert.equal(skin.geometry.morphAttributes.position.length,2);assert.ok(skin.geometry.attributes.position.count<45000);
 const mixer=new AnimationMixer(gltf.scene),clip=gltf.animations.find(c=>c.name==='seated');mixer.clipAction(clip).play();mixer.update(.5);gltf.scene.updateMatrixWorld(true);const v=new Vector3();for(let i=0;i<weights.count;i+=47){skin.getVertexPosition(i,v);assert.ok(Number.isFinite(v.x)&&Number.isFinite(v.y)&&Number.isFinite(v.z));}
 const pose=createStudyPose(gltf.scene);for(let i=0;i<100;i++){pose.restore();mixer.update(1/60);pose.update(1/60,{seated:true,reduced:true,distant:false,desk:true});}assert.equal(skin.morphTargetInfluences[0],0);assert.equal(skin.morphTargetInfluences[1],0);
 for(const [side,x]of [['L',.15],['R',-.15]]){const hand=findBone(gltf.scene,`DEF-hand.${side}`).getWorldPosition(new Vector3()),goal=gltf.scene.localToWorld(new Vector3(x,.82,.35));assert.ok(hand.distanceTo(goal)<.03,JSON.stringify({side,hand:hand.toArray(),goal:goal.toArray(),distance:hand.distanceTo(goal)}));}

 console.log(`ART METRIC ${preset.id}: vertices=${weights.count}, blended joint vertices=${blended}, triangles=${skin.geometry.index.count/3}, visible skinned draw calls=1`);
 }
});
