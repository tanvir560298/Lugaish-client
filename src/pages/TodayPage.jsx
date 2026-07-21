import { Navigate } from 'react-router-dom';

// The Daily Lessons screen is the single source of truth for the course team's
// per-day plan. Keeping /today as a redirect avoids showing an old generic
// video-and-speaking template for every date.
export function TodayPage() {
  return <Navigate to="/daily-lessons" replace />;
}
