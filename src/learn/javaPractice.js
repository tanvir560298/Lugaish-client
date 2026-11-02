// Java Practice Engine & In-Browser Code Simulator
// Provides realistic compiler feedback and execution for Java fundamentals.

export const javaMilestones = [
  { id: 'jm-1', title: 'First Java Class', desc: 'Wrote and understood Java class structure & main method' },
  { id: 'jm-2', title: 'Master of Double Quotes', desc: 'Successfully printed text using System.out.println with quotes' },
  { id: 'jm-3', title: 'Multi-Line Printing', desc: 'Printed separate lines with individual println statements' },
  { id: 'jm-4', title: 'Operator & Pattern Master', desc: 'Mastered arithmetic precedence, print vs println, and pattern designs' }
];

/**
 * Parses and simulates basic Java code execution in the browser.
 * Focuses on fundamentals: classes, main method, System.out.println, System.out.print,
 * strings, quotes, operators, and pattern designs.
 */
export function runJavaSimulation(code) {
  if (!code || typeof code !== 'string') {
    return { success: false, errors: ['No code provided.'], output: '', linesCount: 0 };
  }

  const errors = [];
  const lines = code.split('\n');

  // Strip single-line comments for syntax analysis, but keep track of line numbers
  const cleanedLines = lines.map(line => {
    const commentIdx = line.indexOf('//');
    return commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  });

  const fullCodeWithoutComments = cleanedLines.join('\n');

  // Check brace balance
  let openBraces = 0;
  let closeBraces = 0;
  for (const ch of fullCodeWithoutComments) {
    if (ch === '{') openBraces++;
    if (ch === '}') closeBraces++;
  }

  if (openBraces === 0) {
    errors.push("Missing class body: Java code must be enclosed inside curly braces '{' and '}'.");
  } else if (openBraces > closeBraces) {
    errors.push(`Syntax error: Missing closing brace '}'. Found ${openBraces} open '{' and ${closeBraces} close '}'.`);
  } else if (closeBraces > openBraces) {
    errors.push(`Syntax error: Unexpected extra closing brace '}'.`);
  }

  // Check class definition
  const classMatch = fullCodeWithoutComments.match(/\b(public\s+)?class\s+([A-Za-z_][A-Za-z0-9_]*)/);
  if (!classMatch) {
    errors.push("Java compilation error: Class declaration missing. Expected 'public class <Name> { ... }'.");
  }

  // Check main method
  const mainMatch = fullCodeWithoutComments.match(/public\s+static\s+void\s+main\s*\(\s*String\s*(\[\]\s*[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_][A-Za-z0-9_]*\s*\[\]|\.\.\.\s*[A-Za-z_][A-Za-z0-9_]*)\s*\)/);
  if (!mainMatch) {
    errors.push("Error: Main method not found in class. Please define the main method as:\n   public static void main(String[] args)");
  }

  // Check statement semicolons
  cleanedLines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();
    if (!trimmed) return;
    // Lines that start statements and should end with semicolon
    if (trimmed.startsWith('System.out.print') || trimmed.startsWith('int ') || trimmed.startsWith('String ') || trimmed.startsWith('double ')) {
      if (!trimmed.endsWith(';')) {
        errors.push(`Line ${idx + 1}: Syntax error: ';' expected at end of statement.`);
      }
    }
  });

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      output: '',
      linesCount: 0
    };
  }

  // Simulate print statements execution
  const outputLines = [];
  let currentLine = '';
  const printRegex = /System\.out\.(println|print)\s*\(([\s\S]*?)\)\s*;/g;
  let match;

  while ((match = printRegex.exec(fullCodeWithoutComments)) !== null) {
    const isPrintln = match[1] === 'println';
    const arg = match[2].trim();

    if (arg === '') {
      if (isPrintln) {
        outputLines.push(currentLine);
        currentLine = '';
      }
      continue;
    }

    const evaluated = evaluateJavaPrintArg(arg);
    currentLine += evaluated;

    if (isPrintln) {
      outputLines.push(currentLine);
      currentLine = '';
    }
  }

  if (currentLine) {
    outputLines.push(currentLine);
  }

  const finalOutput = outputLines.join('\n');

  return {
    success: true,
    output: finalOutput,
    errors: [],
    linesCount: outputLines.length
  };
}

/**
 * Evaluates Java print argument expressions (strings, numbers, simple concatenations).
 */
function evaluateJavaPrintArg(expr) {
  // If argument is enclosed in double quotes: "Hello World"
  if (/^"([^"\\]|\\.)*"$/.test(expr)) {
    return expr.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  // Handle concatenation of literals: "Age: " + 22 or "Name" + " " + "Tanvir"
  const parts = splitConcatenation(expr);
  if (parts.length > 1) {
    return parts.map(part => evaluateJavaPrintArg(part.trim())).join('');
  }

  // Arithmetic expression with parentheses or operators: (5 * 6 / 7 % 3) or 1 + 2
  const cleanedExpr = expr.replace(/^\(|\)$/g, '').trim();
  if (/^[\d\s+\-*/%()]+$/.test(cleanedExpr)) {
    try {
      // Evaluate integer arithmetic adhering to Java integer division
      const val = evaluateJavaIntArithmetic(cleanedExpr);
      return String(val);
    } catch {
      return expr;
    }
  }

  // Fallback: strip outer quotes if present or return as is
  return expr.replace(/^"|"$/g, '');
}

/**
 * Evaluates integer arithmetic with Java integer truncation & precedence semantics
 */
