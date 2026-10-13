import test from 'node:test';
import assert from 'node:assert/strict';
import { exactEmail, messageText, publicMessage } from '../server/study/socialValidation.js';
import { STUDY_TABLES, STUDY_SEATS } from '../server/study/tableLayout.js';
import { seatMotion, poseAt } from '../server/study/seating.js';
import { createNotificationQueue, notificationDuration } from '../src/study/shared/notificationQueue.js';
test('email search normalizes only full emails and messages reject empty or oversized input',()=>{
  assert.equal(exactEmail(' Friend@Gmail.com '),'friend@gmail.com');
  for(const input of ['friend','@gmail.com','a@',null,'x'.repeat(255)+'@a.com'])assert.throws(()=>exactEmail(input));
  assert.equal(messageText(' hello '),'hello');assert.throws(()=>messageText(' '));assert.throws(()=>messageText('a'.repeat(501)));
});
test('private message serialization excludes unrelated viewers',()=>{
  const m={_id:'id',senderId:'a',recipientId:'b',senderName:'Friend',body:'private',secret:'hidden'};
  assert.equal(publicMessage(m,'c'),null);assert.equal(publicMessage(m,'a').body,'private');assert.equal(publicMessage(m,'b').body,'private');assert.equal(publicMessage(m,'b').secret,undefined);
});
test('100 study seats are grouped into 20 five-person tables with distinct shared desktops',()=>{
  assert.equal(STUDY_TABLES.length,20);assert.equal(STUDY_SEATS.length,100);
  for(const table of STUDY_TABLES){const seats=STUDY_SEATS.filter(s=>s.tableId===table.id);assert.equal(seats.length,5);assert.equal(new Set(seats.map(s=>s.number)).size,5);}
});
test('every study transfer uses clear corridors around shared tables and other chairs',()=>{
  for(const from of [null,...STUDY_SEATS.map(s=>s.id)])for(const target of STUDY_SEATS){
    const motion=seatMotion(from,target.id,1000);
    for(const stage of motion.stages.filter(s=>s.type==='walk'))for(const t of [0,.25,.5,.75,1]){
      const x=stage.from[0]+(stage.to[0]-stage.from[0])*t,z=stage.from[2]+(stage.to[2]-stage.from[2])*t;
      for(const table of STUDY_TABLES)assert.ok(!(Math.abs(x-table.x)<1.4+.24&&Math.abs(z-table.z)<.75+.24),`${from}->${target.id} crosses ${table.id} at ${x},${z}`);
      for(const s of STUDY_SEATS)assert.ok(!(Math.abs(x-s.position[0])<.26+.24&&Math.abs(z-s.position[2])<.26+.24),`${from}->${target.id} crosses ${s.id}`);
    }
    assert.equal(poseAt(motion,motion.endsAt).state,'seated');
  }
});
test('notification sounds once, survives repeat snapshots and hides after its calculated reading duration',()=>{
  let now=0,scheduled=[],shown=[],chimes=0,acks=[];
  const q=createNotificationQueue({show:m=>shown.push(m?.id||null),chime:()=>chimes++,acknowledge:id=>acks.push(id),setTimer:(fn,ms)=>{const job={fn,at:now+ms};scheduled.push(job);return job;},clearTimer:job=>{scheduled=scheduled.filter(j=>j!==job);}});
  const advance=ms=>{now+=ms;const due=scheduled.filter(j=>j.at<=now);scheduled=scheduled.filter(j=>j.at>now);due.forEach(j=>j.fn());};
  q.push([{id:'one'}]);q.push([{id:'one'}]);advance(1999);assert.deepEqual(shown,['one']);assert.equal(chimes,1);advance(1);assert.deepEqual(shown,['one',null]);
  q.push([{id:'one'},{id:'two'}]);assert.deepEqual(acks,['one','two']);assert.equal(chimes,2);q.dispose();advance(2000);assert.deepEqual(shown,['one',null,'two']);
});

test('five-person table overlap excludes friends studying at a different table',async()=>{
  const {settle}=await import('../server/study/timing.js');
  const person=(id,seat)=>({id,seat,arrivesAt:0,phase:'studying',focusMs:0,focusUntil:100000,lastSeen:100000});
  const room={updatedAtMs:0,togetherMs:0,members:[person('a','s1'),person('b','s6')]};
  settle(room,10000);assert.equal(room.tableTogetherMs['table-1']||0,0);assert.equal(room.tableTogetherMs['table-2']||0,0);
  room.members.push(person('c','s2'));settle(room,20000);assert.equal(room.tableTogetherMs['table-1'],10000);assert.equal(room.tableTogetherMs['table-2']||0,0);
});

test('readable notification durations scale and remain between 2 and 10 seconds',()=>{
 assert.equal(notificationDuration('Hi'),2000);assert.equal(notificationDuration('a'.repeat(1000)),10000);
 assert.ok(notificationDuration('A medium message with several words to read comfortably.')>notificationDuration('Hello!'));
 for(let i=0;i<500;i++){const d=notificationDuration('字'.repeat(i));assert.ok(d>=2000&&d<=10000);}
});
