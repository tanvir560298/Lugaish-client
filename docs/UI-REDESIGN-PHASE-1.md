# Premium UI redesign: protection audit and Phase 1

## Protection audit (recorded before styling changes)

- Existing `/course/:language`, `/lesson/:day`, quiz, daily lessons, speaking practice, interview, progress, profile and staff routes remain registered in App.jsx. Classroom still uses ProtectedCourseRoute; study room uses ProtectedRoute.
- Paid Batch uses the `paid_batch` identifier, account private-batch entitlement/revocation, authorized email linkage and month-tier checks. Backend lesson and catalogue routes reject unapproved learners. Payment/bank/status/submission/admin confirmation routes remain in `server/src/routes/payment.js`. No route or enrollment logic will change in this phase.
- Arabic and English definitions remain in `courseData.js`; CoursePage, LessonPage, authenticated day-modules/lesson/progress endpoints and launch/scheduling checks remain intact. No content or progress records will be renamed/deleted.
- Authentication uses Firebase client sign-in plus existing Express JWT/roles. UI theme lives in AppContext and `data-theme`; preserve that switch and saved preference.
- React/Vite JavaScript, Three/R3F/Drei. Existing course UI mixes Tailwind utilities with global legacy CSS; newer campus pages use scoped CSS. Current colors include blue/purple button gradients, navy surfaces and independently defined light-theme overrides.

## Regression checklist

Arabic/English routes and curricula; paid approved/unapproved/revoked learners and direct API access; paid month tiers; enrollment/payment actions; saved course/video progress; sign-in and staff tools; avatar selection; classroom playback/fullscreen; library seats/notes/goals/timers/PDFs; mobile links; theme switch; Arabic/RTL presentation.

Critical sources were fingerprinted before editing to verify this styling-only phase does not change routes, content, API, enrollment, payment or permissions. Backend integration tests run only against an isolated temporary database, never production student records.

## Phase 1 implementation

Changed files:

- `src/styles/designTokens.css`: semantic dark/light palette, Latin/Arabic fallback typography, type/spacing scales, radii, restrained elevation, action/status/focus and control-border colors. Existing `--page-bg`, `--surface-bg`, `--text-*` aliases remain compatible.
- `src/styles/campus.css`: shared section cards, primary/secondary legacy buttons, badges, form controls, visible keyboard focus; reusable `campus-button`, `campus-link`, `campus-tabs`, `campus-dialog`, `campus-progress`, loading/empty/error primitives for later phases. Removes global background grid/glow and button gradients. Uses logical properties and reduced-motion rules. Existing dedicated classroom/library CSS remains scoped.
- `src/main.jsx`: loads the design system after legacy global styles.
- `tailwind.config.js`: existing background/surface/shadow aliases point to shared tokens; brand accent aliases use forest/gold tones. No dependency added.
- `tests/designTokens.test.mjs`: real luminance/contrast checks for semantic text, links/status colors, primary actions, focus outlines and control boundaries in both themes.
- This audit document.

Existing buttons/cards/forms receive the styling through their existing classes; no action, handler, course ID or URL changes. New tab/dialog primitives provide styling only: future React components must still implement ARIA behavior and focus management. This phase does not rearrange navigation, replace page content or advertise future subjects as available.

## Verification and acceptance limits

- All 37 unit tests pass after adjusting the light input boundary to meet its contrast threshold.
- Paid Batch real HTTP/Mongo integration passes for approved, unapproved and explicitly revoked learners, including catalogue and direct lesson URLs. Isolated synthetic accounts only; no real enrollment changes.
- Fingerprints match for App routes, AppContext, API client, course definitions, CoursePage, LessonPage, PricingPage, User schema and backend auth/lessons/payment/progress routes. Arabic/English content, enrollment, progress and payment logic were not edited.
- Production build passes; existing >500 kB main/Three bundle warnings remain.

Token tests validate WCAG AA contrast of the listed semantic pairs, not WCAG compliance of every rendered page. Existing page-specific blue/purple utilities, gradients and hardcoded colors still need phased cleanup; semantic muted gold is decorative, not a universally safe small-text color. Arabic uses available system fonts without a new font download and requires correct `lang`/`dir` markup on Arabic passages. Browser automation inventory returned no available browsers, so screenshot QA, actual light/dark rendering, RTL/mixed text, mobile touch/focus, sign-in, Arabic/English playback/progress, payment UI, staff UI, avatar and classroom/library interactions remain manual acceptance checks. None is claimed as browser-tested.

No database migration, authorization changes, paid service or content deletion. Highest visual risk is legacy page-specific CSS interacting with the new shared colors; verify light theme and rich learning pages first. Next phase: navigation and Learning Spaces hierarchy, retaining all destinations and the backend-verified Paid Batch visibility rule. Do not proceed to wholesale application rewrites.
