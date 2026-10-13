# Phase 20 — final release preparation

Verified locally October 13, 2026. **Available local engineering and release preparation are completed; production release is pending — NO-GO.** No push, public deployment or production reset occurred. The active catalog outcome below is verified for this workspace/local database, not a claim about the currently deployed production database.

## 1–5. Course inventory, final counts, retained history and cleanup

**VERIFIED:** Read-only inventory of the explicitly named local `lugaish` database finds:

| Records | Before Phase 20 | Final local state |
|---|---:|---:|
| Course documents, any status | 0 | 0 |
| Published/draft/archived courses | 0 / 0 / 0 | 0 / 0 / 0 |
| Active lessons | 0 | 0 |
| Published/draft lessons | 0 / 0 | 0 / 0 |
| Archived historical lessons | 56 | 56 |

[Inventory/evidence](phase20-local-evidence.json). Courses and lessons were checked separately, including missing publication metadata (zero). No redundant archive/delete/reset was executed. Independent user, enrollment, progress, review, note, goal/avatar and private-group data was not erased. A final publication-only count comparison confirms the same main database state after isolated testing.

**COMPLETED:** The already empty server-backed catalog remains authoritative. No old/demo enrollment card was reinstated. Daily Lessons no longer reconstructs student enrollment from an empty array or a client email allowlist; Private Batch visibility uses authenticated access state. Legitimate server-saved legacy batch enrollment is retained, explicit revocation wins. The old hardcoded “Level 6 / 60 Classes IELTS Bridge” heading is replaced by current course identity/description.

**VERIFIED:** Eighteen browser route/viewport checks cover Courses & Fees, My Classes, Profile and stale `/course/english`, `/course/paid_batch`, `/course/ielts-foundation` URLs. Seeded legacy browser catalog caches do not create offers, enroll buttons, runtime errors or overflow. Main Home/Campus empty states also pass the Phase 19 33-check matrix. Catalog responses use `no-store`.

**BLOCKED:** Production inventory/catalog reset requires the actual authorized database/host configuration. Nothing here proves production has zero courses. If its catalog is already empty, skip reset; otherwise take/verify a fresh target backup and reversibly archive reviewed records. Permanent deletion is not authorized. Five public-video deletions in the source review branch capture preexisting Phase 10 archival; this phase did not permanently delete source media, and prior Git blobs remain recoverable.

## 6. Backup verification

**VERIFIED:** Fresh `npm run test:backup` passes a native BSON dump/restore in isolated temporary databases. Seven collections restore with checksum, index and learning-reference validation: users, lessons, study notes, table messages, quizzes, review attempts and progress. Existing integration tests also cover reversible course archive/index preparation/restore while preserving independent records. Archives remain private under `/tmp`, excluded from Git.

**BLOCKED:** Hosted encrypted off-device backups, retention, RPO/RTO and actual code/database rollback cutover are not verified. The local rehearsal is not a production recovery certification.

## 7. Admin course creation matrix

**VERIFIED:** Added `server/src/routes/phase20Catalog.integration.test.js` uses real API routes and an isolated database. An instructor can create an English draft with title/description, create its lesson through the existing module editor API, add reviewed quiz and HTTPS material references, publish the lesson/course, edit/unpublish and archive. Unauthorized student mutation/access/enrollment and stale URLs are denied. Archived lessons plus user/avatar and historical learning/note/group records remain byte-equivalent. The new isolated DB is dropped after the test.

**VERIFIED:** Browser staff draft creation uses the actual Course publication form; authorized API lesson/publication then makes that isolated course visible in Courses & Fees and its student detail page. Archiving hides it again. The temporary fixture database is removed after QA; no developer course entered the main database. [Browser evidence](visual-checks/phase20-catalog.json).

**COMPLETED:** Course mutation routes now reject nonobject JSON with 400 before destructuring. Existing publication permissions and content-review gates remain.

**BLOCKED / existing capability gaps:** This architecture has one catalog record per `english`, `arabic` or `paid_batch` and existing monthly payment/batch-access rules. It does not implement arbitrary per-course pricing, multiple independently managed batches, binary material uploads or a general assignment-authoring workflow. HTTPS material references and reviewed quizzes were verified; nonexistent pricing/upload/assignment controls are not reported as passing. These require a separately specified, implemented and tested authoring/billing extension before claiming the complete requested admin capability matrix.

## 8. Frontend changes and rendered QA

**COMPLETED:** Enrollment visibility/current-course wording and mutation validation changes described above; Phase 18 editorial design preserved. Release hygiene ignores temporary files, private server env files and binary browser evidence while retaining it locally. Eight obsolete scratch/Puppeteer inspection scripts are excluded from the review candidate; originals remain in the owner's workspace.

