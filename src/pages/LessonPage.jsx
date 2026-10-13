import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
export function LessonPage() {
  const { day: raw = "1" } = useParams(),
    day = Number(raw),
    { state } = useAppContext(),
    language = state.activePathway;
  const [form, setForm] = useState({
      title: "",
      description: "",
      moduleType: "video",
      published: false,
      introTitle: "",
      introText: "",
      questions: [],
    }),
    [questionsJson, setQuestionsJson] = useState("[]"),
    [video, setVideo] = useState({
      title: "",
      youtubeUrl: "",
      durationMinutes: 5,
    }),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setMessage("");
    api
      .getLesson(language, day)
      .then((l) => {
        if (active) {
          setQuestionsJson(JSON.stringify(l.speakingQuestions || [], null, 2));
          setForm({
            title: l.title || "",
            description: l.description || "",
            moduleType: l.moduleType || "video",
            published: l.modulePublished === true,
            introTitle: l.moduleIntroTitle || "",
            introText: l.moduleIntroText || "",
            questions: l.speakingQuestions || [],
          });
        }
      })
      .catch((e) => {
        if (active) {
          setForm({
            title: `Day ${day} learning session`,
            description: "",
            moduleType: "video",
            published: false,
            introTitle: "",
            introText: "",
            questions: [],
          });
          setMessage(
            e.status === 404
              ? "No lesson exists in this draft generation. Create a fresh lesson below."
              : e.message,
          );
        }
      });
    return () => {
      active = false;
    };
  }, [language, day]);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const questions = JSON.parse(questionsJson);
      if (!Array.isArray(questions))
        throw new Error("Speaking questions must be a JSON array.");
      await api.updateDayModule(language, day, { ...form, questions });
      setMessage(
        "Module saved. Review content and lesson publication in Course publication.",
      );
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function addVideo() {
    setBusy(true);
    try {
      await api.addLessonVideo(language, day, video);
      setMessage(
        "Video reference saved. Publishing remains a separate reviewed action.",
      );
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="platform-page">
      <header className="platform-page-heading">
        <p className="platform-eyebrow">AUTHORIZED LESSON EDITOR</p>
        <h1>
          {language} · Day {day}
        </h1>
        <p>
          Create a draft course first. Old curriculum is retained in the private
          archive and is not used as a new lesson template.
        </p>
        <Link to="/manage-courses">Course publication</Link>
      </header>
      <p role="status">{message}</p>
      <form className="campus-card course-editor" onSubmit={save}>
        <label>
          Title
          <input
            required
            maxLength={160}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            maxLength={2000}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label>
          Module type
          <select
            value={form.moduleType}
            onChange={(e) => setForm({ ...form, moduleType: e.target.value })}
          >
            <option value="video">Video / reading</option>
            <option value="ai_practice">Supplied speaking activity</option>
            <option value="interview">Interview</option>
          </select>
        </label>
        <label>
          Introduction
          <textarea
            maxLength={2000}
            value={form.introText}
            onChange={(e) => setForm({ ...form, introText: e.target.value })}
          />
        </label>
        <label>
          Speaking questions (JSON)
          <textarea
            value={questionsJson}
            onChange={(e) => setQuestionsJson(e.target.value)}
            aria-describedby="question-help"
          />
        </label>
        <p id="question-help">
          Each question needs id, question, sampleAnswer, expectedKeywords
          (array), and maxMarks (1–100). Use [] for modules without supplied
          speaking questions.
        </p>
        <label>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />{" "}
          Module ready for publication review
        </label>
        <button className="campus-button campus-button-primary" disabled={busy}>
          Save module
        </button>
        <p>
          Quizzes, materials and final publication are managed in Course
          publication.
        </p>
        <hr />
        <label>
          Lecture title
          <input
            maxLength={120}
            value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
          />
        </label>
        <label>
          YouTube URL
          <input
            type="url"
            value={video.youtubeUrl}
            onChange={(e) => setVideo({ ...video, youtubeUrl: e.target.value })}
          />
        </label>
        <label>
          Duration in minutes
          <input
            type="number"
            min="1"
            max="600"
            value={video.durationMinutes}
            onChange={(e) =>
              setVideo({ ...video, durationMinutes: Number(e.target.value) })
            }
          />
        </label>
        <button
          className="campus-button"
          type="button"
          disabled={busy}
          onClick={addVideo}
        >
          Save lecture reference
        </button>
      </form>
    </div>
  );
}
