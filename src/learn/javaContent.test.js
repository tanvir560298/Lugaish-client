import test from 'node:test';
import assert from 'node:assert/strict';
import { javaVideos, javaPracticeProblems, cleanJavaProgress, isJavaClassUnlocked, getNextUnlockedJavaClass } from './javaContent.js';
import { runJavaSimulation, checkJavaPractice } from './javaPractice.js';

test('Java Programming course has 14 structured topic modules', () => {
  assert.equal(javaVideos.length, 14, 'Must have 14 topic modules');
  assert.equal(javaVideos[0].id, '01');
  assert.ok(javaVideos[0].title.includes('Basic Input, Output & Variables'));
  assert.equal(javaVideos[13].id, '14');
  assert.ok(javaVideos[13].title.includes('Basic Data Structures & Algorithms'));
  assert.ok(typeof javaPracticeProblems === 'object', 'javaPracticeProblems must be an object');
});

test('Sequential unlocking rules and progression helpers handle 14 topics safely', () => {
  assert.equal(isJavaClassUnlocked('01', []), true);
  assert.equal(isJavaClassUnlocked('02', []), true);
  assert.equal(isJavaClassUnlocked('14', []), true);
  assert.equal(getNextUnlockedJavaClass([]).id, '01');

  // Verify clean progress handling
  assert.deepEqual(cleanJavaProgress(['01', '01', 'xyz']), ['01']);
  assert.deepEqual(cleanJavaProgress(null), []);
});

test('runJavaSimulation executes Java code and prints lines correctly', () => {
  const code = `
public class Test {
    public static void main(String[] args) {
        System.out.println("My name is Tanvir Ahmad");
        System.out.println("My age is 22");
        System.out.println("I am from Bangladesh");
    }
}
  `;
  const result = runJavaSimulation(code);
  assert.equal(result.success, true);
  assert.equal(result.errors.length, 0);
  assert.equal(result.output, "My name is Tanvir Ahmad\nMy age is 22\nI am from Bangladesh");
  assert.equal(result.linesCount, 3);
});

test('runJavaSimulation detects missing class or main method or semicolons', () => {
  const missingClass = `
    public static void main(String[] args) {
        System.out.println("No class");
    }
  `;
  const res1 = runJavaSimulation(missingClass);
  assert.equal(res1.success, false);
  assert.ok(res1.errors.some(e => e.includes('Class declaration missing')));

  const missingSemicolon = `
public class Test {
    public static void main(String[] args) {
        System.out.println("Missing semi")
    }
}
  `;
  const res2 = runJavaSimulation(missingSemicolon);
  assert.equal(res2.success, false);
  assert.ok(res2.errors.some(e => e.includes("';' expected")));
});

test('checkJavaPractice verifies Java practice problem accurately', () => {
  const sampleProblem = {
    id: 'test-p1',
    expectedKeywords: ['public', 'class', 'main', 'System.out.println'],
    minPrintLines: 2,
    sampleOutput: 'Line 1\nLine 2'
  };
  const validCode = `
public class Test {
    public static void main(String[] args) {
        System.out.println("Line 1");
        System.out.println("Line 2");
    }
}
  `;
  const checkResult = checkJavaPractice(sampleProblem, validCode);
  assert.equal(checkResult.ok, true);
  assert.ok(checkResult.message.includes('compiled and executed perfectly'));
});

test('Java simulator evaluates integer precedence 5 * 6 / 7 % 3 to 1', () => {
  const code = `
public class Test {
    public static void main(String[] args) {
        System.out.println(5 * 6 / 7 % 3);
    }
}
  `;
  const sim = runJavaSimulation(code);
  assert.equal(sim.success, true);
  assert.equal(sim.output.trim(), '1');
});

test('Topic 01 has 25 practice problems attached with 13 Lugaish originals and 12 external challenges', () => {
  const p1 = javaPracticeProblems['01'];
  assert.ok(Array.isArray(p1), 'Topic 01 problems must be an array');
  assert.equal(p1.length, 25, 'Topic 01 must have exactly 25 problems');

  const lugaish = p1.filter(p => p.problemType === 'lugaish');
  const external = p1.filter(p => p.problemType === 'external');
  assert.equal(lugaish.length, 13, 'Must have 13 Lugaish original problems');
  assert.equal(external.length, 12, 'Must have 12 external practice problems');

  // Verify Lugaish original problem properties
  for (const prob of lugaish) {
    assert.ok(prob.id, 'Problem must have an ID');
    assert.ok(prob.title, 'Problem must have a title');
    assert.ok(prob.starterCode, 'Lugaish problem must have starter code');
    assert.ok(Array.isArray(prob.sampleTestCases) && prob.sampleTestCases.length > 0, 'Must have sample test cases');
  }

  // Verify external problem properties
  for (const prob of external) {
    assert.ok(prob.id, 'External problem must have an ID');
    assert.ok(prob.title, 'External problem must have a title');
    assert.ok(prob.sourcePlatform, 'External problem must have sourcePlatform');
    assert.ok(prob.externalUrl && prob.externalUrl.startsWith('http'), 'External problem must have valid URL');
  }
});

