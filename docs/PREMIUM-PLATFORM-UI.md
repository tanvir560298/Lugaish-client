# Cohesive learning platform UI — 2026-10-10

## Active implementation

Home now follows announcement → balanced hero and explicitly labeled lesson preview → Arabic/English course entries → learning steps → static campus introduction → existing interactive practice preview → closing course action. Removed unsupported learner totals, apparent real-user sample progress and the testimonial section without verified sources. No new courses, prices, enrollment statistics or completion claims were invented. The original language selection/enrollment/login handlers remain; the optional practice widget remains interactive. Home no longer imports or starts decorative WebGL.

Courses & Fees preserves the free founding launch offer, lifetime launch-access wording and existing planned 299 BDT/month Pro price. It explicitly excludes unenrolled Paid Batch access. Future Pro purchase is disabled and labeled unavailable. Removed animated mascot, urgency pressure, competing glows and giant promotion headings.

Team retains all six names, roles, biographies and credits. Introduction/cards are more compact and filters expose their pressed state. Removed destination-less social icon buttons rather than inventing accounts. Header retains role controls, logo, routes and theme/account functions, with course-first order, understated active states, mobile Escape close/focus return and route-change close. Footer adds real existing route links and preserves credits.

Existing semantic campus tokens now also drive the public shell. Added navy background, warm forest actions/ivory text, compatible Bengali/Arabic font fallbacks, reusable card/button/status styles, readable plans, form styling, focus rings, responsive grids and reduced motion. Shared legacy content surfaces receive compatible colors; My Classes/pathway gradients and repetitive decorative animation are restrained; Study Library and Classroom scene layout/logic remain isolated. Authentication retains Google flow and existing registration fields, with a static welcoming panel instead of decorative ladder animation.

## Changed files in this UI pass

- `src/pages/HomePage.jsx`, `PricingPage.jsx`, `ArchitectsPage.jsx`, `LoginPage.jsx`
- `src/components/Header.jsx`, `Footer.jsx`
- `src/styles/designTokens.css`, new `src/styles/platform.css`, `src/main.jsx`
- This report and `docs/visual-checks/platform-*` browser evidence.

No package/dependency, server authorization, saved-data schema or study-room animation/audio behavior was changed in this pass. Other pre-existing working-tree modifications are not attributed to this UI task.

## Checks

- Production build passed (existing bundle-size warning remains).
- All 50 unit tests passed, including semantic AA text/action contrast for both palettes and campus/session behavior. Palette contrast does not constitute a complete accessibility audit of every legacy widget.
- Four isolated database integration suites passed: paid access denies unenrolled/revoked students; public seating isolation; private invitations/messaging/reconnect; table-session history cleanup and generations.
- Browser DOM checks cover Home, Pricing, Team, Login and Learning Spaces at 360, 390, 768, 1280 and 1440px. Initial checks found no horizontal overflow. Mobile menu open/Escape focus return/navigation-close passed. Final checks passed for all 50 route/viewport combinations across dark and light themes with no horizontal overflow; Home has no canvas. English entry and protected My Classes redirect signed-out visitors to `/login`. Results are in `visual-checks/platform-final-checks.json`.
- Actual desktop screenshot: `visual-checks/platform-after-desktop.png`. Clean final light and mobile screenshots are `visual-checks/platform-after-light.png` and `platform-after-mobile.png`. Visual review found and corrected high-specificity legacy light-theme gradients/navigation colors before these final captures. Early fromSurface:false captures contain black compositor regions and are not full-page visual evidence. The initial before capture is incomplete, so it is not presented as a reliable before/after comparison.

## Limits and preservation

The live reference URL returned HTTP 200, but the web reader failed and the isolated browser's initial reference body was blank. Repository-rendered active routes and the user's observations informed the redesign; this report does not claim a comprehensive inspection of the deployed authenticated website.

No Google account sign-in was performed. Authenticated My Classes, staff pages, playback/materials and saved personal tools were preserved in code but not exercised through a real logged-in browser this pass. Authorization and social behavior were exercised by integration tests, not bypassed in the UI. No deployment was performed. Device layouts are browser viewport emulations, not physical mobile FPS measurements.
