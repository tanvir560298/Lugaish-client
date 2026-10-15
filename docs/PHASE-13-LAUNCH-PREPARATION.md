# Phase 13 — official launch preparation

**NO-GO for public launch. Prepared locally; not deployed.** Phase 13 authorizes inspection, tests and safe improvements, explicitly withholding public deployment, live DNS, purchases and irreversible production migrations. No such operation was performed. No owner approval was requested for an unspecified or unverified release.

## Prioritized blockers

| Priority | Blocker | Resolution / owner prerequisite |
|---|---|---|
| P1 release gate | No protected hosted staging or genuine Google sign-in/authorized lecture journey | Approved staging services, separate DB/Firebase credentials/domains, permitted test lecture and enrolled/unenrolled accounts; verify actual browser provider and playback |
| P1 release gate | Current source contains extensive uncommitted frontend/backend gitlink work | Review and commit both repositories, update gitlink, execute remote CI against exact commits |
| P1 release gate | Nine development dependency advisories (6 high, 3 moderate) | Compatibility-tested tooling migration/patch review; loopback development only. No forced major upgrade performed |
| P1 release gate | Hosted alerts, off-device encrypted backup/restore and safe rollback unverified | Authorized providers/credentials, retention/access policy, actual alert delivery and recovery rehearsal |
| P2 verification gap | No real beta participants, physical device/microphone, full accessibility or long-session profile | Conduct prepared 5–10-person beta and real device/accessibility/extended-session checks |
| Asset dependency | Professional licensed rigged avatar not integrated | Separate optimized licensed asset work; not claimed complete |

These are release prerequisites, not fabricated human beta bugs. No new application P0/data-loss defect was reproduced. Unavailable tests are not proof of correctness.

## Implemented fixes

1. **Release workflow test gap:** manual prepare-release previously skipped isolated integration tests. It now starts a disposable Mongo service and runs the existing integration suite before audit/build/package. No deploy command was added. GitHub environment reviewers and remote CI execution remain owner setup, not local proof.
2. **Local build misclassification:** packaging previously accepted an ordinary `npm run build` once Git was clean. Validated release builds now emit public-only `release-build.json` with mode, HTTPS API origin and frontend/backend revisions. Real release packaging requires matching evidence plus clean repositories. A local compilation cannot silently become an approved configuration build. A build receipt is not staging verification or deployment approval.
3. **Stale success manifest:** a failed export could leave a previous success manifest alongside changed artifacts. Packaging invalidates the manifest before validation and writes the final manifest atomically only after all archives/checksums succeed. Partial archive files are not a valid release without that final manifest.
4. **HTTPS loopback bypass:** environment validation accepted HTTPS localhost/loopback API URLs and query/hash suffixes despite being unusable public release endpoints. These are now rejected; exact CORS-origin rules and browser-secret rejection remain enforced.
5. Added intentionally invalid private production API configuration template and a concrete operation-specific owner approval/deployment/rollback checkpoint.

No backend contracts, paid enrollment rules, archived catalog, notes, private groups, visual environments or user accounts were modified. No new dependency or heavy asset was added. Entire working-tree changes from previous phases were preserved.

## Verification performed in Phase 13

- **151 unit/regression tests PASS**, zero failed/skipped; includes four new release tests: ordinary/stale-source build rejection, valid release evidence rules, stale-manifest invalidation, HTTPS loopback/query/hash rejection.
- **8 isolated integration tests PASS**, zero failed/skipped: catalog/publication/quiz generations, paid enrollment/revocation, authorized seat assignment and private/table chat privacy/reconnect, course reset restore fixtures and operational readiness/shutdown. These are disposable local fixtures, not production-course publication or real Google login.
- Local production frontend compilation and JavaScript/JSX syntax lint PASS. Syntax lint is not semantic ESLint.
- Both current **production dependency audits: 0 findings**. Full frontend audit remains **9 findings: 6 high/3 moderate** (Tailwind/braces dependency chain, selector parser, Vite/esbuild). Security is not a clean full audit or penetration test.
- New build-evidence plugin tested with a separate `/tmp` build and public fake fixture configuration. It emits expected source IDs/API origin. This fixture has no hosted service or real credentials and is **not a production deployment build**. Ordinary local `dist` is verification only.
- Real release packaging rejects this dirty tree as expected. Local review-only export succeeds with `deployable:false`; all three archive/Dockerfile checksums match. No Git commits/pushes occurred. The production template rejects placeholders as expected.
- Existing local API: `/readyz` 200, `/api/courses` 200 with zero active courses, unauthenticated `/api/lessons` 401. This establishes local connectivity and basic access rejection, not production Mongo network ACLs/provider credentials.
- Final local browser smoke check captures 11 routes × three widths (390×844, tablet 768, desktop 1440×900), checking layout overflow, obsolete active course labels and meaningful empty practice state. See [render evidence](visual-checks/phase13-browser.json). No authentication was forged.

