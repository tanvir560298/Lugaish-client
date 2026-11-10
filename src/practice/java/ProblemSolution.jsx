import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Copy, Check, X } from 'lucide-react';
import './problemSolution.css';

const numberMirror = `#include <stdio.h>

int main(void) {
    int n;

    // Do not print anything before taking input
    scanf("%d", &n);

    // Print the value of n
    printf("%d", n);
}
`;

const solutions = {
  'https://www.codechef.com/problems/START01': {
    language: 'C', file: 'main.c', code: numberMirror,
    explanation: 'Read one integer using scanf, then print the same integer using printf. Do not print a prompt or extra labels: the judge expects only the number.',
    note: 'Example: input 42 produces 42. Time O(1), extra space O(1). Choose C when submitting on CodeChef.'
  },
  'https://www.hackerrank.com/challenges/java-stdin-and-stdout-1/problem': {
    language: 'Java', file: 'Solution.java',
    code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int a = scan.nextInt();
        int b = scan.nextInt();
        int c = scan.nextInt();

        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
    }
}
`,
    explanation: 'Read three integers with Scanner.nextInt(). Each System.out.println prints one integer followed by a new line, preserving the input order. Input integers may be separated by spaces or new lines.',
    note: 'Example: input 42 100 125 produces 42, 100, and 125 on three separate lines. Time O(1), extra space O(1). Keep the class name Solution for HackerRank.'
  },
  'https://www.hackerrank.com/challenges/java-stdin-stdout/problem': {
    language: 'Java', file: 'Solution.java',
    code: `import java.util.Scanner;

public class Solution {

    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int i = scan.nextInt();
        double d = scan.nextDouble();
        scan.nextLine();
        String s = scan.nextLine();
        // Write your code here.

        System.out.println("String: " + s);
        System.out.println("Double: " + d);
        System.out.println("Int: " + i);
    }
}
`,
    explanation: 'Read an integer with nextInt() and a double with nextDouble(). Because nextDouble() does not consume the trailing newline character, call scan.nextLine() once to clear the newline buffer before reading the full line String with scan.nextLine(). Finally, print String, Double, and Int in the required format.',
    note: "Sample input with 42, 3.1415, and a sentence correctly preserves the entire line. Time O(1), extra space O(1)."
  }
};

export function ProblemSolution({ problem }) {
  const dialog = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');
  const solution = solutions[problem.externalUrl];
  if (!solution) return null;

  async function copy() {
    try { await navigator.clipboard.writeText(solution.code); setCopyStatus('Copied'); }
    catch { setCopyStatus('Could not copy. Select the code to copy it.'); }
  }

  return <>
    <button type="button" onClick={() => { setCopyStatus(''); dialog.current.showModal(); }}
      className="problem-solution-trigger">
      <BookOpen size={14} /> View Solution
    </button>
    {createPortal(<dialog ref={dialog} aria-label={`${problem.title} solution in ${solution.language}`}
      className="problem-solution-dialog"
      onClick={event => { if (event.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current.close(); } }}>
      <header className="flex items-start justify-between gap-4">
        <div><h2 className="text-xl font-bold">{problem.title}</h2><p className="mt-1 text-sm text-slate-400">Reference solution by Tanvir · {solution.language}</p></div>
        <button type="button" aria-label="Close solution" title="Close solution" onClick={() => dialog.current.close()} className="p-2"><X size={20} /></button>
      </header>
      <p className="my-4 text-sm leading-relaxed">{solution.explanation}</p>
      <div className="flex items-center justify-between border-b border-slate-700 py-2"><span className="text-xs">{solution.file}</span><button type="button" onClick={copy} aria-label={`Copy ${solution.language} solution`} title={`Copy ${solution.language} solution`} className="p-2">{copyStatus === 'Copied' ? <Check size={16} /> : <Copy size={16} />}</button></div>
      <pre className="overflow-x-auto py-4 text-sm leading-6"><code>{solution.code}</code></pre>
      <p role="status" className="text-xs text-cyan-400">{copyStatus}</p>
      <p className="mt-3 text-xs text-slate-400">{solution.note}</p>
    </dialog>, document.body)}
  </>;
}
