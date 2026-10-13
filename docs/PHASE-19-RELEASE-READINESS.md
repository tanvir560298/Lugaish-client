# Phase 19 — release readiness

Local verification completed across October 12–13, 2026. **Production NO-GO.** Application fixes are implemented; real OAuth, protected media, hosted configuration and recovery remain unverified. The subsequent Phase 20 request authorizes release preparation, not public deployment.

## 1. Initial project state — PASS

Frontend: React 19/Vite 6.4.4, Three.js 0.184, React Three Fiber/Drei. API: Express/Mongoose in the separate `server/` Git repository. Both working branches were `main`; frontend HEAD `8227009505ab6ef32cf42caf87a31cf73264df40`, backend HEAD `1a1244b06c350411f21c695d6810e9d88148c84c`. The large tracked/untracked multi-phase tree predates this audit. No reset, unrelated discard or production mutation occurred.

## 2. Phase 18 preservation — PASS

All 13 files in [the preservation checkpoint](checkpoints/phase19-phase18-preservation.json) retain their hashes: Home, navigation, Learning Spaces, Library scene, original reports, native seating implementation and GLB. Zain SHA-256 remains `fea7e71271203e7073f1a073fa1208de7402df276f87f80e149bf7589b5d46b4`. Antigravity's editorial design is preserved. The [original final report](PHASE-18-CONSOLIDATED-VERIFICATION.md) documented an empty-catalog `/dashboard` crash; Phase 19 fixes that defect.

## 3. Actual bugs fixed — PASS

- Learner/bookmarked `/dashboard` now redirects to `/progress`; staff dashboard safely handles absent/malformed catalog data. Nine identity/viewport checks passed, including explicitly unenrolled learners.
- Identity refresh preserves server-empty enrollments rather than reviving cached grants. Revoked Private Batch access stays revoked. A late 401 cannot erase a newer session. The refresh fallback no longer references an out-of-scope variable.
- Quiz retry carries a stable request ID; duplicate submissions cannot earn duplicate XP. Explicit new attempts get a new ID.
- A YouTube player becoming ready after theater opens now reconciles its destination. Failed/timed-out API loads restore the prior callback and allow retry. These are mocked lifecycle checks, not real private playback.
- CDP commands have deadlines and reject on disconnection. Navigation checks readiness and provider errors; only transient readiness evaluations retry. Interaction actions are not replayed automatically.

## 4. Security — PASS locally; full dependency audit remains FAIL

Closed ownerless application lookup/overwrite, ordinary enrollment/premium/lesson-sequence bypasses, blanket staff student-directory access, cross-owner payment-notification dismissal and tester access to the live interview roster. Firebase relogin preserves explicit unenrollment and rejects conflicting identities. JWT subjects, bodies, IDs, tiers and payment inputs are validated. Internal route/provider errors and Gmail callback URLs no longer expose exception contents. Intentional client errors remain usable.

Existing isolated tests exercise Paid Batch revocation, private room/chat membership, seat ownership/races and learning-record privacy. Correlation/security headers cover rejected CORS and preflight responses. APIs/health use `no-store`. Catch-all/invalid proxy trust is rejected. No passwords, bearer tokens, private messages or recordings were added to logs/evidence.

## 5. Authentication — PASS application checks; BLOCKED real Google login

Firebase client configuration is present locally; backend exchanges verified Firebase identity for an application bearer JWT. Token exchange checks Firebase revocation, identity consistency and account roles. Expiry, logout/local identity handling and protected-route behavior are tested. There is no Express cookie session: cookie-session configuration is **NOT APPLICABLE**. Browser JWT storage remains localStorage; this is not universal server-side JWT revocation.

Actual popup/redirect, authorized domains and provider-account behavior are **BLOCKED** pending approved Firebase console/domain/handler configuration, matching private Admin credentials and an authorized Google test account. Fixture JWTs are not Google-login evidence.

## 6. Protected lecture playback — PASS local authorization/lifecycle; BLOCKED actual playback

Archived/unpublished, unenrolled, revoked and locked lessons are denied in isolated API tests. HTML media error/autoplay states, VideoTexture cleanup and YouTube callback/theater behavior were inspected/tested. Actual private media was unavailable. Third-party URL access control, CDN CORS/ranges, mobile decoding and enrolled real playback are **BLOCKED**. There is no newly implemented authenticated byte-stream proxy; range support must be verified at the actual media origin. Public previews do not prove protected production playback.

