// Java Programming Course Content & Curriculum
// Class 01 & 02: Tanvir Ahmad's recorded classes on Java fundamentals.
// Sequential progression: Students progress through classes with interactive lab practice.

import { nestedLoopsPracticeProblems } from './nestedLoopsPracticeData.js';
export { nestedLoopsPracticeProblems };

export const javaVideos = [
  {
    id: '01',
    youtubeId: 'ukCm0p5PJFA',
    title: 'Class 01: Introduction to Java & Printing Fundamentals',
    summary: 'Learn Java class structure, public static void main, and the fundamental rule: whatever goes inside double quotes in System.out.println() prints to screen.',
    duration: '9 min 38 sec',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/01',
    url: 'https://www.youtube.com/watch?v=ukCm0p5PJFA',
    instructor: 'Tanvir Ahmad',
    topics: ['Java class anatomy', 'public static void main', 'System.out.println()', 'The double-quotes rule', 'Writing new lines'],
    keyConcept: 'Whatever is written inside double quotes ("...") in System.out.println() is printed verbatim to the output screen.'
  },
  {
    id: '02',
    youtubeId: 'rEH2VixyswE',
    title: 'Class 02: Operators, Precedence & Pattern Printing',
    summary: 'Master Java arithmetic operators (+, -, *, /, %), operator precedence rules () > * / % > + -, the crucial difference between print() and println(), and visual asterisk pattern designs.',
    duration: '12 min 48 sec',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/02',
    url: 'https://www.youtube.com/watch?v=rEH2VixyswE',
    instructor: 'Tanvir Ahmad',
    topics: ['Arithmetic operators (+, -, *, /, %)', 'Operator precedence: () > * / % > + -', 'Left-to-right evaluation', 'print vs println', 'Asterisk pattern printing'],
    keyConcept: 'Parentheses take highest priority. Multiplication, division, and modulo share equal precedence and evaluate left-to-right before addition and subtraction. print() keeps the cursor on the same line, while println() moves to the next line.'
  },
  {
    id: '03',
    youtubeId: '',
    title: 'Class 03: Variables & Data Types (int, double, String, boolean)',
    summary: 'Discover how computers store values in memory, declaring variables, type rules, and assigning values in Java.',
    duration: 'Coming soon',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/03',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['Primitive data types', 'Variables & identifiers', 'Memory assignment', 'String vs numeric values'],
    keyConcept: 'Variables hold data in memory. Strongly typed Java requires declaring the type before using a variable.'
  },
  {
    id: '04',
    youtubeId: '',
    title: 'Class 04: Conditions & Decision Making (if, else if, else)',
    summary: 'Branching logic, boolean expressions, relational operators, and decision-making structures in Java.',
    duration: 'Coming soon',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/04',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['if and else statements', 'Comparison operators (==, !=, >, <, >=, <=)', 'Logical AND/OR (&&, ||)', 'Nested conditions'],
    keyConcept: 'Conditions allow programs to make decisions based on true or false boolean expressions.'
  },
  {
    id: '05',
    youtubeId: '',
    title: 'Class 05: Nested Loops Practice Problems',
    summary: 'Master nested loops, pattern printing, arrays, selection sort & simulation with 14 structured practice problems (Easy, Medium, Hard).',
    duration: '14 Problems · Practice Set',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/05',
    instructor: 'Tanvir Ahmad',
    topics: ['Nested Loops', 'Pattern Printing', 'Spaces & Alignment', 'Selection Sort', 'Simulation & Greedy Logic'],
    keyConcept: 'Nested loops iterate through 2D grids and patterns. In algorithms, nested loops power manual sorting like Selection Sort and discrete-time simulations.'
  },
  {
    id: '06',
    youtubeId: '',
    title: 'Class 06: Methods & Modular Java Code',
    summary: 'Write reusable methods, define parameters, return values, and organize clean modular Java applications.',
    duration: 'Coming soon',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/06',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['Method declarations', 'Parameters & arguments', 'Return types', 'Method overloading'],
    keyConcept: 'Methods encapsulate reusable logic and make programs organized and maintainable.'
  },
  {
    id: '07',
    youtubeId: '',
    title: 'Class 07: Object-Oriented Programming (OOP) Fundamentals',
    summary: 'Master the core power of Java: creating custom classes, instantiating objects, and constructors.',
    duration: 'Coming soon',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/07',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['Classes & Objects', 'Constructors', 'Instance variables', 'The this keyword'],
    keyConcept: 'Java is an object-oriented language where real-world concepts are modeled as objects with state and behavior.'
  },
  {
    id: '08',
    youtubeId: '',
    title: 'Class 08: Arrays & Collections in Java',
    summary: 'Store ordered collections of data, iterate with enhanced for-each loops, and explore dynamic ArrayLists.',
    duration: 'Coming soon',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/08',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['Array declaration & indexing', 'Iterating arrays with loops', 'Enhanced for-each loop', 'ArrayList fundamentals'],
    keyConcept: 'Arrays store multiple values of the same type in a single contiguous block of memory.'
  }
];

