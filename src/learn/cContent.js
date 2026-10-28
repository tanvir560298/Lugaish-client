// C Programming Course Content & Curriculum
// Class 01 video: Owner-supplied YouTube video (https://youtu.be/r8hVKDRUGLQ)
// Programming Hero style progression: Students must finish previous class to unlock the next.

export const cVideos = [
  {
    id: '01',
    youtubeId: 'r8hVKDRUGLQ',
    title: 'Introduction to C & Your First Program',
    summary: 'Discover why C is the foundation of modern computing, learn about Dennis Ritchie & Bell Labs, and run your first C program.',
    duration: '1 min',
    course: 'c-programming',
    kind: 'video',
    path: '/learn/c-programming/01',
    url: 'https://www.youtube.com/watch?v=r8hVKDRUGLQ'
  },
  {
    id: '02',
    youtubeId: '',
    title: 'Variables, Data Types & Input / Output (printf & scanf)',
    summary: 'Learn int, float, char, format specifiers, and getting user input with scanf.',
    duration: 'Coming soon',
    course: 'c-programming',
    kind: 'video',
    path: '/learn/c-programming/02',
    url: ''
  },
  {
    id: '03',
    youtubeId: '',
    title: 'Conditions & Decision Making (if, else if, switch)',
    summary: 'Branching logic, boolean expressions, and real-world decision structures.',
    duration: 'Coming soon',
    course: 'c-programming',
    kind: 'video',
    path: '/learn/c-programming/03',
    url: ''
  },
  {
    id: '04',
    youtubeId: '',
    title: 'Loops & Iterations (for, while, do-while)',
    summary: 'Automate repetitive tasks, count loops, and solve sequence problems.',
    duration: 'Coming soon',
    course: 'c-programming',
    kind: 'video',
    path: '/learn/c-programming/04',
    url: ''
  },
  {
    id: '05',
    youtubeId: '',
    title: 'Functions & Modular Code',
    summary: 'Creating reusable functions, parameters, return types, and scope in C.',
    duration: 'Coming soon',
    course: 'c-programming',
    kind: 'video',
    path: '/learn/c-programming/05',
    url: ''
  },
  {
    id: '06',
    youtubeId: '',
    title: 'Arrays & Strings in C',
    summary: 'Storing collections of data, iterating arrays, and string handling.',
    duration: 'Coming soon',
    course: 'c-programming',
    kind: 'video',
    path: '/learn/c-programming/06',
    url: ''
  },
  {
    id: '07',
    youtubeId: '',
    title: 'Pointers & Memory Architecture',
    summary: 'Understand memory addresses, the dereference operator, and how memory really works.',
    duration: 'Coming soon',
    course: 'c-programming',
    kind: 'video',
    path: '/learn/c-programming/07',
    url: ''
  }
];

// Extensible practice problems collection (supports multiple problems per class)
export const cPracticeProblems = {
  '01': [
    {
      id: 'c01-p1',
      title: 'Problem 1: Hello, World!',
      level: 'Easy',
      prompt: 'Write your first C program to print "Hello, World!" followed by a newline.',
      starter: '#include <stdio.h>\n\nint main() {\n    // Print "Hello, World!" below\n    printf("Hello, World!\\n");\n    return 0;\n}',
      expectedKeywords: ['#include', 'main', 'printf'],
      sampleOutput: 'Hello, World!',
      hint: 'Ensure printf has double quotes and ends with a semicolon.'
    },
    {
      id: 'c01-p2',
      title: 'Problem 2: Welcome to C Programming',
      level: 'Easy',
      prompt: 'Modify the program to print "Welcome to our C programming learning journey!"',
      starter: '#include <stdio.h>\n\nint main() {\n    printf("Welcome to our C programming learning journey!\\n");\n    return 0;\n}',
      expectedKeywords: ['#include', 'main', 'printf'],
      sampleOutput: 'Welcome to our C programming learning journey!',
      hint: 'Keep the #include <stdio.h> header and change the text inside printf.'
    },
    {
      id: 'c01-p3',
      title: 'Problem 3: Multi-line Output',
      level: 'Medium',
      prompt: 'Print two separate lines: First line "Learning C", second line "Let\'s begin!"',
      starter: '#include <stdio.h>\n\nint main() {\n    printf("Learning C\\n");\n    printf("Let\'s begin!\\n");\n    return 0;\n}',
      expectedKeywords: ['printf', 'main'],
      sampleOutput: 'Learning C\nLet\'s begin!',
      hint: 'Use two printf calls or a \\n character to break into two lines.'
    }
  ],
  '02': [
    {
      id: 'c02-p1',
      title: 'Problem 1: Declaring Variables',
      level: 'Easy',
      prompt: 'Declare an integer variable age with value 20 and print it.',
      starter: '#include <stdio.h>\n\nint main() {\n    int age = 20;\n    printf("Age: %d\\n", age);\n    return 0;\n}',
      expectedKeywords: ['int', 'printf', '%d'],
      sampleOutput: 'Age: 20',
      hint: 'Use %d format specifier for integers.'
    }
  ],
  '03': [
    {
      id: 'c03-p1',
      title: 'Problem 1: Positive or Negative',
      level: 'Easy',
      prompt: 'Check if a number is positive using an if statement.',
      starter: '#include <stdio.h>\n\nint main() {\n    int num = 5;\n    if (num > 0) {\n        printf("Positive\\n");\n    }\n    return 0;\n}',
      expectedKeywords: ['if', 'printf'],
      sampleOutput: 'Positive',
      hint: 'Compare num > 0 inside the if condition.'
    }
  ]
};

// Clean and validate stored watched IDs
export function cleanCProgress(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter(id => cVideos.some(v => v.id === id)))];
}

// Programming Hero progression policy:
// Class 01 is always unlocked.
// Subsequent classes unlock ONLY if the immediate prior class is completed.
export function isClassUnlocked(videoId, completedIds = []) {
  if (!videoId || videoId === '01') return true;
  const index = cVideos.findIndex(v => v.id === videoId);
  if (index <= 0) return true;
  const priorClass = cVideos[index - 1];
  return completedIds.includes(priorClass.id);
}

// Get the latest unlocked class index for a user
export function getNextUnlockedClass(completedIds = []) {
  for (const video of cVideos) {
    if (!completedIds.includes(video.id)) {
      return video;
    }
  }
  return cVideos[0];
}
