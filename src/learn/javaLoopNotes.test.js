import test from 'node:test';
import assert from 'node:assert/strict';
import { javaLoopNotes } from './javaLoopNotes.js';
import { FALLBACK_PUBLIC_PROBLEMS } from '../practice/java/javaPracticeData.js';

test('Loop notes cover every Topic 04 problem without invalid practice routes', () => {
  const slugs = new Set(FALLBACK_PUBLIC_PROBLEMS['loops-iterations'].map(problem => problem.slug));
  assert.ok(slugs.size > 0);
  assert.deepEqual(new Set(javaLoopNotes.flatMap(section => section.problems)), slugs);
  for (const section of javaLoopNotes) {
    assert.ok(section.title && section.text && section.code && section.tip);
    assert.ok(section.problems.length > 0);
  }
});
