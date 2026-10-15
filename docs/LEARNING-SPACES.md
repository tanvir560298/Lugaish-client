# Learning Spaces

The shared-room extension and its verification report are documented in [SHARED-STUDY-ROOM.md](SHARED-STUDY-ROOM.md).

Local review: http://127.0.0.1:4174/learning-spaces-preview

For signed-in local review, run `npm run dev` and `npm run dev:api` in separate terminals. The API launcher uses Node's `process.loadEnvFile` (Node 20.12+), reads `server/.env` and the root `.env`, and uses the frontend's local API port and Firebase project. Install the backend dependencies with `npm install --prefix server` if needed. MongoDB must also be running (the default is the local `lugaish` database). Running Vite alone serves previews but cannot complete backend sign-in.

The navigation now opens a Learning Spaces page with three plain-English choices: Study Room, 3D Classroom, and the existing Speaking Practice. The preview routes are development-only; the normal Study Room route requires authentication. Speaking Practice retains its existing sign-in requirements.

## Study Room

- Choose a window or quiet desk, enter a task, and start a 15-, 25-, or 45-minute session.
- Pause, resume, finish early, mark the task done, or take a five-minute break.
- Focus mode keeps the timer and notebook/materials visible while hiding extra controls.
- Desktop supports an optional interactive 3D desk. Mobile defaults to a lightweight illustrated desk; a simple view is also available on desktop and after graphics failure.
- Rain audio starts only on request and is cleaned up when leaving the page.
- Existing task/resource notifications are deferred while inside the room, without marking them read.

Timer deadlines survive refresh and background tabs. They measure elapsed session time, not attention; students must pause when stepping away. Notebook, timer, and up to 50 recent session records are stored locally by account and course, with a separate preview scope. They do not sync between devices. Countdown changes now synchronize between same-origin browser tabs. Sessions do not award course credit or XP.

## Materials and access

The development preview includes an original sample reading activity. Signed-in materials use the existing course-day and availability rules. Opening a resource requires successful authorization through `getLesson` before its Google Drive preview is exposed. An external link provides a fallback when embedding is unavailable. Personal study tools remain available when course materials are locked.

## Implementation

Pages are in `src/pages/LearningSpacesPage.jsx` and `src/pages/StudyRoomPage.jsx`. Study components, scoped styles, resource policy, timer reducer, persistence, audio, and tests are in `src/study/`. Illustrations and scene geometry are original code-based assets. This change adds no further dependencies beyond those already used by the local classroom implementation.

## Validation

`npm run build` passes, with the existing large-bundle warning.

```sh
node --test src/study/study.test.js src/classroom/classroom.test.js src/data/learningResources.test.js src/utils/speakingScoring.test.js
```

All 30 tests pass. Local Chrome checks covered desktop/mobile layouts, seat controls, timer pause/resume and refresh, notes, focus mode, completion history, breaks, audio cleanup, unauthenticated redirect, and accelerated timer expiration. Mocked authenticated checks verified denied resources stay blocked, retries reauthorize, permitted PDFs embed, and notes remain scoped. Live account/backend authorization and actual Google Drive rendering still require review with a real account.

Changes remain local for review; nothing has been pushed or deployed.
