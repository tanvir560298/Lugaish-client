import test from 'node:test';
import assert from 'node:assert/strict';
import { SPAWN, SOLIDS, TEACHER_PATH, isBlocked, moveWithCollisions, simulatePlayer, cameraFraction } from './world.js';
import { createLocalSession, transition, interpolateSnapshot } from './session.js';
import { accessibleVideos, resolveMedia } from './mediaPolicy.js';

test('spawn is clear and running cannot tunnel through desks or outer walls',()=> {
  assert.equal(isBlocked(SPAWN.x,SPAWN.z),false);
  for(const [dx,dz] of [[100,0],[-100,0],[0,100],[0,-100],[100,100]]) {
    const result=moveWithCollisions(SPAWN,dx,dz);
    assert.equal(isBlocked(result.x,result.z),false);
  }
  const desk=SOLIDS[6];
  const result=moveWithCollisions({x:(desk.min[0]+desk.max[0])/2,z:desk.min[2]-1},0,2);
  assert.ok(result.z<desk.min[2], `stopped before the actual first desk: ${result.z}`);
});
test('movement is stable across 30 and 144 FPS',()=> {
  const simulate=fps=>{const p={x:-3.8,z:3,vx:0,vz:0,yaw:0};for(let n=0;n<fps;n++)simulatePlayer(p,{x:0,z:-1,running:true},0,1/fps);return p;};
  assert.ok(Math.abs(simulate(30).z-simulate(144).z)<.025);
});
test('diagonal movement has the same speed as cardinal movement',()=> {
  const simulate=(x,z)=>{const p={x:0,z:0,vx:0,vz:0,yaw:0};for(let n=0;n<120;n++)simulatePlayer(p,{x,z,running:false},0,1/120);return Math.hypot(p.vx,p.vz);};
  assert.ok(Math.abs(simulate(1,0)-simulate(1,-1))<.001);
});
test('camera sweep stops before the back wall and furniture',()=> {
  const origin=[0,1.5,13],destination=[0,1.8,20];
  const fraction=cameraFraction(origin,destination);
  assert.ok(fraction>0 && fraction<.34);
  const desk=SOLIDS[6],x=(desk.min[0]+desk.max[0])/2,z=(desk.min[2]+desk.max[2])/2;
  assert.ok(cameraFraction([x,1.5,z],[x,.4,z])<1);
});
test('teacher waypoints have clearance from solid furniture and pass through doorway',()=> {
  for(let i=1;i<TEACHER_PATH.length;i++) {
    const [ax,az]=TEACHER_PATH[i-1],[bx,bz]=TEACHER_PATH[i];
    for(let n=0;n<=100;n++){
      const x=ax+(bx-ax)*n/100,z=az+(bz-az)*n/100;
      const hits=SOLIDS.some(b=>b.min[1]<1.75 && x>b.min[0]-.24 && x<b.max[0]+.24 && z>b.min[2]-.24 && z<b.max[2]+.24);
      assert.equal(hits,false,`teacher blocked at ${x}, ${z}`);
    }
  }
});
test('class sequence rejects duplicate starts and late events after cancellation',()=> {
  let state='Loading';
  for(const event of ['LOADED','START','ENTERED','ARRIVED','PREPARED','PLAYING','PAUSED','PLAYING','FINISHED']) state=transition(state,event);
  assert.equal(state,'Ended');
  assert.equal(transition('TeacherApproaching','START'),'TeacherApproaching');
  assert.equal(transition(transition('TeacherApproaching','END'),'ARRIVED'),'Ended');
  assert.equal(transition('Waiting','PLAYING'),'Waiting');
  assert.equal(transition('Error','RESET'),'Waiting');
});
test('local events carry monotonic sequencing and unsubscribed listeners are released',()=> {
  const session=createLocalSession(),events=[];const unsubscribe=session.subscribe(e=>events.push(e));
  session.emit('player.emote',{emote:'wave'});session.emit('class.stop');unsubscribe();session.emit('class.stop');
  assert.equal(events.length,2);assert.equal(events[1].sequence,events[0].sequence+1);assert.ok(events[0].timestamp);session.dispose();
});
test('remote interpolation takes the shortest angle across +/- pi',()=> {
  const state=interpolateSnapshot({x:0,z:0,yaw:3.1,timestamp:0},{x:2,z:4,yaw:-3.1,timestamp:100,animation:'walk'},50);
  assert.equal(state.x,1);assert.equal(state.z,2);assert.ok(Math.abs(state.yaw-Math.PI)<.01);
});
test('media policy preserves sequential and explicit server locks',()=> {
  const videos=[{_id:'a',youtubeId:'aaaaaaaaaaa'},{_id:'b',youtubeId:'bbbbbbbbbbb'}];
  assert.deepEqual(accessibleVideos({videos}).map(v=>v._id),['a']);
  assert.equal(accessibleVideos({videos},new Set(['a'])).length,2);
  assert.equal(accessibleVideos({videos:[{...videos[0],isLocked:true}]}).length,0);
  assert.equal(accessibleVideos({videos:[{...videos[0],completed:true}]}).length,0,'ambiguous server unlock fails closed');
});
test('media adapter accepts known file/video providers and rejects unsupported sources',()=> {
  assert.equal(resolveMedia({videoUrl:'/videos/lesson.mp4'}).kind,'file');
  assert.equal(resolveMedia({videoUrl:'https://youtu.be/2mJRqQUGNRA'}).kind,'youtube');
  assert.equal(resolveMedia({videoUrl:'https://example.com/private.m3u8'}),null);
  assert.equal(resolveMedia({videoUrl:'javascript:alert(1).mp4'}),null);
  assert.equal(resolveMedia({videoUrl:'https://youtube.com.evil.test/watch?v=2mJRqQUGNRA'}),null);
});
