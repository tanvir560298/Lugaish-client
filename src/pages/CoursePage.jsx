import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
export function CoursePage() {
  const { language } = useParams(),
    { actions, state } = useAppContext();
  const [course, setCourse] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [success, setSuccess] = useState("");
  useEffect(() => {
    let active = true;
    setCourse(null);
    setError("");
    setSuccess("");
    const pending = state.isLoggedIn ? api.getCourse(language) : api.getCourses();
    pending
      .then((c) => {
        if (!active) return;
        if (state.isLoggedIn) setCourse(c);
        else {
          const preview = Array.isArray(c) ? c.find(item => item.language === language) : null;
          if (preview) setCourse(preview);
          else setError('No published course is available yet. Explore our upcoming courses or try a free HTML lesson.');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [language, state.isLoggedIn]);
  async function enroll() {
    setBusy(true);
    setError("");
    try {
      await actions.enrollPathway(language);
      setSuccess("Enrollment confirmed. Open My Classes to see your available lessons.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="platform-page">
      <header className="platform-page-heading">
        <p className="platform-eyebrow">PUBLISHED COURSE</p>
        <h1>{course?.title || "Course availability"}</h1>
        <p>{course?.description}</p>
      </header>
      {error && <div role="alert"><p>{error}</p><Link className="campus-button campus-button-secondary" to="/learn">Explore learning paths →</Link></div>}
      {success && <p role="status">{success}</p>}
      {!course && !error && <p role="status">Loading published course…</p>}
      {course && (
        <section className="campus-card">
          <h2>{Number.isInteger(course.totalDays) ? `${course.totalDays} published lessons` : "Course overview"}</h2>
          <p>
            Lesson access depends on enrollment, schedule and your account
            permissions.
          </p>
          {!state.isLoggedIn ? <Link className="campus-button campus-button-primary" to="/login" state={{ from: { pathname: `/course/${language}` } }}>Sign in to enroll</Link> : language !== "paid_batch" ? (
            <button
              className="campus-button campus-button-primary"
              disabled={busy || state.enrolledPathways?.includes(language)}
              onClick={enroll}
            >
              {busy ? "Checking enrollment…" : state.enrolledPathways?.includes(language) ? "Enrolled ✓" : "Request enrollment"}
            </button>
          ) : (
            <p>Private Batch access must be granted by authorized staff.</p>
          )}
          <Link
            className="campus-button campus-button-secondary"
            to="/daily-lessons"
          >
            My Classes
          </Link>
          <ul>
            {(course.lessons ?? []).map((l) => (
              <li key={l.day}>{l.title}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
