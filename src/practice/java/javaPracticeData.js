// Java Practice Topic 1 Metadata & Constants

export const TOPIC_1_METADATA = {
  id: 'topic-01',
  slug: 'basic-io-variables',
  title: 'Basic Input, Output & Variables',
  language: 'Java',
  level: 'Beginner',
  description:
    'Begin your Java programming journey by practicing printing output, working with variables, and taking user input. Strengthen your fundamentals through practical coding challenges.'
};

export const DEFAULT_JAVA_STARTER = `public class Main {
    public static void main(String[] args) {
        // Write your code here
        
    }
}
`;

export const SOLVED_STORAGE_KEY = 'lugaish_practice_solved_java';

/**
 * Public problem metadata for Topic 1 (strictly excludes server-side hidden test cases).
 */
export const FALLBACK_PUBLIC_PROBLEMS = {
  'basic-io-variables': [
    {
      id: 'java-bio-01',
      number: '01',
      title: 'Hello World!',
      slug: 'hello-world',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `Write a Java program that prints the following message on the screen:

Hello, world!

This is your first Java programming problem. The goal is to become familiar with writing, compiling, and running a simple Java program.`,
      inputFormat: 'There is no input for this problem.',
      outputFormat: 'Print exactly Hello, world! on a single line.',
      constraints: 'None. Output must match exactly on a single line.',
      sampleTestCases: [
        {
          input: '',
          expectedOutput: 'Hello, world!',
          explanation: 'The program prints "Hello, world!" to standard output.'
        }
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• The output is case-sensitive.\n• Do not print any extra words or characters.\n• Use Java to solve this problem.'
    },
    {
      id: 'java-bio-02',
      number: '02',
      title: 'Robot Startup Messages',
      slug: 'robot-startup-messages',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A small robot is getting ready for its first mission. Before starting, it must display three startup messages.

Write a Java program to display the following messages, each on a separate line.`,
      inputFormat: 'There is no input for this problem.',
      outputFormat: `Print exactly the following, each on a separate line:
Robot is waking up...
Battery is fully charged.
Ready for the mission!`,
      constraints: 'None. Each message must appear on a new line.',
      sampleTestCases: [
        {
          input: '',
          expectedOutput: 'Robot is waking up...\nBattery is fully charged.\nReady for the mission!',
          explanation: 'Prints the 3 startup messages sequentially, each on its own line.'
        }
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Each message must appear on a new line.\n• Spelling, spaces, and punctuation (including periods and exclamation mark) must match exactly.'
    },
    {
      id: 'java-bio-03',
      number: '03',
      title: 'Digital Nameplate',
      slug: 'digital-nameplate',
      language: 'Java',
      categorySlug: 'basic-io-variables',
      difficulty: 'Easy',
      problemType: 'lugaish',
      sourcePlatform: 'Lugaish',
      description: `A tech club wants to display a digital nameplate on its welcome screen.

Write a Java program that displays the club name, department, and membership status together on a single line.`,
      inputFormat: 'There is no input for this problem.',
      outputFormat: 'Print exactly: Code Club | Department: CS | Status: Open',
      constraints: 'None. Make sure the entire message appears on one line with the correct spacing and symbols.',
      sampleTestCases: [
        {
          input: '',
          expectedOutput: 'Code Club | Department: CS | Status: Open',
          explanation: 'Prints the club details separated by pipe characters (|) on a single line.'
        }
      ],
      starterCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        
    }
}
`,
      timeLimit: 3,
      memoryLimit: 128000,
      notes: '• Make sure the entire message appears on one line.\n• Use exact spacing and pipe symbols (|).'
    }
  ]
};
