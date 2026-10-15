# Phase 14 — release blockers and protected staging verification

**PARTIALLY IMPLEMENTED / externally BLOCKED. Public launch: NO-GO.** No hosted staging/deployment, DNS change, purchase, production migration or additional catalog deletion occurred. No real Google account, private lecture or physical device result is fabricated. Owner questions requesting only staging URLs/testing authorization, test-account email and private course/lesson ID were submitted; secrets must not be sent in chat.

## Actual issues fixed

- **Google redirect recovery could hang:** `waitForFirebaseUser` used an async listener that cancelled its timeout before awaiting `getIdToken`; token-refresh rejection never rejected the outer promise. New `waitForIdentity` propagates refresh/listener errors, handles signed-out/timeout states and removes listeners, including a synchronous initial callback. Failure/cleanup regression tests run without exchanging any fake token or granting a session. Existing Login catches these errors. Genuine hosted Google login remains blocked.
- **Individually valid but incompatible configs:** separate frontend/backend validation did not catch different Firebase projects, API origins or a missing frontend CORS origin. New paired validator checks those relationships and validates auth domain against the chosen host/project. Auth host syntax/project ID and HTTPS `localhost.` validation are tightened. It does not inspect Google dashboard settings or prove provider credentials.
- **Rollback manifest was not verified against destination:** new read-only verifier checks deployable status, build/source matching, environment, expected public API origin and all three archive hashes. It rejects review snapshots, corrupt/missing files, and staging-to-production mismatch. Synthetic byte fixtures rehearse integrity checks only; they are not a hosted service rollback or schema-compatibility proof.
- **Vite/esbuild development vulnerabilities:** changed Vite 5.4.21 to 6.4.4 with the existing React plugin's declared compatibility; esbuild is now 0.25.12. npm lockfile preserved, no `audit fix --force` or Tailwind 4 rewrite. Production compilation/regressions pass. The user-owned existing development process was not killed; restart the local dev command at a convenient point to ensure that long-running process loads the patched executable. Static production builds use installed Vite 6.4.4.

## Blocker matrix

| Blocker | Initial status | Fix / available implementation | Verified evidence | Final status / next action |
|---|---|---|---|---|
| Google login | BLOCKED | Firebase popup/redirect, backend revoked-token/provider validation, intended internal destination; refresh failure fixed; paired config checks | New failure/timeout/listener tests; existing auth/role/permission tests | **BLOCKED**: approved staging URL, configured provider domains/Admin credentials and authorized actual account needed |
| Authorized lecture playback | BLOCKED | Enrollment-gated lesson lookup, HTML video/VideoTexture, anonymous CORS texture path and native recovery, meaningful failure messages | Existing implementation reviewed; isolated permissions tests rerun | **BLOCKED**: fresh private staging course, enrolled account and authorized signed/cookie-compatible HTTPS media required |
| Protected staging | BLOCKED | Private env examples, paired validator, separate DB-name guard, project-specific auth rewrites, no automatic deployment | Config mismatch tests; no host created | **BLOCKED**: authorize named staging hosts/projects and supply secure dashboard configuration |
| Monitoring | NOT TESTED hosted | Existing readiness/liveness, bounded shutdown/retry, category/request-ID logs and opt-in redacted diagnostic endpoint | Operational integration exercises readiness failure, redaction and shutdown | **BLOCKED** hosted alerts: owner-approved monitor destination/credentials, retention and controlled outage required |
| Rollback | NOT TESTED hosted | Read-only checksum/environment verification plus existing rollback runbook | New integrity/mismatch regression fixtures | **BLOCKED**: prior verified access-safe release pair, approved isolated host and schema/index compatibility evidence required |
| Nine tooling findings | FAIL blanket gate | Targeted Vite/esbuild update; explicit reachability triage below | Current npm audits: 7 findings, production trees zero | **PASS** for scoped Vite/esbuild remediation; **7 remaining findings**, risk decision depends on build/dev exposure, not automatic production-runtime failure |
| Physical mobile | NOT TESTED | Checklist below, current emulated UI checks | No actual Android/iOS device was supplied | **BLOCKED** physical evidence: execute checklist on named device/browser versions |

## Authentication setup: exact owner actions

