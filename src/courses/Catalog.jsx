import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useAppContext } from "../state/AppContext.jsx";
import { ROLES, isStudentPreview } from "../utils/roles.js";
export function useCatalog() {
  const [result, setResult] = useState({
      loading: true,
      courses: [],
      error: "",
    }),
    [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setResult({ loading: true, courses: [], error: "" });
    api
      .getCourses()
      .then((data) => {
        if (active)
          setResult({
            loading: false,
            courses: Array.isArray(data)
              ? data.filter((c) => c.status === "published")
              : [],
            error: "",
          });
      })
      .catch(() => {
        if (active)
          setResult({
            loading: false,
            courses: [],
            error: "Course availability could not be checked. Please retry.",
          });
      });
    return () => {
      active = false;
    };
  }, [version]);
  return { ...result, retry: () => setVersion((v) => v + 1) };
}
export function EmptyCatalog({
  error = "",
  retry,
  title = "No courses are available yet.",
}) {
  return (
    <section className="platform-page">
      <div className="campus-card platform-closing">
        <div>
          <p className="platform-eyebrow">YOUR NEXT CHAPTER</p>
          <h1>
            {error ? "Course availability is temporarily unavailable" : title}
          </h1>
          <p>
            {error ||
              "No courses are available yet. New courses will be announced soon."}
          </p>
          <p>Your saved study tools and account remain available.</p>
          {error && (
            <button
              className="campus-button campus-button-primary"
              onClick={retry}
            >
              Retry catalog
            </button>
          )}
          <div className="platform-actions">
            <Link
              className="campus-button campus-button-primary"
              to="/study-room"
            >
              Open Study Library
            </Link>
            <Link
              className="campus-button campus-button-secondary"
              to="/classroom"
            >
              Visit Classroom
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
export function CatalogGuard({ children, staff = false, fallback }) {
  const { state } = useAppContext(),
    catalog = useCatalog();
  if (
    staff &&
    !isStudentPreview(state) &&
    [ROLES.webDeveloper, ROLES.instructor, ROLES.editor].includes(
      state.userRole,
    )
  )
    return children;
  if (catalog.loading)
    return (
      <div className="platform-page" role="status">
        Checking published courses…
      </div>
    );
  if (!catalog.loading && !catalog.error && !catalog.courses.length && fallback)
    return fallback;
  if (catalog.error || !catalog.courses.length)
    return <EmptyCatalog error={catalog.error} retry={catalog.retry} />;
  return children;
}
export function CatalogNotice() {
  const catalog = useCatalog();
  return (
    <section className="platform-section campus-card">
      <p className="platform-eyebrow">COURSE AVAILABILITY</p>
      <h2>
        {catalog.loading
          ? "Checking course availability…"
          : catalog.courses.length
            ? "Published courses"
            : "No courses are available yet."}
      </h2>
      <p>
        {catalog.error ||
          (!catalog.courses.length
            ? "No courses are available yet. New courses will be announced soon."
            : "Explore currently published courses. Enrollment and lesson access are verified separately.")}
      </p>
      {catalog.error && (
        <button className="campus-button" onClick={catalog.retry}>
          Retry catalog
        </button>
      )}
      {catalog.courses.map((c) => (
        <Link
          key={c.language}
          className="campus-button campus-button-secondary"
          to={"/course/" + c.language}
        >
          {c.title}
        </Link>
      ))}
    </section>
  );
}
