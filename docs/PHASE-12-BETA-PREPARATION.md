# Phase 12 — closed beta preparation and verified refinement

**Beta status: PREPARED, NOT CONDUCTED. Actual participants: 0. Public launch: NO-GO.**

No invitations, external messages, production deployment, catalog publication or production-data reset was performed. Existing local application was retained. No human success rates, timing data, quotations or satisfaction findings exist.

## Phase 11 baseline

Read [Phase 11](PHASE-11-RELEASE-READINESS.md), release/staging, monitoring and recovery runbooks before changes. Existing Git tree includes substantial uncommitted prior-phase changes in frontend and backend gitlink; it is not a clean reproducible release. Placeholder staging templates remain intentionally rejected until real configuration exists. Staging is unavailable. Production/off-device backups, live monitoring and rollback are not demonstrated merely by their local scripts. Known nine development-tool advisories remain; production-only clean audits from Phase 11 are historical evidence, not a new Phase 12 audit. No access controls were bypassed.

## Actual fixes

[Two verified P2 issues](beta/ISSUES.md) were fixed in the live personal Speaking component: course-only reference/phrase instructions were misleading, and inherited dark-theme paragraph colors made its cream panel difficult to read. Personal reading now explains reading one's own notes, recording and listening locally. Course-guided reference controls are retained. Language selection is labelled, has a 44px minimum height and states that changing language deletes the temporary recording. Learning Spaces describes the supported recording capability rather than suggesting unpublished conversation activities.

Professional rigged-avatar replacement remains a separate unresolved licensed-asset dependency. No procedural-avatar polish, unrelated redesign or new backend contract was introduced.

## Closed beta kit

[Participant/facilitator instructions, account prerequisites, 11 tasks and questionnaire](beta/TEST-KIT.md), [anonymous observation sheet](beta/observations.csv), [issue template](beta/ISSUE-TEMPLATE.md), [results template](beta/RESULTS-TEMPLATE.md). Target 5–10 consenting Arabic/English learners with mixed confidence and desktop/mobile devices. Owner must supply protected staging/accounts and recruit real participants. No personal-data collection or upload service was added. Feedback retention/access must be agreed before collecting responses.

The real catalog remains empty. Isolated integration fixtures exercise fresh course creation/publication, grading, generation ownership and enrollment; they do not republish historical courses or expose test lessons in the real catalog. Human classroom lessons require a fresh private protected staging fixture with approved media.

## Automated verification

- Production compilation and JavaScript/JSX syntax lint pass. 147 unit/regression tests and eight isolated integration tests pass, zero failures/skips.
- 33 route/width render checks: Home, pricing, empty practice, Classroom, Library, personal speaking, Login, Learning Spaces, privacy/use/support; 390×844, 768 and 1440×900. No checked horizontal overflow or legacy active course titles. This is emulation, not physical devices.
- Targeted speaking regression checks at three widths: truthful instructions, absent misleading reference/phrase controls, associated language label, ≥44px selector, retained focus on Arabic change, Arabic lang/direction and reduced-motion orb. Studio paragraph contrast is at least 5.29:1 against rendered solid surfaces; this is not a complete accessibility audit.
- Real local recording/play/delete/navigation cleanup using Chrome's synthetic microphone. Physical microphone, speech recognition and external AI were not tested. Genuine AI provider is absent; no fake assessment is presented.
- Library preview: notes and running timer persist through view changes and navigation; injected storage failure preserves current notes and Retry saves them. Arabic/Bengali native note export, microphone denial, rain loading failure, protected sign-out redirects and non-WebGL fallback are controlled failure tests.
- Real licensed rain asset decode/loop/volume/pause/resume; one audio context through tool changes, closed on leaving. Physical audible output is not verified.
- Classroom default Lesson View and camera switching at three widths. No authorized lecture playback is inferred.
- Integration tests exercise actual isolated HTTP/Mongo course permissions, publication, quiz ownership, paid enrolled/revoked access, backend-confirmed seating, private group/chat restrictions, reconnect generations and operational readiness. Preview seat selection is explicitly local, not a shared-seat availability claim.

