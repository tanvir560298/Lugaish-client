import test from 'node:test';
import assert from 'node:assert/strict';
import { javaStringNotes } from './javaStringNotes.js';
import { FALLBACK_PUBLIC_PROBLEMS } from '../practice/java/javaPracticeData.js';

test('String notes cover every current Topic 07 problem with valid practice links', () => {
  const problems = FALLBACK_PUBLIC_PROBLEMS['strings-manipulation'];
  const slugs = new Set(problems.map(problem => problem.slug));
  const covered = new Set(javaStringNotes.flatMap(section => section.problems));
  assert.ok(slugs.size > 0);
  assert.deepEqual(covered, slugs);
  for (const section of javaStringNotes) {
    assert.ok(section.title && section.text && section.code && section.tip);
    assert.ok(section.problems.length > 0);
  }
});
