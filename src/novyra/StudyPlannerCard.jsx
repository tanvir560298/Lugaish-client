import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  Coffee,
  Code,
  HelpCircle,
  FileText,
  PlusCircle,
  Check,
} from "lucide-react";
import { useNovyra } from "./NovyraContext.jsx";

const BLOCK_TYPE_CONFIG = {
  concept: { label: "Concept", icon: BookOpen, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  practice: { label: "Practice", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  coding_exercise: { label: "Code Lab", icon: Code, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
  break: { label: "Break", icon: Coffee, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  quiz: { label: "Quiz", icon: HelpCircle, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  reflection: { label: "Reflection", icon: FileText, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
};

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function StudyPlannerCard({ initialTopic = "", initialDuration = null }) {
  const {
    activePlan,
    createPlan,
    completeBlock,
    activeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    profile,
  } = useNovyra();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(() => Boolean(initialTopic));
  const [topicInput, setTopicInput] = useState("");
  const [durationInput, setDurationInput] = useState(profile?.dailyTimeMinutes || 45);
  const [planError, setPlanError] = useState("");
  const [notesByBlock, setNotesByBlock] = useState({});
  const [expandedNotes, setExpandedNotes] = useState(null);

  useEffect(() => {
    if (profile?.dailyTimeMinutes) setDurationInput(profile.dailyTimeMinutes);
  }, [profile?.dailyTimeMinutes]);
  useEffect(() => {
    if (initialTopic) {
      setTopicInput(initialTopic);
      setShowCreateForm(true);
    }
  }, [initialTopic]);
  useEffect(() => {
    if (Number.isInteger(initialDuration) && initialDuration >= 15 && initialDuration <= 120) setDurationInput(initialDuration);
  }, [initialDuration]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setPlanError("");
    try {
      await createPlan({
        subject: profile?.targetSubject || "english",
        topic: topicInput.trim() || "Fundamentals & Core Skills",
        durationMinutes: Number(durationInput) || 45,
      });
      setTopicInput("");
      setShowCreateForm(false);
    } catch (err) {
      setPlanError(err.message || "I could not make the routine right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleBlock = async (idx, isCurrentlyCompleted) => {
    if (isCurrentlyCompleted) return; // irreversible completion for authenticated record
    const note = notesByBlock[idx] || "";
    await completeBlock(idx, note);
  };

  if (!activePlan || showCreateForm) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tanu Study Planner</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Design Today's Study Routine</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tell Tanu what you want to learn and how much time you have. It will make a timed routine with a short lesson, hands-on practice, a break, and a review.
            </p>
          </div>
          {activePlan && <button type="button" onClick={() => setShowCreateForm(false)} className="text-xs font-semibold text-slate-600 dark:text-slate-300">Cancel</button>}
        </div>

        <form onSubmit={handleCreatePlan} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Target Topic or Goal
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder={profile?.targetSubject === "web_dev" ? "e.g. HTML class 03: headings" : "e.g. Java loops, Python functions, English vocabulary..."}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Session Duration
              </label>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{durationInput} minutes</span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={durationInput}
              onChange={(e) => setDurationInput(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>15m Quick</span>
              <span>45m Focused</span>
              <span>60m Standard</span>
              <span>90m Deep Dive</span>
              <span>120m Intensive</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white on-solid bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Crafting Your Custom Plan...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Generate Structured Study Plan
              </>
            )}
          </button>
          {planError && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{planError}</p>}
        </form>
      </div>
    );
  }

  // Active Plan View
  const completedCount = activePlan.blocks?.filter((b) => b.completed)?.length || 0;
  const totalCount = activePlan.blocks?.length || 1;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const isAllComplete = completedCount === totalCount;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Plan Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {activePlan.subject}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {activePlan.targetDurationMinutes} min target
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activePlan.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Topic: {activePlan.topic}</p>
        </div>
        <button type="button" onClick={() => { setPlanError(""); setShowCreateForm(true); }} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-400"><PlusCircle className="w-4 h-4"/> Make another routine</button>

        {/* Global Timer Banner if Active */}
        {activeTimer.blockIndex !== null && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 text-white shadow-md border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Timer</div>
              <div className="text-xl font-mono font-bold text-indigo-400">{formatTimer(activeTimer.remainingSeconds)}</div>
            </div>
            <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
              {activeTimer.isRunning ? (
                <button
                  type="button"
                  onClick={pauseTimer}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  title="Pause"
                >
                  <Pause className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resumeTimer}
                  className="p-1.5 rounded-lg on-solid bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  title="Resume"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={resetTimer}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>
            {completedCount} of {totalCount} blocks completed
          </span>
          <span className="text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {isAllComplete && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
          <div className="p-2 rounded-lg on-solid bg-emerald-500 text-white">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Study routine complete!</div>
            <div className="text-xs opacity-90">You finished every block. Take a moment to note what you learned and what to revisit.</div>
          </div>
        </div>
      )}

      {/* Timed Blocks List */}
      <div className="space-y-3">
        {activePlan.blocks?.map((block, idx) => {
          const typeConf = BLOCK_TYPE_CONFIG[block.type] || BLOCK_TYPE_CONFIG.concept;
          const TypeIcon = typeConf.icon;
          const isTimerActiveForThis = activeTimer.blockIndex === idx;

          return (
            <div
              key={block.id || idx}
              className={`p-4 rounded-xl border transition-all ${
                block.completed
                  ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75"
                  : isTimerActiveForThis
                  ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-400 dark:border-indigo-600 shadow-sm ring-1 ring-indigo-500"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(idx, block.completed)}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      block.completed
                        ? "border-emerald-500 on-solid bg-emerald-500 text-white"
                        : "border-slate-300 dark:border-slate-700 hover:border-slate-400"
                    }`}
                    title={block.completed ? "Completed" : "Mark block completed"}
                  >
                    {block.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${typeConf.color}`}
                      >
                        <TypeIcon className="w-3 h-3" />
                        {typeConf.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {block.durationMinutes} mins
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold mt-1 ${
                        block.completed
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {block.title}
                    </h4>

                    {block.instructions && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{block.instructions}</p>
                    )}

                    {block.objectives?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {block.objectives.map((obj, oIdx) => (
                          <li
                            key={oIdx}
                            className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5"
                          >
                            <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {block.materials?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {block.materials.map((material, materialIndex) => {
                          const lessonPath = material.match(/^Course lesson path: (\/learn\/web-development\/html(?:\/\d{2})?)$/)?.[1];
                          return lessonPath
                            ? <Link key={materialIndex} to={lessonPath} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 underline">Open the HTML class →</Link>
                            : <span key={materialIndex} className="text-[11px] text-slate-500 dark:text-slate-400">{material}</span>;
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Block Timer Button */}
                {!block.completed && (
                  <div className="flex-shrink-0">
                    {isTimerActiveForThis ? (
                      <button
                        type="button"
                        onClick={activeTimer.isRunning ? pauseTimer : resumeTimer}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold on-solid bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                      >
                        {activeTimer.isRunning ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startTimer(idx, block.durationMinutes, block.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Timer</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Reflection / Notes collapsible */}
              {!block.completed && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  {expandedNotes === idx ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Add quick notes or key takeaways before checking off..."
                        value={notesByBlock[idx] || ""}
                        onChange={(e) => setNotesByBlock({ ...notesByBlock, [idx]: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setExpandedNotes(idx)}
                      className="text-[11px] text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      + Add student note
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
