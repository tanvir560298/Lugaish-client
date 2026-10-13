import test from 'node:test';
import assert from 'node:assert/strict';
import { createFullscreenController, lockViewport, typingTarget } from '../src/classroom/immersive.js';

function browser() {
 const doc=new EventTarget();doc.fullscreenEnabled=true;doc.fullscreenElement=null;
 const root={requestFullscreen:async()=>{doc.fullscreenElement=root;doc.dispatchEvent(new Event('fullscreenchange'));}};
 doc.exitFullscreen=async()=>{doc.fullscreenElement=null;doc.dispatchEvent(new Event('fullscreenchange'));};
 return {root,doc};
}
test('fullscreen is gesture-driven and synchronized on entry, Escape and external exit',async()=>{
 const {root,doc}=browser(),states=[],errors=[];
 const c=createFullscreenController(root,doc,{onChange:v=>states.push(v),onError:e=>errors.push(e)});
 assert.equal(c.supported,true);assert.equal(doc.fullscreenElement,null);
 await c.toggle();assert.equal(states.at(-1),true);
 // Browser Escape changes fullscreen state without calling the button handler.
 await doc.exitFullscreen();assert.equal(states.at(-1),false);
 await c.toggle();await c.toggle();assert.equal(states.at(-1),false);assert.deepEqual(errors,[]);
 c.dispose();const count=states.length;doc.dispatchEvent(new Event('fullscreenchange'));assert.equal(states.length,count);
});
test('fullscreen rejections and unsupported browsers leave the immersive viewport usable',async()=>{
 const {root,doc}=browser(),errors=[];root.requestFullscreen=async()=>{throw new Error('denied');};
 const c=createFullscreenController(root,doc,{onChange:()=>{},onError:e=>errors.push(e)});
 await c.toggle();assert.equal(doc.fullscreenElement,null);assert.match(errors[0],/blocked/);c.dispose();
 delete root.requestFullscreen;const unsupported=createFullscreenController(root,doc,{onChange:()=>{},onError:e=>errors.push(e)});assert.equal(unsupported.supported,false);await unsupported.toggle();assert.match(errors.at(-1),/unavailable/);unsupported.dispose();
});
test('leaving the route exits only its fullscreen and restores previous page overflow',async()=>{
 const {root,doc}=browser();doc.documentElement={style:{overflow:'auto'}};doc.body={style:{overflow:''}};
 const restore=lockViewport(doc);assert.equal(doc.body.style.overflow,'hidden');assert.equal(doc.documentElement.style.overflow,'hidden');
 const c=createFullscreenController(root,doc,{onChange:()=>{},onError:()=>{}});await c.toggle();c.dispose();assert.equal(doc.fullscreenElement,null);
 restore();assert.equal(doc.documentElement.style.overflow,'auto');assert.equal(doc.body.style.overflow,'');
 const other={};doc.fullscreenElement=other;const second=createFullscreenController(root,doc,{onChange:()=>{},onError:()=>{}});second.dispose();assert.equal(doc.fullscreenElement,other);
});
test('input, content editing and dialog focus prevent movement keyboard shortcuts',()=>{
 for(const tagName of ['INPUT','TEXTAREA','SELECT','BUTTON'])assert.equal(typingTarget({tagName}),true);
 assert.equal(typingTarget({tagName:'DIV',isContentEditable:true}),true);
 assert.equal(typingTarget({tagName:'A',closest:()=>({})}),true);
 assert.equal(typingTarget({tagName:'CANVAS',closest:()=>null}),false);
});
