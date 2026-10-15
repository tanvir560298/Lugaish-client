import { useState } from "react";
import { HelpCircle, Sparkles, Check, X, RotateCcw, ArrowRight } from "lucide-react";
import { novyraClient } from "./novyraClient.js";
import { useNovyra } from "./NovyraContext.jsx";

export function PracticeQuizCard({ initialSubject = "english", initialTopic = "Core Concepts" }) {
  const { setAvatarState } = useNovyra();
  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (targetSub = subject, targetTop = topic) => {
    setIsGenerating(true);
    setAvatarState("thinking");
    setSelectedAnswers({});
    try {
      const res = await novyraClient.generatePracticeQuiz({
        subject: targetSub,
        topic: targetTop,
      });
      setQuizData(res);
      setAvatarState("idle");
    } catch (err) {
      console.error("Failed to generate quiz:", err);
      setAvatarState("idle");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // Answer locked
    const isCorrect = quizData?.questions?.[questionIndex]?.correctIndex === optionIndex;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));

    if (isCorrect) {
      setAvatarState("encouraging");
      setTimeout(() => setAvatarState("idle"), 3000);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = quizData?.questions?.length || 0;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, optIdx]) => quizData?.questions?.[qIdx]?.correctIndex === optIdx
  ).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Adaptive Knowledge Check</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Targeted Practice Quizzes</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test your comprehension under active recall conditions. Instant explanations deepen memory retention.
          </p>
        </div>

        {/* Generate / Refresh controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{quizData ? "New Quiz" : "Start Quiz"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!quizData && !isGenerating && (
        <div className="text-center py-8 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ready for a quick 3-question challenge?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Choose a topic to request practice questions. Generated answers may contain mistakes and are not verified course assessments.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setTopic("Loops & Iterations");
                handleGenerate(subject, "Loops & Iterations");
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-indigo-500 transition-colors"
            >
              Loops & Iterations
            </button>
            <button
              type="button"
              onClick={() => {
                setTopic("Memory & Pointers");
                handleGenerate(subject, "Memory & Pointers");
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-indigo-500 transition-colors"
            >
              Memory & Pointers
            </button>
            <button
              type="button"
              onClick={() => {
                setTopic("Vocabulary Mastery");
                handleGenerate(subject, "Vocabulary Mastery");
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-indigo-500 transition-colors"
            >
              Vocabulary Mastery
            </button>
          </div>
        </div>
      )}

      {/* Quiz Questions List */}
      {quizData && (
        <div className="space-y-6">
          {/* Score Header if all answered */}
          {answeredCount === totalQuestions && totalQuestions > 0 && (
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Quiz Completed!</div>
                <div className="text-xs opacity-90">
                  You scored {correctCount} of {totalQuestions} correct ({Math.round((correctCount / totalQuestions) * 100)}%).
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
              >
                <span>Try Another</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {quizData.questions?.map((q, qIdx) => {
            const hasAnswered = selectedAnswers[qIdx] !== undefined;
            const selectedOpt = selectedAnswers[qIdx];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id || qIdx}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <div className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">{q.question}</div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {q.options?.map((opt, optIdx) => {
                    const isOptionSelected = selectedOpt === optIdx;
                    const isOptionCorrect = optIdx === q.correctIndex;

                    let btnStyle =
                      "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200";

                    if (hasAnswered) {
                      if (isOptionCorrect) {
                        btnStyle =
                          "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500";
                      } else if (isOptionSelected && !isCorrect) {
                        btnStyle =
                          "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500";
                      } else {
                        btnStyle = "border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/20 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 text-[10px] uppercase font-bold flex items-center justify-center text-slate-500">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {hasAnswered && isOptionCorrect && <Check className="w-4 h-4 text-emerald-500" />}
                        {hasAnswered && isOptionSelected && !isCorrect && <X className="w-4 h-4 text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {hasAnswered && q.explanation && (
                  <div className="mt-3 p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Novyra Pedagogical Insight:</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">{q.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
