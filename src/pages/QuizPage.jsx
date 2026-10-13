import { LearningTrail } from "../components/LearningTrail.jsx";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
import { DailyGoal } from "../learning/DailyGoal.jsx";
import {
  confirmedQuizResult,
  contentVersion,
} from "../learning/practice/engine.js";
export function QuizPage() {
  const { state, actions } = useAppContext(),
    [params] = useSearchParams(),
    day = Number(
      params.get("day") || state.activeLessonId?.split("-").at(-1) || 1,
    ),
    language = state.activePathway;
  const submission = useRef(null);
  const [lesson, setLesson] = useState(null),
    [responses, setResponses] = useState([]),
    [receipt, setReceipt] = useState(null),
    [freshReceipt, setFreshReceipt] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLesson(null);
    setError("");
    setResponses([]);
    setReceipt(null);
    setFreshReceipt(false);
    Promise.all([
      api.getQuizAccess(language, day),
      api.getLesson(language, day),
    ])
      .then(([, l]) => {
        if (active) {
          setLesson(l);
          let saved;
          try {
            saved = JSON.parse(
              localStorage.getItem(
                `lugaish-practice-published-v1:${state.userEmail}:${language}:${day}:${contentVersion([l.courseGeneration, l.quiz])}`,
              ) || "null",
            );
          } catch {}
          setResponses(
            Array.isArray(saved) &&
              saved.length === l.quiz.length &&
              saved.every(
                (n, i) =>
                  n === null ||
                  (Number.isInteger(n) &&
                    n >= 0 &&
                    n < l.quiz[i].options.length),
              )
              ? saved
              : l.quiz.map(() => null),
          );
          api
            .getQuizResult(language, day)
            .then((result) => {
              if (active && confirmedQuizResult(result, l.quiz.length))
                setReceipt(result);
            })
            .catch(() => {});
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [language, day, retry]);
  useEffect(() => {
    if (!lesson || receipt) return;
    try {
      localStorage.setItem(
        `lugaish-practice-published-v1:${state.userEmail}:${language}:${day}:${contentVersion([lesson.courseGeneration, lesson.quiz])}`,
        JSON.stringify(responses),
      );
    } catch {
      setError(
        "Answers are available in this visit but browser saving failed. Keep this page open while you submit.",
      );
    }
  }, [lesson, responses, receipt, state.userEmail, language, day]);
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const identity = JSON.stringify([
      state.userEmail,
      language,
      day,
      lesson.courseGeneration,
      responses,
    ]);
    if (submission.current?.identity !== identity)
      submission.current = { identity, requestId: crypto.randomUUID() };
    try {
      const result = await api.submitQuiz({
        language,
        day,
        requestId: submission.current.requestId,
        responses: responses.map((selectedAnswer) => ({ selectedAnswer })),
      });
      if (!confirmedQuizResult(result, lesson.quiz.length))
        throw Error(
          "The server could not confirm a saved result. Your answers are retained.",
        );
      setReceipt(result);
      setFreshReceipt(result.alreadyCompleted === false);
      actions.recordServerQuizCompletion(
        `${lesson.courseGeneration}:${language}-les-${day}`,
        result,
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="platform-page">
      <LearningTrail current="Practice" />
      <header className="platform-page-heading">
        <p className="platform-eyebrow">PUBLISHED PRACTICE</p>
        <h1>{lesson?.title || "Practice availability"}</h1>
        <p>
          Answers and completion are checked by the server. Unpublished
          activities stay unavailable.
        </p>
      </header>
      {error && (
        <div role="alert">
          <p>{error}</p>
          {!lesson && (
            <button
              className="campus-button"
              onClick={() => setRetry((v) => v + 1)}
            >
              Retry availability
            </button>
          )}
        </div>
      )}
      {!lesson && !error && (
        <p role="status">Checking your authorized activity…</p>
      )}
      {lesson && (
        <form
          onSubmit={submit}
          className="campus-card"
          dir={language === "arabic" ? "rtl" : "ltr"}
        >
          {lesson.quiz.map((q, i) => (
            <fieldset key={i} disabled={busy || !!receipt}>
              <legend>
                {i + 1}. {q.question}
              </legend>
              {q.options.map((option, n) => (
                <label key={n} style={{ display: "block", padding: "12px" }}>
                  <input
                    type="radio"
                    name={"answer-" + i}
                    checked={responses[i] === n}
                    onChange={() =>
                      setResponses((r) => r.map((v, j) => (j === i ? n : v)))
                    }
                  />
                  {option}
                </label>
              ))}
              {receipt && (
                <p>
                  {receipt.feedback?.[i]
                    ? receipt.feedback[i].isCorrect
                      ? "Correct answer verified."
                      : "Needs review · Correct answer: " +
                        q.options[receipt.feedback[i].correctAnswer]
                    : "Saved quiz result available."}
                  {receipt.feedback?.[i]?.explanation && (
                    <span>
                      {" "}
                      Course-team explanation: {receipt.feedback[i].explanation}
                    </span>
                  )}
                </p>
              )}
            </fieldset>
          ))}
          {!receipt && (
            <button
              className="campus-button campus-button-primary"
              disabled={busy || responses.some((v) => v === null)}
            >
              {busy ? "Saving your result…" : "Submit complete activity"}
            </button>
          )}
          {receipt && (
            <section role="status">
              <Link
                className="campus-button campus-button-primary"
                to="/review-mistakes"
              >
                Review saved mistakes
              </Link>
              <h2>Result saved</h2>
              <p>
                {receipt.correctAnswers} / {receipt.totalQuestions} correct ·{" "}
                {receipt.score}%
              </p>
              <button
                type="button"
                className="campus-button"
                onClick={() => {
                  submission.current = null;
                  setReceipt(null);
                  setFreshReceipt(false);
                }}
              >
                Try this activity again
              </button>
              <DailyGoal
                scope={`${encodeURIComponent(state.userEmail || "learner")}:${language}`}
                confirmedLesson={freshReceipt ? receipt : null}
              />
            </section>
          )}
        </form>
      )}
      <Link
        className="campus-button campus-button-secondary"
        to="/daily-lessons"
      >
        Return to My Classes
      </Link>
    </div>
  );
}
