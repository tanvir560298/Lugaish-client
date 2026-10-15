# Phase 9 — student experience and product quality

## Status

Implemented targeted product fixes in the existing React/Vite app, after reviewing prior phase reports and Phase 8 performance evidence. This pass is not a claim that every earlier phase is complete. Existing local Vite/API services were used. Seven findings were fixed; authentication, paid enrollment, private chat contracts and the 3D architecture were preserved. No new dependency or backend contract was introduced.

Production build passed. The full ordinary regression command passed **103 tests, zero failures/skips**. Five opt-in backend integration checks passed using isolated valid test accounts and database fixtures. Build still reports large-chunk guidance; Phase 8 bundle improvements do not mean all performance work is finished.

## Executed journeys and evidence

| Journey | Actual scope / result | Evidence |
|---|---|---|
| First visit | Public Home at 320/390/768/1440 fits; protected daily lessons, classroom, library, speaking and quiz redirect signed-out users to Login | [Recovery results](visual-checks/phase9-recovery.json) |
| Library | Developer preview: accessible chair list → confirm → My Desk → Notes/Timer → camera changes → leave route and return; notes and a running timer persist. Injected save failure preserves work; retry restores saved state. 390/768/1440 widths | [Journey results](visual-checks/phase9-after-journeys.json) |
| Failure recovery | Native download preserves unsaved multilingual notes; denied microphone has recovery; rain fetch failure is honest; mobile popup fits; unsupported WebGL reaches 2D study fallback | [15 recovery assertions](visual-checks/phase9-recovery.json) |
| Classroom | Developer preview loads scene, opens empty accessible catalog honestly, Escape closes dialog, camera switches, 100 desks remain selectable; 390/1440 without horizontal overflow | [Classroom results](visual-checks/phase9-classroom.json) |
| Practice | Four developer exercise types: wrong answer/retry/correct feedback, draft restoration, mistake review, local completion and no fake server save; English at 390/768/1440; Arabic feedback separately | [Practice results](visual-checks/phase9-practice-practice.json) |
| Speaking | Opt-in recording, real capture state/meter with Chrome synthetic input, stop tracks, playback/pause/delete, reference and mode cleanup; Free mode honestly unavailable; English at three widths and Arabic mobile | [Voice results](visual-checks/phase9-voice-voice.json) |
| Paid and social access | Real authenticated HTTP fixtures: paid eligibility/revocation, quiz ownership/incomplete submission, public/private isolation, invitations, seat race, blocking/reconnect and table-session membership/history isolation | Five backend integration tests; commands in [QA README](../scripts/qa/README.md) |

Browser widths are desktop Chrome emulation, not physical phones. Local preview seating is not evidence of a real enrolled student's server-confirmed frontend assignment. Browser test selectors were corrected during test development; those harness failures are not counted as product defects.

## Fixes and changed files

See [prioritized issue register](PHASE-9-ISSUE-REGISTER.md) for reproduction, severity, impact, root cause and verification.

- `src/study/saveState.js`, `src/study/useStudySession.js`: track failed storage suffixes independently; retry all current notes/timer/history.
- `src/pages/StudyRoomPage.jsx`: show actionable storage warning inside tools; download current notes as UTF-8 text; accessible save-status update.
- `src/utils/loginDestination.js`, `src/pages/LoginPage.jsx`: retain safe return destination and whitelisted lesson selection through Google redirect; clarify first-time and returning access.
- `src/study/shared/StudyHallPreview.jsx`: same-seat preview confirmation returns to My Desk.
- `src/study/study.css`: mobile ambience popup stays within viewport.
- `src/utils/webglSupport.js`, `src/study/shared/SharedRoomPanel.jsx`, `src/study/shared/StudyHallPreview.jsx`: avoid heavy scene initialization when WebGL2 is unavailable; reuse existing fallback.
- `tests/studentRecovery.test.mjs`: four recovery/redirect/WebGL regression cases.
- `scripts/qa/`: reusable CDP client and student, practice, voice, recovery and Classroom runners; reproduction README.
- Phase 9 documents and `docs/visual-checks/phase9-*`: issue evidence, rendered captures and human test materials.

