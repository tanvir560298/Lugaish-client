export const javaLoopNotes = [
  {
    title: '1. A counted loop: start, condition, update',
    text: 'A for loop runs its initialization once, checks the condition before each iteration, executes the body, then performs the update. Use it when you know a range or how many values to process. Counting downward requires both a decreasing update and the correct stopping condition.',
    code: 'for (int i = 4; i >= 1; i--) {\n    System.out.println(i);\n}\n// Prints 4, 3, 2, 1 on separate lines.\n// The countdown challenge instead requires one space-separated line.',
    tip: 'Trace i = 4, 3, 2, 1; when i becomes 0 the condition is false. Using i++ here moves away from the stopping point. Never put an accidental semicolon after for (...): that creates an empty loop body.',
    problems: ['rocket-launch-countdown']
  },
  {
    title: '2. Step sizes and clean output',
    text: 'A loop can advance by more than one. Start at 3 and add 3 to visit multiples of three, or examine every value and test i % 3 == 0. Build output with StringBuilder, inserting a separator only before later items, so there is no leading or trailing space.',
    code: 'StringBuilder output = new StringBuilder();\nfor (int i = 3; i <= n; i += 3) {\n    if (output.length() > 0) output.append(" ");\n    output.append(i);\n}\nSystem.out.println(output.length() == 0 ? "NONE" : output.toString());',
    tip: 'For n = 2 there are no iterations and the answer is NONE. For n = 3, include 3: the upper boundary is inclusive. The same separator pattern works for a countdown.',
    problems: ['every-third-lamp', 'rocket-launch-countdown']
  },
  {
    title: '3. Accumulate a total without overflow',
    text: 'Initialize a running total before the loop and add each contribution inside it. Use long for sums of squares up to 100000. Promoting the result after int multiplication is too late: multiply by 1L first, or make the loop variable long.',
    code: 'long total = 0;\nfor (int day = 1; day <= n; day++) {\n    total += 1L * day * day;\n}\n// For n = 4: total changes to 1, 5, 14, 30.\n\nlong evenEnergy = 0;\nfor (int station = 2; station <= n; station += 2) {\n    evenEnergy += 1L * station * station;\n}',
    tip: 'Do not reset total inside the loop, and do not use ^ for squaring: Java uses ^ for XOR. Both loops take O(n) time and O(1) extra space. Test n = 1 and the maximum n, not just a small sample.',
    problems: ['the-growing-coin-jar', 'even-square-energy']
  },
  {
    title: '4. Read exactly N values and classify each one',
    text: 'When the first input is a count, read it once, then read exactly that many measurements. Scanner.nextInt() accepts integers separated by spaces or newlines. Keep separate counters outside the loop and use if / else if / else so each value enters exactly one category.',
    code: 'int positive = 0, negative = 0, zero = 0;\nfor (int i = 0; i < n; i++) {\n    int value = scanner.nextInt();\n    if (value > 0) positive++;\n    else if (value < 0) negative++;\n    else zero++;\n}\n// Check: positive + negative + zero must equal n.',
    tip: 'With i starting at 0, use i < n, not i <= n. The latter attempts to read an extra value. You do not need to store every measurement in an array to count the categories.',
    problems: ['motion-sensor-summary']
  },
  {
    title: '5. Stop on a sentinel and track the maximum',
    text: 'A sentinel is a special input value that means stop, not a real reading. Read a value, check the sentinel, then process it. A while loop fits an unknown number of readings; break immediately exits the nearest loop. Maintain the strong-reading count and peak independently.',
    code: 'int strong = 0, peak = 0;\nwhile (true) {\n    int reading = scanner.nextInt();\n    if (reading == -1) break;\n    if (reading >= 70) strong++;\n    peak = Math.max(peak, reading);\n}',
    tip: 'Here peak = 0 is correct because real readings are nonnegative and the empty-input result must be 0. For general negative-only data, initializing a maximum to 0 would be wrong. Test -1 alone and a reading of exactly 70.',
    problems: ['meteor-signal-monitor']
  },
  {
    title: '6. At least once versus possibly zero times',
    text: 'A do-while loop checks its condition after the body, so it runs at least once. That fits PIN attempts: at least one attempt exists, and the successful attempt counts too. A normal while checks first, which fits battery upgrades: a battery already at its target needs zero cycles.',
    code: 'int attempts = 0;\nint guess;\ndo {\n    guess = scanner.nextInt();\n    attempts++;\n} while (guess != correctPin);\n\nint cycles = 0;\nwhile (energy < target) {\n    energy += gain;\n    cycles++;\n}',
    tip: 'Read correctPin before the attempt loop; it is not an attempt. For the battery, stop at energy >= target, even if you overshoot. gain is guaranteed positive, so the loop makes progress. Test a correct first guess and energy == target.',
    problems: ['secure-terminal-attempts', 'battery-upgrade-cycles']
  },
  {
    title: '7. Compare neighboring characters',
    text: 'To count switches in a signal, compare each character to its predecessor. Start at index 1 so i - 1 is valid. A signal of length n has n - 1 neighboring pairs, not n. Count transitions rather than the number of ones or distinct characters.',
    code: 'int switches = 0;\nfor (int i = 1; i < signal.length(); i++) {\n    if (signal.charAt(i) != signal.charAt(i - 1)) {\n        switches++;\n    }\n}\n// "00110" has two transitions: 0 -> 1 and 1 -> 0.',
    tip: 'A one-character signal has zero switches and the loop correctly runs zero times. Test a constant signal and an alternating signal. Traversal is O(n) time with O(1) extra space.',
    problems: ['digital-signal-switch-counter']
  },
  {
    title: '8. Keep current progress separate from the best result',
    text: 'A streak counts consecutive successful days, not all successful days. Keep current for the streak ending today and best for the longest streak seen so far. Increment current on success, reset it on failure, and update best on every iteration so a streak ending on the last day is counted.',
    code: 'int current = 0, best = 0;\nfor (int day = 0; day < n; day++) {\n    int minutes = scanner.nextInt();\n    if (minutes >= 30) current++;\n    else current = 0;\n    best = Math.max(best, current);\n}\n// 30, 40, 0, 35 gives current = 1, but best = 2.',
    tip: 'Test all unsuccessful days (0), all successful days (n), exactly 30 minutes, and a longest streak at the end. Never reset best when a day fails.',
    problems: ['fitness-streak-analyzer']
  }
];
