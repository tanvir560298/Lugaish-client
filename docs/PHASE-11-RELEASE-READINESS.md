# Phase 11 — release readiness

## Launch blockers discovered

- The backend was a Git gitlink without `.gitmodules`; both repositories contain extensive uncommitted prior-phase work. A clean remote checkout could not reproduce the current backend. Mapping is repaired; review/commit/push and frontend gitlink update remain required before release.
- Health returned HTTP 200 with disconnected MongoDB. Readiness now returns 503 when disconnected/draining; separate liveness and bounded graceful shutdown are implemented.
- No configured isolated staging host/database/Firebase credentials, protected staging access or actual production environment proof is available. Placeholder templates are rejected rather than presented as live staging.
- Current course catalog is intentionally empty. No real enrolled-account staging lecture is available. Hosted Google sign-in and authorized media playback are BLOCKED, not inferred from fixtures.
- Nine frontend development-tool advisories remain (six high/three moderate); production audits are clean. Vite is restricted to loopback; major Tailwind/Vite migration is deferred for compatibility testing. Do not serve production through dev tools.
- No live alert integration, approved off-device encrypted backup retention, physical mobile/audio or full accessibility certification is available.

## Implemented

Staging/public environment templates and fail-closed release validation; `.gitmodules`; non-root Node API Dockerfile; explicit index preparation without dropping data; production auto-index disabled; meaningful liveness/readiness; safe shutdown/retry cleanup; bounded rate-limit bucket memory; revoked Firebase-token verification at exchange; cross-origin exposed request IDs; fixed-category opt-in frontend/backend diagnostics; Classroom loaders now require a live catalog generation and published lesson even for staff, preventing archived authoring history from reappearing as active lectures; top-level exception recovery; scene/media failure hooks; privacy/use/support pages; static response headers and hashed-asset caching; Firebase-project-specific host-routing generation; CI verification and manual release packaging without deployment; clean-release guards and sanitized local review artifacts; native BSON isolated backup/restore rehearsal.

The existing Classroom, Library, course publication, personal study tools and avatar code were preserved. No additional real records/media were deleted, no test course was published to the real catalog, and no external deployment or messages were sent.

## Verified

Production compilation and syntax lint pass. **147 unit/regression tests pass without failures/skips.** Eight isolated integration tests pass, including disconnected readiness, redacted diagnostics and graceful shutdown. Both frontend/backend production dependency audits report zero findings. **33 rendered page/viewport checks** cover Home, pricing, empty practice, Classroom/Library previews, independent speaking, Login, Learning Spaces, Privacy, Platform use and Support at 390×844 / 768 / 1440×900. Screenshots and assertions are below. The Phase 10 course reset remains reversible archival: 56 historical lessons, zero published courses. Direct unauthenticated content requests fail; isolated API fixtures verify draft/published/archived rules, future publication, enrolled/revoked paid access, quiz ownership, private seating/chat and account preservation. This is not a Google browser login simulation.

Native BSON dump/restore rehearsed four sanitized collections and restored the unique lesson index; checksum and private file permissions verified. Only the two invocation-created local databases were removed afterward. Original Phase 10 private backup remains untouched.

[Rendered assertions](visual-checks/phase11-browser.json) · [Privacy mobile](visual-checks/phase11-privacy-390.png) · [Support mobile](visual-checks/phase11-support-390.png) · [Empty classes](visual-checks/phase11-practice-preview-390.png) · [Classroom desktop](visual-checks/phase11-classroom-preview-1440.png) · [Library mobile](visual-checks/phase11-study-room-preview-390.png).

[Study tools/persistence](visual-checks/phase9-phase11-journeys.json) and [synthetic-microphone recording](visual-checks/phase11-voice.json) passed. [Rain assertions](visual-checks/phase11-rain.json) verify actual asset decoding, loop, gain/volume, pause/resume, one context through tools, and closed context on navigation. Physical sound output was not tested.

[Classroom camera controls](visual-checks/phase11-cameras.json) passed: default Lesson View and third/first/lesson switching at all three widths. This does not prove lecture playback continuity.

[Controlled failure recovery](visual-checks/phase11-recovery.json) passed: microphone denial/retry, multilingual note download under quota failure, rain loading failure, protected redirects and usable 2D fallback.

## Readiness matrix

