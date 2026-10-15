# Living Learning Campus — Phase 1

## Scope and architecture audit

This phase implements the foundation only. It does not claim that the seven-phase campus vision or premium avatar replacement is complete.

- Frontend: React 19, Vite 5, JavaScript, React Router 6. Existing course definitions and account state are in `src/data/courseData.js` and `src/state/AppContext.jsx`.
- Authentication: existing Firebase client sign-in and Express JWT authorization. No new sign-in system or bypass.
- Backend: Express/Mongoose/MongoDB in the `server` submodule. Supabase is not the current provider. A local MongoDB connection is available; no hosted provider plan or quota has been verified.
- Course catalogue: authenticated `/lessons/:language/day-modules` and `/lessons/:language/:day`. Server publication, schedule, premium access and sequential video locks remain authoritative.
- Existing LessonPage provides playlists, explicit video completion, PDF/day rewards, quizzes and materials. Classroom completion reuses `api.completeLessonVideo`; it does not award day completion or duplicate the curriculum.
- 3D: existing React Three Fiber/Drei/Three, shared instanced desks, capsule controller, animation pipeline and a local classroom session. Classroom seats are local, not a claim of connected students.
- Shared study rooms already have authenticated membership, invitations and table seating. Their SSE snapshots poll MongoDB every second. DM/group bodies currently persist with 24-hour TTLs. **That architecture violates the new strict ephemeral messaging requirement.** Phase 3 must replace content storage/delivery with an authorized live transport, remove history/replay paths and define legacy-data removal separately. No destructive deletion was performed in Phase 1.

## Implemented changes

- `src/pages/ClassroomPage.jsx`: dedicated course/day/lecture learning-board dialog, catalogue shortcut in the HUD, personal theater player, fullscreen control, full-lesson/materials links and WebGL-failure 2D lesson link. Access is revalidated before opening content. Supported learner videos can explicitly save completion with the existing API; refresh reveals newly unlocked videos.
- `src/classroom/Projector.jsx`: native video controls in theater reuse the actual video element and its VideoTexture. YouTube uses a single player: browsers with DOM `moveBefore` preserve the iframe context; older browsers recreate that player with its recorded time and playing/paused state. Older-browser transfers may buffer again. Closing theater retains the room and seat instead of remounting the scene.
- `src/classroom/ClassroomScene.jsx`: forwards learning-board and theater presentation controls to the existing scene.
- `src/classroom/Environment.jsx`: warm light palette, ceiling, window sills, front-wall accents, language wall sign, planter and an interactive board catalogue button. Existing room proportions and instanced furniture remain.
- `src/classroom/world.js`: matching collision for the new planter.
- `src/classroom/lectures.js`: carries server progress metadata and reuses existing explicit completion API. Legacy and bundled content route to the full lesson for unsupported progress workflows.
- `src/classroom/session.js`: personal learning can open paused without starting the teacher entrance sequence. Existing guided class behavior remains available.
- `src/classroom/classroom.css`: responsive theater and course-board styling, native dialog focus behavior and focus indicators.
- `tests/classroomLearning.test.mjs`: server locks override stale local progress, legacy sequential unlock rules, source validation and independent personal playback transitions.

## Validation and limits

Production build passes; existing large-chunk warning remains (main application and Three/R3F). Frontend route responds HTTP 200; `/health` reports MongoDB connected.

All 32 frontend/unit tests pass (`node --test tests/*.test.mjs`). Automated tests cover movement, collision, animation compatibility, fullscreen lifecycle logic, catalogue access policy and social utilities. They do not verify real browser playback, YouTube iframe transfers, native fullscreen, touch behavior or visual quality. Interactive browser automation is unavailable in this environment; those checks remain required before production acceptance. Account-based course completion also needs an authenticated browser check. No claim of reference-quality architecture or new premium avatar art is made.

The paid-batch day-modules API currently returns an empty plan; the existing classroom adapter exposes the authorized bundled Day 2 clips only. Other paid-batch PDFs/reels and day workflows remain in the full LessonPage. No pretend videos or fake live classmates are added.

## Migration, resource and security impact

No database migration, package installation, paid service, video upload or schema change. Existing lesson URLs are reused. Lesson completion uses existing authenticated server validation. Personal player state is independent; nothing synchronizes classmates automatically. No new presence/message polling is introduced.

Video hosts may require CORS or allow embedding; YouTube and browser autoplay restrictions still apply. The WebGL scene continues rendering behind theater, so weak devices should use the normal 2D lesson; adaptive render suspension is a later optimization. Deployment free-tier limits cannot be stated until the actual hosting plan is supplied/verified.

## Next phase

First complete browser QA for Phase 1 (two actual learner accounts, locked content, explicit completion/unlock, native/video fullscreen, YouTube transfer, mobile and 2D fallback). Phase 2 should then reconcile existing 100-seat halls and five-person tables with actual private-room membership/presence, without fake online users. Phase 3 replaces persistent chat and one-second database polling with authorized live-only delivery and tests refresh/offline non-replay. Premium sculpted avatar assets remain the separate blocker documented in `AVATAR-REPLACEMENT-BLOCKER.md`.
