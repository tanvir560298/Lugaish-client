import test from 'node:test';
import assert from 'node:assert/strict';
import { allHtmlLessons, htmlModules, cleanHtmlProgress, isHtmlLessonUnlocked } from './htmlContent.js';
import { recordPlayback, watchedFraction, canCompletePlayback, htmlProgressKey } from './htmlWatchProgress.js';
test('only approved Day 0 and HTML lessons are published across the catalog', () => {
  assert.deepEqual(allHtmlLessons.map(l => [l.id,l.youtubeId]), [['00','A0exlm8BHCc'],['day-1','i6NGvCsGIsc']]);
  assert.deepEqual(htmlModules.flatMap(m => m.lessons).map(l => l.id), ['00','day-1']);
  assert.deepEqual(cleanHtmlProgress(['01','07','00','00','day-1',null]), ['00','day-1']);
});
test('progression checks all prerequisites, including a direct URL', () => {
  assert.equal(isHtmlLessonUnlocked('00',[]),true);
  assert.equal(isHtmlLessonUnlocked('day-1',[]),false);
  assert.equal(isHtmlLessonUnlocked('day-1',['day-1']),false);
  assert.equal(isHtmlLessonUnlocked('day-1',['00']),true);
  assert.equal(isHtmlLessonUnlocked('01',['00','day-1']),false);
});
test('natural playback earns completion only after reaching the end', () => {
  let covered=[];
  for(let time=0;time<30;time+=0.5) covered=recordPlayback(covered,time,time+0.5,30,0.5);
  assert.equal(watchedFraction(covered,30),1);
  assert.equal(canCompletePlayback(covered,30,10),false);
  assert.equal(canCompletePlayback(covered,30,30),true);
});
test('scrubbing to the end, replaying a fragment and long inactive gaps do not unlock', () => {
  assert.deepEqual(recordPlayback([],0,29,30,0.5),[]);
  assert.deepEqual(recordPlayback([],0,1,30,60),[]);
  let covered=[];
  for(let i=0;i<20;i++) for(let t=0;t<3;t+=0.5) covered=recordPlayback(covered,t,t+0.5,30,0.5);
  assert.equal(canCompletePlayback(covered,30,30),false);
  assert.ok(watchedFraction(covered,30)<=0.1);
});
test('saved coverage resumes without duplicates and remains account scoped', () => {
  const first=recordPlayback([],0,1,30,1);
  assert.deepEqual(recordPlayback(JSON.parse(JSON.stringify(first)),0,1,30,1), first);
  assert.equal(watchedFraction([null,-1,50,0,0],30),1/30);
  assert.notEqual(htmlProgressKey('guest'), htmlProgressKey('tanvir@example.com'));
  assert.equal(canCompletePlayback([],0,0),false);
});
