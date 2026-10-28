// Interactive Practice & Verification for C Programming
// Simulates C standard I/O (printf, basic syntax validation) in the browser

export function runCSimulation(code) {
  const errors = [];
  const outputLines = [];

  // 1. Basic C syntax checks
  if (!code.includes('#include')) {
    errors.push('Missing #include <stdio.h> header');
  }
  if (!code.includes('main')) {
    errors.push('Missing int main() function');
  }

  // 2. Extract printf contents to simulate standard output
  // Supports printf("Hello, World!\n"); or printf("Age: %d\n", age);
  const printfRegex = /printf\s*\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*(?:,\s*([^)]+))?\s*\)\s*;/g;
  let match;
  let hasPrint = false;

  while ((match = printfRegex.exec(code)) !== null) {
    hasPrint = true;
    let formatStr = match[1];
    const args = match[2] ? match[2].split(',').map(s => s.trim()) : [];

    // Replace basic format specifiers with arg values if simple variable assignment is found
    if (args.length > 0) {
      args.forEach(arg => {
        // find simple declaration like int x = 20;
        const varRegex = new RegExp(`(?:int|float|double|char)\\s+${arg}\\s*=\\s*([^;]+);`);
        const varMatch = code.match(varRegex);
        const val = varMatch ? varMatch[1].trim() : arg;
        formatStr = formatStr.replace(/%[difs]/, val);
      });
    }

    // Process escape sequences
    const unescaped = formatStr.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    outputLines.push(unescaped);
  }

  const output = outputLines.join('');
  return {
    success: errors.length === 0,
    output: output.trim(),
    hasPrint,
    errors
  };
}

export function checkCPractice(problem, code) {
  if (!code || !code.trim()) {
    return { ok: false, message: 'Please write some code before checking.' };
  }

  if (code.trim() === problem.starter.trim()) {
    return { ok: false, message: 'Make changes to solve the problem before checking your solution.' };
  }

  const result = runCSimulation(code);

  if (!result.success) {
    return { ok: false, message: result.errors[0] || 'Check your code structure.' };
  }

  // Verify expected keywords
  if (problem.expectedKeywords) {
    for (const kw of problem.expectedKeywords) {
      if (!code.includes(kw)) {
        return { ok: false, message: `Your program should include "${kw}".` };
      }
    }
  }

  // Verify expected output if defined
  if (problem.sampleOutput) {
    const cleanOutput = result.output.replace(/\r\n/g, '\n').trim();
    const cleanExpected = problem.sampleOutput.replace(/\r\n/g, '\n').trim();
    if (cleanOutput !== cleanExpected) {
      return {
        ok: false,
        message: `Output mismatch. Expected: "${cleanExpected}", but got: "${cleanOutput}"`,
        output: result.output
      };
    }
  }

  return {
    ok: true,
    message: '✓ Excellent! Your C program ran successfully and matched the expected output!',
    output: result.output
  };
}

export const cMilestones = [
  { name: 'First Compile', description: 'Setup, syntax & your first printf program', ids: ['01'] },
  { name: 'Control Flow', description: 'Variables, inputs and decision logic', ids: ['02', '03'] },
  { name: 'Mastering Loops', description: 'Repetition and sequence automation', ids: ['04'] },
  { name: 'Code Architecture', description: 'Modular functions, arrays and memory', ids: ['05', '06', '07'] },
];
