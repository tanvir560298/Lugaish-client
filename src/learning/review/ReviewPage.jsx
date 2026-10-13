import {LearningTrail} from "../../components/LearningTrail.jsx";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAppContext } from "../../state/AppContext.jsx";
import { DailyGoal } from "../DailyGoal.jsx";
import "./review.css";
export function ReviewPage() {
  const { state } = useAppContext(),
    language = state.activePathway;
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [reload, setReload] = useState(0),
    [answers, setAnswers] = useState({}),
    [results, setResults] = useState({}),
    [busy, setBusy] = useState(null);
  const requests = useRef(new Map()),
    feedback = useRef(new Map()),
    generation = useRef(0);
  useEffect(() => {
    let active = true;
    generation.current += 1;
    setData(null);
    setBusy(null);
    setError("");
    setAnswers({});
    setResults({});
    requests.current.clear();
    api
      .getLearning(language)
      .then((d) => {
        if (active) {
          setData(d);
          setResults(
            Object.fromEntries(
              d.items
                .filter((i) => i.lastResult)
                .map((i) => [
                  i.sourceQuiz + ":" + i.questionIndex,
                  i.lastResult,
                ]),
            ),
          );
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
      generation.current += 1;
    };
  }, [language, state.userEmail, reload]);
  async function submit(item, key) {
    if (busy) return;
    const currentGeneration = generation.current;
    setBusy(key);
    setError("");
    const selectedAnswer = answers[key];
    const cached = requests.current.get(key);
    const requestId =
      cached?.answer === selectedAnswer ? cached.id : crypto.randomUUID();
    requests.current.set(key, { id: requestId, answer: selectedAnswer });
    try {
      const result = await api.retryMistake(language, {
        sourceQuiz: item.sourceQuiz,
        questionIndex: item.questionIndex,
        selectedAnswer,
        requestId,
      });
      if (currentGeneration !== generation.current) return;
      setResults((r) => ({ ...r, [key]: result }));
      if (result.reviewComplete)
        setData((d) => ({
          ...d,
          items: d.items.map((i) =>
            i.sourceQuiz === item.sourceQuiz &&
            i.questionIndex === item.questionIndex
              ? { ...i, resolved: true }
              : i,
          ),
        }));
      setTimeout(() => feedback.current.get(key)?.focus(), 0);
    } catch (e) {
      if (currentGeneration === generation.current) setError(e.message);
    } finally {
      if (currentGeneration === generation.current) setBusy(null);
    }
  }
  const pending = data?.items.filter((i) => !i.resolved).length;
  return (
    <div className="platform-page review-page"><LearningTrail current="Review Mistakes"/>
      <header className="platform-page-heading">
        <p className="platform-eyebrow">
          SMART REVIEW · {language === "arabic" ? "ARABIC" : "ENGLISH"}
        </p>
        <h1>Give tricky answers another try.</h1>
        <p>
          Your saved mistakes, checked by Lugaish. Review is practice; it does
          not award course completion or extra XP.
        </p>
      </header>
      {error && (
        <div className="campus-card" role="alert">
          <p>{error}</p>
          <button
            className="campus-button"
            onClick={() => setReload((n) => n + 1)}
          >
            Reload saved review
          </button>
        </div>
      )}
      {!data && !error && (
        <p role="status">Loading your authorized saved review…</p>
      )}
      {data && (
        <>
          <section className="review-summary campus-card" aria-live="polite">
            <h2>
              {pending
                ? `${pending} ${pending === 1 ? "question needs" : "questions need"} another look`
                : "You’re ready for your next step."}
            </h2>
            <p>
              {data.items.length
                ? `${data.items.filter((i) => i.resolved).length} of ${data.items.length} saved mistakes reviewed correctly.`
                : "No recorded mistakes in your current accessible activities."}
            </p>
            <Link
              className="campus-button campus-button-secondary"
              to="/daily-lessons"
            >
              Find my next lesson
            </Link>
            <Link
              className="campus-button campus-button-secondary"
              to="/study-room"
            >
              Continue at my desk
            </Link>
          </section>
          <div className="review-grid">
            {data.items.map((item) => {
              const key = item.sourceQuiz + ":" + item.questionIndex,
                result = results[key];
              return (
                <article className="campus-card review-question" key={key}>
                  <p className="platform-eyebrow">
                    DAY {item.day} · {item.title}
                  </p>
                  <fieldset
                    disabled={!!busy || item.resolved}
                    lang={language === "arabic" ? "ar" : "en"}
                    dir={language === "arabic" ? "rtl" : "ltr"}
                  >
                    <legend>{item.prompt}</legend>
                    <p lang="en" dir="ltr">
                      Your previous answer:{" "}
                      <bdi>{item.options[item.previousAnswer]}</bdi> · Needs
                      review
                    </p>
                    {item.options.map((o, n) => (
                      <label key={n} className="review-option">
                        <input
                          type="radio"
                          name={key}
                          checked={answers[key] === n}
                          onChange={() =>
                            setAnswers((a) => ({ ...a, [key]: n }))
                          }
                        />
                        <bdi>{o}</bdi>
                      </label>
                    ))}
                  </fieldset>
                  {item.resolved && !result && (
                    <p className="review-success">
                      Review complete · Your correct retry was saved.
                    </p>
                  )}
                  {result && (
                    <div
                      className={
                        result.isCorrect ? "review-success" : "review-feedback"
                      }
                      role="status"
                      ref={(node) => {
                        if (node) feedback.current.set(key, node);
                        else feedback.current.delete(key);
                      }}
                      tabIndex={-1}
                    >
                      <strong>
                        {result.isCorrect
                          ? "Correct retry saved. Review complete."
                          : "Retry saved. This still needs practice."}
                      </strong>
                      <p>
                        Previous: <bdi>{item.options[item.previousAnswer]}</bdi>
                        <br />
                        This retry:{" "}
                        <bdi>{item.options[result.selectedAnswer]}</bdi>
                        <br />
                        Correct answer:{" "}
                        <bdi>{item.options[result.correctAnswer]}</bdi>
                      </p>
                      {result.explanation && (
                        <p dir="auto">
                          <strong>Course-team explanation:</strong>{" "}
                          {result.explanation}
                        </p>
                      )}
                      {!result.explanation && (
                        <p>
                          No course-team explanation was supplied. Ask your
                          instructor for guidance.
                        </p>
                      )}
                    </div>
                  )}
                  {!item.resolved && (
                    <button
                      className="campus-button campus-button-primary"
                      disabled={busy !== null || answers[key] === undefined}
                      onClick={() => submit(item, key)}
                    >
                      {busy === key
                        ? "Checking and saving…"
                        : "Check and save retry"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
          <p className="review-help-note">
            Contextual help uses supplied course explanations. Live AI help is
            unavailable; your answers are not sent to an external AI service.
          </p>
        </>
      )}
      <DailyGoal
        key={`${state.userEmail}:${language}`}
        scope={`${encodeURIComponent(state.userEmail || "learner")}:${language}`}
      />
    </div>
  );
}