// Interactive practice problems for Java classes
export const javaPracticeProblems = {
  '01': [
    {
      id: 'java01-p1',
      title: 'Problem 1: Print Your Name, Age & Country',
      level: 'Beginner',
      prompt: 'As demonstrated by Tanvir in Class 01, write a Java program that prints your name, age, and country on three separate lines. Remember the golden rule: whatever text is inside double quotes "..." is printed exactly as it is!',
      starter: `public class Test {
    public static void main(String[] args)
    {
        // Print your name, age, and country on three separate lines
        System.out.println("My name is Tanvir Ahmad");
        System.out.println("My age is 22");
        System.out.println("I am from Bangladesh");
    }
}`,
      expectedKeywords: ['public', 'class', 'main', 'System.out.println'],
      minPrintLines: 3,
      sampleOutput: 'My name is Tanvir Ahmad\nMy age is 22\nI am from Bangladesh',
      hint: 'Use System.out.println("..."); three times. Make sure every line has its text wrapped in double quotes and ends with a semicolon (;).'
    },
    {
      id: 'java01-p2',
      title: 'Problem 2: Welcome to Java on Lugaish',
      level: 'Beginner',
      prompt: 'Write a Java program that prints "Hello, Java!" on the first line and "Welcome to Lugaish Learning Portal!" on the second line.',
      starter: `public class Main {
    public static void main(String[] args) {
        // Print the two messages below
        System.out.println("Hello, Java!");
        System.out.println("Welcome to Lugaish Learning Portal!");
    }
}`,
      expectedKeywords: ['System.out.println'],
      minPrintLines: 2,
      sampleOutput: 'Hello, Java!\nWelcome to Lugaish Learning Portal!',
      hint: 'Ensure you have two System.out.println statements with the exact text inside double quotes.'
    }
  ],
  '02': [
    {
      id: 'java02-p1',
      title: 'Problem 1: Asterisk Triangle Pattern (print vs println)',
      level: 'Beginner',
      prompt: 'As taught by Tanvir in Class 02, write a program that prints a 3-line asterisk triangle pattern using System.out.println():\n*\n* *\n* * *',
      starter: `public class Test {
    public static void main(String[] args)
    {
        // Print a 3-line triangle pattern with asterisks
        System.out.println("*");
        System.out.println("* *");
        System.out.println("* * *");
    }
}`,
      expectedKeywords: ['public', 'class', 'main', 'System.out.'],
      minPrintLines: 3,
      sampleOutput: '*\n* *\n* * *',
      hint: 'Use System.out.println() for each row of asterisks. Notice how println moves to a new line after each row.'
    },
    {
      id: 'java02-p2',
      title: 'Problem 2: Diamond Pattern Design',
      level: 'Intermediate',
      prompt: 'Print the 5-row diamond pattern demonstrated by Tanvir in Class 02:\n  *  \n * * \n* * *\n * * \n  *  ',
      starter: `public class Test {
    public static void main(String[] args)
    {
        // Print the 5-row diamond pattern below
        System.out.println("  *  ");
        System.out.println(" * * ");
        System.out.println("* * *");
        System.out.println(" * * ");
        System.out.println("  *  ");
    }
}`,
      expectedKeywords: ['public', 'class', 'main', 'System.out.println'],
      minPrintLines: 5,
      sampleOutput: '  *  \n * * \n* * *\n * * \n  *  ',
      hint: 'Pay close attention to leading and center spaces in each double-quoted string to align the diamond symmetrically.'
    },
    {
      id: 'java02-p3',
      title: 'Problem 3: Arithmetic Precedence (5 * 6 / 7 % 3)',
      level: 'Concept Check',
      prompt: 'In Class 02, Tanvir explained the operator precedence rules: () > * / % > + -. Trace the expression 5 * 6 / 7 % 3 and print the calculation result using System.out.println.',
      starter: `public class Test {
    public static void main(String[] args)
    {
        // Expression: 5 * 6 / 7 % 3
        // 5 * 6 = 30 -> 30 / 7 = 4 -> 4 % 3 = 1
        System.out.println("The result is = " + (5 * 6 / 7 % 3));
    }
}`,
      expectedKeywords: ['System.out.println'],
      minPrintLines: 1,
      sampleOutput: 'The result is = 1',
      hint: 'Remember that * / % have equal precedence and are evaluated from left to right. In integer division, 30 / 7 gives 4, and 4 % 3 gives remainder 1.'
    }
  ],
  '05': nestedLoopsPracticeProblems
};

// Clean and sanitize progress IDs from localStorage
export function cleanJavaProgress(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter(id => javaVideos.some(v => v.id === id)))];
}

// Sequential unlocking: Class 01 is unlocked for everyone.
// Subsequent classes unlock once the preceding class is completed.
export function isJavaClassUnlocked(classId, completedList = []) {
  if (classId === '01') return true;
  const idx = javaVideos.findIndex(v => v.id === classId);
  if (idx <= 0) return false;
  const previousClassId = javaVideos[idx - 1].id;
  return completedList.includes(previousClassId);
}

// Helper to determine the first uncompleted unlocked class
export function getNextUnlockedJavaClass(completedList = []) {
  for (const video of javaVideos) {
    if (!completedList.includes(video.id) && isJavaClassUnlocked(video.id, completedList)) {
      return video;
    }
  }
  return javaVideos[0];
}
