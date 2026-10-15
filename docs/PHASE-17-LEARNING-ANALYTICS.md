# Phase 17 — My Learning Progress

Implemented locally on 12 October 2026. No public deployment. Launch NO-GO remains.

## Findings and implemented slice

The old `/progress` screen derived progress from browser state, assumed 30 lessons, and painted a repeating artificial heatmap. It has been replaced with an authenticated personal academic workspace backed by verified MongoDB records. The main local `/api/courses` remains `[]`; no course or public learner history was fabricated.

Implemented:
- Four defined overview metrics, selected-period practice accuracy with distinct first/repeat/review denominators, current review insights, useful activity bars, paginated recent activity, Phase 16 next steps, daily focus evidence and explicit empty/error states.
- Last 7 days, last 30 days and all available records filters. Native buttons support keyboard and touch.
- Current accessible published course title and student time zone identify the context. No global score, invented levels, leaderboard or simulated activity.
- Home/My Classes next-step card links to My Learning Progress.
- Browser-local goals may show achievement from relevant verified events today. Opening a destination never completes a goal. Study time remains unavailable without server-verified focus records.
- Instructor analytics stays closed because the current global `manage_lessons` role does not establish an instructor-to-course assignment. No unrestricted student analytics view was added.

## Data and metric definitions