**VERIFIED:** Phase 19 public/authenticated/dashboard matrices (33/12/9), Phase 20 empty/stale/profile checks (18), staff creation/publication journey and nine **compiled production-build** Home/Pricing/Login viewport checks. Compiled routes have no observed page faults, error boundary, horizontal overflow or developer-preview links. [Compiled smoke](visual-checks/phase20-production-smoke.json). This is local preview serving, not a public deployment or full production account test.

The isolated second Vite server uses its own optimizer cache. QA fixture CORS now admits authenticated PUT preflight, permitting actual staff-form verification. Failed checks were diagnosed rather than weakening production authorization. Storage retry, keyboard/Escape/focus return and denied-microphone paths remain tested. Physical phones, successful physical recording and a complete screen-reader/contrast audit are **NOT TESTED**.

## 9. 3D campus

**VERIFIED:** Original licensed Zain GLB and all 13 protected Phase 18 checkpoint hashes are unchanged. Library and Classroom maintain native mesh identity through walk/approach/sit/seated/stand; My Desk, seat selection and mobile fallback remain. Four zones, twenty five-seat tables and 100 seats are preserved. Notes, timer, quota-error recovery and real rain decode/loop/volume/pause/cleanup pass.

Native Idle/Walk/Run preview cycles were exercised. The locomotion diagnostic state may say `walk` while the Run clip is blended; the strengthened real-mixer test confirms Run weight >0.98 and Walk <0.02 at running speed. Native upper-body Wave was separately sampled against idle across its duration; maximum joint-quaternion difference was 0.407. [Animation cycles](visual-checks/phase20-animation-cycles.json), [wave](visual-checks/phase20-wave.json), [seating continuity](visual-checks/phase19-verification-sit-stand-continuity.webm).

**NOT TESTED:** 100 simultaneous 3D users, physical mobile GPU load and unrestricted desktop FPS. No procedural replacement or new campus redesign was made.

## 10–11. Authentication and security

**VERIFIED locally:** Phase 19 regression coverage for Firebase identity/relogin, session expiry, late 401/session races, server enrollment/Paid Batch restrictions, private-group/chat ownership, learning-record privacy, input validation, notification ownership, tester roster isolation and sanitized internal/provider errors. Backend readiness and rejected-origin responses carry safe headers/correlation IDs. See [Phase 19 report](PHASE-19-RELEASE-READINESS.md).

**BLOCKED:** Real Google popup/redirect/domain validation and authorized private lecture playback. Local configuration or isolated JWTs do not prove them. App sessions use bearer JWTs/localStorage; Express cookie-session settings are not applicable. No universal issued-JWT revocation or cross-document transaction certification is claimed.

## 12. Exact tests

| Check | Result |
|---|---|
| `npm test` | **193 passed**, 0 failed/skipped |
| `npm run test:integration` | **13 passed**, 0 failed/skipped; isolated DBs |
| `npm run lint` | Syntax checks passed; semantic ESLint unavailable |
| `npm run build` | Passed, **22.00s**, existing >500KB chunk warning |
| Targeted Run/access assertions after final test enhancement | Four checks passed |
| Fresh `npm run test:backup` | Seven-collection BSON restore passed |
| `npm run build:release` in owner workspace | Correctly refused local HTTP API configuration; **BLOCKED** release environment |
| Clean-source/index/archive/config guards | Phase 19 local tests passed; placeholder templates deliberately rejected |
| Desktop/tablet/mobile | Local browser checks passed at 1440×900, 768px, 390×844 |

Final review-worktree source verification and commit receipts are recorded below/in the local receipt; no remote CI execution is implied.

## 13. Dependency and performance audit

**VERIFIED:** Frontend/backend production-only audits: **0 / 0** findings. Full audits retain **five frontend high / three backend high** findings through unpatched development-tool `braces` chains. Parser override 7.1.6 removed two moderate findings with frozen-source CSS byte-equivalence. No blind major upgrade.

Final local build: **96 JS/CSS assets, 2,724,192 raw / 766,228 gzip bytes**, compared with initial Phase 19 baseline 2,723,599 / 765,920 (+593 / +308). Largest 3D chunk remains 735,206 raw/191,091 gzip. Aggregate bundle bytes do not establish startup speed, LCP or FPS. No visual quality reduction/heavy asset added. [Detailed baseline](phase19-performance-evidence.json).

## 14–17. Git remotes, branch, commits and push

**VERIFIED:** Existing remotes are `https://github.com/tanvir560298/Lugaish-client.git` and `https://github.com/tanvir560298/Lugaish-server.git`. GitHub read-only access works.

