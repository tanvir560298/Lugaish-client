import test from 'node:test';
import assert from 'node:assert/strict';
import { nestedLoopsPracticeProblems } from './nestedLoopsPracticeData.js';
import { javaVideos, javaPracticeProblems } from './javaContent.js';
import { cVideos, cPracticeProblems } from './cContent.js';

test('Nested Loops Practice Set contains exactly 10 problems', () => {
  assert.equal(nestedLoopsPracticeProblems.length, 10, 'Must have 10 practice problems');
});

test('Difficulty distribution matches specification: Easy (3), Medium (3), Hard (4)', () => {
  const easy = nestedLoopsPracticeProblems.filter(p => p.difficulty === 'Easy');
  const medium = nestedLoopsPracticeProblems.filter(p => p.difficulty === 'Medium');
  const hard = nestedLoopsPracticeProblems.filter(p => p.difficulty === 'Hard');

  assert.equal(easy.length, 3, 'Should have 3 Easy problems');
  assert.equal(medium.length, 3, 'Should have 3 Medium problems');
  assert.equal(hard.length, 4, 'Should have 4 Hard problems');

  assert.deepEqual(easy.map(p => p.number), [1, 2, 3]);
  assert.deepEqual(medium.map(p => p.number), [4, 5, 6]);
  assert.deepEqual(hard.map(p => p.number), [7, 8, 9, 10]);
});

test('Codeforces problems have accurate external contest URLs and IDs', () => {
  const cfProblems = nestedLoopsPracticeProblems.filter(p => Boolean(p.externalUrl));
  assert.equal(cfProblems.length, 4, 'There should be 4 Codeforces problems');

  const p6 = nestedLoopsPracticeProblems.find(p => p.number === 6);
  assert.equal(p6.codeforcesId, '510A');
  assert.equal(p6.externalUrl, 'https://codeforces.com/problemset/problem/510/A');

  const p8 = nestedLoopsPracticeProblems.find(p => p.number === 8);
  assert.equal(p8.codeforcesId, '405A');
  assert.equal(p8.externalUrl, 'https://codeforces.com/problemset/problem/405/A');
  assert.ok(p8.specialInstruction.includes('Selection Sort'));

  const p9 = nestedLoopsPracticeProblems.find(p => p.number === 9);
  assert.equal(p9.codeforcesId, '266B');
  assert.equal(p9.externalUrl, 'https://codeforces.com/problemset/problem/266/B');

  const p10 = nestedLoopsPracticeProblems.find(p => p.number === 10);
  assert.equal(p10.codeforcesId, '160A');
  assert.equal(p10.externalUrl, 'https://codeforces.com/problemset/problem/160/A');
  assert.ok(p10.specialInstruction.includes('Selection Sort'));
});

test('All 10 problems contain instructional prerequisites, step-by-step logic and dual language starters', () => {
  for (const prob of nestedLoopsPracticeProblems) {
    assert.ok(prob.title, `Problem ${prob.number} must have a title`);
    assert.ok(prob.statement, `Problem ${prob.number} must have a statement`);
    assert.ok(prob.sampleInput, `Problem ${prob.number} must have sampleInput`);
    assert.ok(prob.sampleOutput, `Problem ${prob.number} must have sampleOutput`);

    // Instructional guidance
    assert.ok(prob.instructional, `Problem ${prob.number} must have instructional guide`);
    assert.ok(prob.instructional.prerequisites.length > 0, `Problem ${prob.number} must have prerequisites`);
    assert.ok(prob.instructional.stepByStepLogic.length > 0, `Problem ${prob.number} must have step-by-step logic`);

    // Dual language starters
    assert.ok(prob.starter.includes('#include <stdio.h>'), `Problem ${prob.number} must have C starter`);
    assert.ok(prob.starterJava.includes('class Main'), `Problem ${prob.number} must have Java starter`);

    // Dual language reference solutions
    assert.ok(prob.solutionC.includes('#include <stdio.h>'), `Problem ${prob.number} must have C reference solution`);
    assert.ok(prob.solutionJava.includes('class Main'), `Problem ${prob.number} must have Java reference solution`);
  }
});

test('Java Programming Class 05 connects to the 10 nested loops problems', () => {
  const class05 = javaVideos.find(v => v.id === '05');
  assert.ok(class05, 'Java Class 05 must exist');
  assert.ok(class05.title.toLowerCase().includes('nested loops'));
  assert.equal(javaPracticeProblems['05'].length, 10);
});

test('C Programming Class 04 connects to the 10 nested loops problems', () => {
  const class04 = cVideos.find(v => v.id === '04');
  assert.ok(class04, 'C Class 04 must exist');
  assert.ok(class04.title.toLowerCase().includes('nested loops'));
  assert.equal(cPracticeProblems['04'].length, 10);
});
