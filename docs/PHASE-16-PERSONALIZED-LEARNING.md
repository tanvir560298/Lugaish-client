# Phase 16 — Verified practice and personalized review

Implemented locally on 12 October 2026. No public deployment.

## Findings and scope

The running local API's `/api/courses` returned `[]` before implementation and remains empty. Phase 10's catalog reset remains intact. There is no real published curriculum to demonstrate a real student's learning journey today. The existing production quiz supports multiple-choice questions checked on the server; blank, matching and ordering activities exist only in the developer practice engine. Goals and speaking drafts are browser preferences, not verified mastery. No secure live language-help AI provider is configured.

This phase completes one supported vertical slice: authorized published multiple-choice activity → server-verified feedback → persistent wrong-answer review → targeted retry → verified review completion → explained next action. It does not publish demonstration courses or label local checks as server-confirmed progress.

## Student experience

- Signed-in Home and My Classes show a compact next-step card: review saved mistakes first, then the currently accessible lesson, plus a Study Library focus action. Reasons explain the underlying evidence. A completed available lesson is explicitly a revisit, not an invented new lesson.
- `/review-mistakes` displays prior incorrect answers, supplied choices, saved retry feedback, course-team explanations when supplied, and the comparison between previous and current answers. Correct retry automatically marks review complete. Incorrect retry remains open. Reload restores verified retry feedback.
- Quiz submission and restored current-content quiz results expose individual server-checked feedback. Lesson and quiz pages link into the review workspace.
- Existing daily focus remains an optional browser intention. Review does not award XP, unlock lessons, claim mastery, assess pronunciation or automatically complete a personal goal.
- Arabic questions and choices use RTL and Arabic language metadata, with diacritics preserved. English interface text remains readable. This live slice evaluates supplied choice indices; it does not pretend typed-answer evaluation is supported by the production backend. Existing developer input tests cover English case/whitespace normalization and Arabic hamza/diacritic distinctions.
- Context help uses course-team supplied explanations. Missing explanations are acknowledged. Live AI help is explicitly unavailable; no learner answers go to an external AI provider. No Bengali translations were invented.

## Evidence and access rules

New quizzes save a SHA-256 content fingerprint covering question text, ordered choices, answer keys and explanations. Review uses only the latest verified attempt per day whose fingerprint matches the currently accessible published lesson. Changed content, archived/draft lessons, obsolete course generations, locked days and inaccessible premium lessons are excluded. Legacy receipts are retained, but older attempts without fingerprints cannot safely become targeted review questions.

`GET /api/learning/:language` and `POST /api/learning/:language/retry` authenticate the student and load enrollment, publication generation, calendar/progression access and premium entitlement from MongoDB. Staff accounts receive student-level access for these endpoints. Only Arabic and English are supported; Paid Batch authorization/contracts are untouched. No submitted user ID, local completion flag or client-provided answer key is authoritative.

A `ReviewAttempt` stores authenticated owner, source quiz, generation, language, question, selected answer and server correctness. A unique owner/request-ID index makes duplicate retries idempotent. Reusing an ID with a different answer returns 409. Retry is rate limited. Review does not mutate course completion or rewards. GET derives next actions from owner-scoped saved quizzes/progress, not browser drafts.

## Files changed in this phase

Backend (inside the existing `server/` repository):
- `src/models/Quiz.js`: optional immutable-content fingerprint on new receipts.
- `src/models/ReviewAttempt.js`: owner-scoped retry persistence and idempotency index.
- `src/services/personalizedLearning.js`: validated content fingerprinting, review derivation, deterministic recommendation rules.
- `src/routes/learning.js`: authenticated overview/retry API.
- `src/routes/quiz.js`: strict actual-option validation, content fingerprint, per-question verified feedback including current-content restored receipts.
- `src/index.js`: mount learning API.
- `src/routes/auth.js`: include new review records in existing authorized account-deletion cleanup.
- `src/services/personalizedLearning.test.js`, `src/routes/learning.integration.test.js`: focused unit and isolated MongoDB journey tests.

Frontend:
- `src/learning/review/LearningNext.jsx`, `ReviewPage.jsx`, `review.css`: next actions, accessible review workspace and responsive presentation.
- `src/api/client.js`: learning API calls through existing authenticated client.
- `src/App.jsx`: lazy authenticated review route.
- `src/pages/HomePage.jsx`, `DailyLessonsPage.jsx`: returning-student recommendations.
- `src/pages/QuizPage.jsx`, `src/courses/PublishedLesson.jsx`: feedback and review entry points.
- `scripts/qa/personalizedFixture.mjs`, `personalizedJourney.mjs`: isolated authenticated browser test harness.
- This report and `docs/visual-checks/phase16-*` evidence.

No avatar, camera, study seating, chat, authentication-provider or backend seating contract was modified. No external learning assets or dependencies were added.

## Verification

- `npm test`: **169 passed** (includes native Zain seating/mapping/fallback tests and existing practice normalization tests).
- `npm run test:integration`: **9 passed**, including the new complete authenticated learning journey.
- Production build passed. The existing >500 kB 3D chunk warning remains.
- `npm run lint`: JavaScript/JSX syntax checks passed; this command is not semantic ESLint.
- Browser journey used real React pages and the real authenticated quiz/learning/lesson routes on an isolated temporary MongoDB database. Fixture title visibly says **DEVELOPER FIXTURE**; its `.invalid` student identity is not a real Google sign-in. The user's main database was not seeded.
- Browser verified 1/2 quiz result, per-question feedback, wrong-answer review, keyboard radio selection, correct retry, saved review after reload, next action after resolution, Arabic RTL/diacritics, and unauthenticated redirect to Login.
- Review tested at **1440×900**, **768×900**, **390×844**; no horizontal overflow. Screenshots were visually inspected. Sticky-header spacing on review cards/feedback was refined after inspection.
- Integration tests reject unauthorized access, unenrolled users, cross-student retry/history, invalid option indices, reused IDs with changed payload, premium-access removal, unpublished/edited questions and unsupported Paid Batch language. They verify empty review, unavailable catalog, idempotent retry persistence and zero review XP and removal of review records when the student account is deleted.

Evidence:
- `visual-checks/phase16-published-practice-1440.png`
- `visual-checks/phase16-review-1440.png`, `phase16-review-768.png`, `phase16-review-390.png`
- `visual-checks/phase16-confirmed-retry-390.png`
- `visual-checks/phase16-personalized-home-1440.png`
- `visual-checks/phase16-arabic-review-390.png`, `phase16-arabic-question-390.png`
- `visual-checks/phase16-journey.json`

## Limits and Phase 17 priorities

This is a verified multiple-choice review slice, not a complete AI tutor. Vocabulary spaced review, new production typed/matching/ordering definitions, live AI, pronunciation assessment and Bengali translation need validated course content and separate work. Recommendations do not infer ability or create mastery scores. Historical quizzes without content fingerprints remain readable as aggregate results but are excluded from question retries.

Actual Google OAuth, authorized real lecture playback, protected staging, monitoring/rollback drills, physical phones and 100 simultaneous users were not verified here. Phase 14 launch **NO-GO remains**. Existing 3D code was not modified or visually recertified in this phase. No public deployment occurred.

Phase 17 should prioritize instructor-reviewed Arabic/English content publication and real enrolled beta students, validate recommendation relevance on their consented actual activity, then extend server-validated exercise definitions and vocabulary review. Resolve existing release blockers separately before production launch.