Phase 12 notes/timer/rain/recording/camera/recovery results remain prior evidence, **not rerun as Phase 13 full feature journeys**; runtime scene/audio implementation did not change. Native BSON restore rehearsal is Phase 11 evidence, not a new hosted backup test. Actual authorized lesson video, current provider login, memory/FPS/LCP, multi-hour sessions and physical devices were not measured. The existing 735kB lazy character-controller chunk still triggers the build warning; no invented performance improvement is reported.

Screenshots: [Home mobile](visual-checks/phase13-home-390.png), [Classroom desktop](visual-checks/phase13-classroom-preview-1440.png), [Classroom mobile](visual-checks/phase13-classroom-preview-390.png), [Library desktop](visual-checks/phase13-study-room-preview-1440.png), [Library mobile](visual-checks/phase13-study-room-preview-390.png). These are browser emulation, not physical device results.

## Final release table

| Requirement | Status | Exact scope |
|---|---|---|
| Frontend build | PASS | Local production compilation; real hosted config unavailable |
| Backend readiness / MongoDB | PASS | Local DB connection, operational integration; production credentials/network restrictions not tested |
| Google Login | BLOCKED | No real authorized staging provider/browser flow |
| Course catalog reset | PASS | Empty real local catalog; isolated archival/access tests, no additional deletion |
| Course creation / enrollment authorization | PASS | Isolated authenticated fixture publication and enrolled/revoked access |
| Classroom | PASS | Local rendered empty-lesson UI; authenticated lesson journey remains blocked |
| Authorized lecture playback/native recovery | BLOCKED | Permitted staging course/media not available |
| Study Library / restricted chat | PASS | Isolated authorization/seat/chat tests; scene smoke, previous Phase 12 tools checks |
| Interactive quizzes | PASS | Isolated server grading/ownership + engine tests; other exercise publishing not integrated |
| Speaking Practice | PASS | Phase 12 synthetic-mic evidence only; real recognition/device flow untested |
| Genuine AI conversation | NOT APPLICABLE | No configured provider; UI makes no assessment claim |
| Mobile layouts | PASS | Current emulation smoke, not Android/iOS physical testing |
| Complete accessibility | NOT TESTED | Prior scoped contrast/focus/RTL checks do not constitute full audit |
| Security | FAIL | Known development-tool advisories; targeted access controls/production audits pass |
| Database backup | PASS | Prior local native BSON/index rehearsal only; production/off-device restore not tested |
| Hosted rollback / monitoring | NOT TESTED | Runbooks prepared, actual services/alerts/recovery unavailable |
| Production configuration | BLOCKED | Validated templates/guards exist, approved configured environment absent |
| Docker runtime / remote CI | NOT TESTED | Workstation lacks Docker; workflows not remotely executed |
| Human beta | NOT TESTED | Prepared kit, zero actual participants |

## Deployment architecture and instructions

Existing frontend hosting with persistent Express API and MongoDB remains the prepared architecture; no new provider was selected or purchased. Static 3D/audio assets are bundled by the existing Vite pipeline. Authorized lecture media must follow current approved HTTPS media policy; removed public course videos were not restored. Cookie sessions are **not** used: app bearer JWT remains in localStorage with seven-day expiry; Firebase checks revocation at exchange, but previously issued app JWTs do not have universal server-side revocation. This is an explicit security review limitation.

[Production checkpoint](../deploy/PRODUCTION-CHECKPOINT.md) supplies installation, verification, environment validation, release packaging, owner approval contents, post-approval smoke tests and rollback procedure. [Hosting/auth configuration](../deploy/README.md), [private backups/restore](../deploy/backup-recovery.md), [privacy-conscious monitoring](../deploy/monitoring.md) remain applicable. No secret values are included in public metadata or reports.

Rollback means restoring a checksum-verified post-archive-access-safe frontend/API pair and matching configuration, while retaining student writes. Production DB restore is a separate approved recovery operation, not routine code rollback. Never fall back to retired-course-exposing code.

## Files modified in this phase

- `.github/workflows/prepare-release.yml`: isolated Mongo/integration gate.
- `vite.config.js`: validated public build receipt plugin.
- `scripts/release/artifacts.mjs`: source/build matching and manifest invalidation/atomic success.
- `scripts/release/build-evidence.js`, `.test.js`, `artifacts.test.js`; `validate-env.js`, `.test.js`: release validation and regression coverage.
- `scripts/qa/betaVisualJourney.mjs`: optional evidence-stage naming, reused for current smoke checks.
- `deploy/api.env.production.example`, `deploy/PRODUCTION-CHECKPOINT.md`, this report and Phase 13 screenshot/verification evidence.

## Approval checkpoint

Launch preparation is complete within locally available evidence. Public launch remains **NO-GO** until the listed prerequisites are resolved. No deployment approval is inferred from the Phase 13 title. Once exact reviewed artifacts, hosts, domains, config identifiers, staging results and rollback release exist, request explicit approval for those named deployment operations. DNS, purchases and production migrations require separately identified approval. This iteration stops before any production-changing operation.
