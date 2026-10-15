import { Sparkles, Brain, MessageSquare, Heart, Compass } from "lucide-react";

export function NovyraAvatarBadge({ state = "idle", size = "md", showLabel = true }) {
  const configs = {
    idle: {
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
      dot: "bg-emerald-500",
      icon: Compass,
      label: "Idle",
    },
    listening: {
      color: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400",
      dot: "bg-sky-500 animate-pulse",
      icon: MessageSquare,
      label: "Listening...",
    },
    thinking: {
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
      dot: "bg-amber-500 animate-ping",
      icon: Brain,
      label: "Thinking...",
    },
    responding: {
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400",
      dot: "bg-indigo-500 animate-pulse",
      icon: Sparkles,
      label: "Responding...",
    },
    encouraging: {
      color: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400",
      dot: "bg-rose-500 animate-bounce",
      icon: Heart,
      label: "Keep it up!",
    },
  };

  const current = configs[state] || configs.idle;
  const Icon = current.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs font-medium gap-2",
    lg: "px-3 py-1.5 text-sm font-semibold gap-2.5",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border transition-all duration-300 shadow-sm ${current.color} ${sizeClasses[size] || sizeClasses.md}`}
      title={`Novyra State: ${current.label}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot.split(" ")[0]}`} />
      </span>
      <Icon className="w-3.5 h-3.5" />
      {showLabel && <span>{current.label}</span>}
    </div>
  );
}
