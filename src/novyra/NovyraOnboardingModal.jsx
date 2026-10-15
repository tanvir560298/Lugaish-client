import { useState } from "react";
import { Sparkles, X, ArrowRight, ArrowLeft, Check, Code, Globe, Target, Clock, BookOpen } from "lucide-react";
import { useNovyra } from "./NovyraContext.jsx";

const SUBJECTS = [
  { id: "english", name: "English", category: "Language", icon: Globe, desc: "Grammar, conversation, vocabulary, and writing" },
  { id: "arabic", name: "Arabic", category: "Language", icon: Globe, desc: "Fusha, grammar (Nahw/Sarf), and fluency" },
  { id: "python", name: "Python", category: "Programming", icon: Code, desc: "Scripting, OOP, data structures, and automation" },
  { id: "java", name: "Java", category: "Programming", icon: Code, desc: "Object-oriented design, collections, and algorithms" },
  { id: "c", name: "C Language", category: "Programming", icon: Code, desc: "Pointers, memory allocation, and system basics" },
  { id: "javascript", name: "JavaScript", category: "Programming", icon: Code, desc: "Modern ES6+, async programming, and web APIs" },
  { id: "web_dev", name: "Web Development", category: "Programming", icon: Code, desc: "Full-stack HTML, CSS, React, and REST APIs" },
  { id: "computer_science", name: "Computer Science", category: "Academic", icon: BookOpen, desc: "Algorithms, complexity, databases, and OS" },
];

const LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Starting fresh or reviewing absolute basics" },
  { id: "intermediate", label: "Intermediate", desc: "Familiar with fundamentals, ready for challenging projects" },
  { id: "advanced", label: "Advanced", desc: "Sharpening deep concepts, algorithms, and system architecture" },
];

const GOALS = [
  { id: "general_mastery", label: "General Mastery", desc: "Build durable lifelong competence at a steady pace" },
  { id: "exam_preparation", label: "Exam Preparation", desc: "Focused revision on high-yield curriculum topics" },
  { id: "interview_prep", label: "Technical Interview Prep", desc: "Targeted problem solving, code tracing, and live debugging" },
  { id: "skill_transition", label: "Career Transition", desc: "Practical hands-on projects and industry-ready best practices" },
];

const TIME_OPTIONS = [15, 30, 45, 60, 90];

export function NovyraOnboardingModal() {
  const { isOnboardingOpen, closeOnboarding, completeOnboarding } = useNovyra();
  const [step, setStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("english");
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [selectedGoal, setSelectedGoal] = useState("general_mastery");
  const [dailyMinutes, setDailyMinutes] = useState(45);
  const [explanationLanguage, setExplanationLanguage] = useState("english");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOnboardingOpen) return null;

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding({
        targetSubject: selectedSubject,
        experienceLevel: selectedLevel,
        primaryGoal: selectedGoal,
        dailyTimeMinutes: dailyMinutes,
        explanationLanguage,
      });
    } catch (err) {
      console.error("Onboarding submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Meet Tanu AI</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your Personal AI Learning Companion on Lugaish</p>
            </div>
          </div>
          <button
            onClick={closeOnboarding}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Step {step} of 3</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-6 bg-indigo-600" : s < step ? "w-3 bg-indigo-400" : "w-3 bg-slate-300 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">What would you like to master first?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select your primary focus. Tanu AI adapts study plans, practice exercises, and code reviews accordingly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {SUBJECTS.map((sub) => {
                  const Icon = sub.icon;
                  const isSelected = selectedSubject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-500"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{sub.name}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {sub.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{sub.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">What is your current experience level?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This sets the technical depth of explanations, vocabulary level, and initial exercise difficulty.
                </p>
              </div>

              <div className="space-y-3">
                {LEVELS.map((lvl) => {
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-500"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">{lvl.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lvl.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Set your learning goal and daily routine</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tanu AI structures your daily sessions into timed blocks with built-in breaks to prevent cognitive fatigue.
                </p>
              </div>

              {/* Goal selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Primary Goal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => setSelectedGoal(goal.id)}
                        className={`p-3 rounded-xl border text-left transition-all text-xs ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-500 font-medium"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                        }`}
                      >
                        <div className="font-semibold text-slate-900 dark:text-white">{goal.label}</div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{goal.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daily time commitment */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Daily Study Commitment
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIME_OPTIONS.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyMinutes(mins)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        dailyMinutes === mins
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      {mins} minutes / day
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred language for explanations */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Preferred Explanation Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "english", label: "English" },
                    { id: "arabic", label: "العربية (Arabic)" },
                    { id: "bilingual", label: "Bilingual" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setExplanationLanguage(lang.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        explanationLanguage === lang.id
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:translate-x-0.5"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Setting Up..." : "Launch My Companion"} <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
