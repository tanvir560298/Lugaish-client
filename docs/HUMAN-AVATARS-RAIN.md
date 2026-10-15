# Human avatars and library rain — 2026-10-10

## Implemented

All three selected character presets now use original continuous anatomical lofts on the existing compatible CC0 student skeleton. Sleeves/legs blend across elbow/knee bones; shoulders connect to the torso; hands have fingers/thumbs; faces include eyes, eyebrows, nose, mouth and glasses when selected. Colors, hair options, IDs and customization remain. Skin, hair and fabric have separate roughness within one visible skinned draw call. Geometry is 23,681–24,500 vertices and 40,256–41,576 triangles per character.

Seated additive posture uses restrained lean, arm IK, breathing and occasional blinking. Previous additive transforms are restored before each mixer evaluation to prevent accumulation on unanimated bones. Reduced motion uses a fixed pose without blinking/breath morph motion; distant characters skip detailed updates. Existing sit/stand clips remain. The tabletop increased from 2.6×1.3 to 2.8×1.5 to put its edge within reach; seat IDs/centers and the 20 five-person tables remain. Collision bounds and server approach spacing match this layout.

Rain is an actual local 28-second field-recording loop (337 KB), not synthesized noise. Header Ambience offers Off/Rain, volume and Play/Pause, with loading/error feedback. Choice and volume persist, but playback requires interaction after a fresh mount. One workspace-owned WebAudio player caches the decoded recording, preserves pause offset, survives tools/camera changes and closes on route exit. Notification sounds remain separate. No visual particles or new dependency were added.

## Assets

- `public/audio/library-rain.mp3`: derivative of Cori Samuel's public-domain [Rain against the Window](https://commons.wikimedia.org/wiki/File:Rain_against_the_window.ogg). Exact license, source hash and filtering/crossfade details are in `public/audio/library-rain-LICENSE.txt`.
- Existing `public/models/student/student.glb`: compatible CC0 Quaternius skeleton/clips, retained with its existing source record. Visible human artwork is original code in `HumanStudent.js`.

## Files changed

- `src/characters/HumanStudent.js`, `bakeCartoonSkin.js`, `studyPose.js`, `RiggedStudent.jsx`
- `src/study/shared/RemoteAvatar.jsx`, `StudyTables.jsx`, `libraryCamera.js`
- `src/study/rainPlayer.js`, `useRainAudio.js`, `AmbienceControl.jsx`, `study.css`
- `src/pages/StudyRoomPage.jsx`; `server/study/tableLayout.js`
- `tests/humanStudent.test.mjs`, `rainAudio.test.mjs`, `studySocial.test.mjs`
- Audio/license assets, this report, avatar status document and `docs/visual-checks` evidence. `tmp/avatar-review` is a development-only render/browser verification harness, not a production entry.

## Verification and evidence

- `node --test tests/*.test.mjs`: 50 passed, no failures/skips. Includes all selectable meshes, valid weights, morphs, fixed reduced-motion pose, IK arm lengths/targets and every seat transfer corridor.
- Paid access, public seating, private social rooms and temporary table-session integration suites: 4 passed using isolated disposable databases. Unenrolled/revoked students still cannot access paid lessons; private isolation and chat generations retained.
- `npm run build`: passed; existing large-chunk warning remains.
- Actual isolated Chrome WebGL canvas renders: [before](visual-checks/avatar-before.png), [after](visual-checks/avatar-after.png), [seated](visual-checks/avatar-seated.png), [sit/stand GIF](visual-checks/avatar-sit-stand.gif). These use the active mesh, rig and pose code with a matching test chair/table; they are canvas review renders, not authenticated full-room screenshots.
- Actual React `/study-room-preview` at 390×844: Ambience present and no horizontal overflow. Browser verified real rain decoding/28-second loop, volume change, pause/resume, tools and return-camera changes without duplicate source, and SPA route-exit cleanup. See `visual-checks/rain-route-verification.json` and `rain-browser-verification.json`. One context/source before pause; route exit closed the context and stopped the resumed source.

## Limits

No professionally sculpted external GLB was acquired; the original procedural mesh improves the old fallback but is not claimed equal to the supplied reference renders. Hands use IK and fixed fingers rather than authored finger animation. Table alignment is verified numerically and in a render harness; authenticated end-to-end room screenshots and device FPS measurements were not captured. Mobile layout was checked in an emulated viewport, not physical mobile hardware. Rain loop is verified by decoded length/end-point processing and browser playback, without claiming a human listening audit. Optional window rain was not added.
