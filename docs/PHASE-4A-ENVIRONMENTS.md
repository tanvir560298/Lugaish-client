# Phase 4A — Classroom and Study Library environments

## What was visibly wrong

Inspected actual local Classroom and Library at 1440×900 and 390×844, plus prior Phase 3 images/reports. The matched before screenshots were captured before editing this phase.

Classroom: flat grey walls; opaque featureless window panels; oversized, mismatched screen backing and sparse teaching wall; rigid chairs/materials with little visual separation; cramped rear-wall third-person framing, especially in portrait.

Library: a large dark ceiling void; featureless windows; solid-block shelving; weak zone identity against a blank rear wall; flat furniture/lights and a close desk camera. Mobile's existing automatic 2D fallback also presented a nearly blank background.

## Implemented transformation

Classroom now has a coordinated teaching wall: fluted oak acoustic detailing, correctly centered screen surround and a warm light line. The original lecture surface coordinates and playback pipeline are unchanged. Side-wall fabric panels, timber skirting, pale wood desks, rounded upholstered chairs, oak-plank flooring, deep timber window frames, glazed garden views and actual openings in the window wall give the room architectural depth. Daylight and cool fill are balanced. Portrait third-person framing is wider; camera collision checks and Lesson/first-person modes remain in place.

Library now has a complete timber-grid/slatted ceiling, suspended luminous fixtures, open framed bookshelves with individual books/spine bands, coordinated oak tables and fabric chairs, upholstered reading lounges, original leafy plants and warm luminous desk-lamp undersides. Four rear-wall architectural panels and physical zone signs identify the existing zones. Arrival is composed from a higher view; My Desk shows more of the table and surroundings, with extra camera distance in portrait. The overhead map removes the ceiling and foreground wall to keep all actual tables visible and clickable.

Both rooms have soft static contact washes in two instanced draws, including low graphics mode. Window daylight washes are subtle static artwork, not a weather/lighting simulation. Garden views are original stylized illustration textures, not photographic outdoor environments. The mobile/low-power 2D Library keeps its real seat controls and now uses the existing original library SVG as a backdrop.

## Scope and performance

No new dependency, downloaded model, stock texture or external asset was introduced. All new surface/garden/plant/sign art is original code-native artwork. Existing avatar asset/animation licensing is unchanged. No procedural avatar modifications in this phase.

512px surface textures and a 1024×512 garden texture are shared across instances. Furniture/slats/books/contact washes use instancing and shared geometry/materials. Plant leaves use two instanced draws per plant. Shared resources are deliberately retained for the application lifetime and excluded from instance disposal. One existing directional shadow map per scene; one shadowless directional fill. No post-processing, particles, per-table shadow lights or continuous texture generation. Low mode retains no real-time shadows and capped DPR; automatic 2D fallback is preserved. This is an optimized implementation, not a measured FPS guarantee on physical phones.

20 tables × 5 seats, four zones, seat IDs, desk heights and established movement corridors remain unchanged. Backend contracts, enrollment/authentication, group/chat restrictions, notes, timer, daily goals and lesson authorization were not edited.

## Files for this phase

- New: `src/shared/campusMaterials.js`, `CampusWindows.jsx`, `CampusSign.jsx`, `CampusPlant.jsx`, `GroundShadows.jsx`.
- Changed: `src/shared/LearningHall.jsx`; `src/classroom/Blocks.jsx`, `Environment.jsx`, `Player.jsx`; `src/study/shared/RoundedFurniture.jsx`, `StudyTables.jsx`, `LibraryInterior.jsx`, `SharedScene.jsx`, `libraryCamera.js`, `StudyHallPreview.jsx`, `SharedRoomPanel.jsx`; `src/study/study.css`; `src/components/CampusArtwork.jsx` (optional aspect-fit prop for the fallback).
- Updated the existing arrival camera test in `tests/libraryEntrance.test.mjs` to verify the new raised arrival composition inside the room while retaining human-height constrained Explore.

## Evidence and limits

Matched desktop and mobile before/after images: `visual-checks/phase4a-{before,after}-classroom-{lesson,room}-{1440,390}.png`, `phase4a-{before,after}-library-entrance-{1440,390}.png`. Extra Library 3D entry/overview/desk images: `phase4a-after-library-{entrance-3d,overview,desk}-{1440,390}.png`. Mobile entry captures include the preserved automatic 2D fallback, plus an explicitly enabled 3D view.

Browser journey at both widths confirmed candidate selection, completed seat arrival, notes and running timer surviving Library/My Desk switching, leaving the seat, and no document overflow. Results: `visual-checks/phase4a-library.json`. Browser harnesses: `tmp/platform-review/phase4a-views.mjs`, `phase4a-library.mjs`.

Production build and 53 unit tests passed. Existing bundle-size warning remains. Real authenticated paid-lecture playback and private multiplayer were not exercised with a live student account; their code/contracts were left intact. Screenshots use the clearly labelled local preview, with no invented occupants or enrollment bypass. The current procedural character and existing seated animation limitations remain intentionally unchanged pending separate professional GLB integration. No claim of photorealism or professional character replacement.

Local server check: port 4174 is the Vite development server (`/@vite/client` and `/src/main.jsx` confirmed in the rendered page), rather than a stale production preview. The final production build was generated separately and passed. The final mobile fallback was re-inspected after cropping/duplicate-context fixes; no overflow or overlapping context card remained. All 53 tests also passed after the final changes.
