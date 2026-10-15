# Study Library UI and journey — 2026-10-10

## Completed behavior

The active Study Room now distinguishes arrival, choosing a chair and studying. Arrival offers Choose My Desk, private Study with Friends and exploration; public allocation is offered only when the authenticated availability endpoint succeeds. Existing entrance eye-level camera remains the initial 3D view. Returning verified private/public membership resumes My Desk after authoritative readiness; personal seats can also restore from a validated account/course-scoped browser key.

Chair/table clicks highlight a candidate. Selection shows zone/table/seat and requires Sit Here before assignment. Accessible seat lists keep zone/availability filters and now preview a chair before confirming. Cancel keeps the prior valid seat. Remote assignment uses existing server actions and waits for actual arrival; 2D/reduced-motion personal assignment becomes ready immediately. Errors remain visible, with assignment progress reflected on the confirm action.

One five-action dock controls Library, My Desk, Choose/Change Seat, Study Tools and More. My Desk changes the camera without automatically opening tools. Library preserves membership and personal timer/notes. Seat menu groups Change Seat with Leave Table. Tools that require readiness explain the requirement and offer seat selection. Settings/secondary cameras/2D fallback/private group controls live in More. Table Chat has its own panel, explains the existing private-group-only restriction and offers private-group options; public chat remains disabled on the server.

The global header is compact on the Study Room, and one slim contextual bar shows Learning Spaces, Study Library, real membership context, ambience and the focus countdown. Scene height follows measured header/context-bar height rather than a guessed desktop offset. The separate mobile learning bottom navigation is omitted on this immersive route; global navigation/account/staff controls remain available in the shared header/menu.

A readable screen-space membership panel shows personal/public/private context, current table/seat/zone, connection and verified table occupancy. Offline occupancy reads Reconnecting/Unknown. The map has screen-space zone labels and selected/hovered table details. Tiny repetitive world sign descriptions are hidden. The desk camera now includes the selected seated avatar and workspace. Wood is warmer, light softer, and three instanced color groups add modest book variation; established furniture positions/corridors and all 20 five-person tables remain.

Only one tools drawer is open, with Notes/Timer/Goals/Materials tabs, titles, Close/Escape and focus restoration. It is a desktop side drawer and mobile bottom sheet. Chat, settings and tools close each other. Existing timer/notes/resources stay in their original workspace owner; the same rain player survives camera/panel changes. Selected avatars, human mesh/pose pipeline and existing saved data are retained.

## Files changed

- `src/pages/StudyRoomPage.jsx`, `src/components/Layout.jsx`
- `src/study/shared/SharedRoomPanel.jsx`, `StudyHallPreview.jsx`, `SeatControls.jsx`
- New `src/study/shared/LibraryDock.jsx`, `personalSeat.js`
- `src/study/shared/SharedScene.jsx`, `StudyTables.jsx`; `src/study/study.css`
- New `tests/personalLibrarySeat.test.mjs`, this report and browser evidence.

No server permissions, course pricing, auth/enrollment, table session cleanup, invitations or shared membership schema changed in this UI pass. The new personal-seat storage key holds only a validated seat ID, scoped to account/course; it never creates a shared room or live student. Leaving the personal seat removes this key.

## Verification

- Full unit suite: 51 passed, including scoped restoration/invalid-seat rejection and existing locomotion, rain, chat, geometry and contrast checks.
- Four isolated database integration suites passed: unenrolled/revoked paid access denied; public seating and public-chat denial; private invitations/messages/reconnect; sender-leave table history cleanup/generation isolation.
- Production build passed; existing large-bundle warning remains.
- Actual local preview at 1280px and 390px: arrival → candidate preview without assignment → Sit Here → completed sit → My Desk → notes/timer → Library → return → tools → Leave. Notes and running timer preserved; no horizontal overflow. Results: `visual-checks/library-journey.json`.
- Returning personal desk, Change Seat, Cancel and refresh: passed. Results: `visual-checks/library-return.json`.
- Actual rain UI: volume, pause/resume, tool/camera stability and route exit verified. One source while tools/camera changed; final stop/close confirmed. Results: `visual-checks/library-rain-journey.json`.
- Screenshots: `visual-checks/library-arrival-1280.png`, `library-seat-selection-1280.png`, `library-my-desk-1280.png`; corresponding `-390.png` screenshots show the mobile 2D fallback. These are actual rendered preview-route screenshots with one local selected avatar, not simulated live students.

## Limits

Authenticated end-to-end UI was not exercised with a real Google account; server-backed assignment, permissions and private chat were checked through integration tests. Screenshots show the local preview. Physical mobile FPS and a matched before/after performance baseline were not measured; no speedup claim is made. No new dependency, particles or post-processing was introduced; added books are instanced, and hidden scene performance readouts no longer trigger periodic React scene state updates. Existing avatar art remains procedural, with the quality limits recorded in the avatar report. No reliable before screenshot of this exact UI state was captured. No deployment was performed.
