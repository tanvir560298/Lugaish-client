import test from 'node:test';
import assert from 'node:assert/strict';
import {htmlVideos,htmlExercises,cleanHtmlProgress} from './htmlContent.js';
import {makeSession,sessionRoute} from '../tanu/session.js';
test('HTML catalog publishes exactly the two current animated lessons',()=>{
 assert.deepEqual(htmlVideos.map(v=>v.youtubeId),['A0exlm8BHCc','i6NGvCsGIsc']);
 for(const v of htmlVideos) assert.equal(new URL(v.url).searchParams.get('v'),v.youtubeId);
 assert.deepEqual(htmlExercises,{});
});
test('HTML progress rejects retired human video IDs',()=>{
 assert.deepEqual(cleanHtmlProgress(['01','07','00','00','first-program',{},'day-1']),['00','day-1']);
 assert.deepEqual(cleanHtmlProgress(null),[]);
});
test('Tanu routes published lessons and rejects retired video sessions',()=>{
 for(const lesson of htmlVideos){const s=makeSession({minutes:50,lesson,owner:'fixture'});assert.equal(sessionRoute(s.lesson),lesson.path);}
 for(const id of ['01','07','unavailable']) assert.throws(()=>sessionRoute({course:'web-development-html',id}),/unavailable/);
});
