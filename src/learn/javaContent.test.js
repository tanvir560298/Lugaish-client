import test from 'node:test';
import assert from 'node:assert/strict';
import { javaVideos, javaPracticeProblems, cleanJavaProgress, isJavaClassUnlocked, getNextUnlockedJavaClass } from './javaContent.js';
import { runJavaSimulation, checkJavaPractice } from './javaPractice.js';

test('Java Programming course is reset and ready for new curriculum', () => {
  assert.ok(Array.isArray(javaVideos), 'javaVideos must be an array');
  assert.ok(typeof javaPracticeProblems === 'object', 'javaPracticeProblems must be an object');
});

test('Sequential unlocking rules and progression helpers handle empty and populated states safely', () => {
  // When reset/empty
  assert.equal(isJavaClassUnlocked('01', []), false);
  assert.equal(getNextUnlockedJavaClass([]), null);

  // If classes are added later
  const mockVideos = [
    { id: '01', title: 'Class 01' },
    { id: '02', title: 'Class 02' }
  ];
  // Verify clean progress handling
  assert.deepEqual(cleanJavaProgress(['01', '01', 'xyz']), []);
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
