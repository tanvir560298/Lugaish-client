import test from 'node:test';
import assert from 'node:assert/strict';
import { sceneFrameRate, scheduleSceneFrames } from '../src/study/shared/frameSchedule.js';

test('library keeps full movement cadence and lowers quiet-scene work',()=>{
 const idle={members:[{seat:'seat-1'}]},moving={members:[{motion:{endsAt:2000}}]};
 assert.equal(sceneFrameRate(idle,1000),30);assert.equal(sceneFrameRate(idle,1000,{low:true}),15);
 assert.equal(sceneFrameRate(moving,1000),60);assert.equal(sceneFrameRate(moving,1000,{low:true}),30);
 assert.equal(sceneFrameRate(moving,2500),30);
 assert.equal(sceneFrameRate({members:[{greeting:{until:2000}}]},1000),60);
 assert.equal(sceneFrameRate(idle,1000,{reducedMotion:true}),0);assert.equal(sceneFrameRate({members:[]},1000),0);
});

test('hidden tabs cancel timers and resume once; dispose prevents late frame work',()=>{
 let callback,listener,delay,frames=0,cancels=0;const doc={hidden:false,addEventListener(_,fn){listener=fn},removeEventListener(){listener=null}};
 const stop=scheduleSceneFrames({room:{members:[{seat:'seat-1'}]},getNow:()=>1000,invalidate:()=>frames++,document:doc,setTimeout(fn,ms){callback=fn;delay=ms;return 1},clearTimeout(){cancels++}});
 assert.equal(delay,1000/30);const late=callback;doc.hidden=true;listener();assert.equal(cancels,1);late();assert.equal(frames,0);
 doc.hidden=false;listener();assert.equal(frames,1);callback();assert.equal(frames,2);
 const afterDispose=callback;stop();assert.equal(listener,null);afterDispose();assert.equal(frames,2);
});
