# Shared Study Room — local version 1

Open http://127.0.0.1:4174/study-room with a signed-in account. Choose **Study with friends**, create a room, enter directly or open the door, and select a seat. Invite another account by email. The recipient reviews **Study invitations**, confirms **Join room**, and chooses a seat. Invitation links work only for the addressed account.

Nothing has been committed, pushed, deployed, or changed in production. The `server/` directory is a separate Git repository/submodule; its changes are also local.

## Existing features preserved

Learning Spaces, the separate 3D Classroom, and Speaking Practice remain available. The personal Window/Quiet desks, 15/25/45-minute countdown, pause/resume/early finish, five-minute breaks, task completion, notebook, authorized PDF materials, rain audio, history, focus view, mobile view, and graphics fallback remain in place. Joining a room does not reset the personal countdown, notes, or course selection.

Development previews still contain only personal sample experiences. Real shared-room access always requires a backend-verified account; the production router excludes preview routes.

## New behavior

- Invitation-only rooms with at most five distinct accounts, including the host.
- Actual authenticated live presence using fetch-based server-sent events and authenticated POST actions. Tokens are never placed in stream URLs.
- Persistent MongoDB room records. Membership, seat claims, invitations, and timing transitions use revision-checked atomic document updates. A separate account lock serializes joining/creating across rooms.
- Five stable seat identifiers with positions, facing directions, approach points, and furniture-safe perimeter paths.
- Shared simple/mobile view and optional 3D view using the same room state. Switching views keeps membership and timers.
- A brief, skippable doorway transition between the separate routes; no campus or free-roaming world is added. Seat selection drives server-validated walking paths and procedural turning/seating. Mobile and reduced-motion users can sit directly.
- Original procedural avatars, wave animation, greeting bubbles, and **Call over**. Recipients move only after **Join table**; **Not now**, muting, focus suppression, and a ten-second greeting cooldown are supported.
- In-app invitations, addressed links, accept/decline, 15-minute expiration, and revocation. Confirmation is neutral regardless of whether the address is registered. No external emails or greeting sounds are sent.
- Participant status/timer panel, desk timer labels, and a cumulative group-overlap display. Other timers can be collapsed.
- Explicit leave, host removal, and automatic host transfer to the earliest remaining member. A host leaving does not end others’ personal sessions.
- One controlling browser document per member. Duplicate tabs observe the same person; **Use this tab** transfers control. Same-browser personal countdown changes propagate through storage events. A refresh can reclaim its prior controller without allocating a second seat.
- Sign-in preserves invitation query strings. Outside the Study Room, invitations appear as a quiet link; they never navigate the recipient away from a lesson automatically.

## Timing and connection policy

The private **Your focus time** comes from the existing personal countdown, excluding pauses and breaks. Shared participant times accrue from server-observed active intervals for the current focus session. Unverified time before joining stays in the private timer and is not imported into public totals; the UI explains this distinction. Breaks preserve the last verified focus total and add no focus time.

**Time studying together** is cumulative room overlap, not the sum of students’ minutes and not a claim that everyone attended the full duration. It increases once per qualifying interval with at least two distinct, seated, connected members actively studying. Seat arrival, countdown deadlines, and connection-grace deadlines split intervals exactly.

Example covered by tests: A studies 20 minutes alone, B joins and studies for five minutes; A has 25, B has five, and the room has five minutes together.

The server never accepts a client-provided elapsed total. It uses its own clock and validated remaining-duration bounds for future deadlines. As with a personal timer, starting a session expresses the student’s intent; it does not prove attention or earn course credit.

Presence heartbeats occur approximately every five seconds, including on incoming stream events so background operation does not depend solely on browser interval timers. Visibility alone does not pause study. After 20 seconds without presence, the member stops contributing to shared overlap. Their personal timer continues. Their seat/membership is retained for two minutes, then released; a stale host is replaced. OS suspension can therefore remove someone from shared overlap even while their private countdown continues.

Explicit **Leave room** releases membership immediately. Navigating away or closing the browser closes the stream and heartbeats, with the same grace window for refresh/recovery. Empty rooms close to new accepts and expire shortly afterward. Active-room persistence is extended by activity; abandoned records expire. Pending invitations created by a departing/removed member are invalidated.

## Privacy and scope limits

Room snapshots contain display names, seats, statuses, public timer values, and gestures. They do not include emails, notebook text, goals, materials, personal history, auth tokens, or other members’ controller identifiers. Course-material authorization is unchanged and is never inherited from another participant. Sound is personal.

