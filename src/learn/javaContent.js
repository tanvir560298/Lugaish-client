// Java Programming Course Content & Curriculum
// 14 Structured Topic Modules & Practice Curriculum by Tanvir Ahmad.

import { nestedLoopsPracticeProblems } from './nestedLoopsPracticeData.js';
export { nestedLoopsPracticeProblems };

export const javaTopics = [
  {
    id: '01',
    number: 1,
    title: 'Basic Input, Output & Variables',
    slug: 'basic-io-variables',
    summary: 'Master Java basics: class structure, main method, Scanner input, System.out.println, data types (int, double, char, boolean, String), and variable declaration.',
    duration: 'Practice Module 01',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '02',
    number: 2,
    title: 'Operators & Expressions',
    slug: 'operators-expressions',
    summary: 'Master arithmetic (+, -, *, /, %), relational, logical (&&, ||, !), assignment, unary, ternary, and bitwise operators with operator precedence.',
    duration: 'Practice Module 02',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '03',
    number: 3,
    title: 'Conditional Statements (if, else, switch)',
    slug: 'conditional-statements',
    summary: 'Master decision making in Java: if, if-else, nested if-else, else-if ladder, and switch-case expressions.',
    duration: 'Practice Module 03',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '04',
    number: 4,
    title: 'Loops & Iterations',
    slug: 'loops-iterations',
    summary: 'Master loop control structures: for loops, while loops, do-while loops, break, continue, and loop accumulator patterns.',
    duration: 'Practice Module 04',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '05',
    number: 5,
    title: 'Nested Loops & Pattern Printing',
    slug: 'nested-loops-pattern-printing',
    summary: 'Master multi-dimensional iterations: star triangles, pyramids, inverted shapes, diamond designs, and number matrices.',
    duration: 'Practice Module 05',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '06',
    number: 6,
    title: 'Arrays',
    slug: 'arrays',
    summary: 'Master 1D and 2D arrays: memory allocation, traversal, searching, min/max finding, reversing, prefix sums, and matrices.',
    duration: 'Practice Module 06',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '07',
    number: 7,
    title: 'Strings & String Manipulation',
    slug: 'strings-manipulation',
    summary: 'Master String immutability, built-in methods (.length, .charAt, .substring, .indexOf), StringBuilder, and palindrome validation.',
    duration: 'Practice Module 07',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '08',
    number: 8,
    title: 'Methods & Functions',
    slug: 'methods-functions',
    summary: 'Master modular programming: method declarations, return types, parameters, method overloading, and pass-by-value semantics.',
    duration: 'Practice Module 08',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '09',
    number: 9,
    title: 'Recursion',
    slug: 'recursion',
    summary: 'Master recursive problem solving: base conditions, recursive steps, call stack visualization, factorials, and Fibonacci sequences.',
    duration: 'Practice Module 09',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '10',
    number: 10,
    title: 'Object-Oriented Programming (OOP)',
    slug: 'object-oriented-programming',
    summary: 'Master core OOP pillars: Classes & Objects, Constructors, Encapsulation, Inheritance, Polymorphism, and Abstraction.',
    duration: 'Practice Module 10',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '11',
    number: 11,
    title: 'Exception Handling',
    slug: 'exception-handling',
    summary: 'Master error resilience: try-catch-finally blocks, throw, throws, built-in exceptions, and custom exceptions.',
    duration: 'Practice Module 11',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '12',
    number: 12,
    title: 'Collections Framework',
    slug: 'collections-framework',
    summary: 'Master Java collections: ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap, and Iterators.',
    duration: 'Practice Module 12',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '13',
    number: 13,
    title: 'File Handling',
    slug: 'file-handling',
    summary: 'Master persistent storage in Java: reading, writing, and parsing files with File, Scanner, FileReader, and BufferedReader.',
    duration: 'Practice Module 13',
    instructor: 'Tanvir Ahmad'
  },
  {
    id: '14',
    number: 14,
    title: 'Basic Data Structures & Algorithms',
    slug: 'basic-dsa',
    summary: 'Master foundational DSA in Java: Searching (Linear & Binary), Sorting (Bubble, Selection, Insertion), Stacks, and Queues.',
    duration: 'Practice Module 14',
    instructor: 'Tanvir Ahmad'
  }
];

// Array of Java topic modules
export const javaVideos = javaTopics.map(t => ({
  id: t.id,
  number: t.number,
  youtubeId: '',
  title: `Topic ${t.id}: ${t.title}`,
  topicTitle: t.title,
  summary: t.summary,
  duration: t.duration,
  course: 'java-programming',
  kind: 'video',
  path: `/learn/java-programming/${t.id}`,
  url: '',
  instructor: t.instructor,
  topics: [t.title],
  keyConcept: t.summary
}));

// Interactive practice problems mapped by topic id ('01' through '14')
// Problems are added topic by topic as provided by Tanvir.
export const javaPracticeProblems = {
  '01': [],
  '02': [],
  '03': [],
  '04': [],
  '05': nestedLoopsPracticeProblems, // Pre-loaded with 14 nested loop algorithm challenges
  '06': [],
  '07': [],
  '08': [],
  '09': [],
  '10': [],
  '11': [],
  '12': [],
  '13': [],
  '14': []
};

// Clean and sanitize progress IDs from localStorage
export function cleanJavaProgress(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter(id => javaVideos.some(v => v.id === id)))];
}

// Sequential unlocking / topic accessibility:
// Allows open exploration across all 14 structured topics so students can practice any topic.
export function isJavaClassUnlocked(classId, completedList = []) {
  if (!javaVideos || javaVideos.length === 0) return false;
  return javaVideos.some(v => v.id === classId);
}

// Helper to determine the first uncompleted unlocked class
export function getNextUnlockedJavaClass(completedList = []) {
  if (!javaVideos || javaVideos.length === 0) return null;
  for (const video of javaVideos) {
    if (!completedList.includes(video.id)) {
      return video;
    }
  }
  return javaVideos[0] || null;
}
