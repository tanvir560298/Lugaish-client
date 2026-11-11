export const javaStringNotes = [
  {
    title: '1. Read the right amount of text',
    text: 'String stores text in double quotes; char stores a single character in single quotes. Scanner.next() reads one whitespace-separated token, while nextLine() reads the rest of the current line, including spaces. Use nextLine() for banners and announcements. Do not trim text when spaces count toward the answer.',
    code: 'String banner = scanner.nextLine();\nint size = banner.length();\n// "Blue sky ahead" has length 14, including two spaces.\n\n// For two space-separated names instead:\nString firstName = scanner.next();\nString lastName = scanner.next();',
    tip: 'After nextInt(), nextLine() may read only the remainder of that numeric line. Consume that remainder once before reading a new full line. Do not add an extra nextLine() when you are already reading lines: it would skip real input.',
    problems: ['poster-width-counter', 'creator-handle-generator']
  },
  {
    title: '2. Length and zero-based positions',
    text: 'Use length() for the number of UTF-16 code units and charAt(index) for the code unit at a position. In these English/ASCII exercises, each character occupies one code unit. The first index is 0 and the last is length() - 1. Index length() is outside the string.',
    code: 'String code = "ORBIT";\nint size = code.length();              // 5\nchar first = code.charAt(0);           // O\nchar middle = code.charAt(2);          // B\nchar last = code.charAt(size - 1);     // T',
    tip: 'Treasure Symbol Locator guarantees a valid index. Do not subtract 1 from its input: the given index is already zero-based. Outside ASCII, an emoji can occupy two UTF-16 code units, so length() is not always the number of visible symbols.',
    problems: ['treasure-symbol-locator', 'poster-width-counter']
  },
  {
    title: '3. Find a sequence, including when it is missing',
    text: 'indexOf(text) returns the starting index of the first matching sequence, or -1 when absent. The search is case-sensitive. contains(text) gives only a boolean. Neither method requires a whole-word match: a sequence inside a longer word also matches.',
    code: 'String description = "Meet at north gate";\nint found = description.indexOf("north");  // 8\nint missing = description.indexOf("North"); // -1\nboolean present = description.contains("gate"); // true',
    tip: 'A match at index 0 is valid. Test index >= 0, not index > 0. Library Keyword Search asks for the first match, not the last one, and does not ask you to ignore capitalization.',
    problems: ['library-keyword-search']
  },
  {
    title: '4. Extract text with substring',
    text: 'substring(start, end) includes start but excludes end. substring(start) takes everything from start to the end. Find the delimiter rather than assuming it always appears at the same position. The bounds must satisfy 0 <= start <= end <= length().',
    code: 'String label = "WEST-0072";\nint dash = label.indexOf("-");\nString area = label.substring(0, dash);  // WEST\nString serial = label.substring(dash + 1); // 0072',
    tip: 'The shipping problem guarantees exactly one hyphen and nonempty parts. Keeping the serial as a String preserves leading zeros. For unrestricted input, check dash != -1 before extracting.',
    problems: ['shipping-label-split']
  },
  {
    title: '5. Change case and join text',
    text: 'Strings are immutable: methods such as toLowerCase() return a result instead of changing the original variable. Store or print that result. Use Locale.ROOT for predictable English case conversion regardless of the computer locale. The + operator joins strings and preserves the punctuation you supply.',
    code: 'String announcement = "Java Is Fun";\nString upper = announcement.toUpperCase(java.util.Locale.ROOT);\nString lower = announcement.toLowerCase(java.util.Locale.ROOT);\n// announcement is still "Java Is Fun".\n\nString first = "Mira".toLowerCase(java.util.Locale.ROOT);\nString last = "Stone".toLowerCase(java.util.Locale.ROOT);\nString handle = "@" + first + "." + last; // @mira.stone',
    tip: 'Do not remove spaces from announcements. For the handle, use exactly one @ and one dot, with no added spaces. Follow the required SHOUT:, WHISPER: and Tag: output labels.',
    problems: ['festival-announcement-modes', 'creator-handle-generator']
  },
  {
    title: '6. Compare contents, not object references',
    text: 'Use equals() to compare string contents. == compares whether references point to the same object; it is not a reliable content comparison. equals() is case-sensitive. equalsIgnoreCase() is only appropriate when the problem explicitly allows capitalization differences.',
    code: 'String official = "SkyFox";\nString entered = "skyfox";\nboolean exact = official.equals(entered); // false\nboolean ignoringCase = official.equalsIgnoreCase(entered); // true\n\nif (exact) {\n    System.out.println("MATCH");\n} else {\n    System.out.println("DIFFERENT");\n}',
    tip: 'Team Code Equality requires exact capitalization. Lowercasing both codes or using equalsIgnoreCase() would incorrectly accept a mismatched code.',
    problems: ['team-code-equality']
  },
  {
    title: '7. Combine string methods with decisions',
    text: 'For Emergency Bulletin Classifier, keep the original message for its length and normalize a copy for the case-insensitive search. First determine whether DANGER occurs; then apply the length threshold. A long message without the sequence is still NORMAL.',
    code: 'String searchable = message.toUpperCase(java.util.Locale.ROOT);\nboolean hasDanger = searchable.contains("DANGER");\nboolean longEnough = message.length() >= 15;\n// hasDanger && longEnough: HIGH_PRIORITY\n// hasDanger only: SHORT_ALERT\n// no DANGER sequence: NORMAL',
    tip: 'Test lengths 14 and 15, mixed case, an absent sequence, and a sequence inside a larger word. "endangered" contains "danger" after case normalization, so it is not NORMAL. Spaces count; do not split the message into words to measure its length.',
    problems: ['emergency-bulletin-classifier']
  }
];
