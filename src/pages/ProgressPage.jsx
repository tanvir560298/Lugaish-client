import {LearningTrail} from "../components/LearningTrail.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
import { LearningNext } from "../learning/review/LearningNext.jsx";
import { DailyGoal } from "../learning/DailyGoal.jsx";
import "../learning/analytics.css";
const labels = {
  first: "First practice submissions",
  repeat: "Repeat practice submissions",
  review: "Targeted review retries",
};
export function ProgressPage() {
  const { state } = useAppContext(),
    language = state.activePathway;
  const [range, setRange] = useState("7"),
    [page, setPage] = useState(1),
    [data, setData] = useState(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    api
      .getLearningAnalytics(language, { range, zone, page })
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [language, state.userEmail, range, zone, page, retry]);
  const empty =
    data &&
    !data.metrics?.practiceSessions &&
    !data.metrics?.completedLessons &&
    !data.review?.total &&
    !data.activity.items.length;
  return (
    <div className="platform-page learning-analytics"><LearningTrail current="My Learning Progress"/>
      <header className="platform-page-heading">
        <p className="platform-eyebrow">YOUR PERSONAL ACADEMIC WORKSPACE</p>
        <h1>My Learning Progress</h1>
        <p>
          Understand what you've learned and discover what to practise next.
        </p>
      </header>
      <div className="analytics-filters">
        <div>
          <span id="analytics-range-label">Show activity</span>
          <div
            className="analytics-range-buttons"
            role="group"
            aria-labelledby="analytics-range-label"
          >
            {[
              ["7", "Last 7 days"],
              ["30", "Last 30 days"],
              ["all", "All available records"],
            ].map(([value, label]) => (
              <button
                key={value}
                data-range={value}
                aria-pressed={range === value}
                onClick={() => {
                  setRange(value);
                  setPage(1);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p>
          {language === "arabic" ? "Arabic" : "English"} · Dates in {zone}
          <br />
          Current published, accessible course content only.
          {data?.courseTitle && (
            <span className="analytics-course-title" dir="auto">
              {data.courseTitle}
            </span>
          )}
        </p>
      </div>
      {!data && !error && (
        <p role="status">Loading your verified learning records…</p>
      )}
      {error && (
        <section className="campus-card" role="alert">
          <h2>Your progress could not be loaded.</h2>
          <p>{error}</p>
          <button
            className="campus-button campus-button-primary"
            onClick={() => setRetry((n) => n + 1)}
          >
            Retry analytics
          </button>
        </section>
      )}
      {data && (
        <>
          {data.coverage.partial && (
            <p role="status" className="campus-card">
              Your history exceeds this view’s safe processing limit. Totals are
              unavailable; no partial totals are presented as complete.
            </p>
          )}
          {empty && !data.coverage.partial ? (
            <section className="campus-card analytics-empty">
              <p className="platform-eyebrow">
                A SMALL STEP IS A GOOD BEGINNING
              </p>
              <h2>Your learning journey starts here.</h2>
              <p>
                Once you complete lessons and practice activities, your progress
                will appear here.
              </p>
              <p>
                {data.catalogAvailable
                  ? "There is no verified activity in this period. Try All available records to see earlier learning."
                  : "No published course is available yet. Your account and personal study tools remain available."}
              </p>
              {data.nextAvailable && (
                <Link
                  className="campus-button campus-button-primary"
                  to="/daily-lessons"
                >
                  Find an available lesson
                </Link>
              )}
              <Link
                className="campus-button campus-button-secondary"
                to="/study-room"
              >
                Open Study Library
              </Link>
            </section>
          ) : (
            <>
              <section
                className="analytics-overview"
                aria-label="Verified learning overview"
              >
                {[
                  [
                    "Completed lessons",
                    data.metrics?.completedLessons,
                    "Distinct lessons first completed in this period.",
                  ],
                  [
                    "Practice sessions",
                    data.metrics?.practiceSessions,
                    "Complete, server-evaluated quiz submissions in this period.",
                  ],
                  [
                    "Questions answered",
                    data.metrics?.questionsAttempted,
                    "Evaluated answers across those submissions; repeats count separately.",
                  ],
                  [
                    "Correct answers",
                    data.metrics?.correctAnswers,
                    "Correct evaluated answers; this is not a mastery score.",
                  ],
                ].map(([label, value, definition]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value ?? "Unavailable"}</strong>
                    <p>{definition}</p>
                  </div>
                ))}
              </section>
              {data.accuracy && (
                <section className="campus-card analytics-accuracy">
                  <p className="platform-eyebrow">PRACTICE, WITH CONTEXT</p>
                  <h2>Accuracy across evaluated answers</h2>
                  <p>
                    First submissions, repeat quizzes and single-question
                    retries have separate denominators.
                  </p>
                  {Object.entries(data.accuracy).map(([kind, g]) => (
                    <div className="accuracy-row" key={kind}>
                      <div>
                        <strong>{labels[kind]}</strong>
                        <span>
                          {g.evaluated
                            ? `${g.correct} correct / ${g.evaluated} evaluated · ${Math.round((g.correct / g.evaluated) * 100)}%`
                            : "No evaluated answers in this period"}
                        </span>
                      </div>
                      {g.evaluated > 0 && (
                        <div className="accuracy-track" aria-hidden="true">
                          <span
                            style={{
                              width: (g.correct / g.evaluated) * 100 + "%",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}
              {data.review && (
                <section className="campus-card analytics-review">
                  <div>
                    <p className="platform-eyebrow">
                      REVIEW INSIGHTS · CURRENT ACCESSIBLE QUESTIONS
                    </p>
                    <h2>
                      {data.review.pending
                        ? `${data.review.pending} ${data.review.pending === 1 ? "question needs" : "questions need"} another try.`
                        : "Your saved reviews are up to date."}
                    </h2>
                    <p>
                      {data.review.successful} of {data.review.total} latest
                      missed questions have a verified correct retry.{" "}
                      {data.review.retries} targeted retries in the selected
                      period.
                    </p>
                    <p>
                      A correct retry shows a successful review, not permanent
                      mastery.
                    </p>
                  </div>
                  {data.review.total > 0 && (
                    <Link
                      className="campus-button campus-button-primary"
                      to="/review-mistakes"
                    >
                      {data.review.pending ? "Review Mistakes" : "Try Again"}
                    </Link>
                  )}
                </section>
              )}
              {data.timeline.length > 0 && (
                <section className="campus-card analytics-timeline">
                  <p className="platform-eyebrow">RECORDED ACTIVITY</p>
                  <h2>Your learning rhythm</h2>
                  <p>
                    Complete practice submissions, targeted retries and non-quiz
                    lesson completions. Only days with verified events appear.
                  </p>
                  {data.timelineTruncated && (
                    <p>
                      Showing the most recent 90 active days. Overview totals
                      cover the selected period.
                    </p>
                  )}
                  <ul>
                    {data.timeline.map((d) => (
                      <li key={d.day}>
                        <time>{d.day}</time>
                        <div className="activity-track" aria-hidden="true">
                          <span
                            style={{
                              width:
                                (d.count /
                                  Math.max(
                                    ...data.timeline.map((v) => v.count),
                                  )) *
                                  100 +
                                "%",
                            }}
                          />
                        </div>
                        <strong>
                          {d.count} {d.count === 1 ? "event" : "events"}
                        </strong>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section className="campus-card analytics-recent">
                <h2>Recent Learning Activity</h2>
                {!data.activity.items.length ? (
                  <p>No verified events in this period.</p>
                ) : (
                  <ol>
                    {data.activity.items.map((e) => (
                      <li key={e.id}>
                        <div>
                          <strong>
                            {e.kind === "review"
                              ? e.correct
                                ? "Correct review retry"
                                : "Review retry needs another try"
                              : e.kind === "lesson"
                                ? "Lesson completed"
                                : e.initial
                                  ? "First practice submitted"
                                  : "Repeat practice submitted"}
                          </strong>
                          <span dir="auto">{e.title}</span>
                          {e.evaluated !== undefined && (
                            <small>
                              {e.correct} / {e.evaluated} evaluated answers
                              correct
                            </small>
                          )}
                        </div>
                        <time dateTime={e.at}>
                          {new Date(e.at).toLocaleString(undefined, {
                            timeZone: zone,
                          })}
                        </time>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="platform-actions">
                  {page > 1 && (
                    <button
                      className="campus-button"
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Newer activity
                    </button>
                  )}
                  {data.activity.hasMore && (
                    <button
                      className="campus-button"
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Older activity
                    </button>
                  )}
                </div>
              </section>
            </>
          )}
          {data.catalogAvailable &&
            !data.coverage.partial &&
            (data.nextAvailable || data.review?.pending > 0) && (
              <LearningNext />
            )}
          <section className="analytics-data-note">
            <h2>What these records can tell you</h2>
            <p>
              Focus time: unavailable. Library focus history is saved on your
              browser, not verified by the server. Opening the Library is never
              counted as study time.
            </p>
            {data.coverage.omitted > 0 && (
              <p>
                {data.coverage.omitted} incomplete or non-comparable records
                were excluded. Changed quiz content and old receipts without
                content fingerprints cannot support these question metrics.
              </p>
            )}
            <p>
              Private notes, chats and voice recordings are excluded. Instructor
              analytics and live AI insights are not enabled.
            </p>
          </section>
          <DailyGoal
            key={`${state.userEmail}:${language}`}
            scope={`${encodeURIComponent(state.userEmail || "learner")}:${language}`}
            analyticsToday={data.today}
          />
        </>
      )}
    </div>
  );
}
