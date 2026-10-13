import test from 'node:test';
import assert from 'node:assert/strict';
import { accessibleVideos, resolveMedia } from '../src/classroom/mediaPolicy.js';
import { transition } from '../src/classroom/session.js';

test('classroom respects server locks even when stale local completion exists',()=>{
 const lesson={videos:[{_id:'a',isLocked:false,completed:false},{_id:'b',isLocked:true}]};
 assert.deepEqual(accessibleVideos(lesson,new Set(['a'])).map(v=>v._id),['a']);
 assert.equal(accessibleVideos(lesson,new Set(),true).length,2);
});
test('legacy sequential videos unlock only after previous explicit completion',()=>{
 const lesson={videos:[{_id:'a'},{_id:'b'},{_id:'c'}]};
 assert.equal(accessibleVideos(lesson).length,1);
 assert.equal(accessibleVideos(lesson,new Set(['a'])).length,2);
 assert.equal(accessibleVideos(lesson,new Set(['b'])).length,1);
});
test('media rejects executable URLs and resolves established content sources',()=>{
 assert.equal(resolveMedia({videoUrl:'javascript:alert(1)'}),null);
 assert.deepEqual(resolveMedia({videoUrl:'/videos/lesson.mp4'}),{kind:'file',src:'/videos/lesson.mp4'});
 assert.deepEqual(resolveMedia({youtubeId:'abcdefghijk'}),{kind:'youtube',youtubeId:'abcdefghijk'});
});
test('personal player opens paused without waiting for or triggering teacher entrance',()=>{
 assert.equal(transition('Waiting','STUDY_READY'),'LecturePaused');
 assert.equal(transition('Ended','STUDY_READY'),'LecturePaused');
 assert.equal(transition('LecturePaused','PLAYING'),'LecturePlaying');
 assert.equal(transition('LecturePlaying','STUDY_READY'),'LecturePlaying');
 assert.equal(transition('Waiting','START'),'TeacherEntering');
});