All source timestamps are stored as UTC dates. Dates are grouped/displayed in a validated client-requested time zone (normally the student's browser zone). Seven/thirty-day windows include today and the preceding six/twenty-nine local calendar days. Future or invalid timestamps are excluded. First/repeat classification uses the available full scoped history before filtering the date range.

Only the authenticated student's Arabic/English records from the current published generation and currently unlocked, published, entitled lessons are considered. Archived/unpublished lessons, old generations, un-enrolled languages and premium content without entitlement are excluded. Future scheduled courses have no available next lesson.

| Metric | Definition |
| --- | --- |
| Completed lessons | Distinct current accessible days first completed in the selected period. Complete quiz submission is the backend's existing completion criterion, regardless of percentage; non-quiz lessons use dated Progress receipts. This does not assert passing or mastery. |
| Practice sessions | Unique complete server-evaluated quiz receipts in the period. Abandoned/browser drafts are excluded. |
| Questions answered / correct answers | Evaluated answer count / correct evaluated count across those quiz receipts. Repeated submissions count as separate sessions and answers. |
| First practice accuracy | Correct / evaluated answers in the earliest comparable quiz receipt for each day and current content. |
| Repeat practice accuracy | Correct / evaluated answers in later complete receipts. Kept separate from first submissions. |
| Review accuracy | Correct / evaluated single-question retries from valid owner-scoped source receipts. |
| Review insights | Pending and successfully reviewed questions from the latest comparable incorrect quiz answers. Successful retry means reviewed correctly once, not permanent mastery. Retry count covers the selected period; current pending/successful counts cover current accessible latest questions independent of the period. |
| Activity | Unique complete practice submissions, valid targeted retries and dated non-quiz lesson completions. Quiz completion is not duplicated as a second lesson event. |
| Focus time | Unavailable. Existing Library history is browser-local, not a verified academic measurement; opening/resuming the Library is never counted. |

Quiz fingerprints must match current reviewed question text, choices, keys and explanations. Responses must be complete, valid and consistent with server correctness. Old receipts without fingerprints, changed question content and malformed/missing records are excluded with an omission notice. Aggregate statistics do not silently reinterpret old answers against changed curriculum.

Quiz events deduplicate by saved ID. Retries deduplicate by owner-scoped request ID (the existing Phase 16 unique index prevents duplicate requests). Lesson completion deduplicates by day, choosing the earliest dated receipt. Accuracy denominators never include unanswered questions. No extra completion, XP or progress is awarded by analytics.

## API, bounds and privacy

`GET /api/analytics/:language?range=7|30|all&zone=…&page=…`:
- JWT authentication and live account/enrollment checks.
- Student-only ownership query; caller-supplied user IDs are ignored. Staff role does not bypass enrollment or premium scope.
- Explicit successful empty response when no current published course exists.
- Validated range, time zone and page (1–500), ten recent events per page.
- Each query caps quiz and review history at 5,001 records, and Progress documents at eleven. If the 5,000/ten safe processing limits are exceeded, overview/accuracy/review/goal totals are **unavailable**, not truncated figures represented as complete. This is an explicit limit, not a claim of unlimited analytics scalability.
- Published lesson definitions are capped at 365. Chart renders the most recent ninety active days at most, with a truncation notice; overview totals still cover the selected range within safe processing limits.
- New owner/language/generation/completion-time indices support the bounded receipt queries.
- API exposes counts, necessary course/lesson titles, generic event types and timestamps. No email roster, raw responses, private notes, chat content, voice recordings or third-party tracking.

`GET /api/analytics/instructor` authenticates and returns 403 `COURSE_SCOPE_REQUIRED`. No instructor interface is enabled until explicit assignment/authorization and scope tests exist. A role alone is insufficient.

Analytics derives records without adding a second event store or retention policy. Existing account deletion removes Quiz, Progress and ReviewAttempt records. Goals remain browser-local and do not become authoritative academic data. Live AI is disabled; no provider credentials or learner data transfer was introduced.

## Daily goals

The existing goal tool now optionally receives verified events for today from this authenticated analytics endpoint:
- Complete one available lesson: dated verified lesson completion today.
- Finish an eligible practice activity: complete evaluated submission today.
- Review mistakes: a verified correct targeted retry today.

Selected intentions and verified completed activity remain separate. No activity-opening signal qualifies. A focus-duration intention cannot become verified achieved because focus duration is unavailable. Browser goal text/storage is unchanged and does not control server progress. Other arbitrary intentions are not automatically evaluated.

## Files changed

Backend repository:
- `src/services/learningAnalytics.js`: pure calculations, dates, deduplication, ranges and activity paging.
- `src/routes/analytics.js`: bounded authenticated analytics and disabled instructor boundary.
- `src/index.js`: mount `/api/analytics`.
- `src/models/Quiz.js`, `src/models/ReviewAttempt.js`: scoped completion-time query indices.
- `src/services/learningAnalytics.test.js`, `src/routes/analytics.integration.test.js`: unit and isolated MongoDB access tests.

Frontend:
- `src/pages/ProgressPage.jsx`: actual replacement for the old progress screen.
- `src/learning/analytics.css`: responsive, calm data presentation and focus styling.
- `src/api/client.js`: authenticated analytics request.
- `src/learning/goalProgress.js`, `src/learning/DailyGoal.jsx`, `tests/goalProgress.test.mjs`: relevant daily-goal evidence.
- `src/learning/review/LearningNext.jsx`: progress entry link.
- `scripts/qa/personalizedFixture.mjs`: reused isolated fixture server with analytics and optional empty catalog.
- `scripts/qa/analyticsJourney.mjs`, this report and `docs/visual-checks/phase17-*`: browser verification evidence.

No avatar, animation, camera, seating, chat, media or OAuth-provider code was changed.

## Tests and browser evidence

- `npm test`: **175 passed**.
- `npm run test:integration`: **10 passed**.
- Production build passed. Existing large 3D chunk warning remains.
- `npm run lint`: JavaScript/JSX syntax checks passed (not semantic ESLint).
- Calculation tests cover first/repeat/review separation, duplicate IDs, malformed/changed data, local date boundaries, filtering before/after first classification, missing focus, partial totals, paginated events and deduplicated completion.
- Integration tests cover unauthorized requests, actual student ownership, unenrolled accounts, denied instructor access, invalid zone/page, empty catalog, premium removal, archived lessons/courses and future course availability.
- Goal tests require relevant verified daily events and reject opening/unrelated activity or unverified duration.

Browser used real React pages and real authenticated APIs against isolated temporary MongoDB databases. The fixture course is visibly **DEVELOPER FIXTURE**. A verified first quiz and repeat quiz produced separate 1/2 accuracy denominators. A correct retry updated review insights, recent activity and a previously selected goal. Reload retained server history and the local intention. Keyboard Space activated the period filter. A simulated QA HTTP 503 displayed a useful error and Retry recovered. Logged-out access redirected to Login.

Verified **1440×900**, **768×900**, **390×844** with no horizontal overflow. Screenshots were visually inspected; sticky-header spacing was refined. The populated run and separate no-course run both passed. Native Enter automation initially did not activate the headless button; the final test uses standard native Space activation and passes. This was not used to claim physical-device testing.

Screenshots:
- `visual-checks/phase17-dashboard-1440.png`, `phase17-dashboard-768.png`, `phase17-dashboard-390.png`
- `visual-checks/phase17-accuracy-390.png`, `phase17-review-insights-390.png`, `phase17-activity-390.png`
- `visual-checks/phase17-no-activity-1440.png`
- `visual-checks/phase17-empty-catalog-1440.png`, `phase17-empty-catalog-390.png`
- `visual-checks/phase17-error-390.png`
- `visual-checks/phase17-journey.json`, `phase17-empty.json`

These are isolated developer records, not actual enrolled student outcomes. No instructor screenshot is supplied because the interface is intentionally disabled. No claim that educational outcomes improved follows from these tests.

## Limits, release status and Phase 18

Current catalog is empty. Older results without question fingerprints remain excluded from comparable question analytics. Paid Batch analytics is not supported and existing private enrollment rules remain unchanged. Server-verified focus time, instructor course assignments, durable unlimited-history aggregation and additional validated exercise types are future work. Real Arabic curriculum/physical Bengali-device rendering were not newly certified here; Unicode titles use automatic direction and existing typography. All-period charts show at most ninety active days, explicitly labeled when limited.

Phase 14 launch **NO-GO remains**. Actual Google authentication, authorized private lecture playback, protected staging, monitoring, rollback rehearsal and physical mobile testing remain unresolved unless separately verified. This phase does not redeploy or recertify 3D scenes or claim readiness for 100 concurrent users.

Recommended Phase 18: publish instructor-reviewed Arabic/English curriculum; validate usefulness with consented real enrolled beta students; establish explicit instructor-to-course assignment and narrowly scoped aggregate endpoints; add a trustworthy focus-session/event persistence design before reporting study duration; then extend bounded aggregation for longer histories and independently validate mobile accessibility and existing launch blockers.
