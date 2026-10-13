import test from 'node:test';
import assert from 'node:assert/strict';
import {createRenderClock,sceneSignature} from '../src/study/shared/renderState.js';
import {seatMotion,leaveSeatMotion,poseAt} from '../server/study/seating.js';
test('chat and heartbeat snapshots leave 3D signature stable, actual seating changes invalidate it',()=>{
 const room={id:'room',name:'Library',members:[{id:'a',name:'Student',seat:'s1',phase:'studying'}]};
 const key=sceneSignature(room);for(let i=0;i<1000;i++)assert.equal(sceneSignature({...room,serverNow:i,revision:i,tableMessages:[{body:`message${i}`}],members:room.members.map(m=>({...m,focusMs:i}))}),key);
 assert.notEqual(sceneSignature({...room,members:[{...room.members[0],seat:'s2'}]}),key);
});
test('render clock absorbs network jitter without reversing movement, handles large corrections',()=>{
 const clock=createRenderClock();assert.equal(clock.sample(0,1000).now,1000);let previous=1000;
 for(let i=1;i<=120;i++){const {now,corrected}=clock.sample(1/60,1000+i*1000/60+(i%2?30:-30));assert.ok(now>previous);assert.equal(corrected,false);previous=now;}
 assert.equal(clock.sample(1/60,10000).corrected,true);
});
test('chair stages expose synchronized progress and retain continuous transforms at boundaries',()=>{
 for(const motion of [seatMotion(null,'s1',1000),leaveSeatMotion('s1',1000)])for(const stage of motion.stages){const midpoint=poseAt(motion,motion.startedAt+stage.start+stage.duration/2);assert.ok(Math.abs(midpoint.progress-.5)<1e-8);const before=poseAt(motion,motion.startedAt+stage.start+stage.duration-.001),after=poseAt(motion,motion.startedAt+stage.start+stage.duration+.001);assert.ok(Math.hypot(before.position[0]-after.position[0],before.position[2]-after.position[2])<.001);}
});
import {createStreamHub} from '../src/study/shared/streamHub.js';
test('header and room share one stream, unsubscribe safely and merge unchanged-history deltas',async()=>{
 let opens=0,publish,aborted=false;
 const subscribe=createStreamHub(async(key,signal,send)=>{opens++;publish=send;await new Promise(resolve=>signal.addEventListener('abort',()=>{aborted=true;resolve();},{once:true}));});
 const a=new AbortController(),b=new AbortController(),receivedA=[],receivedB=[];
 const one=subscribe('account-token',a.signal,v=>receivedA.push(v)),two=subscribe('account-token',b.signal,v=>receivedB.push(v));
 assert.equal(opens,1);publish({room:{id:'r'},tableMessages:[{id:'m'}]});publish({room:{id:'r'},serverNow:10});
 assert.equal(receivedB.at(-1).tableMessages.length,1);a.abort();await one;assert.equal(aborted,false);
 publish({room:null,tableMessages:[]});assert.equal(receivedB.at(-1).tableMessages.length,0);b.abort();await two;assert.equal(aborted,true);
});
test('stream failures reject every subscriber so reconnect handlers can recover',async()=>{
 let fail;const subscribe=createStreamHub(()=>new Promise((_,reject)=>{fail=reject;}));
 const a=new AbortController(),b=new AbortController();const one=subscribe('key',a.signal,()=>{}),two=subscribe('key',b.signal,()=>{});
 fail(new Error('offline'));await assert.rejects(one,/offline/);await assert.rejects(two,/offline/);
});
test('message deltas append, revoke and update read state without replacing retained history',async()=>{
 let publish;const subscribe=createStreamHub(async(_,signal,send)=>{publish=send;await new Promise(r=>signal.addEventListener('abort',r,{once:true}));});
 const abort=new AbortController(),values=[];const pending=subscribe('key',abort.signal,v=>values.push(v));
 publish({tableMessages:[{id:'a',body:'Old',read:false,createdAt:'2026-01-01'}]});
 publish({tableMessageDelta:{append:[{id:'b',body:'New',read:false,createdAt:'2026-01-02'}],remove:[],read:[{id:'a',read:true}]}});
 assert.deepEqual(values.at(-1).tableMessages.map(m=>m.id),['a','b']);assert.equal(values.at(-1).tableMessages[0].read,true);
 publish({tableMessageDelta:{append:[],read:[],remove:['a']}});assert.deepEqual(values.at(-1).tableMessages.map(m=>m.id),['b']);abort.abort();await pending;
});
