# Lugaish — Current Product State and Planning Brief

Prepared 15 October 2026 for consultation with ChatGPT. Based on current local source and the latest available verification reports; this is not a fresh production acceptance test.

## 1. What the product is

Lugaish is an Arabic and English learning platform with a digital university campus. It combines course lessons, speaking practice, personal study tools, social study spaces and student progress tracking. A new system named NOVYRA is being developed as a learning assistant. Zain is the student avatar; NOVYRA is the assistant, not a replacement avatar.

Technical stack: React 19/Vite frontend, Express/Node backend, MongoDB/Mongoose, Firebase/Google authentication integration, Three.js/React Three Fiber for campus environments. Existing hosting is Vercel and Render. This is an existing application to improve incrementally, not a website to rebuild.

## 2. Features present in the codebase

| Area | Existing capability |
| --- | --- |
| Accounts | Sign-in integration, account profiles, authenticated routes, staff roles and enrollment/access checks. |
| Course learning | Arabic/English pathways, published lessons, lesson videos/materials, quizzes and scheduled course access. Paid Batch access is restricted to authorized students. |
| Administration | Course and lesson management/publication, student/role administration and payment-related workflows. This is not yet a general-purpose LMS for arbitrary independently priced courses and batches. |
| Campus | Learning Spaces entrance, 3D Classroom and shared Study Library, camera modes and mobile fallback. |
| Classroom | Lesson board/video flow, student controls, seating and selected avatar integration. |
| Study Library | Four zones, twenty five-person tables, seating, personal desk view, timer, notes, goals, materials and rain ambience controls. Capacity layout is not evidence of tested performance at 100 simultaneous users. |
| Social study | Private/shared room infrastructure, group/table chat rules, invitations/friend-related flows and notifications. Do not assume unrestricted global chat is intended. |
| Avatars | Saved selection/customization, real CC0 Quaternius Zain model, native locomotion clips and authored study-pose integration, with procedural fallback. Current visual quality and transitions still need real-device review. |
| Speaking | Independent recording/replay plus course-configured speaking activities. Do not describe this as verified live AI voice conversation or reliable pronunciation scoring. |
| Progress | Learning analytics, goals, streak/XP-related records, mistake review and achievement/certificate routes. Historical learning records are retained. |
| General UI | Shared navigation, account menu, light/dark theme, responsive layouts and privacy/terms/support pages. |

Presence in code does not mean every journey has been verified in the currently deployed build.

## 3. Course catalog and release state

Phase 20 reset intends old courses to be absent from the active catalog while preserving historical lessons and student progress. Staff must explicitly publish new course content; archived courses must not be republished accidentally. The last release report stated that the frontend was deployed, but the backend deployment remained unresolved at that time. Current hosted versions/catalog contents were not rechecked for this brief.

The current local frontend is `f4aa42e`, backend `482752b`, on `feature/novyra-ai-agent`. These include corrections following NOVYRA review. Local commits do not prove GitHub publication or production deployment.

## 4. NOVYRA: implemented foundation versus actual intelligence

Implemented: dedicated `/novyra` workspace, onboarding/preferences and memory, structured study plans, block timers, tutor chat UI, programming-help UI, practice quiz UI, floating panel, assistant-state badge, authenticated APIs and persistence models. The backend contains provider adapters using native fetch; no additional production npm dependencies were introduced for them.

Important limitations:

- Without an enabled online provider it uses keyword-selected offline templates. These are not genuine personalized AI answers, arbitrary-code diagnosis or verified adaptive assessment.
- Real online provider responses, model availability and credentials were not tested in the latest review.
- Quota checks still require atomic reservation and actual monetary budget enforcement before paid production use. Configuration gates alone are insufficient.
- Study completion is self-reported; declared block durations are not verified elapsed study time.
- Mistake counts/recommendations need stronger integration with unresolved mistakes, current catalog generation and authorized course access.
- Chat schema mismatch, account-state reset, bounded history, basic input boundaries, plan time arithmetic and repeated session counting received targeted fixes.

Last focused verification: 217 unit tests passed, targeted NOVYRA MongoDB/API integration passed, syntax lint passed and production build passed. Those results do not establish browser/mobile accessibility, end-to-end Google authentication or real-provider correctness.

## 5. Features not yet integrated in the active app

A complete university academic profile, configurable GPA/CGPA calculator, target-GPA prediction, exam calendar and assignment/deadline tracker are not present as active routes in this version. Separate unfinished Day 1 work exists outside this active branch and must not be advertised as shipped.

Also not established: PDF/syllabus understanding, flashcards with spaced repetition, a verified adaptive assessment engine, a secure executable coding sandbox or a fully operational voice AI tutor.

## 6. What to prioritize next

1. Reliability: close NOVYRA budget/concurrency blockers, verify one real provider, fix misleading learning metrics and test authenticated end-to-end journeys.
2. Connected academic essentials: profile, deterministic custom GPA/CGPA, exam calendar and assignment deadlines feeding one useful dashboard. Never invent official university grading policies.
3. A clear daily journey: show the next real task, its reason and expected time; preserve distinct paths for language courses and personal academic work.
4. Real learning intelligence: syllabus-based plans, source-backed explanations, flashcards, spaced review and validated practice. Keep AI practice separate from official course grades and XP.
5. Quality: ordinary-page lazy loading, low-end mobile performance, accessible dialogs/navigation, error recovery and measured study-session persistence.

Avoid another broad visual redesign before the main student journeys and learning value are reliable. Preserve campus, avatar, historical records, course permissions and private group boundaries.

## 7. Request for ChatGPT

Using this brief, propose a practical improvement roadmap for the existing Lugaish application. Identify its strongest student use case and simplify navigation around that use case. Separate implemented features, features needing verification, and genuinely new work. Rank proposals by student value, engineering effort, operating cost and dependency. Recommend the next three small releases with explicit acceptance criteria. Explain what to postpone. Do not treat the offline NOVYRA templates as a completed AI system, propose a replacement application, invent university policies or assume production deployment/testing has occurred.