test('Topic 02 has 16 practice problems attached with 16 Lugaish originals', () => {
  const p2 = javaPracticeProblems['02'];
  assert.ok(Array.isArray(p2), 'Topic 02 problems must be an array');
  assert.equal(p2.length, 16, 'Topic 02 must have exactly 16 problems');

  const lugaish = p2.filter(p => p.problemType === 'lugaish');
  assert.equal(lugaish.length, 16, 'All 16 must be Lugaish original problems');

  for (const prob of lugaish) {
    assert.ok(prob.id, 'Problem must have an ID');
    assert.ok(prob.id.startsWith('java-oe-') || prob.id.startsWith('java-math-'), 'Topic 02 problem IDs must start with java-oe- or java-math-');
    assert.ok(prob.title, 'Problem must have a title');
    assert.ok(prob.starterCode, 'Lugaish problem must have starter code');
    assert.ok(Array.isArray(prob.sampleTestCases) && prob.sampleTestCases.length > 0, 'Must have sample test cases');
  }
});

test('Topic 03 has 12 practice problems attached with 12 Lugaish originals', () => {
  const p3 = javaPracticeProblems['03'];
  assert.ok(Array.isArray(p3), 'Topic 03 problems must be an array');
  assert.equal(p3.length, 12, 'Topic 03 must have exactly 12 problems');

  const lugaish = p3.filter(p => p.problemType === 'lugaish');
  assert.equal(lugaish.length, 12, 'All 12 must be Lugaish original problems');

  for (const prob of lugaish) {
    assert.ok(prob.id, 'Problem must have an ID');
    assert.ok(prob.id.startsWith('java-cs-'), 'Topic 03 problem IDs must start with java-cs-');
    assert.ok(prob.title, 'Problem must have a title');
    assert.ok(prob.starterCode, 'Lugaish problem must have starter code');
    assert.ok(Array.isArray(prob.sampleTestCases) && prob.sampleTestCases.length > 0, 'Must have sample test cases');
  }
});

test('Topic 07 has 8 practice problems attached with 8 Lugaish originals', () => {
  const p7 = javaPracticeProblems['07'];
  assert.ok(Array.isArray(p7), 'Topic 07 problems must be an array');
  assert.equal(p7.length, 8, 'Topic 07 must have exactly 8 problems');

  const lugaish = p7.filter(p => p.problemType === 'lugaish');
  assert.equal(lugaish.length, 8, 'All 8 must be Lugaish original problems');

  for (const prob of lugaish) {
    assert.ok(prob.id, 'Problem must have an ID');
    assert.ok(prob.id.startsWith('java-str-'), 'Topic 07 problem IDs must start with java-str-');
    assert.ok(prob.title, 'Problem must have a title');
    assert.ok(prob.starterCode, 'Lugaish problem must have starter code');
    assert.ok(Array.isArray(prob.sampleTestCases) && prob.sampleTestCases.length > 0, 'Must have sample test cases');
  }
});

test('Topic 04 has 10 practice problems attached with 10 Lugaish originals', () => {
  const p4 = javaPracticeProblems['04'];
  assert.ok(Array.isArray(p4), 'Topic 04 problems must be an array');
  assert.equal(p4.length, 10, 'Topic 04 must have exactly 10 problems');

  const lugaish = p4.filter(p => p.problemType === 'lugaish');
  assert.equal(lugaish.length, 10, 'All 10 must be Lugaish original problems');

  for (const prob of lugaish) {
    assert.ok(prob.id, 'Problem must have an ID');
    assert.ok(prob.id.startsWith('java-loop-'), 'Topic 04 problem IDs must start with java-loop-');
    assert.ok(prob.title, 'Problem must have a title');
    assert.ok(prob.starterCode, 'Lugaish problem must have starter code');
    assert.ok(Array.isArray(prob.sampleTestCases) && prob.sampleTestCases.length > 0, 'Must have sample test cases');
  }
});

test('Topic 05 has 16 nested loop problems with 2 new appended problems', () => {
  const p5 = javaPracticeProblems['05'];
  assert.ok(Array.isArray(p5), 'Topic 05 problems must be an array');
  assert.equal(p5.length, 16, 'Topic 05 must have exactly 16 problems');

  const p15 = p5.find(p => p.number === 15 || p.id === 'nested-p15');
  assert.ok(p15, 'Problem 15 must exist in Topic 05');
  assert.equal(p15.title, 'Problem 15: Pixel Art Frame');
  assert.ok(p15.solutionJava, 'Problem 15 must have Java solution');

  const p16 = p5.find(p => p.number === 16 || p.id === 'nested-p16');
  assert.ok(p16, 'Problem 16 must exist in Topic 05');
  assert.equal(p16.title, 'Problem 16: Double Diagonal Radar');
  assert.ok(p16.solutionJava, 'Problem 16 must have Java solution');
});


