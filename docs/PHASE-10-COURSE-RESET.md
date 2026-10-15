# Phase 10 — safe course reset and production readiness

## Actual local result

The configured local `lugaish` database was inventoried before mutation. **56 lessons were archived: 30 English and 26 Arabic**, containing 232 quiz questions. No lesson, account, progress record, quiz response or media byte was permanently deleted. There were no MongoDB Course records before this pass; the old catalog was implicit in lesson languages and hardcoded frontend arrays. The active published catalog is now empty.

The existing user remains. The initial backup contained one study room. Final read-only inventory has zero rooms: the backed-up room expired at `2026-10-11T14:12:53.897Z`, and the existing MongoDB TTL index expires rooms automatically. Course reset updates only lessons/courses; it does not restore or extend expired social sessions. The initial room is retained in the verified backup. Existing progress/quiz collections were empty locally. That local count is not a claim about production. Paid Batch/IELTS content also existed as bundled frontend course plans and five local video files; those defaults no longer seed the active catalog.

| Data / references | Action |
|---|---|
| MongoDB lessons and embedded quiz/vocabulary/grammar/speaking data | `publicationStatus: archived`, reversible batch marker; all original fields retained |
| Accounts, enrollments, cumulative XP, certificates, private groups, messages, bank/settings data | Preserved; no reset updates to these collections |
| Historical progress and quiz responses | Preserved. Fresh course generations use separate progress/result/reward scope; old history does not become new course completion |
| Five `public/videos/day-speaking-self-intro-reel-*.mp4` files | Moved to private archive with matching SHA-256 checksums; removed from public asset delivery |
| Legacy COURSE_DATA, learning resource URLs and IELTS plans | Original source privately archived under `server/.private-archive/source/`; delivered course metadata has empty modules, no old answer keys/resource links, and no legacy template seeds |
| Browser v7 Tanvir catalog / v8 plans | Retained as recoverable local history; fresh catalog/plan keys do not auto-seed old entries |
| Classroom, Library, avatars, personal notes/timer/goals, rain, private chat | Infrastructure preserved; Classroom no longer requires a published course merely to enter |
| Independent speaking | Personal reading/recording remains available without course prompts or invented AI/course marks |

## Verified backup and recovery

Backup: `server/.private-archive/course-reset/catalog.json` and its `.sha256` file. Directory mode 0700; backup files mode 0600; archive is ignored by the server repository. Initial verified temporary export also exists at `/tmp/lugaish-phase10-backup/catalog.json`. The export contains private account/configuration records: do not commit it, expose it through static hosting, or attach it to public reports.

The export uses BSON Extended JSON, preserving ObjectIds and dates. Checksum and record counts were verified. A disposable MongoDB integration test executes backup → archive → restore → repeated restore, verifies the original lesson document exactly, and checks independent user/room preservation. No real database is erased by the test.

Commands run from `server/`:

```sh
node scripts/course-reset.mjs inventory --database lugaish
node scripts/course-reset.mjs backup --database lugaish --backup /tmp/your-private-backup/catalog.json
node scripts/course-reset.mjs archive --database lugaish --backup /tmp/your-private-backup/catalog.json
node scripts/course-reset.mjs publication-index --database lugaish --backup .private-archive/course-reset/catalog.json
# Recovery after reviewing conflicts and stopping authoring:
node scripts/course-reset.mjs restore --database lugaish --backup .private-archive/course-reset/catalog.json
```

The exact database name and verified backup are mandatory. Archive refuses a changed snapshot and targets only backed-up record IDs. Restore prevalidates all touched records, rejects later edits, permits safe retry, and restores only archive-touched lessons/course metadata. It does not roll back independent student/group data. Use a maintenance window: standalone MongoDB updates are not a cross-collection transaction. A database restore restores historical data; student exposure still requires explicit reviewed publication under the new closed-by-default policy.

Original media recovery is a file move from `server/.private-archive/videos/` back to its intended delivery location **only after reviewing entitlement and hosting**. Its `manifest.json` records names, sizes and hashes. Do not casually republish paid media into a public folder.

This is a verified local backup, not an off-device disaster-recovery solution. Copy it to approved encrypted storage and test production restoration separately. No production database was connected or reset. No irreversible deletion is pending approval because none was prepared or executed. Future orphan cleanup requires a new inventory, verified backup and explicit deletion approval.

## Student and future-course behavior

Home and Courses & Fees show actual catalog availability without the old launch curriculum or enrollment offer. Account access remains distinct from course access. Empty My Classes/practice/course pages provide Library/Classroom actions. Signed-out routes remain protected. Classroom stays accessible after authentication with an empty lesson catalog; no old bundled paid reel is used as a lecture fallback.

`/manage-courses` is a real publication UI for authorized managers. Existing lesson authoring remains available. Managers can create a draft, save reviewed quiz/material content, publish its lesson, then publish its course. Both lesson publication and the course generation must match. Draft/archived content is blocked at direct student API requests. Tester accounts cannot publish the live catalog.

Starting a new draft from an archived course rotates its generation; previous completion history is not reused. Current catalog is intentionally still empty: no test course was added to the real database. Automated publication checks use disposable fixtures. New student lessons/practice use live authorized content, never legacy arrays/answer keys. Only multiple-choice production quizzes are implemented; other exercise types still require validated course content/publishing integration.

The local lesson uniqueness index was migrated from `(language, day)` to `(language, day, courseGeneration)` after verified backup. New Day 1 can coexist with the archived Day 1. Original index definitions are in the private `.indexes-before.json` snapshot. Run this migration before production authoring, in a maintenance window. Restoring document contents does not restore index definitions; recreate the old unique index only if there are no cross-generation day duplicates. Do not delete historical lessons to force an index rollback.

