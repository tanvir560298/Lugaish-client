import test from 'node:test';import assert from 'node:assert/strict';
import {getStoredCharacterId,setStoredCharacterId,normalizeCharacterId} from '../src/characters/characterPresets.js';
test('legacy avatar IDs normalize safely; failed persistence never announces a successful change',()=>{
 const before={window:globalThis.window,localStorage:globalThis.localStorage};const events=[];let saved='noor';
 try{
 globalThis.window={dispatchEvent:e=>events.push(e.detail.characterId)};globalThis.localStorage={getItem:()=>saved,setItem:(key,value)=>{saved=value;}};
 assert.equal(getStoredCharacterId(),'noor');assert.equal(normalizeCharacterId('zain'),'zain');assert.equal(normalizeCharacterId('legacy-unknown'),'maya');
 saved='invalid';assert.equal(getStoredCharacterId(),'maya');assert.throws(()=>setStoredCharacterId('invalid'),/available avatars/);assert.equal(events.length,0);
 setStoredCharacterId('zain');assert.equal(saved,'zain');assert.deepEqual(events,['zain']);
 globalThis.localStorage={getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('quota');}};
 assert.equal(getStoredCharacterId(),'maya');assert.throws(()=>setStoredCharacterId('maya'),/could not save/);assert.deepEqual(events,['zain']);
 }finally{if(before.window===undefined)delete globalThis.window;else globalThis.window=before.window;if(before.localStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=before.localStorage;}
});

test('cached fallback geometry is shared while skeleton and facial state stay instance-local',async()=>{
 const {readFileSync}=await import('node:fs');const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');const {clone}=await import('three/addons/utils/SkeletonUtils.js');const {fallbackCharacterTemplate}=await import('../src/characters/fallbackCharacter.js');const {CHARACTER_PRESETS}=await import('../src/characters/characterPresets.js');const {instanceResourceCleanup}=await import('../src/characters/characterResources.js');
 const bytes=readFileSync(new URL('../public/models/student/student.glb',import.meta.url));const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const template=fallbackCharacterTemplate(gltf.scene,CHARACTER_PRESETS[0]);assert.equal(fallbackCharacterTemplate(gltf.scene,CHARACTER_PRESETS[0]),template);
 const a=clone(template),b=clone(template);let skinA,skinB;a.traverse(o=>{if(o.name==='LugaishCartoonSkin')skinA=o;});b.traverse(o=>{if(o.name==='LugaishCartoonSkin')skinB=o;});
 assert.equal(skinA.geometry,skinB.geometry);assert.equal(skinA.material,skinB.material);assert.notEqual(skinA.skeleton,skinB.skeleton);assert.notEqual(skinA.skeleton.bones[0],skinB.skeleton.bones[0]);skinA.morphTargetInfluences[0]=1;assert.equal(skinB.morphTargetInfluences[0],0);
 let disposed=false;skinA.geometry.addEventListener('dispose',()=>{disposed=true;});instanceResourceCleanup(a,template)();assert.equal(disposed,false);assert.ok(skinB.geometry.attributes.position.count>0);
});
