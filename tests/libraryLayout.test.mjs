import test from 'node:test';
import assert from 'node:assert/strict';
import { LIBRARY_TABLES, LIBRARY_ZONES, LIBRARY_SHELVES, libraryOccupancy } from '../src/study/shared/libraryLayout.js';
import { STUDY_SEATS } from '../server/study/tableLayout.js';
import { seatMotion } from '../server/study/seating.js';

test('library zones retain every existing table and saved seat identity',()=>{
 assert.equal(LIBRARY_TABLES.length,20);
 assert.equal(LIBRARY_TABLES.reduce((n,t)=>n+t.capacity,0),100);
 for(const zone of LIBRARY_ZONES)assert.equal(LIBRARY_TABLES.filter(t=>t.zoneId===zone.id).length,5);
 for(const seat of STUDY_SEATS)assert.ok(LIBRARY_TABLES.some(t=>t.id===seat.tableId));
});
test('live count excludes reconnecting members while retaining their reserved chairs',()=>{
 assert.deepEqual(libraryOccupancy({members:[{seat:'s1',phase:'studying'},{seat:'s2',phase:'reconnecting'},{seat:null,phase:'paused'}]}),{present:2,reserved:2,available:98});
 assert.deepEqual(libraryOccupancy({members:[]}),{present:0,reserved:0,available:100});
});
test('shelves and decorative lounges do not obstruct any established seat transfer',()=>{
 const furniture=[...LIBRARY_SHELVES,...[-10,10].map(x=>({x,z:15.25,width:3,depth:1})),...[-14.6,14.6].map(x=>({x,z:15.3,width:.8,depth:.8}))];
 for(const from of [null,...STUDY_SEATS.map(s=>s.id)])for(const target of STUDY_SEATS){
  const motion=seatMotion(from,target.id,1000);
  for(const stage of motion.stages.filter(s=>s.type==='walk'))for(let i=0;i<=10;i++){
   const t=i/10,x=stage.from[0]+(stage.to[0]-stage.from[0])*t,z=stage.from[2]+(stage.to[2]-stage.from[2])*t;
   for(const f of furniture)assert.ok(!(Math.abs(x-f.x)<f.width/2+.24&&Math.abs(z-f.z)<f.depth/2+.24),`${from}->${target.id} hits library furniture`);
  }
 }
});
