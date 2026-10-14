import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Languages,
  Monitor,
  NotebookPen,
} from "lucide-react";
import { useAppContext } from "../state/AppContext.jsx";
import { useCatalog } from "../courses/Catalog.jsx";
import { LearningNext } from "../learning/review/LearningNext.jsx";
import { CampusPreview } from "../components/CampusPreview.jsx";
export function HomePage() {
  const { state } = useAppContext(),
    catalog = useCatalog();
  return (
    <div className="platform-page home-page living-home campus-home-v18">
      <section className="campus-home-hero" aria-labelledby="home-title">
        <div className="campus-home-intro">
          <p className="platform-eyebrow">
            LUGAISH · THE LIVING LEARNING CAMPUS
          </p>
          <h1 id="home-title">
            Learn a language.
            <br />
            <em>Find your place.</em>
          </h1>
          <p className="campus-home-lead">
            A calm place for Arabic and English learning. Make room for your
            next lesson, a little speaking practice, or time at your library
            desk.
          </p>
          <div className="platform-actions">
            <Link
              className="campus-button campus-button-primary"
              to="/learning-spaces"
            >
              Discover your campus <ArrowRight size={18} />
            </Link>
            <Link
              className="campus-link"
              to={state.isLoggedIn ? "/daily-lessons" : "/pricing"}
            >
              {state.isLoggedIn ? "My Classes" : "Course availability"}{" "}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="campus-language-line">
            <span lang="ar" dir="rtl">
              العربية
            </span>
            <span>English</span>
            <span>One learning campus</span>
          </div>
        </div>
        <figure className="campus-home-scene">
          <CampusPreview kind="library" eager />
          <figcaption>
            <span>Inside the Study Library</span>
            <Link to="/learning-spaces">
              Find a place to focus <ArrowRight size={17} />
            </Link>
          </figcaption>
        </figure>
      </section>
      <section className="campus-availability" aria-label="Course availability">
        <BookOpen size={21} />
        <div>
          <strong>
            {catalog.loading
              ? "Checking course availability…"
              : catalog.error
                ? "Course availability could not be checked"
                : catalog.courses.length
                  ? "Explore published courses"
                  : "No courses are available yet."}
          </strong>
          <p>
            {catalog.error ||
              (catalog.loading ? "Checking availability. You can explore the campus while we load the catalog." : !catalog.courses.length
                ? "No courses are available yet. New courses will be announced soon."
                : "Enrollment and lesson access are verified for your account.")}
          </p>
        </div>
        {catalog.error ? (
          <button className="campus-link" onClick={catalog.retry}>
            Try again
          </button>
        ) : (
          <Link className="campus-link" to="/pricing">
            View Courses & Fees <ArrowRight size={16} />
          </Link>
        )}
      </section>
      {state.isLoggedIn && <LearningNext />}
      <section
        className="platform-section campus-home-destinations"
        aria-labelledby="home-destinations"
      >
        <div className="platform-section-heading">
          <div>
            <p className="platform-eyebrow">
              A PLACE FOR EVERY PART OF YOUR DAY
            </p>
            <h2 id="home-destinations">What would you like to do?</h2>
          </div>
          <Link className="campus-link" to="/learning-spaces">
            Explore campus <ArrowRight size={16} />
          </Link>
        </div>
        <div className="campus-home-room-grid">
          {[
            {
              kind: "classroom",
              Icon: Monitor,
              title: "Follow a lesson",
              desc: "An immersive classroom for your authorized lessons and materials.",
              href: "/classroom",
              label: "Classroom",
            },
            {
              kind: "library",
              Icon: BookOpen,
              title: "Find your focus",
              desc: "A quiet desk for notes, a timer and your personal study goal.",
              href: "/study-room",
              label: "Study Library",
            },
          ].map(({ kind, Icon, title, desc, href, label }) => (
            <article className="campus-home-room" key={kind}>
              <Link to={href} aria-label={"Open " + label}>
                <CampusPreview kind={kind} />
              </Link>
              <div>
                <p className="platform-eyebrow">
                  <Icon size={16} />
                  {label}
                </p>
                <h3>{title}</h3>
                <p>{desc}</p>
                <Link className="campus-link" to={href}>
                  Enter {label} <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="campus-speaking-invitation">
          <Languages size={26} />
          <div>
            <h3>Make a little room for your voice.</h3>
            <p>
              Record and replay your own reading. Published course conversations
              appear when available.
            </p>
          </div>
          <Link
            className="campus-button campus-button-secondary"
            to="/speaking-practice"
          >
            Open Speaking Practice <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section
        className="campus-learning-rhythm"
        aria-labelledby="learning-rhythm"
      >
        <div>
          <p className="platform-eyebrow">
            SMALL STEPS, WITH A CLEAR DIRECTION
          </p>
          <h2 id="learning-rhythm">
            A learning rhythm
            <br />
            that feels like yours.
          </h2>
        </div>
        <ol>
          {[
            {
              Icon: BookOpen,
              title: "Learn when a lesson is available",
              text: "Open published content from your enrolled course.",
            },
            {
              Icon: NotebookPen,
              title: "Try it, then review",
              text: "Save checked answers and revisit questions that need another look.",
            },
            {
              Icon: Languages,
              title: "See your next step",
              text: "Use your verified progress to decide what to practise next.",
            },
          ].map(({ Icon, title, text }, i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <div>
                <Icon size={20} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
