# Motivating campus — classroom blockers and learning next steps

Implemented 2026-10-10 in the existing application. This pass prioritizes Phase 1 and concrete next-step improvements; it is not a claim that every requested platform/asset transformation is complete.

## Actual findings and implementation

`Projector.jsx` unconditionally set anonymous CORS on file video, which is required for WebGL texture upload but can reject a remote host that permits ordinary native playback. The previous error treated every load failure as potentially CORS without diagnosing media error codes. Remote source failures now make one fallback attempt on the same video element without CORS; texture projection is disabled, and Classroom communicates that the personal player is required. Failure after recovery remains visible with source/format/decode/network guidance. Local failures are not disguised by this fallback. No proxy, relaxed enrollment, or duplicated player was introduced. Native-player retry also restores the personal-study phase so an embedded player is not left in the Waiting state.

The original failing authenticated URL was not supplied or accessed. Therefore its exact host-specific cause is not confirmed and its playback is not claimed fixed. The identified implementation defect and recovery path were exercised using a locally generated, original two-second WebM and an isolated test host deliberately omitting CORS headers. Actual browser result: ready=true, nativeOnly=true, playing=true, no crossorigin attribute. Both texture-compatible and incompatible hosts still depend on valid accessible media URLs, formats and hosting.

The default third-person camera put the avatar between the student and teaching surface. Added default Lesson view with hidden local avatar, comfortable easing, and aspect-aware board framing. Room view retains movement, collision-controlled third-person camera and existing first-person setting; third-person distance increased. Exploration explicitly switches to Room view before pointer capture. No player position or seat ID is replaced for Lesson view.

Classroom now presents one purposeful learning-context surface. It uses actual selected lecture title, course/day and confirmed video-completion state when available. With no available lecture it offers Choose a Lesson; supported selected content offers Start Learning or Review Lesson rather than inventing an unfinished resume position. Class presentation is secondary. Removed duplicate world-space course button and permanent walking-instruction text; instructions remain in Settings. Portrait screenshots revealed cropped board edges, fixed by aspect-aware distance.

Environment uses original modular warm ceiling slats, timber window trim, warm floor, ivory rounded desktop surfaces and sage seats. These borrow broad natural-material/light qualities from the reference, not its exact architecture. Repeated details are instanced. Existing 100 classroom seats and navigation obstacles retained. No texture downloads, particles, post-processing or new dependencies.

My Classes now offers contextual Classroom and focus-session next actions alongside existing real course/lesson selectors. Study Library uses the existing editable personal goal, timer, history and mark-task-done behavior; completion adds Continue Studying and Return to Campus. Classroom completion offers My Classes/full materials and Library next steps. Watching alone does not mark completion: the existing explicit completion endpoint remains authoritative. No streaks, rewards or achievement records invented.

## Files changed in this pass

- `src/classroom/Projector.jsx`, `Player.jsx`, `Environment.jsx`, `classroom.css`
- `src/shared/LearningHall.jsx`
- `src/pages/ClassroomPage.jsx`, `DailyLessonsPage.jsx`, `StudyRoomPage.jsx`
- `src/styles/platform.css`
- This report; isolated browser/test fixture scripts under `tmp/platform-review` and screenshot/check artifacts under `docs/visual-checks`.

## Checks actually run

- Production build passed after final source changes; pre-existing large-chunk warning remains.
- 51 unit tests passed, including course lock/sequential access rules, classroom phases, character navigation, geometry, rain lifecycle and theme contrast.
- Real classroom preview at 1440×900, 768×900 and 390×844: no horizontal overflow, no HUD error, Canvas present, controls inside viewport.
- Original no-CORS WebM browser fixture: texture request fails, same native video succeeds and plays after explicit user gesture.
- Actual screenshots: `visual-checks/motivating-classroom-1440.png`, `-768.png`, `-390.png`. Results: `visual-checks/motivating-classroom-review.json`. These are development room previews without paid lesson content or fabricated students.
- `git diff --check` passed.

## Preserved and remaining

Backend contracts/auth/paid enrollment/private group chat and invitations unchanged. Existing course selectors, selected avatar IDs, study notes/goals/timer/rain owners retained. No professional GLB supplied: authored asset adapter exists but its preset entries remain empty. Existing procedural avatar quality is still a limitation; Lesson view reduces obstruction rather than claiming to replace the model.

Real-account end-to-end lesson playback, external host-specific playback, physical device FPS and a matched before screenshot are not verified. Authenticated My Classes and completion UI were not exercised through a real Google session; no identity/entitlement bypass was used. No deployment. Deeper real-data resume orchestration, genuine environment preview assets, professional character asset replacement and broader campus atmosphere work remain next-stage tasks.
