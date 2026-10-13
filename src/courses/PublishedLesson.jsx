import {LearningTrail} from "../components/LearningTrail.jsx";
import { DailyGoal } from "../learning/DailyGoal.jsx";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
import { resolveMedia } from "../classroom/mediaPolicy.js";
export function PublishedLesson() {
  const { day: raw = "1" } = useParams(),
    day = Number(raw),
    { state } = useAppContext();
  const [lesson, setLesson] = useState(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0),
    [completion, setCompletion] = useState(null),
    [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    setLesson(null);
    setError("");
    api
      .getLesson(state.activePathway, day)
      .then((l) => {
        if (active) setLesson(l);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [state.activePathway, day, retry]);
  async function complete() {
    setSaving(true);
    setError("");
    try {
      const result = await api.completeLesson({
        language: state.activePathway,
        day,
      });
      setCompletion(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }
  const videos = lesson?.videos?.length
    ? lesson.videos
    : lesson?.videoUrl
      ? [lesson]
      : [];
  return (
    <div className="platform-page"><LearningTrail current="Lesson"/>
      <header className="platform-page-heading">
        <p className="platform-eyebrow">YOUR PUBLISHED LESSON</p>
        <h1>{lesson?.title || "Lesson availability"}</h1>
        <p>{lesson?.description}</p>
      </header>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button
            className="campus-button"
            onClick={() => setRetry((v) => v + 1)}
          >
            Retry lesson
          </button>
        </div>
      )}
      {!error && !lesson && (
        <p role="status">Loading your authorized lesson…</p>
      )}
      {videos.map((v, i) => {
        const media = resolveMedia(v);
        return (
          <section key={v._id || i} className="campus-card">
            <h2>{v.title || "Lecture"}</h2>
            {!media ? (
              <p>
                This lecture has no playable media. Ask your course team for a
                valid source.
              </p>
            ) : media.kind === "youtube" ? (
              <iframe
                title={v.title || "Lecture video"}
                src={
                  "https://www.youtube-nocookie.com/embed/" + media.youtubeId
                }
                allow="fullscreen; encrypted-media"
                allowFullScreen
                style={{ width: "100%", aspectRatio: "16/9", border: 0 }}
              />
            ) : (
              <video
                controls
                preload="metadata"
                src={media.src}
                style={{ width: "100%" }}
                onError={() =>
                  setError(
                    "This video could not load. Please retry or contact your course team.",
                  )
                }
              />
            )}
          </section>
        );
      })}
      {lesson?.materials?.map((r) => (
        <a
          key={r.id}
          className="campus-button campus-button-secondary"
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {r.title}
        </a>
      ))}
      {lesson?.quiz?.length > 0 && (
        <Link
          className="campus-button campus-button-primary"
          to={"/quiz?day=" + day}
        >
          Open published practice
        </Link>
      )}
      {lesson?.moduleType === "ai_practice" && (
        <Link className="campus-button" to={"/speaking-practice?day=" + day}>
          Open supplied speaking activity
        </Link>
      )}
      {lesson && !lesson.quiz?.length && (
        <button
          className="campus-button campus-button-primary"
          disabled={saving || !!completion}
          onClick={complete}
        >
          {completion
            ? "Completion confirmed"
            : saving
              ? "Saving…"
              : "Mark this lesson complete"}
        </button>
      )}
      <Link
        className="campus-button campus-button-secondary"
        to="/daily-lessons"
      >
        Return to My Classes
      </Link>
      <Link className="campus-button campus-button-secondary" to="/review-mistakes">Review my saved mistakes</Link>
      <DailyGoal
        scope={`${encodeURIComponent(state.userEmail || "learner")}:${state.activePathway}`}
        confirmedLesson={
          completion?.alreadyCompleted === false ? completion : null
        }
      />
      <p>Watching a video alone does not award course completion.</p>
    </div>
  );
}
