# Programming self-study architecture

One data-driven Java mini-path, three original lessons: program structure, variables and if/else decisions. It is intentionally labeled introductory, not a complete Java curriculum. All lessons have objectives, explanations, highlighted code, expected output, editable nonexecuting drafts, hints, solutions and a deterministic MCQ with feedback. Completion requires a correct checked answer plus self-confirmed exercise practice.

`src/learn/content.js` owns content and progress sanitization; `LearnPages.jsx` supplies discovery, overview and reusable lesson renderer; `learn.css` supplies isolated responsive styles. Routes are lazy loaded. More paths can extend this structure; no independent page per lesson is needed.

Progress is localStorage-only, scoped by signed-in email or guest, sanitized against known IDs. It survives browser reload where storage is available, does not sync across devices and is not secure server-authoritative evidence. Drafts are not persisted. Errors are surfaced. Self-study never changes official quiz records, grades, XP, certificates or paid enrollment. Code is not run: this is code-reading/tracing practice, not a compiler.

Future execution requires a separately isolated sandbox service: no production-server shell execution, no credentials/network by default, strict CPU/memory/time/output limits, per-user limits and explicit execution consent. That service and server-synced progress are outside this implementation.