1. Provide the **protected staging frontend and API URLs** and explicit permission to test that environment. If none exist, approve creation/deployment to specifically named projects first. No staging deployment is implicitly authorized.
2. In private provider settings, configure an isolated Firebase web/Admin project. The backend `FIREBASE_PROJECT_ID` must equal frontend `VITE_FIREBASE_PROJECT_ID`; install Admin credentials through secret storage/mounted file, never VITE variables or Git. Public Firebase config alone does not grant Admin access.
3. Add the staging frontend hostname to Firebase authorized domains. Set OAuth JavaScript origin to the exact HTTPS frontend origin and redirect handler to `https://STAGING_FRONTEND/__/auth/handler`; verify the actual provider console configuration. Use the existing project-specific auth-helper rewrite if the frontend host serves the handler proxy. Check staging protection permits the authorized tester and the auth-helper flow.
4. Configure exact `FRONTEND_URL`/`CORS_ORIGIN`, `PUBLIC_API_ORIGIN` and distinct authenticated staging MongoDB/JWT secret in private settings. Run `node scripts/release/validate-pair.mjs PRIVATE_FRONTEND_ENV PRIVATE_BACKEND_ENV`. Its output prints errors, not values. Staging schema/index creation remains a separately reviewed operation.
5. Provide an approved **test-account email**, not password/token. Tester must complete the genuine provider login in the authorized browser. Verify popup and redirect, intended-page return, reload, logout, expired app session and role restrictions. No fake JWT/Firebase token or manually injected browser session is used here.

Current session architecture uses Authorization bearer JWT stored in browser localStorage, not a server cookie session. Firebase verifies signature/project/revocation at exchange; app JWT lasts seven days and does not support universal server-side revocation after issuance. LocalStorage/XSS exposure remains an explicit review risk. Internal redirect filtering exists; no new OAuth/CSRF protocol implementation was substituted for Firebase.

## Authorized media prerequisite and verification

Need a **fresh private staging course/lesson ID**, approved enrolled/unenrolled test accounts, and permitted HTTPS lecture media with real access enforcement (e.g. short-lived authorized signed URL), suitable codec, HTTPS byte-range delivery, and appropriate frontend-origin CORS for WebGL texture upload. Existing player does not add API bearer headers to media element requests; a bearer-only video endpoint therefore needs an approved media delivery contract before testing. Do not make paid media public to accommodate the player.

On the actual account: confirm enrollment denial for the unauthorized identity; authorized response/status/ranges and CORS; metadata/codec decode; user-gesture HTML playback; VideoTexture rendering; native recovery on controlled CORS/texture failure; camera transitions, pause/resume, end/quiz action and iOS/Android behavior. Redact signed query tokens in logs/screenshots. No private asset was supplied and no public sample was used as proof.

## Nine original advisory entries: triage

All nine original npm entries are development dependencies; inherited entries are not nine distinct exploits. Frontend static runtime and API production-only audits report zero findings. Tailwind processes trusted repository styles/globs during build/watch, not a public student API input. Malicious repository changes/files/selector input could still exhaust CI or developer tools. Build untrusted PRs without deployment credentials and keep dev servers loopback-only; a compromised build pipeline is distinct from shipped runtime exposure.

| Package / original installed version | Severity / directness | Cause / affected versions / patch | Reachability and action | Current result |
|---|---|---|---|---|
| vite 5.4.21 | High, direct dev | Dev server path handling; original audit ≤6.4.2; patched 6.4.4 selected | Dev HTTP exposure; Windows-specific variants not reachable on this Mac, but cross-platform tooling remains relevant. Supported-plugin upgrade, test rather than force Vite 8 | Removed |
| esbuild 0.21.5 | Moderate, transitive dev | Serve API issue ≤0.24.2; now 0.25.12 | esbuild serve API was not the production host. Updated with Vite | Removed |
| braces 3.0.3 | High, transitive dev | Deep pattern stack exhaustion ≤3.0.3; advisory lists no patch | Tailwind/glob/watch input; trusted patterns mitigate reachability, not vulnerability. Await patch or separately validate Tailwind migration | Remains |
| chokidar 3.6.0 | High, transitive dev | Inherits braces; audit range 2.0.0–3.6.0 | Tailwind watcher, no shipped browser/API use. No compatible declared Tailwind dependency migration selected | Remains |
| micromatch 4.0.8 | High, transitive dev | Inherits braces; current audit broad affected range | Repository glob input, not runtime user text; patch chain/migrate only with compatibility proof | Remains |
| fast-glob 3.3.3 | High, transitive dev | Inherits micromatch; current audit broad range | Build file scan; npm suggests fix but no guaranteed independent patch removes underlying braces chain | Remains |
| postcss-selector-parser 6.1.4 | Moderate, transitive dev | Selector CPU exhaustion <7.1.6; patched 7.1.6 | Build selector input; patched parser is outside Tailwind 3's declared major range, no unvalidated override | Remains |
| postcss-nested 6.2.0 | Moderate, transitive dev | Inherits parser; audit 2.0.3–6.2.0 | Build nesting; underlying parser/Tailwind migration needs CSS compatibility validation | Remains |
| tailwindcss 3.4.19 | High, direct dev | Inherits five tooling chains; npm suggests major 4.3.3 | No safe v3 patch found in registry lookup; major CSS migration not forced | Remains |