function evaluateJavaIntArithmetic(expr) {
  let clean = expr;
  // Handle parentheses first
  while (clean.includes('(')) {
    clean = clean.replace(/\(([^()]+)\)/g, (_, inner) => evaluateJavaIntArithmetic(inner));
  }

  const tokens = [];
  const regex = /\s*([0-9]+|[+\-*/%])\s*/g;
  let m;
  while ((m = regex.exec(clean)) !== null) {
    tokens.push(m[1]);
  }
  if (!tokens.length) return 0;

  // First pass: left-to-right for * / %
  const pass1 = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === '*' || t === '/' || t === '%') {
      const prev = Number(pass1.pop());
      const next = Number(tokens[i + 1]);
      let res = 0;
      if (t === '*') res = prev * next;
      else if (t === '/') res = next === 0 ? 0 : Math.trunc(prev / next);
      else if (t === '%') res = next === 0 ? 0 : Math.trunc(prev % next);
      pass1.push(res);
      i += 2;
    } else {
      pass1.push(t);
      i++;
    }
  }

  // Second pass: left-to-right for + -
  let result = Number(pass1[0]);
  let j = 1;
  while (j < pass1.length) {
    const op = pass1[j];
    const nextVal = Number(pass1[j + 1]);
    if (op === '+') result += nextVal;
    if (op === '-') result -= nextVal;
    j += 2;
  }
  return result;
}

/**
 * Splits expression by + outside of quotes
 */
function splitConcatenation(expr) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  let escaped = false;
  let parenDepth = 0;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '\\' && inQuotes) {
      escaped = !escaped;
      current += ch;
      continue;
    }
    if (ch === '"' && !escaped) {
      inQuotes = !inQuotes;
      current += ch;
      continue;
    }
    escaped = false;

    if (!inQuotes) {
      if (ch === '(') parenDepth++;
      if (ch === ')') parenDepth--;
    }

    if (ch === '+' && !inQuotes && parenDepth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) {
    parts.push(current);
  }
  return parts;
}

/**
 * Checks student code against a specific practice problem
 */
export function checkJavaPractice(problem, code) {
  const sim = runJavaSimulation(code);

  if (!sim.success) {
    return {
      ok: false,
      message: 'Compilation Failed! Check the compiler errors in the terminal below.',
      errors: sim.errors,
      output: ''
    };
  }

  // Check expected keywords
  if (problem.expectedKeywords) {
    for (const kw of problem.expectedKeywords) {
      if (!code.includes(kw)) {
        return {
          ok: false,
          message: `Code check: Missing required Java keyword or statement: '${kw}'.`,
          errors: [`Make sure your code includes '${kw}'.`],
          output: sim.output
        };
      }
    }
  }

  // Check min lines printed
  if (problem.minPrintLines && sim.linesCount < problem.minPrintLines) {
    return {
      ok: false,
      message: `Expected at least ${problem.minPrintLines} lines of output, but only ${sim.linesCount} line(s) were printed. Remember each println prints on a separate line!`,
      errors: [`Only ${sim.linesCount} line(s) printed. Try using System.out.println() for each required line.`],
      output: sim.output
    };
  }

  // Specific problem checks for Class 01
  if (problem.id === 'java01-p1') {
    const hasName = /name|tanvir|ahmad|[a-zA-Z]+/i.test(sim.output);
    const hasAge = /\d+/.test(sim.output);
    const hasCountry = /bangladesh|country|[a-zA-Z]+/i.test(sim.output);

    if (!hasName || !hasAge || !hasCountry || sim.linesCount < 3) {
      return {
        ok: false,
        message: 'Your program should print your name on line 1, age on line 2, and country on line 3.',
        errors: ['Make sure you have 3 separate System.out.println statements for name, age, and country.'],
        output: sim.output
      };
    }
  }

  if (problem.id === 'java01-p2') {
    if (!/hello/i.test(sim.output) || !/lugaish|portal/i.test(sim.output)) {
      return {
        ok: false,
        message: 'Please make sure to print "Hello, Java!" and "Welcome to Lugaish Learning Portal!".',
        errors: ['Check spelling and double quotes in your System.out.println statements.'],
        output: sim.output
      };
    }
  }

  // Specific problem checks for Class 02
  if (problem.id === 'java02-p1') {
    // Triangle pattern with asterisks
    if (!sim.output.includes('*') || sim.linesCount < 3) {
      return {
        ok: false,
        message: 'Please print a 3-line triangle pattern using asterisks (*).',
        errors: ['Each line should contain increasing numbers of asterisks.'],
        output: sim.output
      };
    }
  }

  if (problem.id === 'java02-p2') {
    // Diamond or shape pattern
    if (!sim.output.includes('*') || sim.linesCount < 3) {
      return {
        ok: false,
        message: 'Please print the asterisk diamond/shape pattern shown in Class 02.',
        errors: ['Use System.out.println() with spaced asterisks to form the shape.'],
        output: sim.output
      };
    }
  }

  if (problem.id === 'java02-p3') {
    // Precedence calculation: 5 * 6 / 7 % 3 = 1
    if (!sim.output.includes('1')) {
      return {
        ok: false,
        message: 'The arithmetic expression 5 * 6 / 7 % 3 should evaluate to 1.',
        errors: ['Check your expression: (5 * 6 / 7 % 3). Remember * / % are evaluated left-to-right.'],
        output: sim.output
      };
    }
  }

  return {
    ok: true,
    message: 'Awesome work! Your Java code compiled and executed perfectly! You mastered the concept.',
    errors: [],
    output: sim.output
  };
}
