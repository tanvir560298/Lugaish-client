import test from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import { fitLibraryCamera, LIBRARY_BOUNDS, constrainExplore } from '../src/study/shared/libraryCamera.js';
test('bounds fit stays inside usable viewport on portrait, tablet and desktop',()=>{
 for(const aspect of [.5,.75,1,1.5,2.2]){
  const fit=fitLibraryCamera(LIBRARY_BOUNDS,aspect),camera=new PerspectiveCamera(48,aspect,.08,200);
  camera.position.copy(fit.eye);camera.lookAt(fit.target);camera.updateMatrixWorld();
  for(const x of LIBRARY_BOUNDS.min.slice(0,1).concat(LIBRARY_BOUNDS.max[0]))for(const y of [0,5.4])for(const z of [-17,17]){
   const p=new Vector3(x,y,z).project(camera);assert.ok(Math.abs(p.x)<=.821&&Math.abs(p.y)<=.821);
  }
 }
});
test('explore camera stays at human eye height and cannot cross a table',()=>{
 const safe=constrainExplore([-3.5,1.65,-8],[-3.5,8,-13]);
 assert.equal(safe[1],1.65);assert.ok(safe[2]>-10.2);
 const bounded=constrainExplore([0,1.65,15],[0,-8,100]);assert.ok(bounded[2]<=16.2);
});

test('desk orbit stays inside walls and ceiling while cutaway map remains usable',async()=>{
 const {constrainLibraryOrbit,LIBRARY_CAMERA_SOLIDS}=await import('../src/study/shared/libraryCamera.js');
 const target=[0,1.4,0];
 for(const eye of [[100,9,100],[-100,-3,-100],[0,20,0]]){
  const safe=constrainLibraryOrbit(eye,target,'desk');assert.ok(Math.abs(safe[0])<=15.75&&Math.abs(safe[2])<=16.75&&safe[1]>=.6&&safe[1]<=5.2);
 }
 const eye=[60,50,80];assert.deepEqual(constrainLibraryOrbit(eye,target,'overview'),eye);
 assert.ok(LIBRARY_CAMERA_SOLIDS.some(s=>s.max[1]===3.3));
 const safe=constrainLibraryOrbit([-10.5,.65,-13],[-10.5,1.15,-10],'desk');
 assert.ok(safe[1]>.79,'camera stops above the desk instead of entering its surface');
});
