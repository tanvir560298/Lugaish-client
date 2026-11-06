// Lugaish — Programming Practice Set 01
// Topics: Nested Loops, Pattern Printing, Arrays, Selection Sort & Simulation
// Total Problems: 10 (Easy: 3, Medium: 3, Hard: 4)
// Taught by Tanvir Ahmad for Lugaish Learning Portal

export const nestedLoopsPracticeProblems = [
  {
    id: 'nested-p01',
    number: 1,
    title: 'Problem 01: Right-Aligned Star Triangle',
    difficulty: 'Easy',
    level: 'Easy',
    originalProblem: 'Assiut Sheet #2 (Loops) · Problem O: Pyramid',
    codeforcesId: 'Sheet 2 (Problem O)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/O',
    topics: ['Nested Loops', 'Spaces', 'Pattern Printing'],
    statement: `You are given an integer N. Write a C program to print a right-aligned triangle containing N rows.

Each row contains an increasing number of stars (*). There must be exactly one space between consecutive stars.`,
    inputFormat: 'A single integer N.',
    constraints: '1 <= N <= 20',
    sampleInput: '5',
    sampleOutput: `    *
   * *
  * * *
 * * * *
* * * * *`,
    explanation: 'Row 1 has 4 leading spaces and 1 star. Row 2 has 3 leading spaces and 2 stars separated by spaces. Row 5 has 0 leading spaces and 5 stars.',
    instructional: {
      prerequisites: [
        'Outer loop control: An outer for-loop runs N times, once for each row i (from 1 to N).',
        'Leading spaces calculation: Each row i needs exactly (N - i) single spaces before the first star.',
        'Spaced stars output: In row i, print i stars where consecutive stars are separated by a space ("* " or condition j == i ? "*" : "* ").',
        'Newline: Always print a newline \\n after finishing all stars in a row.'
      ],
      stepByStepLogic: [
        'Step 1: Read the integer N from standard input.',
        'Step 2: Run an outer loop: for (int i = 1; i <= N; i++).',
        'Step 3: Inside the outer loop, run a loop for spaces: for (int s = 1; s <= N - i; s++) printf(" ");.',
        'Step 4: Run a second inner loop for stars: for (int j = 1; j <= i; j++) printf(j == i ? "*" : "* ");.',
        'Step 5: Output printf("\\n"); to move to the next row.'
      ],
      commonPitfalls: [
        'Do not forget the leading spaces: without them, the triangle will be left-aligned instead of right-aligned.',
        'Watch trailing spaces: the sample shows consecutive stars separated by a space.'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Write nested loops to print right-aligned triangle
    // Row i needs (N - i) leading spaces and i stars separated by space

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Outer loop for N rows, inner loops for spaces and stars
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // Outer loop for rows 1 to N
    for (int i = 1; i <= N; i++) {
        // Step 1: Print (N - i) leading spaces
        for (int s = 1; s <= N - i; s++) {
            printf(" ");
        }
        // Step 2: Print i stars separated by space
        for (int j = 1; j <= i; j++) {
            printf(j == i ? "*" : "* ");
        }
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        for (int i = 1; i <= N; i++) {
            for (int s = 1; s <= N - i; s++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= i; j++) {
                System.out.print(j == i ? "*" : "* ");
            }
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p02',
    number: 2,
    title: 'Problem 02: Reverse Star Triangle',
    difficulty: 'Easy',
    level: 'Easy',
    originalProblem: 'Assiut Sheet #2 (Loops) · Problem P: Shape 1',
    codeforcesId: 'Sheet 2 (Problem P)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/P',
    topics: ['Nested Loops', 'Decreasing Loops'],
    statement: `Given an integer N, print an inverted right-aligned star triangle. The first row contains N stars. Each following row contains one fewer star and one additional leading space.`,
    inputFormat: 'A single integer N.',
    constraints: '1 <= N <= 30',
    sampleInput: '5',
    sampleOutput: `*****
 ****
  ***
   **
    *`,
    explanation: 'Row 0 has 0 spaces and 5 stars. Row 1 has 1 space and 4 stars. Row 4 has 4 spaces and 1 star. Notice that adjacent stars have NO space between them.',
    instructional: {
      prerequisites: [
        'Decreasing iteration: The star count starts at N and decrements by 1 on each row.',
        'Increasing spaces: The number of leading spaces starts at 0 and increments by 1 on each row.',
        'Zero-indexed loop advantage: If loop index i runs from 0 to N - 1, row i naturally has i spaces and (N - i) stars!'
      ],
      stepByStepLogic: [
        'Step 1: Read the integer N.',
        'Step 2: Loop i from 0 to N - 1 (for each row).',
        'Step 3: Print i spaces: for (int s = 0; s < i; s++) printf(" ");.',
        'Step 4: Print (N - i) stars: for (int j = 0; j < N - i; j++) printf("*");.',
        'Step 5: Print "\\n" at the end of each row.'
      ],
      commonPitfalls: [
        'Do not add spaces between stars here. In this problem, stars are contiguous: "*****", not "* * * * *".',
        'Beware of off-by-one errors when stopping at N - 1 vs N.'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Loop i from 0 to N - 1
    // Print i leading spaces followed by (N - i) stars

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Print inverted right-aligned star triangle
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    for (int i = 0; i < N; i++) {
        // Print i leading spaces
        for (int s = 0; s < i; s++) {
            printf(" ");
        }
        // Print (N - i) stars
        for (int j = 0; j < N - i; j++) {
            printf("*");
        }
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        for (int i = 0; i < N; i++) {
            for (int s = 0; s < i; s++) {
                System.out.print(" ");
            }
            for (int j = 0; j < N - i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p03',
    number: 3,
    title: 'Problem 03: Alphabet Triangle',
    difficulty: 'Easy',
    level: 'Easy',
    originalProblem: 'Assiut Sheet #2 (Loops) · Characters & Grid Contest',
    codeforcesId: 'Sheet 2 (Loops Contest)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432',
    topics: ['Nested Loops', 'Characters', 'ASCII'],
    statement: `Write a C program that takes an integer N and prints an alphabet triangle.

The first row contains A, the second row contains A B, and each following row contains one additional alphabet.

Separate consecutive letters with a single space.`,
    inputFormat: 'A single integer N.',
    constraints: '1 <= N <= 26',
    sampleInput: '5',
    sampleOutput: `A
A B
A B C
A B C D
A B C D E`,
    explanation: 'Row 1 prints letter A. Row 2 prints letters A and B separated by space. Row 5 prints A through E.',
    instructional: {
      prerequisites: [
        'ASCII character math: Characters in C/Java are stored as numbers. \'A\' is ASCII 65. \'A\' + 1 gives \'B\', \'A\' + 2 gives \'C\', etc.',
        'Outer loop row count: i goes from 1 to N.',
        'Inner loop character range: j goes from 0 to i - 1, printing (char)(\'A\' + j).'
      ],
      stepByStepLogic: [
        'Step 1: Read the integer N (1 <= N <= 26).',
        'Step 2: Loop i from 1 to N for the rows.',
        'Step 3: Inside, loop j from 0 to i - 1.',
        'Step 4: Print (char)(\'A\' + j). If j < i - 1, print a separating space.',
        'Step 5: Print "\\n" after every row.'
      ],
      commonPitfalls: [
        'N is at most 26 (the number of uppercase English letters). Ensure you use capital \'A\'.',
        'Do not hardcode switch cases; use character arithmetic (\'A\' + j).'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Loop i from 1 to N
    // Print characters from 'A' up to 'A' + i - 1 separated by spaces

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Print alphabet triangle
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    for (int i = 1; i <= N; i++) {
        for (int j = 0; j < i; j++) {
            printf("%c", 'A' + j);
            if (j < i - 1) {
                printf(" ");
            }
        }
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        for (int i = 1; i <= N; i++) {
            for (int j = 0; j < i; j++) {
                System.out.print((char)('A' + j));
                if (j < i - 1) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf', '%c']
  },
  {
    id: 'nested-p04',
    number: 4,
    title: 'Problem 04: Right-Aligned Number Triangle',
    difficulty: 'Medium',
    level: 'Medium',
    originalProblem: 'Assiut Sheet #2 (Loops) · Problem V: PUM',
    codeforcesId: 'Sheet 2 (Problem V)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/V',
    topics: ['Nested Loops', 'Number Patterns', 'Spaces'],
    statement: `Given an integer N, print a right-aligned number triangle.

In row i, print the integers from 1 to i, separated by one space. Each row must have N-i leading spaces.`,
    inputFormat: 'A single integer N.',
    constraints: '1 <= N <= 9',
    sampleInput: '5',
    sampleOutput: `    1
   1 2
  1 2 3
 1 2 3 4
1 2 3 4 5`,
    explanation: 'Row 1 has 4 leading spaces followed by 1. Row 2 has 3 leading spaces followed by 1 2. Row 5 has 0 leading spaces followed by 1 2 3 4 5.',
    instructional: {
      prerequisites: [
        'Alignment arithmetic: Row i (1 to N) requires exactly N - i leading single space characters.',
        'Sequential numbers: Inside row i, print numbers from 1 up to i.',
        'Inter-number spacing: Print numbers separated by a single space (e.g. 1 2 3).'
      ],
      stepByStepLogic: [
        'Step 1: Read N.',
        'Step 2: Loop i from 1 to N.',
        'Step 3: Print N - i spaces using a loop: for (int s = 1; s <= N - i; s++) printf(" ");.',
        'Step 4: Print numbers from 1 to i: for (int j = 1; j <= i; j++) printf(j == i ? "%d" : "%d ", j);.',
        'Step 5: Print "\\n".'
      ],
      commonPitfalls: [
        'Trailing space after the last number in each row can cause presentation error on competitive judges.',
        'Make sure leading spaces count is N - i and not N - 1.'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Loop i from 1 to N
    // Print (N - i) spaces, then numbers 1 to i separated by space

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Right-aligned number triangle
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    for (int i = 1; i <= N; i++) {
        // Leading spaces
        for (int s = 1; s <= N - i; s++) {
            printf(" ");
        }
        // Numbers from 1 to i
        for (int j = 1; j <= i; j++) {
            printf("%d", j);
            if (j < i) printf(" ");
        }
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        for (int i = 1; i <= N; i++) {
            for (int s = 1; s <= N - i; s++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= i; j++) {
                System.out.print(j);
                if (j < i) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p05',
    number: 5,
    title: 'Problem 05: Inverted Pyramid',
    difficulty: 'Medium',
    level: 'Medium',
    originalProblem: 'Assiut Sheet #2 (Loops) · Problem T: Shape 2',
    codeforcesId: 'Sheet 2 (Problem T)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/T',
    topics: ['Nested Loops', 'Arithmetic Patterns'],
    statement: `You are given an integer N. Print an inverted pyramid using stars.

The first row contains 2*N-1 stars. Each subsequent row contains two fewer stars and one additional leading space. The last row contains exactly one star.`,
    inputFormat: 'A single integer N.',
    constraints: '1 <= N <= 30',
    sampleInput: '5',
    sampleOutput: `*********
 *******
  *****
   ***
    *`,
    explanation: 'Row 0 has 0 spaces and 2*5-1 = 9 stars. Row 1 has 1 space and 7 stars. Row 4 has 4 spaces and 1 star.',
    instructional: {
      prerequisites: [
        'Arithmetic sequence formula: The number of stars starts at 2*N - 1 and decreases by 2 each row: 2*(N - i) - 1 where i is 0-indexed.',
        'Leading spaces progression: Row i has exactly i leading spaces.',
        'Continuous stars: The stars are printed without spaces in between.'
      ],
      stepByStepLogic: [
        'Step 1: Read N.',
        'Step 2: Loop i from 0 to N - 1.',
        'Step 3: Print i spaces: for (int s = 0; s < i; s++) printf(" ");.',
        'Step 4: Calculate starCount = 2 * (N - i) - 1.',
        'Step 5: Print starCount stars: for (int j = 0; j < starCount; j++) printf("*");.',
        'Step 6: Print "\\n".'
      ],
      commonPitfalls: [
        'Do not multiply N by 2 inside the inner loop variable directly without subtracting i; the star count shrinks every row.',
        'Notice there are no spaces between the stars: *********.'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Loop i from 0 to N - 1
    // Print i spaces followed by 2*(N - i) - 1 stars

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Inverted pyramid
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    for (int i = 0; i < N; i++) {
        // Leading spaces
        for (int s = 0; s < i; s++) {
            printf(" ");
        }
        // 2*(N - i) - 1 stars
        int count = 2 * (N - i) - 1;
        for (int j = 0; j < count; j++) {
            printf("*");
        }
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        for (int i = 0; i < N; i++) {
            for (int s = 0; s < i; s++) System.out.print(" ");
            int count = 2 * (N - i) - 1;
            for (int j = 0; j < count; j++) System.out.print("*");
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p06',
    number: 6,
    title: 'Problem 06: Fox and Snake',
    difficulty: 'Medium',
    level: 'Medium',
    topics: ['Nested Loops', 'Conditions', 'Pattern Logic'],
    statement: `Given an odd number of rows N and a number of columns M, print a snake-shaped pattern using # and . characters.

Every odd-numbered row contains only # symbols. The other rows alternate between having a # at the rightmost position and at the leftmost position.`,
    inputFormat: 'Two integers N and M.',
    constraints: '3 <= N, M <= 50; N is odd.',
    sampleInput: '5 5',
    sampleOutput: `#####
....#
#####
#....
#####`,
    explanation: 'Row 1 has all #. Row 2 has 4 dots and 1 # at the right. Row 3 has all #. Row 4 has 1 # at the left and 4 dots. Row 5 has all #.',
    originalProblem: 'Codeforces 510A',
    codeforcesId: '510A',
    externalUrl: 'https://codeforces.com/problemset/problem/510/A',
    instructional: {
      prerequisites: [
        'Modulo arithmetic for row classification: Using 1-based indexing for row i:',
        '  - If i % 2 != 0: The row is odd, so print # for all M columns.',
        '  - If i % 4 == 2: Even row with snake turning right: print M - 1 dots followed by 1 #.',
        '  - If i % 4 == 0: Even row with snake turning left: print 1 # followed by M - 1 dots.'
      ],
      stepByStepLogic: [
        'Step 1: Read two integers N and M.',
        'Step 2: Loop row i from 1 to N.',
        'Step 3: If i is odd (i % 2 != 0), run loop for j from 0 to M - 1 printing \'#\'.',
        'Step 4: Else if i % 4 == 2 (row 2, 6, 10...), print M - 1 \'.\' then one \'#\'.',
        'Step 5: Else (row 4, 8, 12...), print one \'#\' then M - 1 \'.\'.',
        'Step 6: Print \'\\n\' after each row.'
      ],
      commonPitfalls: [
        'Be careful with 0-based vs 1-based indexing! The modulo % 4 condition behaves differently if your loop starts at 0 vs 1.',
        'N is guaranteed to be odd, so the snake always ends on a full solid row of #.'
      ],
      timeComplexity: 'O(N * M) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;

    // TODO: Loop row i from 1 to n
    // If i is odd: all '#'
    // If i % 4 == 2: '....#'
    // If i % 4 == 0: '#....'

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();

        // TODO: Fox and Snake simulation
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int n, m;
    if (scanf("%d %d", &n, &m) != 2) return 0;

    for (int i = 1; i <= n; i++) {
        if (i % 2 != 0) {
            // Full row of '#'
            for (int j = 0; j < m; j++) printf("#");
        } else if (i % 4 == 2) {
            // Turn right: '....#'
            for (int j = 0; j < m - 1; j++) printf(".");
            printf("#");
        } else {
            // Turn left: '#....'
            printf("#");
            for (int j = 0; j < m - 1; j++) printf(".");
        }
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();

        for (int i = 1; i <= n; i++) {
            if (i % 2 != 0) {
                for (int j = 0; j < m; j++) System.out.print("#");
            } else if (i % 4 == 2) {
                for (int j = 0; j < m - 1; j++) System.out.print(".");
                System.out.print("#");
            } else {
                System.out.print("#");
                for (int j = 0; j < m - 1; j++) System.out.print(".");
            }
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p07',
    number: 7,
    title: 'Problem 07: Alternating Diamond Pattern',
    difficulty: 'Hard',
    level: 'Hard',
    originalProblem: 'Assiut Sheet #2 (Loops) · Problem W: Shape 3',
    codeforcesId: 'Sheet 2 (Problem W)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/W',
    topics: ['Nested Loops', 'Conditions', 'Spaces', 'Symmetry'],
    statement: `Write a C program that takes an integer N and prints a centered diamond-shaped pattern consisting of # and - symbols.

The pattern must follow these rules:
1. The diamond contains exactly 2*N-1 rows.
2. The first row contains one #.
3. The second row contains three - symbols.
4. Every following row in the upper half contains two more symbols than the previous row.
5. Odd-numbered rows in the upper half use #, while even-numbered rows use -.
6. After the widest row, print the upper rows in reverse order, without repeating the widest row.
7. Add leading spaces to keep the diamond centered.`,
    inputFormat: 'A single integer N.',
    constraints: '1 <= N <= 20',
    sampleInput: '4',
    sampleOutput: `   #
  ---
 #####
-------
 #####
  ---
   #`,
    explanation: 'Upper half has 4 rows (r = 1, 2, 3, 4). Row 1: 3 spaces + 1 \'#\'. Row 2: 2 spaces + 3 \'-\'. Row 3: 1 space + 5 \'#\'. Row 4 (widest): 0 spaces + 7 \'-\'. Lower half mirrors rows 3, 2, 1.',
    instructional: {
      prerequisites: [
        'Symmetric geometry: Decompose the diamond into two distinct halves:',
        '  - Upper half: row r goes from 1 to N (where row N is the widest central row).',
        '  - Lower half: row r goes from N - 1 down to 1.',
        'Geometry parameters for any row r:',
        '  - Leading spaces = N - r.',
        '  - Symbol count = 2 * r - 1.',
        '  - Alternating symbol = (r % 2 != 0) ? \'#\' : \'-\'.'
      ],
      stepByStepLogic: [
        'Step 1: Read N.',
        'Step 2: Loop r from 1 to N (Upper Half):',
        '        - Print N - r spaces.',
        '        - Pick char ch = (r % 2 != 0) ? \'#\' : \'-\'.',
        '        - Print ch (2 * r - 1) times.',
        '        - Print \'\\n\'.',
        'Step 3: Loop r from N - 1 down to 1 (Lower Half):',
        '        - Print N - r spaces.',
        '        - Pick char ch = (r % 2 != 0) ? \'#\' : \'-\'.',
        '        - Print ch (2 * r - 1) times.',
        '        - Print \'\\n\'.'
      ],
      commonPitfalls: [
        'Do not repeat the widest row: the lower half must start at N - 1, not N.',
        'Ensure the symbol matches the row index in both halves (odd row uses #, even row uses -).'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Upper half (rows 1 to N)
    // Lower half (rows N - 1 down to 1)

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Alternating Diamond Pattern
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // Upper half (rows 1 to N)
    for (int r = 1; r <= N; r++) {
        for (int s = 0; s < N - r; s++) printf(" ");
        char ch = (r % 2 != 0) ? '#' : '-';
        for (int k = 0; k < 2 * r - 1; k++) printf("%c", ch);
        printf("\\n");
    }

    // Lower half (rows N - 1 down to 1)
    for (int r = N - 1; r >= 1; r--) {
        for (int s = 0; s < N - r; s++) printf(" ");
        char ch = (r % 2 != 0) ? '#' : '-';
        for (int k = 0; k < 2 * r - 1; k++) printf("%c", ch);
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // Upper half
        for (int r = 1; r <= N; r++) {
            for (int s = 0; s < N - r; s++) System.out.print(" ");
            char ch = (r % 2 != 0) ? '#' : '-';
            for (int k = 0; k < 2 * r - 1; k++) System.out.print(ch);
            System.out.println();
        }

        // Lower half
        for (int r = N - 1; r >= 1; r--) {
            for (int s = 0; s < N - r; s++) System.out.print(" ");
            char ch = (r % 2 != 0) ? '#' : '-';
            for (int k = 0; k < 2 * r - 1; k++) System.out.print(ch);
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p08',
    number: 8,
    title: 'Problem 08: Gravity Flip',
    difficulty: 'Hard',
    level: 'Hard',
    topics: ['Arrays', 'Selection Sort', 'Nested Loops'],
    specialInstruction: 'For this practice set, implement the sorting manually using Selection Sort. Do not use a built-in sorting function.',
    originalProblem: 'Codeforces 405A',
    codeforcesId: '405A',
    externalUrl: 'https://codeforces.com/problemset/problem/405/A',
    statement: `You are given an array of N positive integers representing the heights of columns of cubes.

After gravity changes direction to the right, the cubes slide across the floor. The column heights become arranged in non-decreasing order.

Print the resulting heights.`,
    inputFormat: `First line: Integer N.
Second line: N space-separated integers.`,
    constraints: '1 <= N <= 100; each height is between 1 and 100.',
    sampleInput: `4
3 2 1 2`,
    sampleOutput: '1 2 2 3',
    explanation: 'When gravity pulls cubes to the right, cubes in taller left columns slide into shorter right columns until columns are monotonically increasing from left to right: [3, 2, 1, 2] becomes [1, 2, 2, 3].',
    instructional: {
      prerequisites: [
        'Why this problem is sorting: Cubes slide right whenever the left column has more cubes than the right column. In equilibrium, every column is <= the column to its right, which means the array is sorted in ascending order!',
        'Manual Selection Sort mechanics:',
        '  1. Loop i from 0 to N - 2.',
        '  2. Set min_idx = i.',
        '  3. Loop j from i + 1 to N - 1: if arr[j] < arr[min_idx], set min_idx = j.',
        '  4. Swap arr[i] and arr[min_idx].'
      ],
      stepByStepLogic: [
        'Step 1: Read N into an integer variable.',
        'Step 2: Read N integers into an array int a[105].',
        'Step 3: Implement Selection Sort with two nested loops.',
        'Step 4: Print the sorted array separated by spaces.',
        'Step 5: Output a final newline.'
      ],
      commonPitfalls: [
        'Do not use qsort() or std::sort(); this challenge tests your nested loop sorting implementation!',
        'Check that inner loop starts from i + 1 and goes up to N - 1.'
      ],
      timeComplexity: 'O(N^2) time using Selection Sort, O(N) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int a[105];
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);

    // TODO: Sort array 'a' in ascending order using manual Selection Sort
    // Find min_idx in remaining elements and swap with a[i]

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        // TODO: Selection Sort ascending
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int a[105];
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    // Manual Selection Sort
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[min_idx]) {
                min_idx = j;
            }
        }
        // Swap a[i] and a[min_idx]
        int temp = a[i];
        a[i] = a[min_idx];
        a[min_idx] = temp;
    }

    // Print sorted array
    for (int i = 0; i < n; i++) {
        printf("%d%c", a[i], i == n - 1 ? '\\n' : ' ');
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        // Selection Sort
        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[min_idx]) min_idx = j;
            }
            int temp = a[i];
            a[i] = a[min_idx];
            a[min_idx] = temp;
        }

        for (int i = 0; i < n; i++) {
            System.out.print(a[i] + (i == n - 1 ? "\\n" : " "));
        }
    }
}`,
    expectedKeywords: ['for', 'scanf', 'printf']
  },
  {
    id: 'nested-p09',
    number: 9,
    title: 'Problem 09: Queue at the School',
    difficulty: 'Hard',
    level: 'Hard',
    topics: ['Loops', 'Strings', 'Simulation', 'Swapping'],
    originalProblem: 'Codeforces 266B',
    codeforcesId: '266B',
    externalUrl: 'https://codeforces.com/problemset/problem/266/B',
    statement: `A queue consists of boys (B) and girls (G).

Every second, if a boy stands immediately before a girl, their positions are exchanged. All eligible exchanges during the same second happen simultaneously.

Given the initial queue and the number of seconds T, determine the final arrangement.`,
    inputFormat: `First line: Two integers N and T.
Second line: A string of N characters containing only B and G.`,
    constraints: '1 <= N, T <= 50',
    sampleInput: `5 2
BGGBG`,
    sampleOutput: 'GGBGB',
    explanation: `Initial: BGGBG
After second 1: The 'B' at pos 0 swaps with 'G' at pos 1, and 'B' at pos 3 swaps with 'G' at pos 4 -> GBGGB
After second 2: The 'B' at pos 1 swaps with 'G' at pos 2 -> GGBGB`,
    instructional: {
      prerequisites: [
        'Simultaneous exchange rule: When boy B at index i swaps with girl G at index i + 1, that same boy cannot swap again in the same second with girl at index i + 2.',
        'Loop index skipping: After swapping positions i and i + 1, you must advance the loop counter by 2 (i.e. i++) so you do not re-process the boy who just moved forward!',
        'Time outer loop: Repeat the full scan T times, once per second.'
      ],
      stepByStepLogic: [
        'Step 1: Read integers N and T.',
        'Step 2: Read string s of length N (e.g. scanf("%s", s)).',
        'Step 3: Outer loop runs for sec = 0 to T - 1.',
        'Step 4: Inner loop scans i from 0 to N - 2:',
        '        - Check if s[i] == \'B\' && s[i + 1] == \'G\'.',
        '        - If true, swap: s[i] = \'G\'; s[i + 1] = \'B\';',
        '        - Increment i++ extra so we skip over the newly placed boy.',
        'Step 5: After T seconds, print the final string s.'
      ],
      commonPitfalls: [
        'Crucial Trap: If you forget to skip i++ upon swapping, the boy will propagate multiple positions to the right in a single second (cascading swap), yielding wrong answers!',
        'Make sure string buffer is at least 55 chars long to prevent buffer overflow.'
      ],
      timeComplexity: 'O(T * N) time, O(N) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int n, t;
    if (scanf("%d %d", &n, &t) != 2) return 0;
    char s[60];
    scanf("%s", s);

    // TODO: Simulate t seconds
    // In each second, find 'B' followed by 'G', swap them, and advance i by 1 extra

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int t = sc.nextInt();
        char[] s = sc.next().toCharArray();

        // TODO: Queue at School simulation
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int n, t;
    if (scanf("%d %d", &n, &t) != 2) return 0;
    char s[60];
    scanf("%s", s);

    // Simulate each second
    for (int sec = 0; sec < t; sec++) {
        for (int i = 0; i < n - 1; i++) {
            if (s[i] == 'B' && s[i + 1] == 'G') {
                // Simultaneous swap
                s[i] = 'G';
                s[i + 1] = 'B';
                i++; // Skip so boy doesn't jump twice in same second
            }
        }
    }

    printf("%s\\n", s);
    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int t = sc.nextInt();
        char[] s = sc.next().toCharArray();

        for (int sec = 0; sec < t; sec++) {
            for (int i = 0; i < n - 1; i++) {
                if (s[i] == 'B' && s[i + 1] == 'G') {
                    s[i] = 'G';
                    s[i + 1] = 'B';
                    i++;
                }
            }
        }

        System.out.println(new String(s));
    }
}`,
    expectedKeywords: ['for', 'scanf', 'printf']
  },
  {
    id: 'nested-p10',
    number: 10,
    title: 'Problem 10: Twins — Minimum Coins',
    difficulty: 'Hard',
    level: 'Hard',
    topics: ['Arrays', 'Selection Sort', 'Greedy Logic'],
    specialInstruction: 'Use Selection Sort to arrange the coins before determining the answer.',
    originalProblem: 'Codeforces 160A',
    codeforcesId: '160A',
    externalUrl: 'https://codeforces.com/problemset/problem/160/A',
    statement: `You are given N coins with different possible values.

You want to take the minimum number of coins such that the total value of the coins you take is strictly greater than the total value of all remaining coins.

Determine the minimum number of coins required.`,
    inputFormat: `First line: Integer N.
Second line: N space-separated positive integers.`,
    constraints: '1 <= N <= 100; each coin value is between 1 and 100.',
    sampleInput: `5
3 3 3 2 2`,
    sampleOutput: '3',
    explanation: 'The total value of all coins is 13. Taking two coins worth 3 each gives 6, which is not greater than the remaining 7. Taking three coins worth 3 each gives 9, which is strictly greater than the remaining 4. Therefore, the minimum number of coins is 3.',
    instructional: {
      prerequisites: [
        'Greedy Choice Property: To take the fewest possible coins, always pick coins with the largest values first.',
        'Strictly greater condition: If your sum is my_sum and total sum is total_sum, remaining coins sum to total_sum - my_sum. You need my_sum > total_sum - my_sum (or 2 * my_sum > total_sum).',
        'Sorting requirement: Sort the array descending using Selection Sort so largest values appear first.'
      ],
      stepByStepLogic: [
        'Step 1: Read N and array of N coin values.',
        'Step 2: Calculate total_sum of all coins.',
        'Step 3: Sort coins array in descending order using Selection Sort.',
        'Step 4: Iterate through sorted coins:',
        '        - Add coin value to my_sum.',
        '        - Increment coin_count.',
        '        - If my_sum > total_sum - my_sum, break!',
        'Step 5: Print coin_count.'
      ],
      commonPitfalls: [
        'Strict inequality: It must be strictly greater (>), not greater than or equal (>=). Taking half is not enough!',
        'Sorting order: If you sort ascending, you must pick coins from the end of the array (N - 1 down to 0).'
      ],
      timeComplexity: 'O(N^2) time for Selection Sort + O(N) scan, O(N) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int a[105];
    int total = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
        total += a[i];
    }

    // TODO: Sort coins descending with Selection Sort
    // Greedily pick largest coins until my_sum > total - my_sum

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] a = new int[n];
        int total = 0;
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
            total += a[i];
        }

        // TODO: Twins greedy coins
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int a[105];
    int total = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
        total += a[i];
    }

    // Selection Sort in descending order
    for (int i = 0; i < n - 1; i++) {
        int max_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] > a[max_idx]) {
                max_idx = j;
            }
        }
        int temp = a[i];
        a[i] = a[max_idx];
        a[max_idx] = temp;
    }

    // Greedily take largest coins
    int my_sum = 0;
    int count = 0;
    for (int i = 0; i < n; i++) {
        my_sum += a[i];
        count++;
        if (my_sum > total - my_sum) {
            break;
        }
    }

    printf("%d\\n", count);
    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] a = new int[n];
        int total = 0;
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
            total += a[i];
        }

        // Selection Sort descending
        for (int i = 0; i < n - 1; i++) {
            int max_idx = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] > a[max_idx]) max_idx = j;
            }
            int temp = a[i];
            a[i] = a[max_idx];
            a[max_idx] = temp;
        }

        int my_sum = 0;
        int count = 0;
        for (int i = 0; i < n; i++) {
            my_sum += a[i];
            count++;
            if (my_sum > total - my_sum) break;
        }

        System.out.println(count);
    }
}`,
    expectedKeywords: ['for', 'scanf', 'printf']
  },
  {
    id: 'nested-p11',
    number: 11,
    title: 'Problem 11: Shape 1 (Inverted Left Triangle)',
    difficulty: 'Easy',
    level: 'Easy',
    topics: ['Nested Loops', 'Decreasing Loops', 'Pattern Printing'],
    originalProblem: 'Codeforces Sheet 2 (Problem P: Shape1)',
    codeforcesId: 'P (Sheet 2)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/P',
    statement: `Given a number N. Print a face-down right triangle containing N lines using asterisks (*).

The first line has N stars, the second has N - 1 stars, and the last line has 1 star. Do not print leading spaces.`,
    inputFormat: 'A single integer N (1 <= N <= 99).',
    constraints: '1 <= N <= 99',
    sampleInput: '4',
    sampleOutput: `****
***
**
*`,
    explanation: 'Line 1 has 4 stars, line 2 has 3 stars, line 3 has 2 stars, and line 4 has 1 star. No spaces between or before stars.',
    instructional: {
      prerequisites: [
        'Decreasing outer loop: Run outer loop i from N down to 1 (or from 1 to N with inner bound N - i + 1).',
        'Inner star loop: In row i, print i asterisks without spaces.',
        'Newline: Print \\n after each line.'
      ],
      stepByStepLogic: [
        'Step 1: Read integer N.',
        'Step 2: Loop i from N down to 1 (for int i = N; i >= 1; i--).',
        'Step 3: Inside, loop j from 1 to i: printf("*");.',
        'Step 4: Print "\\n".'
      ],
      commonPitfalls: [
        'Do not add leading spaces here; this triangle starts from column 0.',
        'Do not print space between stars on the same line.'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Print face-down triangle with N lines
    // Line i contains (N - i + 1) stars without spaces

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Print Shape 1
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    for (int i = N; i >= 1; i--) {
        for (int j = 1; j <= i; j++) {
            printf("*");
        }
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        for (int i = N; i >= 1; i--) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p12',
    number: 12,
    title: 'Problem 12: Shape 2 (Star Pyramid)',
    difficulty: 'Medium',
    level: 'Medium',
    topics: ['Nested Loops', 'Spaces', 'Odd Number Arithmetic'],
    originalProblem: 'Codeforces Sheet 2 (Problem T: Shape2)',
    codeforcesId: 'T (Sheet 2)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/T',
    statement: `Given a number N. Print a centered pyramid of stars (*) consisting of N lines.

Line i (from 1 to N) contains N - i spaces, followed by 2*i - 1 stars.
Note: Do not print any trailing spaces after the stars on each line!`,
    inputFormat: 'A single integer N (1 <= N <= 99).',
    constraints: '1 <= N <= 99',
    sampleInput: '4',
    sampleOutput: `   *
  ***
 *****
*******`,
    explanation: 'Line 1 has 3 spaces and 1 star. Line 2 has 2 spaces and 3 stars. Line 3 has 1 space and 5 stars. Line 4 has 0 spaces and 7 stars.',
    instructional: {
      prerequisites: [
        'Row geometry: Line i (1 to N) has exactly (N - i) leading spaces and (2*i - 1) stars.',
        'Odd numbers: Consecutive rows increase in width by 2 stars (1, 3, 5, 7, ...).',
        'No trailing spaces: Competitive judges will give Presentation Error if you print spaces after the stars.'
      ],
      stepByStepLogic: [
        'Step 1: Read integer N.',
        'Step 2: Loop i from 1 to N.',
        'Step 3: Print N - i spaces: for (int s = 1; s <= N - i; s++) printf(" ");.',
        'Step 4: Print 2*i - 1 stars: for (int j = 1; j <= 2*i - 1; j++) printf("*");.',
        'Step 5: Print "\\n".'
      ],
      commonPitfalls: [
        'Do not print trailing spaces after the stars.',
        'Ensure the star formula is 2*i - 1, not 2*i + 1.'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Loop i from 1 to N
    // Print (N - i) spaces, then (2*i - 1) stars without trailing spaces

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Star pyramid
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    for (int i = 1; i <= N; i++) {
        // Leading spaces
        for (int s = 1; s <= N - i; s++) {
            printf(" ");
        }
        // Stars
        for (int j = 1; j <= 2 * i - 1; j++) {
            printf("*");
        }
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        for (int i = 1; i <= N; i++) {
            for (int s = 1; s <= N - i; s++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= 2 * i - 1; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p13',
    number: 13,
    title: 'Problem 13: Shape 3 (Full Diamond Pattern)',
    difficulty: 'Hard',
    level: 'Hard',
    topics: ['Nested Loops', 'Centered Symmetry', 'Diamond Pattern'],
    originalProblem: 'Codeforces Sheet 2 (Problem W: Shape3)',
    codeforcesId: 'W (Sheet 2)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219432/problem/W',
    statement: `Given a number N. Print a centered diamond consisting of 2*N lines using asterisks (*).

The upper half contains N lines forming an upright pyramid (from 1 to 2*N - 1 stars).
The lower half contains N lines forming an inverted pyramid (from 2*N - 1 down to 1 stars).
Note: The widest line of 2*N - 1 stars is printed TWICE (once in the upper half, once in the lower half).`,
    inputFormat: 'A single integer N (1 <= N <= 99).',
    constraints: '1 <= N <= 99',
    sampleInput: '4',
    sampleOutput: `   *
  ***
 *****
*******
*******
 *****
  ***
   *`,
    explanation: 'Lines 1 to 4 form an upright pyramid. Lines 5 to 8 form an inverted pyramid with identical width order.',
    instructional: {
      prerequisites: [
        'Two-phase symmetry: Upper pyramid runs i from 1 to N; lower pyramid runs i from N down to 1.',
        'Row i formulas for both halves:',
        '  - Leading spaces = N - i.',
        '  - Stars = 2*i - 1.',
        'Important distinction: Unlike Problem 07, the widest row of 2*N - 1 stars is repeated here!'
      ],
      stepByStepLogic: [
        'Step 1: Read N.',
        'Step 2: Upper half: loop i from 1 to N:',
        '        - Print N - i spaces.',
        '        - Print 2*i - 1 stars.',
        '        - Print "\\n".',
        'Step 3: Lower half: loop i from N down to 1:',
        '        - Print N - i spaces.',
        '        - Print 2*i - 1 stars.',
        '        - Print "\\n".'
      ],
      commonPitfalls: [
        'Make sure the lower loop starts at N (so line 2*N-1 stars is printed again), not N - 1.',
        'Do not print any trailing spaces after the stars on any row.'
      ],
      timeComplexity: 'O(N^2) time, O(1) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // TODO: Upper half: i from 1 to N
    // Lower half: i from N down to 1

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // TODO: Full Diamond Pattern (Shape 3)
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int N;
    if (scanf("%d", &N) != 1) return 0;

    // Upper half (lines 1 to N)
    for (int i = 1; i <= N; i++) {
        for (int s = 1; s <= N - i; s++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("*");
        printf("\\n");
    }

    // Lower half (lines N down to 1)
    for (int i = N; i >= 1; i--) {
        for (int s = 1; s <= N - i; s++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("*");
        printf("\\n");
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int N = sc.nextInt();

        // Upper half
        for (int i = 1; i <= N; i++) {
            for (int s = 1; s <= N - i; s++) System.out.print(" ");
            for (int j = 1; j <= 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }

        // Lower half
        for (int i = N; i >= 1; i--) {
            for (int s = 1; s <= N - i; s++) System.out.print(" ");
            for (int j = 1; j <= 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }
    }
}`,
    expectedKeywords: ['for', 'printf']
  },
  {
    id: 'nested-p14',
    number: 14,
    title: 'Problem 14: Sorting (Array Sorting)',
    difficulty: 'Medium',
    level: 'Medium',
    topics: ['Arrays', 'Selection Sort', 'Nested Loops'],
    specialInstruction: 'Implement sorting manually using nested loops (Selection Sort or Bubble Sort).',
    originalProblem: 'Codeforces Sheet 3 (Problem H: Sorting)',
    codeforcesId: 'H (Sheet 3)',
    externalUrl: 'https://codeforces.com/group/MWSDmqGsZm/contest/219774/problem/H',
    statement: `Given a number N and an array of N numbers. Print the numbers after sorting them in non-decreasing (ascending) order.

Special Instruction: Implement manual sorting using nested loops (Selection Sort). Do not use built-in sort functions.`,
    inputFormat: `First line: Single integer N (1 <= N <= 1000).
Second line: N space-separated integers A_1, A_2, ..., A_N (-100 <= A_i <= 100).`,
    constraints: '1 <= N <= 1000; -100 <= A_i <= 100',
    sampleInput: `3
3 1 2`,
    sampleOutput: '1 2 3',
    explanation: 'The sorted order of [3, 1, 2] is [1, 2, 3].',
    instructional: {
      prerequisites: [
        'Selection Sort logic: In step i (0 to N - 2), find the index of the minimum element in range [i, N - 1], and swap it with arr[i].',
        'Nested loop bounds:',
        '  - Outer loop i from 0 to N - 2.',
        '  - Inner loop j from i + 1 to N - 1.',
        'Negative numbers: Array elements can be negative (-100 <= A_i <= 100); Selection Sort handles negative values naturally.'
      ],
      stepByStepLogic: [
        'Step 1: Read N.',
        'Step 2: Read N integers into an array: for (int i = 0; i < N; i++) scanf("%d", &a[i]);.',
        'Step 3: Run Selection Sort:',
        '        - min_idx = i;',
        '        - for j = i + 1 to N - 1: if a[j] < a[min_idx], min_idx = j;',
        '        - swap a[i] and a[min_idx];',
        'Step 4: Print sorted array separated by spaces.',
        'Step 5: Output a final newline.'
      ],
      commonPitfalls: [
        'Ensure the array size is declared large enough (at least 1005).',
        'Separate elements with a space and end with newline.'
      ],
      timeComplexity: 'O(N^2) time using Selection Sort, O(N) space.'
    },
    starter: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int a[1005];
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);

    // TODO: Sort array 'a' in ascending order using manual Selection Sort
    // Print sorted array separated by space

    return 0;
}`,
    starterJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        // TODO: Selection Sort ascending
    }
}`,
    solutionC: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int a[1005];
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    // Selection Sort
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[min_idx]) {
                min_idx = j;
            }
        }
        int temp = a[i];
        a[i] = a[min_idx];
        a[min_idx] = temp;
    }

    // Print sorted elements
    for (int i = 0; i < n; i++) {
        printf("%d%c", a[i], i == n - 1 ? '\\n' : ' ');
    }

    return 0;
}`,
    solutionJava: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        // Selection Sort
        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[min_idx]) min_idx = j;
            }
            int temp = a[i];
            a[i] = a[min_idx];
            a[min_idx] = temp;
        }

        for (int i = 0; i < n; i++) {
            System.out.print(a[i] + (i == n - 1 ? "\\n" : " "));
        }
    }
}`,
    expectedKeywords: ['for', 'scanf', 'printf']
  }
];
