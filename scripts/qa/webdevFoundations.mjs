import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {visit,evaluate,send,shot,close} from './browserClient.mjs';
const base='http://127.0.0.1:4174', results=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const text=()=>evaluate('document.querySelector("main").innerText');
const check=async(name,fn)=>{await fn();results.push(name);};
try {
 await visit(base+'/learn/web-development/html/00');
 await evaluate('localStorage.removeItem("lugaish_html_playback_v2:guest");localStorage.removeItem("lugaish_html_playback_v2:guest:coverage:00")');
 for(const width of [1440,768,390]) {
  await visit(base+'/learn/web-development/html/00',width);await wait(350);
  assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth+1'),false);
  assert.equal(await evaluate('document.querySelectorAll(".hl-module-lessons-list > li").length'),2);
  await shot(`tmp/webdev-${width}.png`);
 }
 results.push('Desktop, tablet, mobile: exactly two lessons and no horizontal overflow');
 await check('Direct locked URL never mounts a video player',async()=>{
  await visit(base+'/learn/web-development/html/day-1');
  assert.match(await text(),/Complete Day 0 to unlock/);
  assert.equal(await evaluate('document.querySelector(".hl-player-frame,.hl-lesson-poster")===null'),true);
  await shot('tmp/webdev-locked.png');
 });
 await check('Retired human-made lesson URL has no playable video',async()=>{
  await visit(base+'/learn/web-development/html/01');assert.match(await text(),/no longer available/);
  assert.equal(await evaluate('document.querySelector(".hl-player-frame,.hl-lesson-poster")===null'),true);
 });
 // Provider fixture: tests wiring and real watch sampling; no third-party playback claims.
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.YT={Player:class {
  constructor(mount,options){this.t=0;this.state=2;this.options=options;window.qaPlayer=this;mount.innerHTML='<div style="height:100%;display:grid;place-items:center;color:white;background:#101a2b">YouTube API fixture · playback integration test</div>';setTimeout(()=>options.events.onReady(),0)}
  getCurrentTime(){return this.t} getDuration(){return 4} getPlayerState(){return this.state}
  play(){this.state=1;this.options.events.onStateChange({data:1})}
  end(){this.t=4;this.state=0;this.options.events.onStateChange({data:0})}
  pauseVideo(){this.state=2;this.options.events.onStateChange({data:2})} destroy(){}
 }};`});
 await check('Jumping directly to the end does not unlock the next lesson',async()=>{
  await visit(base+'/learn/web-development/html/00');
  await evaluate('document.querySelector(".hl-lesson-poster").click()');await wait(100);
  await evaluate('qaPlayer.play();qaPlayer.end()');await wait(150);
  assert.match(await text(),/Next lesson locked/);
  assert.equal(await evaluate('localStorage.getItem("lugaish_html_playback_v2:guest")'),null);
 });
 await check('Watched playback plus ended event completes and unlocks next',async()=>{
  await evaluate('qaPlayer.t=0;qaPlayer.play()');
  for(let n=1;n<=8;n++){await wait(500);await evaluate(`qaPlayer.t=${n/2}`);}
  await wait(550);await evaluate('qaPlayer.end()');await wait(100);
  assert.match(await text(),/Next: What is HTML/);
  assert.equal(await evaluate('localStorage.getItem("lugaish_html_playback_v2:guest")'),'["00"]');
  assert.equal(await evaluate('document.querySelector(".hl-current-label").innerText.includes("DAY 0")'),true);
 });
 await check('Completion persists on refresh and unlocks direct HTML URL',async()=>{
  await visit(base+'/learn/web-development/html/day-1');
  assert.equal(await evaluate('!!document.querySelector(".hl-lesson-poster")'),true);
  assert.match(await text(),/What is HTML/);
  await shot('tmp/webdev-unlocked.png');
 });
 await check('Tabs support keyboard arrows and notes contain real lesson material',async()=>{
  await evaluate('document.getElementById("hl-tab-overview").focus();document.getElementById("hl-tab-overview").dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}))');
  await wait(100);assert.equal(await evaluate('document.activeElement.id'),'hl-tab-notes');
  assert.match(await text(),/markup language/);
 });
 await check('Published HTML lesson can also complete without a fabricated next lesson',async()=>{
  await evaluate('document.querySelector(".hl-lesson-poster").click()');await wait(100);await evaluate('qaPlayer.play()');
  for(let n=1;n<=8;n++){await wait(500);await evaluate(`qaPlayer.t=${n/2}`);}
  await wait(550);await evaluate('qaPlayer.end()');await wait(100);
  assert.equal(await evaluate('localStorage.getItem("lugaish_html_playback_v2:guest")'),'["00","day-1"]');
  assert.match(await text(),/finished both published lessons/);
 });
 await writeFile('tmp/webdev-browser-results.json',JSON.stringify({results,provider:'Mocked YouTube API for completion tests; real timers and app state. No claim of external video playback verification.'},null,2));
 console.log(results.join('\n'));
}finally{close();}
