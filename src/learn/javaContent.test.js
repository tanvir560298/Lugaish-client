import test from 'node:test';
import assert from 'node:assert/strict';
import { javaVideos, javaPracticeProblems, cleanJavaProgress, isJavaClassUnlocked, getNextUnlockedJavaClass } from './javaContent.js';
import { runJavaSimulation, checkJavaPractice } from './javaPractice.js';

test('Java Programming course has Class 01 with Tanvir Ahmad video and printing fundamentals', () => {
  const class01 = javaVideos.find(v => v.id === '01');
  assert.ok(class01, 'Class 01 must exist');
  assert.equal(class01.course, 'java-programming');
  assert.equal(class01.path, '/learn/java-programming/01');
  assert.equal(class01.instructor, 'Tanvir Ahmad');
  assert.equal(class01.youtubeId, 'ukCm0p5PJFA');
  assert.equal(class01.url, 'https://www.youtube.com/watch?v=ukCm0p5PJFA');
  assert.ok(class01.summary.includes('double quotes'));
});

test('Sequential unlocking rule: Class 01 is unlocked; subsequent classes require completing previous class', () => {
  assert.equal(isJavaClassUnlocked('01', []), true);
  assert.equal(isJavaClassUnlocked('02', []), false);
  assert.equal(isJavaClassUnlocked('02', ['01']), true);
  assert.equal(isJavaClassUnlocked('03', ['01']), false);
  assert.equal(isJavaClassUnlocked('03', ['01', '02']), true);

  assert.equal(getNextUnlockedJavaClass([]).id, '01');
  assert.equal(getNextUnlockedJavaClass(['01']).id, '02');
  assert.equal(getNextUnlockedJavaClass(['01', '02']).id, '03');
});

test('cleanJavaProgress cleans duplicates and ignores invalid IDs', () => {
  assert.deepEqual(cleanJavaProgress(['01', '01', 'xyz', '02']), ['01', '02']);
  assert.deepEqual(cleanJavaProgress(null), []);
});

test('Class 01 has interactive practice problems for printing name, age, and country', () => {
  const problems = javaPracticeProblems['01'];
  assert.ok(Array.isArray(problems), 'Problems should be an array');
  assert.ok(problems.length >= 2, 'Should have at least 2 problems');

  const p1 = problems[0];
  assert.equal(p1.id, 'java01-p1');
  assert.ok(p1.prompt.includes('name, age, and country'));
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

test('checkJavaPractice verifies Tanvirs practice problem accurately', () => {
  const problem = javaPracticeProblems['01'][0];
  const validCode = `
public class Test {
    public static void main(String[] args) {
        System.out.println("My name is Tanvir Ahmad");
        System.out.println("My age is 22");
        System.out.println("I am from Bangladesh");
    }
}
  `;
  const checkResult = checkJavaPractice(problem, validCode);
  assert.equal(checkResult.ok, true);
  assert.ok(checkResult.message.includes('compiled and executed perfectly'));
});

test('Java Programming course has Class 02 connected to YouTube video rEH2VixyswE', () => {
  const class02 = javaVideos.find(v => v.id === '02');
  assert.ok(class02, 'Class 02 must exist');
  assert.equal(class02.youtubeId, 'rEH2VixyswE');
  assert.equal(class02.url, 'https://www.youtube.com/watch?v=rEH2VixyswE');
  assert.ok(class02.title.includes('Operators') || class02.title.includes('Pattern'));
  assert.equal(class02.path, '/learn/java-programming/02');

  const pList = javaPracticeProblems['02'];
  assert.ok(Array.isArray(pList) && pList.length >= 3, 'Class 02 should have 3 practice exercises');
});

test('Class 02 simulator evaluates integer precedence 5 * 6 / 7 % 3 to 1', () => {
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
