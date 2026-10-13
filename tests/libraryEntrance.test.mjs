import test from 'node:test';
import assert from 'node:assert/strict';
import { ENTRANCE_CAMERA, entranceChoiceState, constrainExplore } from '../src/study/shared/libraryCamera.js';
test('arrival camera frames the library inside its architectural bounds; explore retains human eye height',()=>{
 assert.ok(ENTRANCE_CAMERA.eye[1]>2&&ENTRANCE_CAMERA.eye[1]<5.4);
 assert.ok(ENTRANCE_CAMERA.target[1]<ENTRANCE_CAMERA.eye[1]);
 assert.equal(ENTRANCE_CAMERA.eye[0],0);
 assert.ok(ENTRANCE_CAMERA.eye[2]<17&&ENTRANCE_CAMERA.target[2]<ENTRANCE_CAMERA.eye[2]);
 assert.equal(constrainExplore([0,1.65,15.8],[0,3.2,15.8])[1],1.65);
});
test('return offer requires verified settled active seat and never replaces membership',()=>{
 const room={id:'private'},mine={seat:'s9',arrivesAt:100,phase:'paused'};
 assert.equal(entranceChoiceState({connected:true,room,mine,now:200}).canReturn,true);
 for(const input of [{connected:false,room,mine,now:200},{connected:true,room,mine,now:50},{connected:true,room,mine:{...mine,phase:'reconnecting'},now:200}])assert.equal(entranceChoiceState(input).canReturn,false);
 assert.equal(entranceChoiceState({connected:true,room,mine,now:200}).canStudyAlone,false);
 assert.equal(entranceChoiceState({connected:true,room:null,mine:null,now:200}).canStudyAlone,true);
 assert.deepEqual(room,{id:'private'});assert.equal(mine.seat,'s9');
});
