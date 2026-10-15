import { useState } from "react";
import { Brain, Target, Clock, Globe, Award, AlertTriangle, Plus, X, RotateCcw } from "lucide-react";
import { useNovyra } from "./NovyraContext.jsx";

export function StudentMemoryCard() {
  const { profile, fullProfile, usage, updateProfile, openOnboarding } = useNovyra();
  const [newWeakArea, setNewWeakArea] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddWeakArea = async (e) => {
    e.preventDefault();
    if (!newWeakArea.trim() || isUpdating) return;
    const current = profile?.weakAreas || [];
    if (current.includes(newWeakArea.trim())) return;

    setIsUpdating(true);
    try {
      await updateProfile({
        weakAreas: [...current, newWeakArea.trim()],
      });
      setNewWeakArea("");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveWeakArea = async (item) => {
    const current = profile?.weakAreas || [];
    await updateProfile({
      weakAreas: current.filter((w) => w !== item),
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>Persistent Student Memory</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Learning Profile & Goals</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tanu AI retains your discipline, targeted weaknesses, and daily study budget to continuously calibrate instruction.
          </p>
        </div>

        <button
          type="button"
          onClick={openOnboarding}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Update Setup</span>
        </button>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Globe className="w-3 h-3" /> Subject
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white mt-1 capitalize">
            {profile?.targetSubject || "English"}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Target className="w-3 h-3" /> Level
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white mt-1 capitalize">
            {profile?.experienceLevel || "Beginner"}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Clock className="w-3 h-3" /> Daily Target
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">
            {profile?.dailyTimeMinutes || 60} mins
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Award className="w-3 h-3" /> Verified XP
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">
            {fullProfile?.totalXP || 0} XP
          </div>
        </div>
      </div>

      {/* Weak Areas Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Identified Weak Areas & Revision Priorities</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile?.weakAreas?.length > 0 ? (
            profile.weakAreas.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveWeakArea(item)}
                  className="hover:text-amber-950 dark:hover:text-amber-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">No weak areas identified yet. Practice quizzes and quiz retries will populate this automatically.</span>
          )}
        </div>

        {/* Add custom weak area form */}
        <form onSubmit={handleAddWeakArea} className="flex gap-2 pt-1">
          <input
            type="text"
            value={newWeakArea}
            onChange={(e) => setNewWeakArea(e.target.value)}
            placeholder="Add topic to review (e.g. Nested Loops, Irregular Verbs)..."
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!newWeakArea.trim() || isUpdating}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quota & Usage Meter */}
      {usage && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Daily AI Allowance Meter</span>
            <span>
              {usage.requestsToday} / {usage.dailyRequestLimit} requests
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((usage.requestsToday / usage.dailyRequestLimit) * 100))}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Tokens: {usage.tokensUsedToday.toLocaleString()} / {usage.dailyTokenLimit.toLocaleString()}</span>
            <span>Resets daily at midnight UTC</span>
          </div>
        </div>
      )}
    </div>
  );
}
