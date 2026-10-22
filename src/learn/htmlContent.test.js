import test from 'node:test';
import assert from 'node:assert/strict';
import {htmlVideos,htmlExercises,cleanHtmlProgress} from './htmlContent.js';
import {makeSession,sessionRoute} from '../tanu/session.js';
test('HTML playlist preserves all seven owner-supplied YouTube IDs and order',()=>{
 assert.deepEqual(htmlVideos.map(v=>v.youtubeId),['YEZHgqqsocs','PtwgTt8RX5M','d6MAKl6tM_I','uqtDfCDGUuA','5wfVU8R2yNA','m3Nu1TlNg1o','fJKSDcXKPXo']);
 assert.equal(new Set(htmlVideos.map(v=>v.id)).size,7);
 for(const v of htmlVideos){assert.match(v.youtubeId,/^[\w-]{11}$/);assert.equal(new URL(v.url).searchParams.get('v'),v.youtubeId);}
});
test('HTML watched state rejects stale/corrupt IDs and never includes Java progress',()=>{
 assert.deepEqual(cleanHtmlProgress(['01','01','first-program',{},'08']),['01']);
 assert.deepEqual(cleanHtmlProgress(null),[]);
});
test('each published HTML class has a focused starter exercise and browser preview document',()=>{
 assert.deepEqual(Object.keys(htmlExercises),htmlVideos.map(video=>video.id));
 for(const video of htmlVideos){
  const exercise=htmlExercises[video.id];
  assert.ok(exercise.prompt.length>20,`class ${video.id} needs a clear task`);
  assert.match(exercise.starter,/<[a-z!/]/i,`class ${video.id} needs editable HTML`);
 }
});
test('Tanu routes the exact HTML video to its real page without invoking paid course enrollment',()=>{
 for(const lesson of htmlVideos){const s=makeSession({minutes:50,lesson,owner:'fixture'});assert.equal(sessionRoute(s.lesson),lesson.path);assert.equal(s.elapsed[0],0);}
 assert.throws(()=>sessionRoute({course:'web-development-html',id:'unavailable'}),/unavailable/);
});