## 7. Database reliability — PASS isolated; cross-document transaction check NOT TESTED

Quiz receipts use a partial unique owner/request-ID index, save before a single atomic reward update and reject changed-payload replays. Verified receipts can recover progression. Review history is bounded and signals its limit rather than pretending truncated data is complete. Malformed historical review answers are not promoted to verified data.

Standalone Mongo cannot atomically commit Quiz/User/Progress together. Replica-set transaction and interruption recovery validation remains **NOT TESTED**. Prepare the new partial quiz index using the guarded index workflow before hosted rollout. The main development database was inventoried read-only, not seeded/reset.

## 8. Classroom and Library — PASS within local scope

New native seating evidence confirms the same mesh through standing, walking, approach, lowering, seated My Desk and standing again; Classroom seated/stand transition and mobile seated preview pass. Mobile Library uses the established 2D fallback without overflow. Four zones, twenty five-seat tables and 100 seats remain; no capacity/scene/backend contract changed.

Notes persist across cameras/navigation; timer survives navigation; storage failure preserves text and Retry saving recovers at 390/768/1440px. Actual licensed rain decodes and loops, volume/pause/resume work, tools do not duplicate its context and leaving closes it. Physical sound quality and 100-user GPU performance are **NOT TESTED**.

Evidence: [seating](visual-checks/phase19-verification-seating.json), [continuity recording](visual-checks/phase19-verification-sit-stand-continuity.webm), [study tools](visual-checks/phase19-verification-journeys.json), [rain](visual-checks/phase19-rain.json).

## 9. Performance — PASS preservation measurement; runtime speed NOT TESTED

[Measured evidence](phase19-performance-evidence.json): 96 emitted JS/CSS files; aggregate raw/gzip bytes increased from 2,723,599/765,920 to 2,724,526/766,311 (+927/+391). Largest 3D chunk is unchanged, 735,206 raw/191,091 gzip. These aggregate route assets are not initial-page transfer size. Seven representative built assets match source bytes; GLB is 1,430,660 bytes and Library WebP 99,582 bytes.

Routes/scenes remain lazy; audio, listeners, timers, mixers and VideoTextures retain cleanup. No forced duplicate-major override or heavy new assets were added. LCP/INP/FPS/memory-pressure improvement is **NOT TESTED**; no speed claim is made. The >500KB chunk warning remains.

## 10. Mobile/accessibility — PASS targeted checks; broader audit NOT TESTED

33 public route/viewport checks, 12 authenticated empty-catalog checks and nine dashboard checks passed. Screenshots were inspected at desktop 1440×900, tablet 768px and mobile 390×844. Tested account-menu keyboard opening, Escape/focus return, mobile-menu fit, contextual links, no false upload notification and denied-microphone alert. Reduced-motion preference is recognized; automated scene tests cover fixed-pose behavior. Contrast-token tests pass; they do not establish a complete WCAG audit. Physical iOS/Android, successful physical recording and whole-site screen-reader testing are **NOT TESTED**.

Expired fixture credentials correctly invalidated the session; only that session/check was renewed. A second Vite instance initially shared the owner's optimizer cache, causing an isolated Firebase registration error. Its dedicated QA config now uses a separate cache. The owner app and compiled Login render correctly. QA fixture PUT preflight was subsequently completed for Phase 20 authoring checks; it was not a production CORS defect.

## 11. Staging — PASS preparation; hosted staging BLOCKED

Separate frontend/API templates, exact HTTPS origins, staging-named database/JWT isolation, strict startup/proxy validation, auth-routing generator and protected deployment runbooks are prepared. Placeholder templates intentionally fail validation. Manual preparation chooses the correct staging/production build and checks matching archive metadata. No host/DNS/account setting was changed. Docker image execution is **NOT TESTED**.

## 12. Monitoring — PASS local diagnostics; hosted alert delivery BLOCKED

Readiness, liveness, database detection, correlation IDs, sanitized event categories and frontend boundaries exist. Local `/health`, `/livez`, `/readyz` and `/api/courses` returned 200; an unapproved origin returned 403 with security headers. [Local evidence](phase19-local-health-evidence.json). Restricted provider, retention, operational owner and alert destination must be configured and tested on staging.

## 13. Backup/rollback — PASS isolated rehearsal; hosted recovery BLOCKED

