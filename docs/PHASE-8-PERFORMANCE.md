# Phase 8 — targeted performance pass

The supplied request ends at “Largest Contentful Paint (LCP”. This pass implements the available scope: actual baseline measurement, targeted route-loading and 3D scheduling improvements, mobile flow checks, and preservation of working features. It does not claim all unspecified Phase 8 requirements or unfinished Phase 7 UI passes are complete.

## Baseline and measured result

Compared preserved before and final after **production builds**, served separately on localhost. Same Chrome headless instance, cold HTTP cache, 4× CPU slowdown, 80 ms simulated latency and 10 Mbps download. Three runs at each width, 900 px height. These are local lab samples, not field Core Web Vitals or physical-phone results.

| Measure | Before | After |
| --- | ---: | ---: |
| Home initial decoded JS | 631,780 B | 468,562 B |
| Home JS requests | 13 | 8 |
| Main JS chunk, uncompressed | 598,584 B | 456,544 B |
| Main JS chunk, gzip estimate | 177,744 B | 131,909 B |
| Median LCP, 390 px | 1,020 ms | 892 ms |
| Median LCP, 1440 px | 912 ms | 856 ms |
| Median DOMContentLoaded, 390 px | 378 ms | 333 ms |

Initial decoded Home JS decreased **25.8%**. The local mobile-width median LCP decreased **12.5%**; only three samples were taken and desktop timings included an after-run outlier. No field speed guarantee follows from these figures. The observer recorded zero long tasks in these samples; this is not an INP/TBT benchmark. Wire transfer depends on actual hosting compression; gzip here is a file estimate.

Raw evidence: [before](visual-checks/phase8-before-performance.json), [after](visual-checks/phase8-after-performance.json), [bundle sizes](visual-checks/phase8-bundles.json).

## Architecture and bottlenecks reviewed

- Existing page imports are already lazy. Home itself mounted its below-fold practice immediately, pulling animation/confetti dependencies into initial loading. Shared Layout eagerly imported the animated resource notification even for signed-out users.
- The production entry still includes shared course data and React/state infrastructure. Large Three.js chunks are route-dependent; no 3D character chunk or canvas was observed on Home in either build.
- Vite's existing large-chunk warning remains for 3D chunks. Merely relabeling chunks would not reduce the work, so no cosmetic manual-chunk configuration was added.
- The Library uses demand rendering, but its interval previously invalidated at 60 Hz standard / 30 Hz low even when nobody was moving. Hidden tabs retained a waking interval, although it skipped invalidation.
- Existing library furniture uses shared/instanced resources; campus materials cache textures/materials. Mobile already skips the HDR environment and detailed wood maps. These stable paths were retained.
- Existing student GLB is approximately 921 KB; assets are cached through `useGLTF`, skeletons are cloned per character, and owned mixer/instance cleanup exists. No asset recompression, rig replacement or visual downgrade was introduced.
- Existing rain uses one owned player with opt-in playback/cleanup. Speaking recording cleanup and real-level sampling remain unchanged. API GET de-duplication already exists and was not replaced with a cache that could serve stale enrollment data.

## Changes implemented

1. `src/components/DeferredPracticePreview.jsx`: load the real practice widget when within 240 px of the viewport or explicitly opened. Fallback to normal loading without IntersectionObserver. Disconnect observer on cleanup. Preserve the existing widget and callbacks; show an accessible loading/error state with reload recovery. Reserve space for the preview.
2. `src/pages/HomePage.jsx`: use that deferred component.
3. `src/components/Layout.jsx`: dynamically load resource notifications only for signed-in users, where their existing eligibility effect applies. Do not load that animation dependency for a signed-out Home visit.
4. `src/study/shared/frameSchedule.js` and `SharedScene.jsx`: standard quiet scenes request 30 frames/s rather than 60; low quiet scenes request 15 rather than 30. Active movement/greetings retain the previous 60/30 cadence. Empty or reduced-motion scenes do not run the idle timer. Camera controls/transitions retain their own invalidation. Hidden documents cancel the timer and resume with one invalidation on visibility return. Cleanup cancels timers/listeners; preference changes reschedule.
5. `src/styles/journey.css`: reserve the practice preview area.
6. `src/study/shared/RemoteAvatar.jsx`: respond to reduced-motion preference changes while mounted, so a newly static scene uses the final natural pose rather than freezing an in-progress path.
7. `tests/sceneFrameSchedule.test.mjs`: regression coverage for cadence changes, motion deadlines, reduced motion, hidden/resumed scheduling and late callbacks after disposal.

Quiet-scene **scheduled invalidations** are halved. This does not mean measured FPS doubled or total GPU work halved: camera damping, component changes and real hardware can trigger additional renders. Live movement cadence and subtle idle animation are retained.

## Verification

- Final production build passed. Existing large-chunk advisory remains.
- **99 tests passed** including two new scheduler tests and existing microphone, rain, progress, classroom and access-related tests.
- At 390, 768 and 1440 px, the optimized production Home did not request the practice module initially; scrolling to it loaded the working widget. No horizontal overflow was observed. [Flow results](visual-checks/phase8-flows.json).
- Mobile developer Library: accessible seat selection, Study Tools, starting the timer and preserving it through Library/My Desk view changes passed.
- Desktop developer Library: the actual 3D canvas rendered after the scheduler change. [Screenshot](visual-checks/phase8-library-1440.png).
- Practice screenshots: [mobile](visual-checks/phase8-practice-390.png), [tablet](visual-checks/phase8-practice-768.png), [desktop](visual-checks/phase8-practice-1440.png).

The initial benchmark script had an escaped-regex error; invalid rows were discarded and all baseline/final measurements above were rerun. A seat smoke test initially expected an automatic modal instead of the existing accessible-seat action; the corrected actual flow passed.

## Limitations and next work

No physical phone, hardware GPU, authenticated learner or real multi-user room was available. Headless 3D used software graphics; it verifies rendering, not ordinary-device FPS. Hidden-timer behavior and reduced-motion scheduling were verified with deterministic tests, not a physical battery measurement. CLS, INP, memory/leak duration tests, production API latency and long-running live-room load were not measured. Complete those measurements before broader 3D changes.

Shared course data and initial CSS (about 176 KB entry CSS, 266 KB across all generated CSS) remain substantial. Their separation requires reviewing curriculum/state contracts; this pass avoids removing access checks or mutating course content merely to reduce a score. No backend contracts, enrollments, paid access, private chat, notes, materials, audio assets or seating capacities changed.
