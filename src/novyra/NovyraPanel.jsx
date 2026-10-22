import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function NovyraPanel() {
  return <>
    <Link to="/tanu" className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full on-solid bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 group" title="Open Tanu AI Companion" aria-label="Open Tanu AI Companion">
      <Sparkles className="w-5 h-5"/><span className="text-xs font-bold tracking-wide pr-1">Tanu AI</span>
    </Link>
  </>;
}
