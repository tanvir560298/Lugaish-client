# Tanu AI — guided study implementation, 15 October 2026

Display branding changed from NOVYRA to Tanu AI, including UI and provider prompts. Existing API routes, environment names, collection names and component/file identifiers remain compatible. `/tanu` is the new entry; `/novyra` remains valid. No push or deployment.

## Working application flow

Chat requests such as “I have 50 mins to learn web development” offer an actionable Guided Study link carrying the time and topic. This is an explicit deterministic application tool, not a generated AI claim. The student reviews a time plan, chooses a real available lesson and approves before navigation. No auto-enrollment or synthetic video is created.

Guided setup offers existing Java self-study immediately, or current-course accessible videos via existing published catalog/day/lesson authorization helpers. It searches up to five available course days; unsupported/unpublished web development content remains unavailable. Video length is not known and is not invented. Existing per-account course selection is preserved.

Course sessions navigate to Classroom with exact day/lecture intention, resolved again against the live accessible catalog. The timer is armed explicitly; first block accrues only when the selected actual player reports playing and the page is visible. Native/YouTube existing reports are reused. Pausing/buffering, other selected videos, navigation or hidden tabs do not earn viewing time. At the first block budget the player pauses. User actions advance practice and reflection, with no automatic official completion/XP. Self-study sessions navigate to the real Java lesson and use an explicitly started reading timer.

A small original CSS robot companion gives restrained five-minute encouragement, quiet mode, pause/resume/end controls, reflection and summary. Respects reduced-motion. Coach is also present inside the Classroom personal player dialog. Timer state is isolated from scene consumers by a stable playback-report context; no new frame loop/3D asset/dependency. SessionStorage is owner-scoped and restores paused, never counts time away. It is local convenience state, not trusted server progress or cross-device sync.

## Limits and checks

This does not turn the existing offline keyword engine into general AI. Real tutoring/provider setup and atomic paid budgets remain separate blockers. Code practice and reflections are self-reported, not assessed mastery. Unknown course durations, missing web-development content and server lesson restrictions are not bypassed. A time plan is not a promise the entire video fits. The selected content is reauthorized by existing Classroom flow.

Pure tests cover all10–120 minute budgets, paused clocks, delayed tick clamping, explicit block advance, no fake mastery, malformed/cross-owner recovery and chat-intent parsing. Existing tests, lint and production build are rerun. Browser automation still fails with -10005 timeout; native-player timing, mobile framing and full authenticated playback journey are not visually certified. No screenshots fabricated. Test manually using /tanu, then a real authorized Classroom lesson when available.
