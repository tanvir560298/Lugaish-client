import test from 'node:test';
import assert from 'node:assert/strict';
import { restoredPersonalSeat, rememberPersonalSeat } from '../src/study/shared/personalSeat.js';
test('personal desk restoration is account/course scoped, validates seat IDs and never restores shared membership',()=>{
 const prior=Object.getOwnPropertyDescriptor(globalThis,'localStorage'),data=new Map();
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}});
 try{
  rememberPersonalSeat('alice:arabic','s6');assert.equal(restoredPersonalSeat('alice:arabic').seat,'s6');assert.equal(restoredPersonalSeat('bob:arabic'),null);assert.equal(restoredPersonalSeat('alice:english'),null);
  const restored=restoredPersonalSeat('alice:arabic');assert.equal(restored.id,'personal-library');assert.equal(restored.roomId,undefined);assert.equal(restored.arrivesAt,0);
  rememberPersonalSeat('alice:arabic','not-a-seat');assert.equal(restoredPersonalSeat('alice:arabic'),null);
  rememberPersonalSeat('alice:arabic','s2');rememberPersonalSeat('alice:arabic',null);assert.equal(restoredPersonalSeat('alice:arabic'),null);
 }finally{if(prior)Object.defineProperty(globalThis,'localStorage',prior);else delete globalThis.localStorage;}
});
