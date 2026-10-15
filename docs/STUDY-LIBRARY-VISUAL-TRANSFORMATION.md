# Study Library visual transformation

Active `/study-room` changes:

- `src/study/shared/libraryCamera.js`: fits canonical architectural bounds in perspective using every corner, viewport aspect and usable 82% framing factor. Human-height exploration is constrained against tables, chairs, shelves, lounges, plants and room bounds.
- `src/study/shared/SharedScene.jsx`: bounds-fit first frame and resize-aware smooth cameras; seated desk and selected-table views; human-eye Explore; warm directional shadows (Standard), cheaper Low graphics; deep forest exterior; single floating contextual dock and settings panel. Actual camera state drives the selected mode badge. Labels show only hovered/own tables.
- `src/study/shared/RoundedFurniture.jsx`: reusable instanced rounded geometry, rough matte finishes and original procedural oak-grain texture for desktops. No third-party model or dependency.
- `src/study/shared/StudyTables.jsx`: rounded tops and chair upholstery, restrained hover rim, laptop details, taller walls/windows. All original 20 tables, 100 seat IDs and seat positions remain.
- `src/study/shared/SharedRoomPanel.jsx`: connects dock actions to real seat/room dialog, desk tools, focus and 2D controls. Existing invitation-only authorization and seat actions remain intact.
- `src/pages/StudyRoomPage.jsx`: compact context bar/timer; removes duplicate top actions; desk drawer returns to Library without resetting saved notes/timer/material state.
- `src/study/shared/StudyHallPreview.jsx`: preview seat action opens the real local seat-selection dialog.
- `src/study/study.css`: dominant viewport canvas, contextual bottom dock, readable settings surface, responsive touch controls; no stacked camera toolbar.
- `tests/libraryCamera.test.mjs`: fitted bounds stay within usable frame across portrait/tablet/wide ratios; Explore stays at eye height and cannot traverse a desk.

Validation: 39 unit tests pass; authenticated HTTP/Mongo integration passes for seating races, invites, streams, privacy and reconnect; production build passes. Existing main/Three chunk-size warning remains. Final focused camera tests also pass after adding lounge/plant obstacles. No backend/course/auth/payment/enrollment changes, database migrations or paid services.

Limits: browser automation is unavailable, so rendered screenshots, real mobile layouts, camera interaction feel, shadows and GPU performance have not been visually verified. No 90/100 acceptance or measured GPU improvement is claimed. Existing avatar quality remains unchanged. Explore is collision-constrained camera orbit/pan at human height, not a new WASD character controller. Group sizes remain five; public drop-in is unimplemented. Current messaging persistence is not changed by this visual task. Books/laptops are environment details, not simulated live learning activity.
