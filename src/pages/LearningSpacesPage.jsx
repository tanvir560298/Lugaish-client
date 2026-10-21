import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Languages } from "lucide-react";
import {
  EntranceBoundary,
  SimpleEntrance,
} from "../university/SimpleEntrance.jsx";
import { AvatarChooser } from "../characters/AvatarChooser.jsx";
import { CampusPreview } from "../components/CampusPreview.jsx";
import "../study/study.css";
import "../university/university.css";
const UniversityScene = lazy(() => import("../university/UniversityScene.jsx"));
const loaders = {
  classroom: () => import("./ClassroomPage.jsx"),
  study: () => import("./StudyRoomPage.jsx"),
  speaking: () => import("./SpeakingPracticePage.jsx"),
};
export function LearningSpacesPage({ devPreview = false }) {
  const preview = import.meta.env.DEV && devPreview;
  const navigate = useNavigate();
  const [entranceOpen, setEntranceOpen] = useState(false);
  const [simple, setSimple] = useState(
    () =>
      window.matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)")
        .matches,
  );
  const [selection, setSelection] = useState(null),
    [arrived, setArrived] = useState(false),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState("");
  const request = useRef(0);
  const spaces = [
    {
      id: "classroom",
      title: "Classroom",
      description:
        "Watch free HTML lessons or bring your own YouTube video. Keep notes and a focus timer beside your learning.",
      href: preview ? "/classroom-preview" : "/classroom",
    },
    {
      id: "study",
      title: "Study Library",
      description:
        "Your notebook, a focus timer, a study checklist and your own PDFs. Ready to use, with or without a course.",
      href: preview ? "/study-room-preview" : "/study-room",
    },
  ];
  const choose = useCallback((id) => {
    const current = ++request.current;
    document.querySelector(".uni-stage")?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    setError("");
    setLoaded(false);
    setArrived(false);
    setSelection(id);
    loaders[id]()
      .then(() => {
        if (request.current === current) setLoaded(true);
      })
      .catch(() => {
        if (request.current === current)
          setError("This room could not load. Please try again.");
      });
  }, []);
  const finish = useCallback(() => setArrived(true), []),
    fallback = useCallback(() => setSimple(true), []);
  useEffect(
    () => () => {
      request.current++;
    },
    [],
  );
  useEffect(() => {
    if (selection && arrived && loaded) {
      const dest =
        selection === "classroom"
          ? preview
            ? "/classroom-preview"
            : "/classroom"
          : selection === "study"
            ? preview
              ? "/study-room-preview"
              : "/study-room"
            : "/speaking-practice";
      navigate(dest, { state: { fromEntrance: true, chosenRoom: selection } });
    }
  }, [selection, arrived, loaded, preview, navigate]);
  const selected = spaces.find((s) => s.id === selection);
  const cancel = () => {
    request.current++;
    setSelection(null);
    setArrived(false);
    setLoaded(false);
    setError("");
  };
  return (
    <section className="ls-page uni-page campus-destinations-v18">
      <header className="campus-header">
        <div>
          <span className="ls-eyebrow">THE LIVING LEARNING CAMPUS</span>
          <h1>A campus for your learning day.</h1>
          <p>
            Choose a place to learn, a quiet desk to focus, or a little time for
            your voice.
          </p>
        </div>
        <AvatarChooser />
      </header>
      {preview && (
        <p className="campus-preview">
          Try your workspace freely. Sign in for immersive rooms and shared study features.
        </p>
      )}
      <div className="campus-destinations">
        {spaces.map((space) => (
          <article
            key={space.id}
            className={`campus-place campus-place--${space.id}`}
          >
            <Link
              className="campus-place-visual"
              to={space.href}
              aria-label={`Enter ${space.title}`}
              onPointerEnter={() => loaders[space.id]().catch(() => {})}
            >
              <CampusPreview
                kind={space.id === "study" ? "library" : "classroom"}
              />
              <span>
                {space.id === "study" ? "A space to focus" : "A place to learn"}
              </span>
            </Link>
            <div className="campus-place-body">
              <span className="platform-eyebrow">
                {space.id === "study"
                  ? "02 / Independent & shared study"
                  : "01 / Lessons & materials"}
              </span>
              <h2>{space.title}</h2>
              <p>{space.description}</p>
              <p className="campus-room-details">
                {space.id === "study"
                  ? "Free workspace · No enrollment required · Optional 3D library"
                  : "Free lesson player · Your own videos · Optional 3D classroom"}
              </p>
              <Link
                className="campus-button campus-button-primary"
                to={space.href}
              >
                Enter {space.id === "study" ? "Study Library" : "Classroom"}
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="campus-secondary-entry">
        <div>
          <Languages size={22} />
          <div>
            <h2>Speaking Practice</h2>
            <p>
              Record, replay and listen to your own reading. Course
              conversations appear when published.
            </p>
          </div>
        </div>
        <Link className="campus-link" to="/speaking-practice">
          Explore practice <ArrowRight size={16} />
        </Link>
      </div>
      <div className="campus-explore-entry">
        <div>
          <h2>A little more curious?</h2>
          <p>
            Explore the university entrance. You can also enter any room
            directly above.
          </p>
        </div>
        <button
          className="campus-button campus-button-secondary"
          aria-expanded={entranceOpen}
          onClick={() => {
            cancel();
            setEntranceOpen((v) => !v);
          }}
        >
          {entranceOpen ? "Close campus preview" : "Explore the entrance"}
        </button>
      </div>
      {entranceOpen && (
        <div className="uni-stage">
          <div className="uni-stage-top">
            <span>THE UNIVERSITY ENTRANCE</span>
            <button
              className="ls-button"
              disabled={Boolean(selection)}
              onClick={() => setSimple((v) => !v)}
            >
              {simple ? "Explore in 3D" : "Use simple view"}
            </button>
          </div>
          <EntranceBoundary key={simple ? "simple" : "3d"} onError={fallback}>
            {simple ? (
              <SimpleEntrance
                selection={selection}
                onArrive={finish}
                onChoose={choose}
              />
            ) : (
              <Suspense
                fallback={
                  <div className="uni-loading">
                    Opening the university gates…
                  </div>
                }
              >
                <UniversityScene
                  selection={selection}
                  ready={loaded}
                  onArrive={finish}
                  onChoose={choose}
                  onError={fallback}
                />
              </Suspense>
            )}
          </EntranceBoundary>
          <div className="uni-stage-caption" role="status">
            {selected
              ? `${arrived ? "Opening" : "On your way to"} ${selected.title}…`
              : "Choose a room above or enter through a doorway."}
            <span>
              {selected ? (
                <>
                  <button onClick={() => setArrived(true)}>
                    Enter directly
                  </button>
                  <button onClick={cancel}>Cancel</button>
                </>
              ) : (
                ""
              )}
            </span>
          </div>
        </div>
      )}
      {error && (
        <div className="ls-error" role="alert">
          {error}
          <button
            className="ls-button"
            onClick={() => {
              choose(selection);
              setArrived(true);
            }}
          >
            Try again
          </button>
          <button className="ls-button" onClick={cancel}>
            Choose another room
          </button>
        </div>
      )}
      {import.meta.env.DEV && !preview && (
        <Link className="ls-back" to="/learning-spaces-preview">
          Try the campus without signing in →
        </Link>
      )}
    </section>
  );
}
