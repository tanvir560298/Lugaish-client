// Java Programming Course Content & Curriculum
// Class 01: Tanvir Ahmad's class on Java basics & printing fundamentals.
// Designed to link directly to YouTube to save hosting bandwidth & storage.
// Sequential progression: Students progress through classes with interactive lab practice.

export const javaVideos = [
  {
    id: '01',
    youtubeId: '', // Paste YouTube Video ID once uploaded (e.g. 'abcdefghijk')
    title: 'Class 01: Introduction to Java & Printing Fundamentals',
    summary: 'Learn Java class structure, public static void main, and the fundamental rule: whatever goes inside double quotes in System.out.println() prints to screen.',
    duration: '9 min 38 sec',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/01',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['Java class anatomy', 'public static void main', 'System.out.println()', 'The double-quotes rule', 'Writing new lines'],
    keyConcept: 'Whatever is written inside double quotes ("...") in System.out.println() is printed verbatim to the output screen.'
  },
  {
    id: '02',
    youtubeId: '',
    title: 'Class 02: Variables & Data Types (int, double, String, boolean)',
    summary: 'Discover how computers store values in memory, declaring variables, type rules, and assigning values in Java.',
    duration: 'Coming soon',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/02',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['Primitive data types', 'Variables & identifiers', 'Memory assignment', 'String vs numeric values'],
    keyConcept: 'Variables hold data in memory. Strongly typed Java requires declaring the type before using a variable.'
  },
  {
    id: '03',
    youtubeId: '',
    title: 'Class 03: String Concatenation & Arithmetic Operations',
    summary: 'Combine text with values using the + operator, perform calculations, and understand operator precedence in Java.',
    duration: 'Coming soon',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/03',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['String concatenation with +', 'Arithmetic operators (+, -, *, /, %)', 'Operator precedence', 'Printing expressions'],
    keyConcept: 'When used with Strings, the + operator concatenates. When used with numbers, it performs arithmetic addition.'
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
    title: 'Class 05: Loops & Iterations (for, while, do-while)',
    summary: 'Automate repetitive tasks, count loops, and iterate through sequences without repeating code.',
    duration: 'Coming soon',
    course: 'java-programming',
    kind: 'video',
    path: '/learn/java-programming/05',
    url: '',
    instructor: 'Tanvir Ahmad',
    topics: ['for loop structure', 'while and do-while loops', 'Loop counters & increments', 'break and continue'],
    keyConcept: 'Loops repeat a block of code as long as a specified condition remains true.'
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
  ]
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