Sources: [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [selector parser advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf), [Vite migration](https://v6.vite.dev/guide/migration), [Vite Windows-path advisory](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff). Current lockfile/npm audit is the exact installed-version evidence. Remaining dev advisories are residual risks to assess, **not alone the reason for NO-GO**; real auth/media/operational verification remains blocked.

## Physical-device checklist (not executed)

On one iOS Safari and one Android Chrome, record model/OS/browser, date, network and anonymous tester code. Use the authorized protected staging account and test lecture:

- Google popup/redirect, intended destination, reload and logout.
- Classroom Lesson View/third-person, actual lecture play/pause/native recovery and readable mobile controls.
- Library free-seat selection and **backend-confirmed** assignment, My Desk/Library switching and private-group denial.
- Notes in Arabic/Bengali, timer across views/navigation and reconnect; preserve existing text on failure.
- Rain user-enabled playback, volume/pause and interruption; navigation must stop audio.
- Voice mic allow/deny, visible recording status, play/delete and navigation cleanup; recognition only where genuinely supported.
- Keyboard/text zoom/navigation, 2D fallback, orientation changes, 15–30-minute warmth/battery/responsiveness observation without invented FPS.

Record pass/fail/blocked per task and redacted evidence. Test real sound/microphone and browser permissions; desktop emulation does not establish these results.

## Tests and evidence

Production build with installed Vite 6.4.4 PASS; syntax lint PASS; **159 unit/regression tests PASS**, zero failed/skipped; **8 isolated integration tests PASS**, zero failed/skipped. New eight tests cover token-refresh failure/cleanup, paired config and rollback integrity/environment checks. Existing security/enrollment/private-chat/operational suites rerun. Browser smoke checks at 390×844, tablet 768 and 1440×900 are saved in [Phase 14 render evidence](visual-checks/phase14-browser.json); no forged authentication. Hosted authenticated journeys/media and physical mobile remain BLOCKED. [Verification summary](visual-checks/phase14-verification.json). Local API readiness 200, active courses zero, unauthenticated lessons 401. No new memory/FPS/LCP benchmark was measured; existing large lazy chunk warning remains.

Rollback result: **artifact integrity checks PASS; actual frontend/API deployment rollback NOT TESTED**. Current review artifact is nondeployable and is deliberately rejected by the new verifier. No previous verified hosted release was discovered. To approve rollback rehearsal, provide current/previous immutable release IDs and privately retained manifests/archive hashes, an isolated host and migration compatibility record. Run `node scripts/release/verify-manifest.mjs ARTIFACT_DIR staging EXPECTED_API_ORIGIN` before any authorized redeploy. Never restore a production database as a routine code rollback.

Monitoring result: readiness/unready/shutdown/redacted event tests PASS; **actual alert delivery NOT TESTED**. Owner must choose an authorized monitor/alert destination, configure retention/access, enable optional redacted diagnostics on both sides if desired, then approve a controlled isolated staging outage and verify alert receipt. No email/notification was sent. Existing monitoring.md specifies categories without notes/chat/token/media contents.

## Files changed

`package.json`, `package-lock.json` (Vite/esbuild); `src/lib/firebase.js`, new `waitForIdentity.js`/`.test.js`; release `build-evidence.js`/tests, `validate-env.js`/tests, new `validate-pair.js`/CLI/tests and `verify-manifest.js`/CLI/tests; production/staging API templates gain public API origin for paired validation; deployment docs/report and Phase 14 evidence. No backend contract, catalog data, paid permissions or UI redesign changes.

## Remaining owner actions / launch checkpoint

Provide protected staging URLs and explicit testing/deployment authorization; configure credentials only in secure provider storage; authorize the actual test account and fresh private lesson; choose monitoring destination and previous safe rollback release; arrange real iOS/Android checks. Review/commit existing dirty frontend/backend changes and run remote CI on exact IDs. No approval or external configuration is inferred from elapsed time. Phase 14 remains externally blocked; stop before public launch until genuine evidence and explicit operation-specific approval exist.