**COMPLETED locally:** Separate review worktrees at `/Users/tanvir/Desktop/lugaish-phase20-review` and its `server/`; branch **`release/phase20-review-20261013`** in both repositories. Owner workspaces stay on their original `main` HEADs. Client review starts from fetched remote `main` (`ef1f67db32dbe0195046ec79f27db52f03a7ccc9`) to preserve remote bot history; the only remote/current-owner source difference before overlay was automation state, which was retained from remote.

| Repository | Reviewed source commit |
|---|---|
| Backend | `088094144e19221dbff7b3e7f09977251795901a` |
| Frontend campus/release source | `28c837de133bb3e1eeef48210123565e26ff6a90` |

A subsequent local documentation/test/hygiene commit completes the review branch. Exact final HEADs and cleanliness are in the ignored local `release-artifacts/phase20-review-commits.json` receipt. The frontend gitlink refers to the matching committed backend. Private env, backups, dependencies, temporary data and binary QA recordings are excluded. Compact JSON evidence is included; screenshots/recordings remain in the original local workspace. No owner work was reset/discarded; candidate omissions do not delete originals.

**BLOCKED — push result: NOT PUSHED.** `main` is production-connected. Provider policy for review-branch deployments and the separate backend host is unavailable, so the no-public-deployment condition cannot yet be guaranteed. Review branches have no `origin/main` push upstream, preventing an accidental default push to production. Both repositories must be safely published together for the server gitlink to be fetchable. No force-push, remote-history replacement or PR/merge occurred.

## 18–21. Hosting, triggers, identified URL and actual deployment

**VERIFIED:** Client GitHub Production deployments are created by `vercel[bot]`. Latest inspected deployment `7042937505` reports success for `ef1f67db32dbe0195046ec79f27db52f03a7ccc9`, a remote `main` bot commit. The only remote workflow currently discovered is the daily Facebook bot, which writes/pushes state; local verify/manual-preparation workflows are not remotely executed. Server GitHub deployment history is empty; backend hosting is **BLOCKED / unidentified**.

Identified existing deployment URL (from the actual deployment status, not a guessed domain): `https://lugaish-client-9z1xqrrg1-tanvir-ah-mad-s-projects.vercel.app`. HTTPS reachability/status is recorded in [hosting evidence](phase20-hosting-evidence.json). This URL is **not** the new local release and may have host access protection. Canonical custom domain, host settings, environment variables and production database linkage are not certified.

**REQUIRES OWNER APPROVAL:** Public deployment. The mandatory gate additionally requires passing real Google login, required private-media access, confirmed production environment/database safety and hosted backup/rollback. These are unresolved, so deployment was not attempted. A GitHub deployment success for an older commit does not mean this release is live.

[Vercel's official Git configuration](https://vercel.com/docs/project-configuration/git-configuration) supports disabling automatic deployment; the actual projects/branch policies must be checked and safely configured before publication. No provider setting was changed based on an assumption.

## 22–24. Remaining blockers, decision and exact owner actions

**NO-GO for production.** Local course exclusion, preservation, supported authoring, safe fixes, testing and release-review preparation are finished. Full requested advanced authoring capabilities and production verification remain incomplete.

1. Confirm frontend/backend connected hosts, production branches and review-branch deployment protection/disablement; authorize the safe paired branch publication. Set a deliberate commit author identity before any public push if the automatically inferred local identity is unsuitable.
2. Provision/validate approved HTTPS frontend/API origins, trusted proxy policy, separate protected staging Mongo/JWT credentials and production database access. Inventory that exact target; use verified reversible archival only if needed.
3. Configure matching Firebase project/client/Admin identity, authorized frontend domains and auth-handler redirects. Test actual authorized Google accounts, intended-page return, logout and expiry.
4. Provide permitted private media plus enrolled/revoked test identities; verify real playback, CORS/ranges and mobile recovery.
5. Prepare required indexes; test replica-set/interruption recovery; approve encrypted off-device backups, retention/RPO/RTO and perform hosted rollback rehearsal.
6. Configure restricted monitoring/alert delivery; complete physical-device/audio/accessibility checks and address/risk-review unpatched development tooling.
7. Resolve the documented per-course pricing, independent batches, binary uploads and assignment-authoring gaps before asserting that entire admin matrix.
8. After all blockers pass, review matching committed artifacts/remote CI and give explicit production deployment approval. No such approval is assumed from the Phase 20 request.

Detailed configuration prerequisites remain in [the owner checklist](../deploy/PHASE-19-OWNER-PREREQUISITES.md). This report does not label the website LIVE or launch-ready.
