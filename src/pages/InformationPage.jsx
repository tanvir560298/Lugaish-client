import { Link } from "react-router-dom";
const sections = {
  privacy: {
    title: "Your information and study tools",
    items: [
      [
        "Your account",
        "Google sign-in uses Firebase. Lugaish stores account information, course eligibility and learning records on its server. Session tokens are stored in this browser; sign out on shared devices.",
      ],
      [
        "Your study work",
        "Notes, focus settings, goals and avatar preferences use local browser storage. Clearing browser data can remove locally saved work. These tools are not an off-device backup.",
      ],
      [
        "Rooms and messages",
        "Group membership and seat assignment are checked by the server. Study room and message records have expiry policies; temporary table chat is not a permanent conversation archive.",
      ],
      [
        "Voice practice",
        "Local recordings stay in page memory and are deleted when you retry, leave or hide the page. Browser speech recognition, when enabled in a supplied activity, may use an external browser service. No real conversational AI provider is currently configured.",
      ],
      [
        "Operational checks",
        "If enabled by the operator, diagnostic reporting sends only a fixed failure category. It does not send notes, chat, recordings, tokens or stack traces. Hosting and Google services may maintain their own operational logs.",
      ],
    ],
  },
  terms: {
    title: "Using Lugaish",
    items: [
      [
        "Learning availability",
        "The active course catalog is currently empty. Future courses require publication; paid and private content requires the appropriate account access. Account creation does not purchase or enroll you in an unpublished course.",
      ],
      [
        "Respectful study",
        "Use private group chat with your group and respect other learners. Do not share restricted materials or attempt to bypass enrollment or room permissions.",
      ],
      [
        "Study records",
        "Keep a separate copy of important locally saved notes. Temporary voice recordings and expiring room messages are not permanent storage.",
      ],
      [
        "Owner review",
        "This page describes platform behavior. Formal commercial terms, refund policies and retention commitments must be confirmed by the platform owner before paid enrollment opens.",
      ],
    ],
  },
  support: {
    title: "Help with your learning space",
    items: [
      [
        "Trouble loading",
        "Check your connection and retry. For a 3D rendering problem, use the available 2D or lower-quality view. For microphone errors, check browser permission and try a new recording.",
      ],
      [
        "Report a problem",
        "Include the page, approximate time, device and steps to reproduce. Include an API request ID if shown. Do not send passwords, session tokens, private messages or recordings.",
      ],
      [
        "Account requests",
        "Use the existing Lugaish support contact below for account or access questions. Availability and response times are confirmed by the owner.",
      ],
    ],
  },
};
export function InformationPage({ kind }) {
  const page = sections[kind];
  return (
    <div className="platform-page">
      <header className="platform-page-heading">
        <p className="platform-eyebrow">LUGAISH INFORMATION</p>
        <h1>{page.title}</h1>
      </header>
      {page.items.map(([title, text]) => (
        <section
          className="campus-card"
          style={{ padding: "1.5rem", marginBottom: "1rem" }}
          key={title}
        >
          <h2>{title}</h2>
          <p>{text}</p>
        </section>
      ))}
      {kind === "support" && (
        <a className="campus-button" href="mailto:lugaish2026@gmail.com">
          Contact Lugaish
        </a>
      )}
      <p>
        <Link to="/privacy">Privacy information</Link> ·{" "}
        <Link to="/terms">Platform use</Link> ·{" "}
        <Link to="/support">Support</Link>
      </p>
    </div>
  );
}
