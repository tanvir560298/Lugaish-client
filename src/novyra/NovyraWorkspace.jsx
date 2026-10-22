import {TanuGuideSetup} from '../tanu/GuidedSession.jsx';
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  Code,
  HelpCircle,
  Brain,
  Sparkles,
  Flame,
  Clock,
  Award,
} from "lucide-react";
import { useNovyra } from "./NovyraContext.jsx";
import { NovyraAvatarBadge } from "./NovyraAvatarBadge.jsx";
import { StudyPlannerCard } from "./StudyPlannerCard.jsx";
import { NovyraChatView } from "./NovyraChatView.jsx";
import { CodeMentorView } from "./CodeMentorView.jsx";
import { PracticeQuizCard } from "./PracticeQuizCard.jsx";
import { StudentMemoryCard } from "./StudentMemoryCard.jsx";
import { NovyraOnboardingModal } from "./NovyraOnboardingModal.jsx";

const TABS = [
  { id: "planner", label: "Study Planner", icon: Calendar },
  { id: "chat", label: "Tutor Chat", icon: MessageSquare },
  { id: "code", label: "Code Mentor", icon: Code },
  { id: "practice", label: "Practice Quizzes", icon: HelpCircle },
  { id: "memory", label: "My Memory & Goals", icon: Brain },
];

export function NovyraWorkspace() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => TABS.some((tab) => tab.id === searchParams.get("tab")) ? searchParams.get("tab") : "planner");
  const { profile, fullProfile, avatarState, activeSubject } = useNovyra();
  const requestedTopic = searchParams.get("topic") || "";
  const requestedDuration = Number(searchParams.get("duration")) || null;

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    if (TABS.some((tab) => tab.id === requestedTab)) setActiveTab(requestedTab);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16">
      {/* Onboarding Dialog */}
      <NovyraOnboardingModal />
      <TanuGuideSetup />

      {/* Top Banner / Hero */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl on-solid bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      Tanu AI
                    </h1>
                    <NovyraAvatarBadge state={avatarState} size="md" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your course-aware study companion
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-sm">
                <Flame className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Streak</div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {fullProfile?.streak || 0} Days
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-sm">
                <Clock className="w-4 h-4 text-indigo-500" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Daily Target</div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {profile?.dailyTimeMinutes || 60}m
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shadow-sm">
                <Award className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total XP</div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {fullProfile?.totalXP || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "on-solid bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <p role="note" className="mb-5 text-sm text-slate-600 dark:text-slate-300">Tanu can answer from built-in learning guides and help plan your study. General AI answers are available only when Lugaish’s online provider is enabled; check the status in Tutor Chat.</p>
        {activeTab === "planner" && <StudyPlannerCard initialTopic={requestedTopic} initialDuration={requestedDuration} />}
        {activeTab === "chat" && <NovyraChatView />}
        {activeTab === "code" && <CodeMentorView />}
        {activeTab === "practice" && (
          <PracticeQuizCard initialSubject={activeSubject} initialTopic="Core Fundamentals" />
        )}
        {activeTab === "memory" && <StudentMemoryCard />}
      </main>
    </div>
  );
}
