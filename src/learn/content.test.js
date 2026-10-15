import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,cleanProgress,nextLesson} from './content.js';
test('saved self-study progress rejects corrupt, obsolete and duplicated lesson IDs',()=>{
 assert.deepEqual(cleanProgress(null),[]);
 assert.deepEqual(cleanProgress({completed:['first-program']}),[]);
 assert.deepEqual(cleanProgress(['first-program','admin',{},'first-program']),['first-program']);
});
test('continue learning picks the first incomplete lesson and provides a review after completion',()=>{
 assert.equal(nextLesson([]).id,'first-program');
 assert.equal(nextLesson(['first-program']).id,'variables');
 assert.equal(nextLesson(['first-program','variables']).id,'conditions');
 assert.equal(nextLesson(lessons.map(l=>l.id)).id,'first-program');
});
