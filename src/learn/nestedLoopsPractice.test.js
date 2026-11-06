import test from 'node:test';
import assert from 'node:assert/strict';
import { nestedLoopsPracticeProblems } from './nestedLoopsPracticeData.js';
import { javaVideos, javaPracticeProblems } from './javaContent.js';
import { cVideos, cPracticeProblems } from './cContent.js';

test('Nested Loops Practice Set contains exactly 14 problems', () => {
  assert.equal(nestedLoopsPracticeProblems.length, 14, 'Must have 14 practice problems');
});

test('Difficulty distribution covers Easy, Medium, and Hard', () => {
  const easy = nestedLoopsPracticeProblems.filter(p => p.difficulty === 'Easy');
  const medium = nestedLoopsPracticeProblems.filter(p => p.difficulty === 'Medium');
  const hard = nestedLoopsPracticeProblems.filter(p => p.difficulty === 'Hard');

  assert.equal(easy.length, 4, 'Should have 4 Easy problems');
  assert.equal(medium.length, 5, 'Should have 5 Medium problems');
  assert.equal(hard.length, 5, 'Should have 5 Hard problems');
});

test('Codeforces problems have accurate external contest URLs and IDs including Assiut Sheets', () => {
  const cfProblems = nestedLoopsPracticeProblems.filter(p => Boolean(p.externalUrl));
  assert.equal(cfProblems.length, 8, 'There should be 8 Codeforces problems');

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

  // Assiut Sheet 2 & 3 Problems
  const p11 = nestedLoopsPracticeProblems.find(p => p.number === 11);
  assert.equal(p11.codeforcesId, 'P (Sheet 2)');
  assert.equal(p11.externalUrl, 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/P');

  const p12 = nestedLoopsPracticeProblems.find(p => p.number === 12);
  assert.equal(p12.codeforcesId, 'T (Sheet 2)');
  assert.equal(p12.externalUrl, 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/T');

  const p13 = nestedLoopsPracticeProblems.find(p => p.number === 13);
  assert.equal(p13.codeforcesId, 'W (Sheet 2)');
  assert.equal(p13.externalUrl, 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/W');

  const p14 = nestedLoopsPracticeProblems.find(p => p.number === 14);
  assert.equal(p14.codeforcesId, 'H (Sheet 3)');
  assert.equal(p14.externalUrl, 'https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H');
});

test('All 14 problems contain instructional prerequisites, step-by-step logic and dual language starters and solutions', () => {
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

test('Java Programming Class 05 connects to the nested loops problems', () => {
  const class05 = javaVideos.find(v => v.id === '05');
  assert.ok(class05, 'Java Class 05 must exist');
  assert.ok(class05.title.toLowerCase().includes('nested loops'));
  assert.equal(javaPracticeProblems['05'].length, 14);
});

test('C Programming Class 04 connects to the nested loops problems', () => {
  const class04 = cVideos.find(v => v.id === '04');
  assert.ok(class04, 'C Class 04 must exist');
  assert.ok(class04.title.toLowerCase().includes('nested loops'));
  assert.equal(cPracticeProblems['04'].length, 14);
});
