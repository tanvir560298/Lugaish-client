import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { useAppContext } from "../../state/AppContext.jsx";
import "./review.css";
export function LearningNext() {
  const { state } = useAppContext();
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    if (state.activePathway === "paid_batch") return;
    api
      .getLearning(state.activePathway)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [state.activePathway, state.userEmail, retry]);
  if (state.activePathway === "paid_batch") return null;
  return (
    <section
      className="learning-next campus-card"
      aria-labelledby="learning-next-heading"
    >
      <p className="platform-eyebrow">YOUR NEXT SMALL STEP</p>
      <h2 id="learning-next-heading">Pick up where you left off.</h2>
      <Link className="campus-link" to="/progress">See My Learning Progress →</Link>
      {!data && !error && <p role="status">Checking your saved learning…</p>}
      {error && (
        <div role="status">
          <p>{error}</p>
          <button
            className="campus-button campus-button-secondary"
            onClick={() => setRetry((n) => n + 1)}
          >
            Check again
          </button>
        </div>
      )}
      {!data && (
        <Link
          className="campus-button campus-button-secondary"
          to="/study-room"
        >
          Continue at my library desk
        </Link>
      )}
      {data && (
        <>
          {data.actions.length === 0 && (
            <p>
              No saved mistakes or available next lesson yet. Your course team
              will publish learning activities here.
            </p>
          )}
          <div className="learning-action-grid">
            {data.actions.map((a) => (
              <Link
                key={a.kind}
                className="learning-action"
                to={
                  a.kind === "review" ? "/review-mistakes" : "/lesson/" + a.day
                }
              >
                <strong>{a.title}</strong>
                <span>{a.reason}</span>
                <b>
                  {a.kind === "review" ? "Review mistakes" : "Open lesson"} →
                </b>
              </Link>
            ))}
            <Link className="learning-action" to="/study-room">
              <strong>Make time to focus</strong>
              <span>
                Bring your notes and personal goal to a quiet library desk.
              </span>
              <b>Open Study Library →</b>
            </Link>
          </div>
          {data.nextUnlockAt && (
            <p>
              Your next lesson unlocks at{" "}
              {new Date(data.nextUnlockAt).toLocaleString()}.
            </p>
          )}
        </>
      )}
    </section>
  );
}
