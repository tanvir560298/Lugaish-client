import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, ExternalLink, FileText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { LEARNING_RESOURCES } from '../data/learningResources.js';
import { useAppContext } from '../state/AppContext.jsx';

export function LearningResourceNotification() {
  const { state } = useAppContext();
  const [latestResource, setLatestResource] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    if (!state.isLoggedIn || !['arabic', 'english'].includes(state.activePathway)) {
      setLatestResource(null);
      setIsOpen(false);
      return undefined;
    }

    setIsOpen(false);
    api.getDayModules(state.activePathway)
      .then(response => {
        if (ignore) return;
        const availableDays = new Set(
          (Array.isArray(response.modules) ? response.modules : [])
            .filter(module => module.available === true)
            .map(module => Number(module.day)),
        );
        const availableUnseenResources = (LEARNING_RESOURCES[state.activePathway] ?? [])
          .filter(resource => (
            availableDays.has(resource.day)
            && localStorage.getItem(`lugaish_resource_seen_${resource.id}`) !== 'true'
          ));
        const resource = availableUnseenResources.at(-1) ?? null;
        setLatestResource(resource);
        setIsOpen(Boolean(resource));
      })
      .catch(() => {
        // The server day plan is the access authority. If it cannot confirm an
        // unlocked day, no resource notification is shown.
        if (!ignore) {
          setLatestResource(null);
          setIsOpen(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [state.activePathway, state.isLoggedIn]);

  const dismiss = () => {
    if (latestResource) localStorage.setItem(`lugaish_resource_seen_${latestResource.id}`, 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] grid place-items-center bg-slate-950/75 p-5 backdrop-blur-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-notification-title"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-emerald-400/25 bg-slate-950 p-7 shadow-[0_32px_110px_rgba(16,185,129,0.22)] sm:p-9"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close notification"
            >
              <X size={18} />
            </button>

            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300">
              <BellRing size={30} />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
              New {state.activePathway === 'arabic' ? 'Arabic' : 'English'} learning resource
            </p>
            <h2 id="resource-notification-title" className="mt-3 pr-8 text-3xl font-black text-white">
              Keep learning beyond the class
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              If you would like to learn something new after today&apos;s class, this PDF is for you.
              Read it at your own pace, practise what you discover, and take your {state.activePathway === 'arabic' ? 'Arabic' : 'English'} learning one step further.
            </p>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <FileText className="shrink-0 text-emerald-300" size={24} />
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{latestResource.title}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Day {latestResource.day} · Optional PDF resource</p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
              <a
                href={latestResource.url}
                target="_blank"
                rel="noreferrer"
                onClick={dismiss}
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-emerald-400"
              >
                Open PDF <ExternalLink size={16} />
              </a>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                View later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
