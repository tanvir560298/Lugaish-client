import { useState } from "react";
import { Code, Play, Sparkles, Copy, Check, AlertCircle, HelpCircle } from "lucide-react";
import { novyraClient } from "./novyraClient.js";
import { useNovyra } from "./NovyraContext.jsx";

const CODE_PRESETS = {
  java: {
    title: "Java Loop Off-By-One Bug",
    code: `public class LoopExercise {
    public static void main(String[] args) {
        int[] scores = {95, 88, 72, 90, 85};
        
        // Student attempt: print all scores
        for (int i = 0; i <= scores.length; i++) {
            System.out.println("Score " + i + ": " + scores[i]);
        }
    }
}`,
    question: "Why does this throw an ArrayIndexOutOfBoundsException on runtime?",
  },
  c: {
    title: "C Pointer & Dynamic Allocation",
    code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int* ptr = (int*)malloc(5 * sizeof(int));
    if (ptr == NULL) return 1;

    for (int i = 0; i < 5; i++) {
        *(ptr + i) = (i + 1) * 10;
        printf("%d ", *(ptr + i));
    }
    printf("\\n");

    // What is missing before the program exits?
    return 0;
}`,
    question: "Are there any memory leaks or unsafe pointer operations in this snippet?",
  },
  python: {
    title: "Python Mutable Default Argument",
    code: `def add_student(name, roster=[]):
    roster.append(name)
    return roster

print(add_student("Alice")) # ['Alice']
print(add_student("Bob"))   # What will this output?`,
    question: "Why does the second call return ['Alice', 'Bob'] instead of just ['Bob']?",
  },
  javascript: {
    title: "JavaScript Async Loop Closure",
    code: `function scheduleAlerts() {
    for (var i = 1; i <= 3; i++) {
        setTimeout(function() {
            console.log("Tick: " + i);
        }, i * 1000);
    }
}

scheduleAlerts();`,
    question: "Why does this print 'Tick: 4' three times instead of 1, 2, 3?",
  },
};

export function CodeMentorView() {
  const { setAvatarState } = useNovyra();
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(CODE_PRESETS.java.code);
  const [question, setQuestion] = useState(CODE_PRESETS.java.question);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (langKey) => {
    setLanguage(langKey);
    const preset = CODE_PRESETS[langKey];
    if (preset) {
      setCode(preset.code);
      setQuestion(preset.question);
    }
    setAnalysisResult(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setAvatarState("thinking");

    try {
      const res = await novyraClient.analyzeCode({
        language,
        code,
        question: question.trim(),
      });
      setAnalysisResult(res?.analysis || "Analysis completed.");
      setAvatarState("responding");
    } catch (err) {
      setAnalysisResult(`Failed to analyze code: ${err.message}`);
      setAvatarState("idle");
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAvatarState("idle"), 4000);
    }
  };

  const handleCopyAnalysis = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 mb-2">
            <Code className="w-3.5 h-3.5" />
            <span>Programming Mentor & Diagnostics</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Guided Code Mentorship</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Novyra inspects syntax, logic traps, and algorithmic complexity, providing pedagogical hints before giving solutions.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {["java", "c", "python", "javascript"].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleSelectPreset(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                language === lang
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Question Form */}
      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span>Code Snippet</span>
              <span className="text-[10px] text-slate-400 normal-case font-normal">
                (Safe static evaluation • Untrusted code is never executed)
              </span>
            </label>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              {language}
            </span>
          </div>

          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={10}
              className="w-full p-4 bg-transparent text-emerald-400 dark:text-emerald-300 placeholder:text-slate-600 focus:outline-none resize-y selection:bg-indigo-600 selection:text-white"
              placeholder="// Paste your code snippet here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Specific Question or Error Message (Optional)
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How do I fix the loop condition? or Why am I getting this memory leak?"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !code.trim()}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Novyra is Diagnosing Your Code...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Analyze & Diagnose Code</span>
            </>
          )}
        </button>
      </form>

      {/* Analysis Output Pane */}
      {analysisResult && (
        <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Novyra Mentorship Analysis</span>
            </div>
            <button
              type="button"
              onClick={handleCopyAnalysis}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
            {analysisResult}
          </div>
        </div>
      )}
    </div>
  );
}
