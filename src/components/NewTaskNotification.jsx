import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { api } from '../api/client.js';
import { useAppContext } from '../state/AppContext.jsx';

export function NewTaskNotification() {
  const { state } = useAppContext();
  const location = useLocation();
  const [courseDay, setCourseDay] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!state.isLoggedIn || !['arabic', 'english'].includes(state.activePathway)) {
      setIsVisible(false);
      return;
    }

    let ignore = false;
    api.getDayModules(state.activePathway)
      .then(response => {
        if (ignore) return;
        const cDay = response.courseDay;
        if (cDay) {
          setCourseDay(cDay);
          const lastDismissed = localStorage.getItem(`lugaish_${state.activePathway}_last_dismissed_day`);
          // Show if the user has not dismissed this day's notification yet
          if (String(lastDismissed) !== String(cDay)) {
            setIsVisible(true);
          }
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [state.isLoggedIn, state.activePathway, location.pathname]);

  const handleDismiss = () => {
    localStorage.setItem(`lugaish_${state.activePathway}_last_dismissed_day`, String(courseDay));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm font-black uppercase tracking-[0.08em] shadow-md border-b border-blue-500/30">
      <div className="flex items-center gap-2.5 mx-auto">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 text-amber-300 ring-1 ring-white/10 animate-pulse">
          <Bell size={13} />
        </div>
        <span>
          new task has been uploaded.{' '}
          <Link
            to="/daily-lessons"
            className="underline hover:text-blue-100 transition decoration-amber-300 underline-offset-2 ml-1"
          >
            Go to Day {courseDay}
          </Link>
        </span>
      </div>
      <button
        onClick={handleDismiss}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
