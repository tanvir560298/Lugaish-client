import { useAppContext } from "../state/AppContext.jsx";
import { ROLES, isStudentPreview } from "../utils/roles.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { CourseAnnouncementPreview } from "./CourseAnnouncementPreview.jsx";
function CourseEditor() {
  const [courses, setCourses] = useState([]),
    [form, setForm] = useState({
      language: "english",
      title: "",
      description: "",
      status: "draft",
    }),
    [day, setDay] = useState(1),
    [lessonStatus, setLessonStatus] = useState("draft"),
    [content, setContent] = useState('{\n  "quiz": [],\n  "materials": []\n}'),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    try {
      setCourses(await api.manageCourses());
    } catch (e) {
      setMessage(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await api.saveCourse(form.language, form);
      setMessage(
        "Course saved. Only published courses with published lessons enter the student catalog.",
      );
      await load();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function saveContent() {
    setBusy(true);
    try {
      await api.updatePublishedContent(form.language, day, JSON.parse(content));
      setMessage(
        "Content saved as draft. Review and publish the lesson separately.",
      );
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function publishLesson() {
    setBusy(true);
    try {
      await api.publishLesson(form.language, day, lessonStatus);
      setMessage("Lesson publication state saved.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="platform-page">
      <header className="platform-page-heading">
        <h1>Course publication</h1>
        <p>
          Archived history stays recoverable. Draft courses and lessons are
          hidden from students. Review lesson content before publishing.
        </p>
      </header>
      <div className="platform-announcement" role="note">
        <span>Catalog setup</span>
        <span>This publisher currently supports English, Arabic, and Paid Batch pathways. C Programming and Video Editing need their own course catalog entries before they can be published here.</span>
      </div>
      <p role="status">{message}</p>
      <div className="platform-grid two">
        <form className="campus-card course-editor" onSubmit={save}>
          <label>
            Language
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              {["english", "arabic", "paid_batch"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            Course title
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
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label>
            State
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {["draft", "published", "archived"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <button
            className="campus-button campus-button-primary"
            disabled={busy}
          >
            Save course
          </button>
          <hr />
          <p>
            Use the existing lesson editor for content, then review publication
            here.
          </p>
          <Link to="/daily-lessons">Open lesson editor</Link>
          <label>
            Lesson day
            <input
              type="number"
              min="1"
              max="365"
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
            />
          </label>
          <label>
            Lesson state
            <select
              value={lessonStatus}
              onChange={(e) => setLessonStatus(e.target.value)}
            >
              {["draft", "published", "archived"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Reviewed quiz and materials JSON
            <textarea
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          <p>
            Quiz: question, options, correctAnswer (zero-based), explanation.
            Material: id, title, HTTPS url, type.
          </p>
          <button
            type="button"
            className="campus-button"
            disabled={busy}
            onClick={saveContent}
          >
            Save content as draft
          </button>
          <button
            type="button"
            className="campus-button"
            disabled={busy}
            onClick={publishLesson}
          >
            Save lesson state
          </button>
        </form>
        <section className="campus-card">
          <h2>Catalog records</h2>
          {!courses.length && (
            <p>No catalog records yet. Create a draft to begin.</p>
          )}
          {courses.map((c) => (
            <button
              key={c.language}
              className="campus-button campus-button-secondary"
              onClick={() =>
                setForm({
                  language: c.language,
                  title: c.title,
                  description: c.description,
                  status: c.status,
                })
              }
            >
              {c.title} · {c.status}
            </button>
          ))}
        </section>
      </div>
      <CourseAnnouncementPreview course={form} />
    </div>
  );
}

export function ManageCourses() {
  const { state } = useAppContext();
  return !isStudentPreview(state) &&
    [ROLES.webDeveloper, ROLES.instructor, ROLES.editor].includes(
      state.userRole,
    ) ? (
    <CourseEditor />
  ) : (
    <div className="platform-page">
      <h1>Staff access required</h1>
      <p>Course publication is available to authorized course managers.</p>
    </div>
  );
}