| Area | Status | Evidence / limit |
|---|---|---|
| Frontend build | PASS | Local production compilation; configured hosted release remains separate |
| Backend configuration | PASS | Validation/health/shutdown tests; actual cloud credentials absent |
| Google authentication | BLOCKED | Signed provider/revocation code reviewed; real authorized-domain/provider flow unavailable |
| Course reset | PASS | Empty live catalog, archived records retained, rendered empty states |
| Future course creation | PASS | Isolated authenticated manager publication and generation tests |
| Paid Batch authorization | PASS | Direct API tests reject unenrolled/revoked accounts |
| Classroom | PASS | Local rendered empty-lesson scene; hosted authenticated lesson journey not tested |
| Authorized lecture video | BLOCKED | No authorized staging media/course; video policy tests and cleanup inspection are not playback proof |
| Study Library | PASS | Isolated confirmed seating/private APIs and rendered tools/persistence checks |
| Restricted private chat | PASS | Isolated membership/ownership/rejoin/privacy fixtures |
| Interactive Practice | PASS | Engine unit tests and real isolated server MCQ grading/results; other exercise publishing not integrated |
| Speaking Practice | PASS | Local synthetic-microphone record/play/delete/cleanup; physical mic, browser speech recognition and hosted course flow not tested |
| Real AI conversation | NOT APPLICABLE | No conversational AI provider configured; UI states unavailable |
| Database backup | PASS | Local reversible archive restore plus native sanitized BSON/index rehearsal; production/off-device recovery not tested |
| Deployment configuration | NOT TESTED | Prepared scripts/templates; Docker unavailable and no hosted deployment |
| Monitoring/alerts | NOT TESTED | Health and redacted diagnostic tests pass; live alerts/retention not configured |
| Mobile UX | PASS | Browser emulation at 390/768/1440; physical devices not tested |
| Accessibility | NOT TESTED | Existing keyboard/2D fallback retained; full screen-reader/audit outstanding |
| Security | FAIL | Targeted authorization/redaction tests and production dependency audits pass; nine development-tool advisories remain. Not a clean full audit or penetration test |
| Rollback deployment | NOT TESTED | Artifact guards/runbook prepared; no real host rollback rehearsed |

## Prepared, not deployed

See [staging architecture, CI and auth configuration](../deploy/README.md), [backup/rollback](../deploy/backup-recovery.md) and [monitoring](../deploy/monitoring.md). Recommended continuity: existing Vercel frontend + persistent Render API + isolated MongoDB. Owner/provider selection remains open; no services purchased. CI files exist locally; required GitHub environment reviewers/access have not been configured.

## Files changed in Phase 11

- `.gitmodules`, `.gitignore`, environment examples, `vercel.json`, `vite.config.js`, root package scripts.
- `.github/workflows/{verify,prepare-release}.yml`; `deploy/` API Dockerfile/config/runbooks; `server/.dockerignore`.
- `scripts/release/` syntax checks, test discovery, environment validation/tests, public env writer, artifacts, Firebase host config generator.
- Backend configuration/startup, `operations` utilities/tests, rate-limit bounded storage/test, Firebase verification; guarded index preparation, operational integration and native backup rehearsal scripts. The privacy test now uses a distinct sensitive sentinel rather than matching the legitimate room-kind label `private`.
- Frontend operational reporter/tests, `AppErrorBoundary`, main entry/API diagnostics, existing Classroom/Library exception hooks, privacy/use/support routes/page/Footer.
- `scripts/qa/` Phase 11 rendered/recovery/rain journeys; viewport evidence; this report.

This working tree includes prior phases. No unrelated changes were reverted and no commits/pushes were made.

## Owner approval and outstanding launch actions

1. Review and commit both repositories and update the gitlink; configure repository access, protected environments and reviewers. Run CI remotely on those exact commits.
2. Select hosting and supply separate staging Firebase/database/public URLs/secret storage; configure domains, trusted proxy/network policy, HTTPS and staging protection. Approve external staging deployment explicitly.
3. Build/run the container, prepare indexes, verify hosted Google popup/redirect, token expiry/logout, split-origin authorization and SSE reconnect.
4. Publish only a private validated staging fixture; verify enrolled and unenrolled lecture/native VideoTexture recovery and materials with authorized accounts. Do not use production student records as fixtures.
5. Enable and test actual monitoring alerts/retention; approve encrypted off-device backups, recovery objectives and a restore rehearsal.
6. Review privacy/support/terms with the owner/legal adviser, confirm support mailbox ownership/coverage, complete physical devices, speech-recognition and accessibility checks. No legal compliance claim is made.
7. Rehearse rollback to a verified post-Phase-10 safe release. Do not use old code that ignores archival access gates.
8. Approve production deployment only after the blockers are resolved. No production deployment, DNS changes, purchases or destructive restore is included in this implementation.
