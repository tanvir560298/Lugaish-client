# Phase 7 — foundation and public learning journey

## Scope delivered

A cohesive working first pass of the requested multi-pass transformation: shared design foundation, navigation, Home composition, campus entry and sign-in visibility. Phase 7 as a whole is **not complete**. The authenticated learning workspace and immersive/activity interfaces still need their dedicated passes.

## Findings from actual browser inspection

Nine routes were captured before editing at 1440×900, 768×900 and 390×844. The authenticated My Classes route redirected to Login; this was preserved rather than bypassed. Campus, Classroom, Library and Speaking were inspected using existing developer preview routes.

The biggest issues in this pass were an abstract Home hero that did not show the product, two nearly identical illustrated campus entries, a long first-screen composition, Speaking hidden under the campus journey, and a white legacy pseudo-element hiding the Google sign-in label. The older pricing copy also advertised AI-assisted tools despite no real conversation provider being configured.

Remaining issues observed: mobile library arrival competes with several navigation/control surfaces, My Classes needs a full actual-enrollment review, and immersive overlays still use their own composition. These were not silently replaced with mockups.

## Implemented changes

- Home now follows hero → language pathways → learning rhythm → working sample exercise → campus destinations → final action. Actual rendered scenes replace the abstract hero illustration. The returning-user action goes directly to My Classes.
- Exploring a Home pathway changes the selected language and opens the existing pathway/login flow; it no longer calls enrollment while merely browsing. Enrollment remains in its existing explicit flow.
- Campus has distinct real Classroom and Library previews, direct room actions and a compact existing avatar control. Speaking and entrance exploration remain available.
- Shared navy/forest/ivory semantic tokens unify ordinary pages across both existing themes. Existing font fallbacks, Arabic direction, and motion preferences remain supported.
- Navigation separates Campus and Speaking, and keeps My Classes active on lesson/quiz/course routes. Mobile navigation closes on route changes; Escape closes it and restores focus.
- A keyboard skip link reaches the main surface. Visible focus outlines and comfortable link/button targets improve navigation. Login errors have an alert role.
- Removed legacy animated login pseudo-elements that obscured the Google button. The working Firebase handlers and return destination logic are untouched.
- Course inclusions describe implemented practice/study tools. Unsupported AI promises were removed; the future Pro plan remains explicitly unavailable.

No dependencies or backend contracts changed. No synthetic progress, occupancy, reward or AI feedback was added. Classroom scene, library seats/groups, timer/notes, rain and microphone controller logic were not changed in this pass.

## Files changed in this pass

- `src/styles/journey.css` and `src/main.jsx`: foundation and responsive public layouts.
- `src/pages/HomePage.jsx`: restructured public learning journey.
- `src/components/CampusPreview.jsx` and `public/images/campus/{classroom,library}.jpg`: static actual-scene previews, about 198 KB combined; lazy except the hero. No 3D scene loads in the Home hero.
- `src/pages/LearningSpacesPage.jsx`: campus heading, preview and action presentation.
- `src/components/Header.jsx`, `src/components/Layout.jsx`: navigation and skip link.
- `src/pages/LoginPage.jsx`: accessible error announcement.
- `src/pages/PricingPage.jsx`: accurate supported-feature copy.

This working tree already contained extensive previous-phase changes. The full Git diff is not the change count for this pass.

## Verification and evidence

- Production build passed; the existing large-chunk advisory remains.
- Existing 97 automated tests passed.
- Two real HTTP/MongoDB integration tests passed for paid access and quiz ownership/completion, using isolated test data.
- Before/after capture of nine routes at all three widths showed no horizontal overflow. [Before results](visual-checks/phase7-before.json), [after results](visual-checks/phase7-after.json).
- Ten navigation smoke checks passed: loaded static hero, no hero canvas, mobile menu open, Escape/focus restoration, route close, keyboard skip link, course CTA, light theme, theme persistence and protected speaking redirect/readable Google label. [Navigation results](visual-checks/phase7-navigation.json).
- [Before/after screenshot gallery](visual-checks/phase7-comparison.html). Light-theme captures: [Home desktop](visual-checks/phase7-home-light-1440.png), [Campus mobile](visual-checks/phase7-spaces-light-390.png).
- [Full mobile Home composition](visual-checks/phase7-home-full-mobile.png) was also captured and visually reviewed.

The initial skip-link automation attempted to click the intentionally hidden link without tabbing to reveal it; the corrected keyboard-first check passed. No application fix was needed for that harness error.

## Assets and access

The preview JPGs are cropped from existing Phase 4B screenshots of this project's own rendered environments. They contain no fabricated occupancy and require no new third-party imagery license. Existing environment asset licenses remain as documented in Phase 4B. They are static previews; the actual interactive scene remains on its existing destination.

Google sign-in was not completed with a real account. Enrolled lesson completion, private chat, live seat conflicts, physical microphone and real learner progress were not end-to-end browser tested in this pass. Existing tests passed, but this is not a claim that every learning journey has been verified.

## Remaining Phase 7 work and Phase 8 priorities

1. Finish Pass B for a real authenticated student: meaningful enrollment empty states, one next eligible lesson and actual saved progress.
2. Complete Pass C with focused Classroom selection/controls and a single coherent Library arrival, seat and tools journey. Preserve timers/notes while testing view changes.
3. Complete Pass D's activity/completion language and Pass E's contextual loading/error/recovery states, using live eligible course data.
4. Extend responsive and keyboard checks through those authenticated journeys before declaring Phase 7 complete.
5. Phase 8 should prioritize real enrolled-user usability testing, hardware mobile performance, a licensed rigged character and an actual AI-provider integration only when configured. Avoid adding new unsupported features before completing the existing journeys.

These public pages are visibly more coherent, but a successful build is not a 10/10 design assessment. The screenshot previews still reflect the current geometric 3D environments; this pass does not make those environments photorealistic.
