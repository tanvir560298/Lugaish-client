import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, X } from "lucide-react";
import { api } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
import { availableLessonNotice } from "./lessonNotice.js";
export function NewTaskNotification() {
  const { state } = useAppContext(),
    { pathname } = useLocation();
  const [notice, setNotice] = useState(null);
  const key = `lugaish_${state.activePathway}_last_dismissed_day:${state.userEmail}`;
  useEffect(() => {
    let active = true;
    setNotice(null);
    if (
      !state.isLoggedIn ||
      !["arabic", "english"].includes(state.activePathway)
    )
      return;
    api
      .getDayModules(state.activePathway)
      .then((response) => {
        if (!active) return;
        const next = availableLessonNotice(response);
        let dismissed;
        try {
          dismissed = localStorage.getItem(key);
        } catch {}
        if (next && dismissed !== String(next.day)) setNotice(next);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [state.isLoggedIn, state.activePathway, state.userEmail, pathname, key]);
  if (!notice) return null;
  return (
    <aside className="campus-lesson-notice" aria-label="Available lesson">
      <BookOpen size={18} />
      <span>
        Your course has an available lesson.
        <Link to="/daily-lessons">Open Day {notice.day}</Link>
      </span>
      <button
        aria-label="Dismiss lesson notice"
        onClick={() => {
          try {
            localStorage.setItem(key, String(notice.day));
          } catch {}
          setNotice(null);
        }}
      >
        <X size={18} />
      </button>
    </aside>
  );
}
