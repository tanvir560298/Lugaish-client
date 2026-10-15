# Lugaish 3D Classroom — local V1

## Run and review

Run `npm run dev -- --host 127.0.0.1`. Vite uses port 4174.

- **Fast local review:** http://127.0.0.1:4174/classroom-preview
- **Normal authenticated integration:** http://127.0.0.1:4174/classroom (also in the existing navigation)

The preview route exists only when `import.meta.env.DEV` is true. Production builds contain no preview route. It uses the five speaking clips already distributed in `public/videos`; it does not grant private course access, bypass a server check, create users, or write progress. No changes have been committed, pushed, or deployed for this feature.

Choose a lecture and graphics quality, enter, then select **Start local preview**. The door opens, the teacher follows the left aisle to the teaching area, turns, activates the projector, and attempts playback. If the browser requires a new gesture, **Play lecture** is available. Pause, resume, end, replay, exit, and re-entry are supported. A room with no accessible videos can still be explored, with start disabled.

## Controls

- **Walk around:** explicitly captures the mouse. No automatic pointer lock.
- **W/A/S/D:** camera-relative walking. **Shift:** running. **Mouse:** look.
- **E / Wave button:** articulated wave and one brief “Hi!” indicator.
- **Esc:** release the mouse and use HUD controls.
- **First-person / Third-person view:** camera mode. Default is third person.
- **Return to entrance:** restore a collision-free spawn and clear input.
- **Controls:** help and an actual two-second performance sample.

Focus loss and typing clear movement. Hiding the tab pauses media. Touch-only devices receive a keyboard-and-mouse requirement instead of entering an uncontrollable scene. There is no joystick in V1.

## Architecture and files

The existing app is React 19 / Vite 5, JavaScript/JSX, React Router 6, AppContext/localStorage, Firebase sign-in and an authenticated Express API. It already used React Three Fiber 9, Drei 10, and Three.js via peer dependencies. The feature uses those systems unchanged.

| Purpose | Files |
| --- | --- |
| Existing integration | `src/App.jsx`, `src/components/Header.jsx` |
| Entry, accessible lecture selection, HUD, errors | `src/pages/ClassroomPage.jsx`, `src/classroom/classroom.css` |
| Scene, capability checks, context loss, performance | `src/classroom/ClassroomScene.jsx` |
| Procedural architecture, reusable furniture, door, light | `src/classroom/Environment.jsx` |
| Dimensions, colliders, frame-independent movement and camera sweeps | `src/classroom/world.js` |
| Keyboard/mouse adapter, local simulation, camera | `src/classroom/Player.jsx` |
| Replaceable character asset adapter | `src/classroom/Avatar.jsx` |
| Teacher entity and waypoint choreography | `src/classroom/Teacher.jsx` |
| Video texture and official YouTube player adapters | `src/classroom/Projector.jsx` |
| Authorized catalog, provider/sequential-access policy | `src/classroom/lectures.js`, `src/classroom/mediaPolicy.js` |
| State machine, local transport, contracts, future remote rendering | `src/classroom/session.js`, `src/classroom/contracts.d.ts`, `src/classroom/RemoteAvatar.jsx` |
| Asset provenance | `src/classroom/assets.json` |
| Automated logic tests | `src/classroom/classroom.test.js` |
| Dependency declaration | `package.json`, `package-lock.json` |

The route is lazy-loaded; the scene is a second lazy boundary loaded on entry. No classroom model/video is loaded on unrelated routes. Classroom styles are scoped under `cr-*`; no global style overrides were added. The header hides the secondary progress badge until the wider breakpoint to accommodate the additional navigation destination.

`three@0.184.0` was promoted from an already-installed peer dependency to a direct pinned dependency because classroom modules import it. No Three.js version change, new runtime engine, physics library, or dependency upgrade. It satisfies the installed Fiber and Drei peer ranges. Temporary browser QA tooling was installed under `/tmp`, outside the project.

## World, animation, and resource ownership