The workspace also contains previous-phase changes. This list attributes only this pass's work, not the entire working tree.

## Before/after rendered evidence

| Verified visible defect | Before | After |
|---|---|---|
| Mobile ambience offscreen | [390px before](visual-checks/phase9-before-ambience-390.png) | [390px fixed, recoverable audio error](visual-checks/phase9-after-ambience-390.png) |
| Notes error hidden behind tools | [390px before](visual-checks/phase9-before-storage-failed-390.png) | [390px actionable recovery](visual-checks/phase9-after-storage-failed-390.png) |
| Newcomer sign-in clarity | [390px before](visual-checks/phase9-before-login-390.png) | [390px new and returning access](visual-checks/phase9-after-login-390.png) |

Additional captures: [Classroom mobile](visual-checks/phase9-classroom-390.png), [Classroom desktop](visual-checks/phase9-classroom-1440.png), [Library saved notes](visual-checks/phase9-after-recovered-390.png), [Arabic feedback](visual-checks/phase9-practice-arabic-feedback-390.png), [Speaking recording](visual-checks/phase9-voice-recording-390.png). Screenshots were inspected; the repaired ambience panel, text and Play control are visibly inside the mobile viewport. There is no fabricated complete before-run result: the initial preview journey hit the same-seat inconsistency.

## Product review and limits

| Category | Evidence-based assessment |
|---|---|
| First-time usability | Sign-in now explains new and returning access; actual Google registration/login needs valid provider testing |
| Learning clarity | Local practice offers feedback/review; complete enrolled My Classes → lesson → saved result journey still requires real course credentials/content |
| Classroom | Camera/catalog/desk controls passed; real lesson video, external media failures and full student movement journey are not verified here |
| Study Library | Notes recovery and mobile ambience repaired; preview study tools and fallback passed; production seating permissions tested through backend |
| Interactive Practice | Four fixture types passed. This does not establish validated production content for all four; actual server-owned quiz permissions tested separately |
| Speaking Practice | Synthetic recording/control and permission denial passed. Physical audio quality, speech transcript and external AI service remain unverified; no invented pronunciation score |
| Motivation | No fake fixture completion was sent to progress; genuine daily-goal completion remains covered by existing regression tests rather than a real student browser session |
| Navigation | Protected redirects and lesson-selection preservation tested; authenticated return-to-course browser journey remains pending |
| Mobile | Essential tested panels fit emulated widths; physical keyboard, low-end GPU, touch comfort and all dark-mode/RTL screens need device/manual review |
| Accessibility | Escape, named controls, keyboard practice paths and non-3D study alternative tested. No screen-reader session or full contrast/text-scaling audit; no WCAG-compliance claim |
| Reliability | Save failure has truthful recovery; backend access isolation passes. Expired real provider sessions, all offline/media failures and production reconnect UI are not comprehensively tested |

No confirmed unresolved P0/P1 remains in the executed scope. Unavailable authenticated frontend/provider/device evidence is a launch gate, not proof those flows work. No authenticated browser state was fabricated.

## Human testing and Phase 10 priorities

[Usability kit](PHASE-9-STUDENT-USABILITY-KIT.md) provides six outcome-based tasks, consent/setup, observation sheet, assistance/success recording and feedback questions for 5–8 participants. No participant sessions or feedback are claimed.

Before launch:

1. Use authorized enrolled and unenrolled accounts to execute Google sign-in/redirect, My Classes → real lecture → supported practice → saved results → return; test expiry/revocation and external playback failure.
2. Execute private invitations/chat and server-confirmed seat changes in two real frontend sessions; exercise reconnect and permission revocation without weakening access.
3. Test physical Android/iOS audio, keyboard, background cleanup and low-end graphics; measure actual-device responsiveness rather than emulated FPS.
4. Complete screen-reader, focus/trap, contrast, 200% text, reduced-motion, Arabic RTL and dark-mode audits across real lesson content.
5. Run the prepared student sessions, prioritize observed task failures and retest. Validate curriculum explanations separately from synthetic exercise mechanics.
6. Continue bundle/route and loading measurements from Phase 8; retain honest fallbacks and user work during unavailable services.