This version uses fixed safe paths and simple procedural avatars, not imported character animation clips or unrestricted joystick movement. There is no voice chat, public discovery, shared notes, document editing, shared lecture playback, or full campus. Those remain future work.

The transport sends bounded snapshots about once per second; avatars render/interpolate locally between updates. Movement frames are not written to MongoDB. Room transitions and presence heartbeats do write room state. This is sized for small five-person rooms; large-scale deployment/load testing and a multi-process event broker are not part of this local version. MongoDB compare-and-swap remains authoritative across API processes, while connection limits are per process.

Local notes/history remain browser-specific and are not cloud-synced. Countdown storage events synchronize same-origin tabs only. The room’s verified timing is independent of private history. Actual Google sign-in across two real student accounts and live Google Drive rendering still need a user acceptance pass; the automated browser accounts described below are disposable local fixtures, not real students.

## Files and dependencies

- `server/study/models.js`, `service.js`: room persistence, membership, invitations, permitted actions, concurrency.
- `server/study/routes.js`: authenticated HTTP actions, streamed snapshots, connection and request limits.
- `server/study/timing.js`, `seating.js`: interval calculations and validated paths.
- `server/src/index.js`: mounts `/api/study` behind the existing database guard.
- `src/study/shared/transport.js`, `useSharedRoom.js`: authenticated connection, reconnection, control ownership, timer transitions.
- `src/study/shared/SharedRoomPanel.jsx`, `Invitations.jsx`, `SeatControls.jsx`, `StudyInvitations.jsx`: shared UI, invitations, accessible seat input, quiet notification link.
- `src/study/shared/SharedScene.jsx`, `RemoteAvatar.jsx`, `motion.js`: room visuals and interpolated procedural avatars.
- `src/study/shared/RoomBoundary.jsx`, `shared.css`: failure isolation and responsive presentation.
- `src/pages/StudyRoomPage.jsx`, `LearningSpacesPage.jsx`, `LoginPage.jsx`, `src/components/Layout.jsx`: integration and sign-in return URL.
- `src/study/timer.js`, `useStudySession.js`: same-browser countdown restoration/synchronization.
- `server/study/study.test.js`, `scripts/shared-room-qa.mjs`: pure and real-backend integration checks.

No additional runtime dependencies were added for multiplayer. Existing Express, MongoDB/Mongoose, JWT middleware, React Three Fiber, Drei, and Three.js are reused. Browser verification used externally installed Playwright Core and local Chrome; it is not bundled with the application.

## Local commands

```sh
npm run dev
# Separate terminal; Node 20.12+ and a running local MongoDB are required:
npm run dev:api
```

Install backend dependencies with `npm install --prefix server` if they are missing. The launcher reads `server/.env` and root `.env`, uses the configured local API port, and takes the Firebase project from the existing frontend configuration. Real sign-in still requires correctly configured Firebase Google authentication and an authorized local domain.

Pure checks:

```sh
node --test server/study/study.test.js src/study/study.test.js src/classroom/classroom.test.js src/data/learningResources.test.js src/utils/speakingScoring.test.js
rg --files server/src -g '*.test.js' -0 | xargs -0 node --test
npm run build
```

Real backend checks (requires local MongoDB):

```sh
node scripts/shared-room-qa.mjs
# Include actual separate Chrome contexts with externally installed Playwright:
QA_PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs node scripts/shared-room-qa.mjs
```

The integration script starts isolated API/frontend ports 5012/4182, creates uniquely named `lugaish_study_test_*` databases, and removes those fixtures afterward. It signs normal backend JWTs for fixture accounts and passes through the real authentication middleware. It neither mocks presence nor bypasses authentication in application code. It does not automate Google's identity-provider login.

## Verification record

- 36 study/classroom/resource/scoring tests and 16 existing backend tests passed.
- Production build passed; the existing large-bundle warning remains.
- Real separate desktop/mobile browser contexts verified invitation delivery and acceptance, shared presence, seated overlap, call/accept, private notes, pause/resume, focus suppression, actual offline/reconnect grace, refresh recovery, duplicate-tab control, 3D rendering, and no mobile horizontal overflow.
- Real backend checks verified simultaneous final membership claims, same-seat/final-chair competition, wrong-account links, unauthorized actions, malformed timer requests, host transfer/removal, expiry/decline/revocation, and stale-host release.
- Personal Study Room browser regressions verified notes, focus, reading, completion, breaks, persistence, responsive layout, authentication redirect, and audio cleanup. Existing mocked material-provider checks remain distinct from actual Google Drive verification.
- Preview routes remain absent from the production entry bundle. No production data was used.