Room: 10 × 8 m, 3.2 m high; desks at 0.74 m; chairs at 0.46 m; eye height 1.62 m. Nine desks leave a wide left aisle. The teacher has a separate entrance route, approximately 1.3 m clear through the door. The local player starts in that aisle near the entrance. The player stays inside the teaching room; only the teacher uses the short entrance corridor.

Movement is a grounded circular-footprint approximation against expanded AABBs. It normalizes diagonals, smoothly accelerates/decelerates, substeps at 120 Hz, and further subdivides displacement to at most 8 cm. Ground height is fixed; there is no jumping, gravity solver, stairs, or sloped terrain. Furniture colliders intentionally include under-desk space. Camera sweeps use expanded 3D AABBs and room bounds. First person hides the local avatar; third person also hides it when camera clearance is too small.

The teacher state advances on waypoint arrival and turning completion, not a chain of timed callbacks. Start requests are guarded against duplicates, stale API responses after exit, and illegal transitions. Ending resets the teacher rather than animating a departure. The state machine has Loading, Waiting, TeacherEntering, TeacherApproaching, PreparingLecture, LectureReady, LecturePlaying, LecturePaused, Ended and Error states. Reduced-motion mode removes optional gesturing and snaps the door; functional walking remains.

The characters are intentionally **articulated placeholders**, not professional scanned/rigged avatars. Replace `Avatar` with a properly licensed GLB and animation mixer later. Visual assets, colliders, input, and choreography are separate. See `assets.json` for provenance and scale. No external character licenses or asset-download links are invented.

Repeated furniture uses instancing and cached primitive materials/geometry. One directional light casts shadows in Standard quality; Low disables shadows and caps pixel ratio at 1. Standard caps it at 1.5. No HDR downloads or post-processing. Generated textures and owned video textures are disposed. Media is paused immediately on exit; R3F completes renderer/effect resource disposal asynchronously. Ref cleanup checks ownership so an outgoing room cannot clear a newly entered room’s controls.

## Lecture access and media compatibility

The normal route reuses `ProtectedCourseRoute`, including authentication and the existing course launch guard. The catalog reads `getDayModules`, filters published/available/non-premium-locked days, and reads `getLesson` for the selected day. Server video locks or existing local sequential-video completion keys remain in force. Ambiguous server lock metadata fails closed. There are no new completion writes.

Private-batch bundled clips are exposed only after a successful `getLesson('paid_batch', 2)` response; that existing endpoint checks enrollment and paid month access. Start revalidates entitlement. Error/replay retry fetches fresh records, including changed signed URLs. Network or access failures never unlock a lecture. Existing server implementations and their permission rules were not altered.

- **Bundled files:** actual MP4 playback uses `HTMLVideoElement` → `THREE.VideoTexture`; source metadata preserves aspect ratio and letterboxes where needed. One active video/audio source. Loaded, buffering, play, pause, end, autoplay denial and error states feed the HUD.
- **Remote MP4/WebM/OGV:** uses `crossOrigin='anonymous'`. The host must permit CORS and serve a browser-supported codec. Cookies/private authorization headers are not synthesized. Signed URLs come only from the existing lesson API; retry refreshes the record. URLs are not persisted or included in transport events.
- **YouTube:** uses the official IFrame API in a Drei `Html transform` surface aligned to the physical projector, with raycast occlusion. This is an embedded DOM player, **not a WebGL video texture**. Raycast occlusion can hide the whole embedded surface when its center is obstructed; file textures have normal per-pixel geometry occlusion. Native player controls are available after Esc. Provider embed bans and network failures produce recovery instructions. The player does not scrape media, bypass provider restrictions, or pretend CORS access is available.
- **Other providers / HLS / DASH / DRM / PDF / slides:** no fake controls. Unsupported sources are omitted. Use My Classes for those lesson activities.

