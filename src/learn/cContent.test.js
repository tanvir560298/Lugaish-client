import test from 'node:test';
import assert from 'node:assert/strict';
import { cVideos, cPracticeProblems, cleanCProgress, isClassUnlocked, getNextUnlockedClass } from './cContent.js';
import { runCSimulation, checkCPractice } from './cPractice.js';
import { makeSession, sessionRoute } from '../tanu/session.js';

test('C Programming course has Class 01 with uploaded YouTube video r8hVKDRUGLQ', () => {
  const class01 = cVideos.find(v => v.id === '01');
  assert.ok(class01, 'Class 01 must exist');
  assert.equal(class01.youtubeId, 'r8hVKDRUGLQ');
  assert.equal(class01.url, 'https://www.youtube.com/watch?v=r8hVKDRUGLQ');
  assert.equal(class01.course, 'c-programming');
  assert.equal(class01.path, '/learn/c-programming/01');
});

test('Sequential unlocking rule: Class 01 is unlocked; subsequent classes require completing previous class', () => {
  // Class 01 is always unlocked
  assert.equal(isClassUnlocked('01', []), true);

  // Class 02 is locked when nothing is completed
  assert.equal(isClassUnlocked('02', []), false);

  // Class 02 unlocks once Class 01 is completed
  assert.equal(isClassUnlocked('02', ['01']), true);

  // Class 03 is locked if only Class 01 is completed
  assert.equal(isClassUnlocked('03', ['01']), false);

  // Class 03 unlocks once Class 02 is completed
  assert.equal(isClassUnlocked('03', ['01', '02']), true);

  // getNextUnlockedClass points to first uncompleted class
  assert.equal(getNextUnlockedClass([]).id, '01');
  assert.equal(getNextUnlockedClass(['01']).id, '02');
  assert.equal(getNextUnlockedClass(['01', '02']).id, '03');
});

test('cleanCProgress cleans duplicates and ignores invalid IDs', () => {
  assert.deepEqual(cleanCProgress(['01', '01', 'invalid', '02']), ['01', '02']);
  assert.deepEqual(cleanCProgress(null), []);
});

test('Practice problems are extensible and Class 01 has interactive exercises', () => {
  const pList = cPracticeProblems['01'];
  assert.ok(Array.isArray(pList), 'Class 01 problems must be an array');
  assert.ok(pList.length >= 2, 'Class 01 should have at least 2 practice problems');

  for (const prob of pList) {
    assert.ok(prob.title, 'Problem must have title');
    assert.ok(prob.prompt, 'Problem must have prompt');
    assert.ok(prob.starter.includes('#include <stdio.h>'), 'Starter must include stdio.h');
    assert.ok(prob.starter.includes('main'), 'Starter must include main function');
  }
});

test('C simulation runs printf correctly', () => {
  const code = '#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}';
  const res = runCSimulation(code);
  assert.equal(res.success, true);
  assert.equal(res.output, 'Hello, World!');
});

test('checkCPractice validates student code against problem constraints', () => {
  const problem = cPracticeProblems['01'][0];

  // Unaltered starter code rejected
  const resUnaltered = checkCPractice(problem, problem.starter);
  assert.equal(resUnaltered.ok, false);

  // Valid solution accepted
  const validCode = '#include <stdio.h>\nint main() {\n    // My solution\n    printf("Hello, World!\\n");\n    return 0;\n}';
  const resValid = checkCPractice(problem, validCode);
  assert.equal(resValid.ok, true);
});

test('Tanu sessionRoute correctly routes c-programming lessons', () => {
  const lesson = cVideos[0];
  const s = makeSession({ minutes: 40, lesson, owner: 'student' });
  assert.equal(sessionRoute(s.lesson), '/learn/c-programming/01');
});
