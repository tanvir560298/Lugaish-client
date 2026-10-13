import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
export function CoursePage() {
  const { language } = useParams(),
    { actions } = useAppContext();
  const [course, setCourse] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setCourse(null);
    setError("");
    api
      .getCourse(language)
      .then((c) => {
        if (active) setCourse(c);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [language]);
  async function enroll() {
    setBusy(true);
    setError("");
    try {
      await actions.enrollPathway(language);
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
      {error && <p role="alert">{error}</p>}
      {!course && !error && <p role="status">Loading published course…</p>}
      {course && (
        <section className="campus-card">
          <h2>{course.totalDays} published lessons</h2>
          <p>
            Lesson access depends on enrollment, schedule and your account
            permissions.
          </p>
          {language !== "paid_batch" ? (
            <button
              className="campus-button campus-button-primary"
              disabled={busy}
              onClick={enroll}
            >
              {busy ? "Checking enrollment…" : "Request enrollment"}
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
            {course.lessons.map((l) => (
              <li key={l.day}>{l.title}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