Official API references used: [Three.js VideoTexture](https://threejs.org/docs/pages/VideoTexture.html), [Drei Html](https://drei.docs.pmnd.rs/misc/html), [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference).

## Authority boundary and V2

There is no classroom backend in V1. Every user sees **Local session** and **Start local preview**; this does not imply teacher/admin privilege. Local control events affect only this browser. No fake connected-user counts, live voice, remote users, or server synchronization.

`contracts.d.ts` defines versioned messages with session/entity IDs, timestamps and sequence numbers for join/leave, snapshots, emotes, start/stop, lecture selection, and media position/time. A local emitter implements transport today. The separate remote-avatar adapter interpolates snapshots without using local input, but is not mounted in V1. Snapshots are emitted at 10 Hz; transforms do not go through React state every frame.

Before shared classrooms: authenticate the transport; validate role, enrollment, class transitions and emotes server-side; rate-limit and sequence commands; authorize media resolution; use authoritative media position plus timestamp and reconcile client drift. Never trust a client-provided role, URL, timestamp, or entity ID. No multiplayer endpoints or client-side staff toggle should be mistaken for server authorization.

V2 intentionally reserves multiplayer, authoritative class control, professional rigged models, touch controls, live audio, slide/PDF adapters, adaptive quality and full remote playback synchronization.

## Validation

Baseline before editing: production build passed with existing >500 kB chunk warnings; all 9 existing frontend Node tests passed. No existing frontend lint/type script is configured.

Run `node --test src/classroom/classroom.test.js src/data/learningResources.test.js src/utils/speakingScoring.test.js` and `npm run build`.

The added tests cover spawn/teacher-route clearance, running collision/tunnelling, diagonal normalization, 30 vs 144 FPS movement, camera obstruction, legal/duplicate/cancelled class transitions, transport cleanup, shortest-angle interpolation, sequential/server locks, and media-provider validation.

Browser QA uses installed Google Chrome in an isolated headless profile, because the in-app browser bridge was unavailable. Live account login and production services are not assumed to work from mock tests. See the final validation record below for completed checks and limitations.

### Final validation record

- Production build: **passed**; existing large-chunk warning remains. Separate output: classroom page approximately 20 kB JS / 8 kB CSS, scene approximately 33 kB JS, before gzip. Three/Fiber remain a shared lazy chunk. No `classroom-preview` route string in the production main bundle.
- Frontend Node tests: **19/19 passed** (9 existing + 10 classroom).
- Isolated Chrome, 1440 px desktop: actual WebGL room and existing H.264 teaching clip; teacher entrance; start/play/pause/resume/end; exit/re-entry; camera toggles; no new console errors in this flow.
- Keyboard/mouse: explicit pointer lock, WASD/Shift changing the viewpoint, keyboard wave, and blur releasing pointer lock passed. “Hi!” appears as one label.
- Forced autoplay rejection: stayed ready with Play lecture; user-click recovery succeeded. Exactly one playing HTML video was observed. Exit immediately paused playback; cleanup removed the source once React/R3F disposal completed.
- 390 px touch profile: support notice shown, Enter absent, no horizontal overflow; mobile navigation includes 3D Classroom. No claim of touch gameplay.
- Unauthenticated `/classroom`: redirects to `/login`.
- Authenticated route with **isolated API fixtures**: paid-batch lesson access checked; a 403 introduced after selection prevents Start from advancing; normal My Classes navigation still renders. These are client integration tests, not live backend authorization or Firebase sign-in tests.
- Standard-quality sample: approximately **60 FPS, 100 draw calls, 5,930 triangles** in headless Chrome on this host. A Low-quality entry/startup sample during the wider test run was **35 FPS, 84 draw calls, 4,004 triangles**. These are observed two-second samples, not controlled GPU benchmarks or guarantees. Use the Controls panel for current-device measurements.
- Verified visually: desktop lobby, default room framing, in-world file playback, mobile lobby/support state.
- Not verified: a real user's Firebase login/enrollment, live backend data, live YouTube playback, remote signed URL expiration, Safari/Firefox, context loss on physical hardware, long-duration memory/performance, or all existing application flows. YouTube/provider and WebGL recovery code is implemented but should be reviewed on the target devices before upload.

Temporary browser screenshots and QA scripts live under `/tmp/lugaish-classroom-*` and `/tmp/lugaish-classroom-qa`; they are not runtime dependencies or public assets.
