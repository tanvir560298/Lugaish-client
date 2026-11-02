// Java Practice Engine & In-Browser Code Simulator
// Provides realistic compiler feedback and execution for Java fundamentals.

export const javaMilestones = [
  { id: 'jm-1', title: 'First Java Class', desc: 'Wrote and understood Java class structure & main method' },
  { id: 'jm-2', title: 'Master of Double Quotes', desc: 'Successfully printed text using System.out.println with quotes' },
  { id: 'jm-3', title: 'Multi-Line Printing', desc: 'Printed separate lines with individual println statements' },
  { id: 'jm-4', title: 'Java Explorer', desc: 'Completed hands-on practice problems in the Java Lab' }
];

/**
 * Parses and simulates basic Java code execution in the browser.
 * Focuses on fundamentals: classes, main method, System.out.println, strings, quotes, and newlines.
 */
export function runJavaSimulation(code) {
  if (!code || typeof code !== 'string') {
    return { success: false, errors: ['No code provided.'], output: '' };
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
  const printedOutputs = [];
  // Regular expression to match System.out.println(...) and System.out.print(...)
  const printRegex = /System\.out\.(println|print)\s*\(([\s\S]*?)\)\s*;/g;
  let match;

  while ((match = printRegex.exec(fullCodeWithoutComments)) !== null) {
    const isPrintln = match[1] === 'println';
    const arg = match[2].trim();

    if (arg === '') {
      printedOutputs.push(isPrintln ? '' : '');
      continue;
    }

    // Evaluate argument
    // Handle string literals and concatenation
    const evaluated = evaluateJavaPrintArg(arg);
    printedOutputs.push(evaluated);
  }

  const finalOutput = printedOutputs.join('\n');

  return {
    success: true,
    output: finalOutput,
    errors: [],
    linesCount: printedOutputs.length
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

  // Pure numeric expression: 5 + 3
  if (/^[\d\s+\-*/%()]+$/.test(expr)) {
    try {
      // Safe arithmetic evaluator
      const sanitized = expr.replace(/[^0-9+\-*/%()]/g, '');
      // eslint-disable-next-line no-new-func
      const val = Function(`'use strict'; return (${sanitized})`)();
      return String(val);
    } catch {
      return expr;
    }
  }

  // Fallback: strip quotes if present or return as is
  return expr.replace(/^"|"$/g, '');
}

/**
 * Splits expression by + outside of quotes
 */
function splitConcatenation(expr) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  let escaped = false;

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

    if (ch === '+' && !inQuotes) {
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

  // Specific problem checks
  if (problem.id === 'java01-p1') {
    // Should print name, age, and country
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

  return {
    ok: true,
    message: 'Awesome work! Your Java code compiled and executed perfectly! You mastered the double-quotes printing rule.',
    errors: [],
    output: sim.output
  };
}