Evidence: [verification summary](visual-checks/phase12-verification.json), [render checks](visual-checks/phase12-browser.json), [speaking UX](visual-checks/phase12-speaking-ux.json), [voice](visual-checks/phase12-voice.json), [notes/timer](visual-checks/phase9-phase12-journeys.json), [rain](visual-checks/phase12-rain.json), [controlled recovery](visual-checks/phase12-recovery.json), [cameras](visual-checks/phase12-cameras.json).

Screenshots: [Classroom desktop](visual-checks/phase12-classroom-preview-1440.png), [Classroom mobile](visual-checks/phase12-classroom-preview-390.png), [Library desktop](visual-checks/phase12-study-room-preview-1440.png), [Library mobile](visual-checks/phase12-study-room-preview-390.png), [Speaking desktop](visual-checks/phase12-speaking-preview-1440.png), [Speaking mobile](visual-checks/phase12-speaking-preview-390.png). Existing Phase 11 screenshots provide earlier evidence; no new visual overhaul is claimed.

## Limits, performance and long sessions

The existing large lazy character-controller chunk still triggers Vite's >500kB warning; no new heavy assets/dependencies or scene update loops were added. No fresh LCP/FPS/heap benchmark or prolonged multi-hour study session was measured. Short navigation tests establish persistence/audio cleanup only. Physical Android/iOS, actual screen readers, whole-site contrast, keyboard-only dialog journey, 200% text zoom, production token-expiration recovery and real video interruption remain NOT TESTED. Existing timer/permission unit coverage is not a long-session measurement. Arabic/Bengali text and 2D fallback checks are scoped to the tested controls/content.

## Final release gate

| Requirement | Status | Scope / unresolved prerequisite |
|---|---|---|
| Production compilation and automated regressions | PASS | Local build, 147 unit + 8 integration |
| Empty catalog and course publishing | PASS | Empty local rendered state; isolated private fixtures, not new real course |
| Paid/enrollment and private-chat authorization | PASS | Isolated server tests; no human multi-account hosted test |
| Google authentication | BLOCKED | Real protected staging provider/account flow unavailable |
| Classroom lesson access | BLOCKED | Permission tests pass; real enrolled browser lesson fixture unavailable |
| Authorized lecture video | BLOCKED | Approved staging media/playback unavailable |
| Study Library seating | PASS | Isolated backend assignment tests + local preview UI |
| Notes/timer, rain and controlled recovery | PASS | Short local browser tests; physical audio and prolonged sessions untested |
| Interactive Practice | PASS | Engine and isolated MCQ grading; other exercise publishing not integrated |
| Speaking Practice | PASS | Personal recording with synthetic mic; real devices/recognition not tested |
| Genuine AI conversations | NOT APPLICABLE | Provider not configured; no assessment claim |
| Mobile layout | PASS | Browser emulation only at specified sizes |
| Full accessibility | NOT TESTED | Scoped contrast/focus/RTL/reduced-motion checks pass; full audit outstanding |
| Security | FAIL | Known development-tool advisories; no full security audit |
| Database backup | PASS | Phase 11 local BSON/index rehearsal; hosted/off-device restoration not tested |
| Production monitoring / hosted rollback | NOT TESTED | Prepared runbooks; live services/alerts absent |
| Human closed beta | NOT TESTED | Kit prepared, zero participants |

No new reproduced P0/P1 was found; unresolved release requirements prevent recommending launch. Resolve security advisories with compatibility validation, review/commit both repos, provision explicitly approved protected staging, verify genuine Google/enrollment/media flows, test actual devices and accessibility, rehearse hosted recovery/rollback and alerts, then conduct 5–10-person beta and retest its real findings. Public deployment requires separate explicit approval after these gates.

## Files changed this phase

`src/speaking/SpeakingStudio.jsx`, `src/speaking/speaking.css`, `src/courses/IndependentSpeaking.jsx`, `src/pages/LearningSpacesPage.jsx`; new `scripts/qa/personalSpeakingUx.mjs`, beta visual/recovery/rain/camera QA scripts; `docs/beta/` kit/templates/issues; this report and Phase 12 evidence. Existing unit tests were rerun; new targeted regressions are browser checks. No backend implementation changes.
