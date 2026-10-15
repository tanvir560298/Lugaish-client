import { useState } from "react";
import { Sparkles, X, MessageSquare, Calendar, Code, ChevronRight } from "lucide-react";
import { useNovyra } from "./NovyraContext.jsx";
import { NovyraAvatarBadge } from "./NovyraAvatarBadge.jsx";
import { NovyraChatView } from "./NovyraChatView.jsx";
import { StudyPlannerCard } from "./StudyPlannerCard.jsx";

export function NovyraPanel() {
  const { isPanelOpen, closePanel, togglePanel, avatarState, activePlan } = useNovyra();
  const [panelTab, setPanelTab] = useState("chat");

  return (
    <>
      {/* Floating Action Trigger Button (Bottom Right) */}
      {!isPanelOpen && (
        <button
          type="button"
          onClick={togglePanel}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 group"
          title="Open Tanu AI Companion"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide pr-1">Tanu AI</span>
        </button>
      )}

      {/* Slide-out Drawer Panel */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closePanel}
          />

          {/* Drawer container */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-slide-left">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Tanu AI Companion</span>
                    <NovyraAvatarBadge state={avatarState} size="sm" showLabel={false} />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Contextual Learning Assistant</div>
                </div>
              </div>

              <button
                type="button"
                onClick={closePanel}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 bg-slate-100/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setPanelTab("chat")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all ${
                  panelTab === "chat"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Tutor Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setPanelTab("plan")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-bold transition-all ${
                  panelTab === "plan"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Study Plan</span>
                {activePlan && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {panelTab === "chat" && <NovyraChatView compact />}
              {panelTab === "plan" && <StudyPlannerCard />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
