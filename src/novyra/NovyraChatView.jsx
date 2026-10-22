import {Link} from 'react-router-dom';
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Trash2, ArrowRight } from "lucide-react";
import { useNovyra } from "./NovyraContext.jsx";
import { NovyraAvatarBadge } from "./NovyraAvatarBadge.jsx";

const SUGGESTIONS = {
  web_dev: [
    "What is HTML, and how do I start my first page?",
    "When should I use headings and paragraphs?",
    "How do links and images work in HTML?",
    "What is the difference between a div and a span?",
    "Make me a study routine for my next HTML class",
  ],
  default: [
    "Explain this topic one step at a time",
    "Give me a small practice question",
    "How am I doing on my learning progress?",
    "Recommend my next study activity",
    "Make me a study routine for today",
  ],
};

export function NovyraChatView({ compact = false }) {
  const {
    messages,
    sendMessage,
    isChatLoading,
    avatarState,
    clearChat,
    activeSubject,
    usage,
  } = useNovyra();

  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const suggestions = SUGGESTIONS[activeSubject] || SUGGESTIONS.default;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isChatLoading) return;
    const text = input;
    setInput("");
    await sendMessage(text, { subject: activeSubject });
  };

  const handleSuggestion = async (s) => {
    await sendMessage(s, { subject: activeSubject });
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden ${compact ? "h-[500px]" : "h-[650px]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl on-solid bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Tanu AI Tutor</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {activeSubject}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Step-by-step guidance & code mentorship</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NovyraAvatarBadge state={avatarState} size="sm" />
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p role="status" className="px-5 py-3 text-xs text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
        {usage?.engineMode === 'offline-template'
          ? 'Offline guide mode. Built-in course help is available; broader AI answers need an online provider.'
          : usage?.engineMode === 'online-configured'
            ? 'Online provider configured. Generated answers may contain mistakes.'
            : usage?.engineMode === 'unavailable'
              ? 'Learning engine unavailable. Check the backend connection and sign-in.'
              : 'Checking learning engine connection…'}
      </p>
      <Link to="/tanu" className="px-5 py-3 text-sm font-bold text-indigo-700 dark:text-indigo-300">Have 10–120 minutes? Start a guided study session →</Link>
      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Start a learning conversation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Ask about your course, request a simpler explanation, or try one of these questions to get started.
              </p>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-col gap-1.5 w-full max-w-md pt-2">
                {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestion(s)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-left text-xs text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{s}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isStudent = msg.sender === "student";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isStudent ? "justify-end" : "justify-start"}`}
              >
                {!isStudent && (
                  <div className="w-7 h-7 rounded-lg on-solid bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isStudent
                      ? "on-solid bg-indigo-600 text-white rounded-tr-none shadow-sm"
                      : msg.isError
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}
                    {msg.actionUrl?.startsWith("/tanu?") && <Link to={msg.actionUrl} className="block mt-3 underline font-bold">{msg.actionUrl.includes("tab=planner") ? "Make this study routine →" : "Open guided study →"}</Link>}</div>

                  {/* Tool Call Context Card if available */}
                  {msg.toolCalls?.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-300/40 dark:border-slate-700/60 space-y-1">
                      {msg.toolCalls.map((tc, tIdx) => (
                        <div
                          key={tIdx}
                          className="px-2 py-1 rounded bg-black/10 dark:bg-black/30 font-mono text-[10px] text-slate-600 dark:text-slate-400"
                        >
                          ⚡ Verified Platform Tool: <span className="font-bold">{tc.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 text-right ${
                      isStudent ? "text-indigo-200" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </div>
                </div>

                {isStudent && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isChatLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg on-solid bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask Tanu AI about ${activeSubject}...`}
          className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isChatLoading}
          className="p-2.5 rounded-xl on-solid bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