Seven-collection native BSON backup/restore passed: users, lessons, notes, table messages, quizzes, review attempts and progress. Hashes, unique indexes and references restored. Course archive/restore regression preserves unrelated records and supports safe resume. Dump files remain outside source. Production backup encryption/retention, RPO/RTO, credentials and actual hosted code/database cutover remain **BLOCKED**. [Runbook](../deploy/backup-recovery.md).

## 14. Dependencies — production-only PASS; full audit FAIL

Compatible `postcss-selector-parser` override 6.1.4→7.1.6 removes two moderate findings. Frozen-source CSS is byte-identical after the package change: 306,732 bytes, SHA-256 `663a9952a859b851938838bc6d5b9406774de7037abbdaeee7a78987e19206a4`. Full frontend audit: five high; backend: three high, all development-tool paths through [unpatched braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Both `npm audit --omit=dev` results are zero. No forced Tailwind-major migration/nodemon downgrade. Full audit must not be described as clean.

## 15. Course-reset preparation — PASS local inventory; production inventory BLOCKED

Read-only local `lugaish` inventory: **0 course records; 0 draft/published courses; 56 archived lessons; 0 active/published/draft lessons**. Hardcoded active curricula are removed; legacy history/storage is not a student catalog. Future course publication/admin APIs remain. No archive/reset/delete was necessary or performed. Target production database inventory and any fresh verified backup/archive require explicit target authorization. If already empty, skip reset. Preserve accounts, enrollments, notes, goals, avatars, groups and learning history.

## 16. GitHub/release workflow — PASS inspection; push/deployment BLOCKED

Remotes: `tanvir560298/Lugaish-client` and `tanvir560298/Lugaish-server`. GitHub credentials support read-only inspection. Recent successful client Production deployments are created by `vercel[bot]` for remote `main` commits; treat `main` as production-connected. Server has no GitHub deployment records; that does not prove a separate host has no auto-deploy. Existing remote workflow is the daily Facebook bot; new verify/manual-prepare workflows have not run remotely.

Diff whitespace/conflict/import checks passed. Secret-pattern/ignored-file scans found no private credentials/dumps in scoped candidate source; an intentional invented redaction sentinel is not a credential. Mixed preexisting changes were not mass-committed. Release builds now reject dirty/untracked frontend/backend or mismatched server gitlink. Regular local build success does not prove deployable environment configuration. Subsequent Phase 20 preparation must preserve remote bot commits and avoid public auto-deployment.

## 17. Exact tests — PASS

| Check | Result |
|---|---|
| `npm test` | 193 passed, 0 failed/skipped |
| `npm run test:integration` | 12 passed, 0 failed/skipped; isolated DBs |
| Targeted release/operations tests | 28 passed, including five clean-source guard tests |
| `npm run lint` | JavaScript/JSX syntax passed; semantic ESLint not configured |
| `npm run build` | Passed, 15.69s; existing chunk warning |
| Frontend/backend diff whitespace | Passed |
| Source/asset preservation | 13 checkpoint hashes unchanged |
| Public/authenticated/dashboard browser matrices | 33 / 12 / 9 checks passed |
| Interaction / study tools / native seating / rain | Passed within documented local/fixture scope |

These are the Phase 19 counts before the additional Phase 20 authoring integration. Phase 20's final report records the later suite.

## 18. Remaining blockers

**BLOCKED:** real Google login; actual private playback; approved hosted environment/database/proxy safety; protected staging; monitoring alerts; hosted backup/rollback; verified branch auto-deploy policy. **FAIL:** remaining unpatched development-tool advisories. **NOT TESTED:** physical mobile/audio, Docker execution, replica-set cross-document interruption recovery, high concurrency, full accessibility and remote release workflows.

## 19. Exact owner actions

Follow [the prerequisite checklist](../deploy/PHASE-19-OWNER-PREREQUISITES.md): confirm connected hosting projects/branches and disable public review-branch deployments; provision isolated staging database/secrets and HTTPS origins; configure Firebase domains/handler/Admin credentials; provide an enrolled permitted private-media account; prepare indexes; configure restricted monitoring and alerts; approve encrypted backups/RPO/RTO and rehearse hosted rollback. Supply physical-device QA and address/risk-review tooling advisories. Only then review a matching clean release artifact and separately authorize public deployment.

## 20. Decision

**NO-GO for public release.** Safe Phase 19 application hardening and available local verification are finished. External outcomes are explicitly pending. No GitHub push, public deployment, destructive reset or permanent record/media deletion occurred during Phase 19. The next report distinguishes Phase 20 preparation from a live launch.
