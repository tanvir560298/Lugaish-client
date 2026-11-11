import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Cpu,
  ArrowLeft,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileCode,
  Info
} from 'lucide-react';
import {
  fetchProblemDetail,
  fetchTopicProblems,
  runJavaCode,
  submitJavaSolution,
  isProblemSolved
} from './javaPracticeClient.js';
import {
  DEFAULT_JAVA_STARTER,
  TOPIC_1_METADATA,
  TOPIC_2_METADATA,
  TOPIC_METADATA_MAP
} from './javaPracticeData.js';

export function JavaProblemSolverPage() {
  const { topicSlug = 'basic-io-variables', problemSlug } = useParams();
  const navigate = useNavigate();

  const currentTopic = TOPIC_METADATA_MAP?.[topicSlug] || TOPIC_1_METADATA;
  const topicNum = currentTopic.id ? currentTopic.id.replace('topic-', '') : '01';
  const coursePath = `/learn/java-programming/${topicNum}`;
  const allProblemsPath = `/practice/java/${topicSlug}`;

  const [problem, setProblem] = useState(null);
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor State
  const [code, setCode] = useState(DEFAULT_JAVA_STARTER);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'input' | 'verdict'

  // Execution & Submission State
  const [executing, setExecuting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [solved, setSolved] = useState(false);

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState(null);

  const editorRef = useRef(null);
  const resultVersion = useRef(0);

  function clearResults() {
    resultVersion.current += 1;
    setRunResult(null);
    setSubmitResult(null);
    setExecuting(false);
    setSubmitting(false);
    setActiveTab('output');
  }

  function updateCode(value) {
    clearResults();
    setCode(value);
  }

  // Load problem details
  useEffect(() => {
    let isMounted = true;
    clearResults();
    setProblem(null);
    setSolved(false);
    setCustomInput('');
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const prob = await fetchProblemDetail(topicSlug, problemSlug);
        if (!isMounted) return;

        if (!prob) {
          setError(`Problem '${problemSlug}' could not be found.`);
          setLoading(false);
          return;
        }

        if (prob.problemType === 'external' && (!prob.sampleTestCases || prob.sampleTestCases.length === 0)) {
          if (prob.externalUrl) {
            window.location.replace(prob.externalUrl);
            return;
          }
          navigate(allProblemsPath, { replace: true });
          return;
        }

        setProblem(prob);
        setCode(prob.starterCode || DEFAULT_JAVA_STARTER);
        setSolved(isProblemSolved(prob.id));

        // Set default custom input from sample 1 if present
        if (prob.sampleTestCases && prob.sampleTestCases.length > 0) {
          setCustomInput(prob.sampleTestCases[0].input || '');
        }

        document.title = `${prob.title} — Java Practice | Lugaish`;

        // Fetch sibling problems for prev/next navigation
        const listData = await fetchTopicProblems(topicSlug);
        if (isMounted && listData?.problems) {
          setAllProblems(listData.problems.filter((p) => p.problemType === 'lugaish'));
        }
      } catch (err) {
        console.error('Failed to load problem:', err);
        if (isMounted) setError('Failed to load problem. Please check your connection.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
      resultVersion.current += 1;
    };
  }, [problemSlug]);

  // Compute Prev / Next problem
  const { prevProblem, nextProblem } = useMemo(() => {
    if (!problem || allProblems.length === 0) return { prevProblem: null, nextProblem: null };
    const idx = allProblems.findIndex((p) => p.id === problem.id || p.slug === problem.slug);
    return {
      prevProblem: idx > 0 ? allProblems[idx - 1] : null,
      nextProblem: idx >= 0 && idx < allProblems.length - 1 ? allProblems[idx + 1] : null
    };
  }, [problem, allProblems]);

  // Handle Tab key in Code Area
  const handleEditorKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = code;
      const nextCode = val.substring(0, start) + '    ' + val.substring(end);
      updateCode(nextCode);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
        }
      }, 0);
    } else if (e.key === 'Enter') {
      const textarea = e.target;
      const start = textarea.selectionStart;
      const currentLine = code.substring(0, start).split('\n').pop();
      const match = currentLine.match(/^\s*/);
      let indent = match ? match[0] : '';
      if (currentLine.trim().endsWith('{')) {
        indent += '    ';
      }
      if (indent.length > 0) {
        e.preventDefault();
        const nextCode = code.substring(0, start) + '\n' + indent + code.substring(start);
        updateCode(nextCode);
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 1 + indent.length;
          }
        }, 0);
      }
    }
  };

  // Reset Code
  const handleResetCode = () => {
    if (window.confirm('Reset code to default template?')) {
      updateCode(problem?.starterCode || DEFAULT_JAVA_STARTER);
      setRunResult(null);
      setSubmitResult(null);
    }
  };

  // Run Code
  const handleRunCode = async () => {
    if (executing || submitting) return;
    const version = ++resultVersion.current;
    setExecuting(true);
    setRunResult(null);
    setSubmitResult(null);
    setActiveTab('output');

    try {
      const stdinToUse = showCustomInput
        ? customInput
        : problem?.sampleTestCases?.[0]?.input || '';

      const result = await runJavaCode({
        sourceCode: code,
        stdin: stdinToUse
      });
      if (version !== resultVersion.current) return;
      setRunResult(result);
    } catch (err) {
      if (version !== resultVersion.current) return;
      setRunResult({
        success: false,
        verdict: 'Execution Service Unavailable',
        stderr: 'Failed to run code. Please try again.'
      });
    } finally {
      if (version === resultVersion.current) setExecuting(false);
    }
  };

  // Submit Solution
  const handleSubmitSolution = async () => {
    if (executing || submitting || !problem) return;
    const version = ++resultVersion.current;
    setSubmitting(true);
    setSubmitResult(null);
    setRunResult(null);
    setActiveTab('verdict');

    try {
      const result = await submitJavaSolution({
        topicSlug: topicSlug || problem.categorySlug || 'basic-io-variables',
        problemId: problem.id,
        sourceCode: code
      });

      if (version !== resultVersion.current) return;
      setSubmitResult(result);
      if (result?.success && result?.verdict === 'Accepted') {
        setSolved(true);
      }
    } catch (err) {
      if (version !== resultVersion.current) return;
      setSubmitResult({
        success: false,
        verdict: 'Execution Service Unavailable',
        message: 'Could not connect to evaluation judge. Please retry.'
      });
    } finally {
      if (version === resultVersion.current) setSubmitting(false);
    }
  };

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Line numbers calculation
  const lineCount = useMemo(() => {
    return Math.max(code.split('\n').length, 14);
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center py-20 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300 font-medium">Loading Java Workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-2xl mx-auto text-center">
        <div className="section-card p-8 rounded-2xl border border-rose-500/30 bg-rose-500/5">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Problem Not Available</h2>
          <p className="text-slate-300 text-sm mb-6">{error || 'This problem is not currently published.'}</p>
          <div className="flex justify-center gap-3">
            <Link
              to={coursePath}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Java Course
            </Link>
            <Link
              to={allProblemsPath}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              All Problems
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 px-3 sm:px-6 lg:px-8 max-w-[1700px] mx-auto">
      {/* Top Bar with Navigation & Solved Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <Link
            to={coursePath}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50"
            title={`Return to ${currentTopic.title} in Java Programming Course`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Java Course
          </Link>
          <Link
            to={allProblemsPath}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
          >
            All Problems
          </Link>
          <div className="hidden sm:block text-slate-600">|</div>
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            Java • {currentTopic.title}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {solved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> Solved
            </span>
          )}

          {prevProblem && (
            <Link
              to={`/practice/java/${topicSlug}/${prevProblem.slug || prevProblem.id}`}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              title={`Previous: ${prevProblem.title}`}
            >
              ← Prev
            </Link>
          )}

          {nextProblem && (
            <Link
              to={`/practice/java/${topicSlug}/${nextProblem.slug || nextProblem.id}`}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              title={`Next: ${nextProblem.title}`}
            >
              Next →
            </Link>
          )}
        </div>
      </div>

      {/* Main Split Layout: Desktop 2-column, Mobile stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Problem Statement (5 columns on large screens) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="section-card rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                #{problem.number || problem.id}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  problem.difficulty === 'Hard'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : problem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {problem.difficulty || 'Easy'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {problem.timeLimit || 3}s
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> {Math.round((problem.memoryLimit || 128000) / 1000)}MB
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white mb-4">
              {problem.title}
            </h1>

            {/* Problem Statement */}
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-6 border-b border-slate-800 pb-5">
              {problem.description}
            </div>

            {/* Input Format */}
            {problem.inputFormat && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Input Format
                </h2>
                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                  {problem.inputFormat}
                </div>
              </div>
            )}

            {/* Output Format */}
            {problem.outputFormat && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Output Format
                </h2>
                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                  {problem.outputFormat}
                </div>
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Constraints
                </h2>
                <div className="text-xs text-slate-300 font-mono bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed whitespace-pre-wrap">
                  {problem.constraints}
                </div>
              </div>
            )}

            {/* Sample Test Cases */}
            {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sample Test Cases
                </h2>
                {problem.sampleTestCases.map((tc, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-3"
                  >
                    <div className="text-xs font-bold text-slate-400">
                      Sample #{index + 1}
                    </div>

                    {/* Sample Input */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
                        <span>Input:</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(tc.input || '', `in-${index}`)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === `in-${index}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-xs bg-slate-900/90 text-amber-200 p-2.5 rounded-lg border border-slate-800/80 overflow-x-auto">
                        {tc.input !== '' ? tc.input : '<No Input>'}
                      </pre>
                    </div>

                    {/* Sample Output */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
                        <span>Expected Output:</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(tc.expectedOutput || '', `out-${index}`)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === `out-${index}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-xs bg-slate-900/90 text-emerald-300 p-2.5 rounded-lg border border-slate-800/80 overflow-x-auto whitespace-pre-wrap">
                        {tc.expectedOutput}
                      </pre>
                    </div>

                    {/* Explanation if available */}
                    {tc.explanation && (
                      <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/60 leading-relaxed">
                        <strong className="text-slate-300">Explanation: </strong>
                        {tc.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            {problem.notes && (
              <div className="mt-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <div>{problem.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Terminal (7 columns on large screens) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Editor Container */}
          <div className="section-card rounded-2xl border border-slate-800 bg-[#070b16] shadow-2xl overflow-hidden flex flex-col">
            {/* Editor Header Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold text-white">Main.java</span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                  Java OpenJDK 13
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetCode}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50"
                  title="Reset code to default template"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* Editor Code Area with Line Numbers */}
            <div className="relative flex min-h-[380px] max-h-[550px] overflow-auto bg-[#070b16] font-mono text-sm leading-6">
              {/* Line Numbers Gutter */}
              <div
                className="select-none py-4 px-3 text-right text-slate-600 bg-slate-950/70 border-r border-slate-800/80 text-xs font-mono shrink-0"
                aria-hidden="true"
              >
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => updateCode(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                spellCheck="false"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                className="flex-1 w-full p-4 bg-transparent text-slate-100 placeholder-slate-600 resize-none outline-none font-mono text-xs sm:text-sm leading-6 whitespace-pre tab-4 border-0"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Custom Input Toggle & Box */}
            <div className="border-t border-slate-800/80 bg-slate-950/60">
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Custom Input (stdin)
                  {showCustomInput && <span className="text-[10px] text-amber-400">(active)</span>}
                </span>
                {showCustomInput ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showCustomInput && (
                <div className="p-3 pt-0">
                  <textarea
                    rows={3}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter input passed to your program via Scanner / stdin..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Action Bar (Run Code & Submit Solution) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 border-t border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Compiler: Judge0 Sandboxed</span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Run Code Button */}
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={executing || submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Play className={`w-3.5 h-3.5 text-amber-400 ${executing ? 'animate-spin' : ''}`} />
                  {executing ? 'Compiling & Running...' : 'Run Code'}
                </button>

                {/* Submit Solution Button */}
                <button
                  type="button"
                  onClick={handleSubmitSolution}
                  disabled={executing || submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
                >
                  <Send className={`w-3.5 h-3.5 ${submitting ? 'animate-pulse' : ''}`} />
                  {submitting ? 'Judging All Test Cases...' : 'Submit Solution'}
                </button>
              </div>
            </div>
          </div>

          {/* Results / Terminal Panel */}
          {(runResult || submitResult || executing || submitting) && (
            <div className="section-card rounded-2xl border border-slate-800 bg-[#080d1a] shadow-xl overflow-hidden">
              {/* Terminal Tabs */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('output')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'output'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Console Output
                  </button>

                  {submitResult && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('verdict')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'verdict'
                          ? submitResult.verdict === 'Accepted'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Official Verdict
                    </button>
                  )}
                </div>

                {/* Execution Stats */}
                {(runResult || submitResult) && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    {((runResult?.time ?? submitResult?.time) !== undefined) && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {(runResult?.time ?? submitResult?.time).toFixed(2)}s
                      </span>
                    )}
                    {((runResult?.memory ?? submitResult?.memory) !== undefined) && (
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-slate-400" />
                        {Math.round((runResult?.memory ?? submitResult?.memory) / 1024)}MB
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Terminal Content */}
              <div className="p-4 font-mono text-xs space-y-3">
                {/* Pending State */}
                {(executing || submitting) && (
                  <div className="flex items-center gap-3 py-4 text-slate-300">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>
                      {executing
                        ? 'Compiling Java code and executing in sandbox...'
                        : 'Running submitted solution against all official test cases...'}
                    </span>
                  </div>
                )}

                {/* Submit Verdict Banner */}
                {submitResult && activeTab === 'verdict' && (
                  <div>
                    <div
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                        submitResult.verdict === 'Accepted'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : submitResult.verdict === 'Wrong Answer'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : submitResult.verdict === 'Compilation Error'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {submitResult.verdict === 'Accepted' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : submitResult.verdict === 'Wrong Answer' ? (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-sm">{submitResult.verdict}</div>
                          {submitResult.score && <p role="status" className="mt-2 text-sm text-emerald-400">
                            {submitResult.score.congratulations ? `Congratulations! You are now #${submitResult.score.rank} on the Java leaderboard. ` : ''}
                            {submitResult.score.awarded ? '+5 points! ' : 'Already credited. '}{submitResult.score.points} total points.
                          </p>}
                          {submitResult.scoreMessage && <p role="status">{submitResult.scoreMessage}</p>}
                          {submitResult.totalTestCases !== undefined && (
                            <div className="text-xs text-slate-300 mt-0.5">
                              {submitResult.testCasesPassed} of {submitResult.totalTestCases} test cases passed
                            </div>
                          )}
                          {submitResult.message && (
                            <div className="text-xs text-slate-300 mt-1">
                              {submitResult.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {submitResult.verdict === 'Accepted' && (
                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Problem Solved!
                        </div>
                      )}
                    </div>

                    {/* Wrong Answer on Sample Test Case Details */}
                    {submitResult.verdict === 'Wrong Answer' && submitResult.isSampleTestCase && (
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                        <div className="text-rose-400 font-bold">
                          Failed on Sample Test Case #{submitResult.failedTestCaseIndex}:
                        </div>
                        {submitResult.input !== undefined && (
                          <div>
                            <span className="text-slate-400">Input:</span>
                            <pre className="mt-0.5 p-2 bg-slate-950 rounded text-amber-200">
                              {submitResult.input || '<No Input>'}
                            </pre>
                          </div>
                        )}
                        {submitResult.expectedOutput !== undefined && (
                          <div>
                            <span className="text-slate-400">Expected Output:</span>
                            <pre className="mt-0.5 p-2 bg-slate-950 rounded text-emerald-300">
                              {submitResult.expectedOutput}
                            </pre>
                          </div>
                        )}
                        {submitResult.actualOutput !== undefined && (
                          <div>
                            <span className="text-slate-400">Your Output:</span>
                            <pre className="mt-0.5 p-2 bg-slate-950 rounded text-rose-300">
                              {submitResult.actualOutput || '<No Output>'}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Wrong Answer on Hidden Test Case Notice */}
                    {submitResult.verdict === 'Wrong Answer' && !submitResult.isSampleTestCase && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        Failed on hidden test case #{submitResult.failedTestCaseIndex}. Review your logic, variable types, boundary conditions, and edge cases.
                      </div>
                    )}

                    {/* Compilation or Runtime Error in Submit */}
                    {(submitResult.compileOutput || submitResult.stderr) && (
                      <div className="mt-3">
                        <div className="text-slate-400 text-xs mb-1">Compiler / Diagnostic Output:</div>
                        <pre className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-300 whitespace-pre-wrap overflow-x-auto">
                          {submitResult.compileOutput || submitResult.stderr}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Run Code Output */}
                {(runResult || (submitResult && activeTab === 'output')) && (
                  <div>
                    {/* Run Code Status Tag */}
                    {runResult && (
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            runResult.verdict === 'Accepted'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : runResult.verdict === 'Compilation Error'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {runResult.verdict}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          (Run Code does not mark problems as solved)
                        </span>
                      </div>
                    )}

                    {/* Standard Output */}
                    {(runResult?.stdout || submitResult?.stdout) ? (
                      <div>
                        <div className="text-slate-400 text-[11px] mb-1">Standard Output (stdout):</div>
                        <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-300 whitespace-pre-wrap overflow-x-auto max-h-60">
                          {runResult?.stdout || submitResult?.stdout}
                        </pre>
                      </div>
                    ) : (
                      !runResult?.compileOutput &&
                      !runResult?.stderr &&
                      !submitResult?.compileOutput && (
                        <div className="text-slate-500 italic py-2">
                          Program produced no standard output.
                        </div>
                      )
                    )}

                    {/* Compilation Error Output */}
                    {(runResult?.compileOutput || submitResult?.compileOutput) && (
                      <div className="mt-3">
                        <div className="text-rose-400 text-[11px] mb-1 font-bold">Compilation Error:</div>
                        <pre className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl text-rose-300 whitespace-pre-wrap overflow-x-auto max-h-60">
                          {runResult?.compileOutput || submitResult?.compileOutput}
                        </pre>
                      </div>
                    )}

                    {/* Runtime Stderr */}
                    {(runResult?.stderr || submitResult?.stderr) && !runResult?.compileOutput && (
                      <div className="mt-3">
                        <div className="text-amber-400 text-[11px] mb-1 font-bold">Standard Error / Diagnostic:</div>
                        <pre className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-amber-300 whitespace-pre-wrap overflow-x-auto max-h-60">
                          {runResult?.stderr || submitResult?.stderr}
                        </pre>
                      </div>
                    )}

                    {/* Service / Diagnostic Message */}
                    {runResult?.message && !runResult?.compileOutput && !runResult?.stderr && (
                      <div className="mt-3">
                        <div className="text-amber-400 text-[11px] mb-1 font-bold">Execution Message:</div>
                        <pre className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-amber-300 whitespace-pre-wrap overflow-x-auto max-h-60">
                          {runResult.message}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

