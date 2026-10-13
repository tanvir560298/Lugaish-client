import { Link } from "react-router-dom";
export function LearningTrail({ current }) {
  return (
    <nav className="learning-route-trail" aria-label="Learning location">
      <Link to="/daily-lessons">My Classes</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
      <span aria-hidden="true">·</span>
      {current !== "Review Mistakes" && (
        <Link to="/review-mistakes">Review Mistakes</Link>
      )}
      {current !== "My Learning Progress" && (
        <Link to="/progress">My Learning Progress</Link>
      )}
    </nav>
  );
}