Existing enrollment/access eligibility is retained; future paid-course publication must review the intended cohort before release. This remains one active course pathway per language, with separate generation-scoped content/progress; it is not a new multi-course enrollment CMS.

## Security changes

- Google-only login now requires verified email plus the signed `google.com` provider claim before privileged-email bootstrap. Previously any Firebase identity with an email reached that path. Claims are read only after Firebase token verification; [official decoded token fields](https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth.decodedidtoken).
- Development authentication no longer fabricates a successful session when the backend fails. Old `local-dev-*` tokens are not accepted as logged-in sessions; Google login always requires the backend response. Client email-based privileged-role inference was removed.
- Tester privileges no longer authorize live account deletion, role/private-batch grants, site or mail administration. Isolated lesson authoring is retained. Boolean batch grants reject string coercion.
- Archived/unpublished course and lesson requests fail closed. Paid catalog visibility and direct access retain enrollment/revocation checks. Existing private room/chat enforcement is unchanged.
- Future quiz keys and materials are validated; material URLs require HTTPS without embedded credentials. Editing content returns a lesson to draft.
- Production boot validation checks JWT strength, real Firebase project and exact HTTPS CORS origins. Development localhost origins are excluded from production defaults.
- Proxy trust is explicit through `TRUST_PROXY`; direct deployments do not trust a client-supplied forwarding header by default. JSON requests are bounded to 1MB; 5xx responses do not expose raw database/provider errors.
- Compatible dependency updates, a patched React Router release and a grpc transitive override were installed. Final `npm audit --omit=dev` reports **zero production findings for both frontend and backend**. This is dependency advisory evidence, not a penetration-test or complete security certification. [Router advisory](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6).

## Verification and rendered evidence

Production build passes. **121 regression tests and 7 isolated MongoDB/API integration tests pass (zero failures, zero skips).** Browser navigation uses a clean QA profile without fabricated authenticated state. Eighteen checks cover Home, Courses & Fees, empty practice, Classroom preview, Library preview and independent speaking at 390, 768 and 1440px; no horizontal overflow or retired curriculum in main content. Team credits remain intentionally intact.

[Browser assertions](visual-checks/phase10-browser.json) · [Home mobile](visual-checks/phase10-home-390.png) · [Pricing mobile](visual-checks/phase10-pricing-390.png) · [Empty classes/practice component](visual-checks/phase10-practice-preview-390.png) · [Classroom desktop](visual-checks/phase10-classroom-preview-1440.png) · [Library mobile](visual-checks/phase10-study-room-preview-390.png).

Independent recording, playback, deletion and microphone-track cleanup on navigation passed using Chrome’s synthetic microphone; this is not a physical-device recording test. [Audio assertions](visual-checks/phase10-voice.json).

Seat selection, Library/My Desk transitions, notes and focus-timer continuity, and quota-error retry also passed at all three widths through the existing real Study components. [Study journey assertions](visual-checks/phase9-phase10-journeys.json).

Twelve additional responsive checks cover Login, Learning Spaces and signed-out Dashboard/Course management redirects. [Navigation assertions](visual-checks/phase10-navigation.json). Thirty rendered route/width checks passed overall, in addition to the Study and voice journeys.

The empty-state screenshot uses the actual shared component through a developer route, not a forged student login. Actual enrolled Google/browser/admin sessions and production infrastructure remain untested.

## Files changed for this phase

- Backend: `src/models/{Course,Lesson,Progress,Quiz}.js`, publication/live-permission middleware, course/lesson/quiz/progress/auth/interview routes, generation-scoped progression/achievements, Google identity and production configuration validation, request/error logging.
- Reset and recovery: `server/scripts/course-reset.mjs`, reset guard/restore/publication integration tests, server private archive ignore rule.
- Frontend: `src/courses/` catalog, publication, published lesson and independent speaking components; `App.jsx`, `AppContext.jsx`, API client, Home/Pricing/Course/Lesson/Quiz pages, Header, Classroom lecture loader and Study material loader. Legacy course/template/resource data now have no active defaults.
- Delivery/configuration: both package manifests/lockfiles, production environment examples, course-editor styles, `scripts/qa/catalogJourney.mjs`, this report and `docs/visual-checks/phase10-*` evidence.

This list describes Phase 10 areas; the working tree also contains prior phases and was not reset or committed.

## Production launch gates

- [ ] Deploy only after explicit user authorization; no deployment was performed.
- [ ] Configure production HTTPS API URL, Firebase authorized domains/project/provider settings, JWT secret, database authentication/TLS/network restrictions and exact CORS/proxy trust.
- [ ] Run real Google sign-in, expiry/revocation and admin course publication with authorized accounts; do not infer provider success from unit fixtures.
- [ ] Publish reviewed real content and test enrolled/unenrolled learner lecture → practice → saved result, including paid access and materials. Validate course schedule/start date and cohort policy before opening enrollment.
- [ ] Move backup to approved encrypted off-device storage, set retention, rehearse a production restore and use a maintenance window for migration.
- [ ] Use protected/signed media hosting for paid content. External Drive/YouTube references remain archived; ownership/retention/orphan deletion has not been performed.
- [ ] Configure external error monitoring, uptime checks and alert routing. Verify logs do not contain tokens, emails or credentials. Process-local rate limits need shared storage if deploying multiple API instances.
- [ ] Review remaining development-tool advisories separately; do not expose Vite development/preview servers as production infrastructure.
- [ ] Complete physical mobile/audio, real student usability and screen-reader testing. Existing large 3D build-chunk warnings remain; no heavy rendering infrastructure was replaced.

The local reset is implemented and reversible. Production readiness remains conditional on these operational/provider/content checks; it is not a claim that deployment can safely proceed without them.
