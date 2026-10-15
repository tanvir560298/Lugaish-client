# Temporary table chat and coordinated movement

## Working behavior

Table messages append chronologically without the former 40-message limit.
Current authenticated table members see messages from senders whose table
membership is still valid, including messages predating the reader's arrival.
Explicit standing, leaving, removal and successful cross-table switches revoke
the departed sender's generation and delete its records. Remaining members keep
their own messages; an empty table clears. Changing camera/tools does not leave.
Brief reconnects retain membership/history during the existing two-minute grace.
Expired presence is immediately excluded from reads; a 30-second background
sweep deletes abandoned records even with no clients online. The sweep deletes
specific stale record IDs after rereading current membership, protecting a newer
rejoin from stale cleanup. Live records have a renewable TTL orphan safeguard;
this is temporary database storage, not a claim about provider logs or backups.
Legacy active records are upgraded when their seated sender first heartbeats.
Existing direct messages remain a separate feature with their prior retention.

A visible Table Chat/Leave Table toolbar sits over the library independently of
seat-selection dialogs. Desktop uses a compact panel; mobile a bottom sheet.
Hide/Escape, mute, block, member names, restrained unread status and one-time
explanation are provided. Windowed variable-height history retains the full
conversation while limiting mounted rows. Scroll follows new messages only near
the bottom and preserves a reading anchor otherwise. Input/cache reset on leave
or table change. Existing personal study tools and timers stay mounted.

Avatar roots sample continuous authoritative paths on the render loop, using a
monotonic clock that absorbs network jitter. Large clock corrections hide for
120ms rather than interpolating through furniture. Sit/stand clip progress now
matches the root timeline, including late snapshots and low frame rates. Turns
use smooth easing. Distant avatars skip facial detail/foot IK; existing geometry,
materials and animation assets remain. Reduced motion and 2D modes remain.

## Load and measurements

- Header notifications and study-room subscriptions share one authenticated SSE
  connection per token/document; aborting one subscriber preserves the other.
- Heartbeat sources share a timestamp gate, preventing duplicate writes.
- Chat is excluded from the 3D scene props/signature; focus counters and heartbeat
  revisions no longer invalidate the scene. Tests exercise 1,000 such snapshots.
- SSE sends initial history, then append/remove/read deltas; unchanged history is
  omitted. Departed messages are also removed from queued table notifications.
- Isolated local MongoDB/authenticated HTTP test, 105 retained messages, 10 reads:
  p50 3.94 ms, sampled p90 4.36 ms. This is local API latency, not user-device FPS.
- Same test's unchanged SSE snapshot: full-history equivalent 30,582 bytes,
  emitted payload 11,084 bytes (63.8% smaller; notifications still included).
- Active TTL renewal is once per minute per room/process; cleanup reads are
  throttled to five seconds and deletion occurs only for actual stale records.

GPU FPS, shadows, avatar draw cost and mobile render quality were not measured:
computer automation currently cannot attach to the running Chrome browser.
Therefore no GPU bottleneck or visually approved animation claim is made.
The existing avatar-art replacement blocker still applies. No heavy dependency
was added; no paid/course/auth/enrollment/staff access rule was changed.

## Files

Backend: `server/study/models.js`, `service.js`, `collaboration.js`, `routes.js`.
UI/rendering: `src/study/shared/TableChat.jsx`, `ChatHistory.jsx`,
`SharedRoomPanel.jsx`, `SharedScene.jsx`, `RemoteAvatar.jsx`, `renderState.js`,
`streamHub.js`, `transport.js`, `useSharedRoom.js`, `notificationQueue.js`,
`StudyInvitations.jsx`, `shared.css`; `src/characters/RiggedStudent.jsx`;
`server/study/movementTimeline.js`.
Tests: `server/study/tableSession.integration.test.js`,
`tests/studyRenderState.test.mjs`, existing public/private/paid integration tests.

Build and 47 unit tests pass; authenticated temporary-history, private-social,
public-seat and paid-access integration checks are run against disposable test
DBs. Multi-user HTTP and actual SSE are verified, not multiple browser windows.
