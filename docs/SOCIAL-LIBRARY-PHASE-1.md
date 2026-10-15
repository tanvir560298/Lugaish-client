# Social Library — Phase 1

## Scope

The current phase expands the functional shared Study Room into a multi-zone library. Existing authenticated room membership, authoritative seat assignment, movement timelines, invitations, timers, notes, materials and classroom behavior remain in place. No fake students, counts or videos were added.

## Audit

React/Vite JavaScript with Three/R3F/Drei; Express, JWT and MongoDB backend. Shared rooms currently have 20 tables, five seats each (100 seats). Seats and animation routes are shared with the backend through `server/study/tableLayout.js`. Existing rooms remain invitation-only. Private content access is unchanged. The standalone personal desk remains available.

Existing shared presence uses room-level SSE snapshots with one-second database polling. Existing direct/table messages persist for 24 hours; this does not satisfy the requested ephemeral-only policy. This phase does not claim to fix that architecture or silently delete historical data. Public drop-in requires a separate authorized server flow; simply exposing the existing private-room list would be inappropriate.

## Files and working changes

- `src/study/shared/libraryLayout.js`: four named zones, names/capacities derived from actual existing tables, safe shelf layout and occupancy calculation separating connected members from held seats.
- `src/study/shared/LibraryInterior.jsx`: bookshelves with instanced books, zone floor finishes and signs, table lamps, window frames/sills, overhead light fixtures, entrance plants and clearly decorative reading lounges.
- `src/study/shared/StudyTables.jsx`: library furnishing integrated with existing clickable tables/chairs. Existing IDs/coordinates remain unchanged, preserving seat selections and movement.
- `src/study/shared/SharedScene.jsx`: smoothly interpolated Overview, My Desk and Table cameras; Explore enables orbit/pan. Reduced motion snaps camera transitions. Standard/Low graphics changes DPR and frame cadence (60/30 target), hidden tabs stop interval-driven rendering. Runtime FPS/draw-call/triangle readout is available; it is instrumentation, not a concurrency benchmark.
- `src/study/shared/SeatControls.jsx`: real room dashboard, zone filter and available-table filter; free-chair selection still uses the existing server action and occupancy checks. Reconnecting users are excluded from connected count while their held seats stay unavailable.
- `src/study/shared/SharedRoomPanel.jsx`, `StudyHallPreview.jsx`: library entrance copy and explicit local-only preview; no simulated live population.
- `src/study/shared/shared.css`: responsive library dashboard, camera/filter controls, zone and lounge signs. Existing simple 2D view remains functional.
- `tests/libraryLayout.test.mjs`: all existing IDs retained, live/held occupancy and new furniture clearance across every existing seat-transfer route.

No lesson video player was added to Study Room. Existing PDF reading, notes, goals and personal timers remain available below the shared scene.

## Validation

- `npm run build`: passes; preexisting large main/Three chunks still generate warnings.
- `node --test tests/*.test.mjs`: 35 tests pass.
- `RUN_STUDY_INTEGRATION=1 node --test server/study/social.integration.test.js`: passes using a unique temporary database and authenticated synthetic accounts. Covers concurrent final-seat allocation, cross-room joining, invitation authorization, private/group message access, blocking and reconnection. Only the isolated test database is deleted.

These are HTTP/database and unit tests, not multiple authenticated browser windows. Interactive browser automation remains unavailable here. Visual quality, mobile GPU performance, camera obstruction and live multi-browser consistency still need browser acceptance testing. No measured 20-avatar GPU/concurrency claim is made.

## Not implemented yet

Variable 1/2–4/6–8/10/20 table capacities, public shared-library entry, Find Me a Seat across public tables, private-table booking/codes/revocation, activity-sharing privacy, DND status, reading/typing/writing skeletal clips and ephemeral live-only chat are later-phase work. All currently bookable tables retain their real five-seat capacity. Zone names describe spaces; they do not impose moderation or synchronized focus sessions. Explore is camera navigation, not keyboard-controlled avatar exploration. Decorative lounges are not bookable chairs.

## Migration, performance and next steps

No dependencies, paid services, uploads, schema changes or database migration. Furniture uses existing shared geometries/materials and instancing. Four zone signs plus existing table/avatar HTML labels add DOM work; occupied-avatar rendering and large-group performance still need profiling. Actual hosted free-tier quotas are unverified.

Phase 2 should extend the canonical seat layout/allocation contract with configurable capacities and migration/compatibility for saved seat IDs, and test simultaneous claims/disconnects. Phase 3 should add authorized public drop-in and private-table membership separately. Phase 4 must replace stored message bodies and polling delivery with an authorized ephemeral transport, including refresh/offline non-replay, mute/privacy/rate limits. Phase 5 completes camera collision, measured GPU scaling, accessibility and browser QA. Classroom/Paid Batch restrictions are outside this phase and remain unchanged.
