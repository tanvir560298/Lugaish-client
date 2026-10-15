import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSession,tickSession,advanceSession,restoreSession,encouragement,parseGuidedRequest} from './session.js';
const options={minutes:50,lesson:{id:'english:1:video',title:'An actual lesson',kind:'video',course:'english',day:1},owner:'fixture'};
test('chat study intent extracts time and topic without treating every numeric question as a plan',()=>{
 assert.deepEqual(parseGuidedRequest('I have 50 mins to learn web development'),{minutes:50,topic:'web development',valid:true});
 assert.deepEqual(parseGuidedRequest('Study Java for 10 minutes'),{minutes:10,topic:'java',valid:true});
 assert.equal(parseGuidedRequest('Explain Java loops'),null);
 assert.equal(parseGuidedRequest('Why did my program run for 60 minutes?'),null);
 assert.equal(parseGuidedRequest('I have 5 mins').valid,false);
});
test('every supported time budget is split exactly, without claiming a video duration',()=>{
 for(let minutes=10;minutes<=120;minutes++){const s=makeSession({...options,minutes});assert.equal(s.blocks.reduce((n,b)=>n+b.seconds,0),minutes*60);assert.ok(s.blocks.every(b=>b.seconds>0));}
 assert.throws(()=>makeSession({...options,minutes:9}));assert.throws(()=>makeSession({...options,minutes:10.5}));
});
test('timer waits for explicit start, ignores paused time and clamps delayed/background ticks',()=>{
 const ready=makeSession(options);assert.equal(tickSession(ready,1),ready);
 const active={...ready,status:'active',running:true};assert.equal(tickSession(active,100).elapsed[0],2);
 const paused={...active,status:'paused',running:false};assert.equal(tickSession(paused,1),paused);
 assert.equal(tickSession(active,NaN),active);
});
test('block boundary stops clock and advancing requires a distinct user action',()=>{
 const s=makeSession(options);s.status='active';s.running=true;s.elapsed[0]=s.blocks[0].seconds-1;
 const done=tickSession(s,2);assert.equal(done.elapsed[0],done.blocks[0].seconds);assert.equal(done.running,false);assert.equal(done.stage,0);
 const next=advanceSession(done);assert.equal(next.stage,1);assert.equal(next.running,false);
 const final=advanceSession(advanceSession(next));assert.equal(final.status,'completed');assert.equal(final.elapsed[1],0);
 assert.match(encouragement(final),/not a mastery/);
});
test('reload pauses recovery and rejects cross-account or malformed saved sessions',()=>{
 const s={...makeSession(options),status:'active',running:true};
 assert.equal(restoreSession(s,'other'),null);assert.equal(restoreSession({...s,stage:20},'fixture'),null);
 assert.equal(restoreSession({...s,elapsed:[Infinity,0,0]},'fixture'),null);
 const restored=restoreSession(s,'fixture');assert.equal(restored.status,'paused');assert.equal(restored.running,false);
});
