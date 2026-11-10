import { useRef, useState } from 'react';
import { BookOpen, Copy, Check, X } from 'lucide-react';

const numberMirror = `#include <stdio.h>

int main(void) {
    int n;

    // Do not print anything before taking input
    scanf("%d", &n);

    // Print the value of n
    printf("%d", n);
}
`;

export function ProblemSolution({ problem }) {
  const dialog = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');
  if (problem.externalUrl !== 'https://www.codechef.com/problems/START01') return null;

  async function copy() {
    try { await navigator.clipboard.writeText(numberMirror); setCopyStatus('Copied'); }
    catch { setCopyStatus('Could not copy. Select the code to copy it.'); }
  }

  return <>
    <button type="button" onClick={() => { setCopyStatus(''); dialog.current.showModal(); }}
      className="mt-2 inline-flex items-center gap-2 rounded-md border border-slate-600 px-3 py-2 text-xs font-semibold text-cyan-400">
      <BookOpen size={14} /> View Solution
    </button>
    <dialog ref={dialog} aria-label="Number Mirror solution in C"
      className="m-auto w-[calc(100%_-_32px)] max-w-xl max-h-[85dvh] overflow-y-auto rounded-lg border border-slate-700 bg-slate-950 p-5 text-left text-slate-100 shadow-xl backdrop:bg-black/60">
      <header className="flex items-start justify-between gap-4">
        <div><h2 className="text-xl font-bold">Number Mirror</h2><p className="mt-1 text-sm text-slate-400">Reference solution by Tanvir · C</p></div>
        <button type="button" aria-label="Close solution" title="Close solution" onClick={() => dialog.current.close()} className="p-2"><X size={20} /></button>
      </header>
      <p className="my-4 text-sm leading-relaxed">Read one integer using <code>scanf</code>, then print the same integer using <code>printf</code>. Do not print a prompt or extra labels: the judge expects only the number.</p>
      <div className="flex items-center justify-between border-b border-slate-700 py-2"><span className="text-xs">main.c</span><button type="button" onClick={copy} aria-label="Copy C solution" title="Copy C solution" className="p-2">{copyStatus === 'Copied' ? <Check size={16} /> : <Copy size={16} />}</button></div>
      <pre className="overflow-x-auto py-4 text-sm leading-6"><code>{numberMirror}</code></pre>
      <p role="status" className="text-xs text-cyan-400">{copyStatus}</p>
      <p className="mt-3 text-xs text-slate-400">Example: input 42 produces 42. Time O(1), extra space O(1). This is C code; choose C when submitting on CodeChef.</p>
    </dialog>
  </>;
}
