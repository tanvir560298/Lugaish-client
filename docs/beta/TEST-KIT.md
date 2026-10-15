# Lugaish closed beta — participant and facilitator kit

**Prepared, not conducted.** No recruited participants or student feedback exist in this repository. Target: 5–10 consenting students, including less confident technology users; roughly half mobile and half desktop, with Arabic and English learners. Do not send invitations or publish until the owner provides protected staging and authorizes recruitment.

## Before inviting anyone

Owner: provide a protected staging URL, isolated database, real configured Google sign-in, validated private sample course, permitted lecture media, and a support contact with confirmed coverage. Keep removed courses archived. Use only staging accounts and synthetic teaching content. Verify enrolled, unenrolled and revoked accounts. Never grant staff access to participants or publish fixtures to the real catalog. Local previews are developer inspection only, not a replacement for authenticated shared-room tests.

Use an anonymous participant code (B01–B10), not name/email in research records. Google login still requires the participant's own approved account; do not share passwords, tokens or production identities. Do not record a session or upload notes/voice without separate informed consent. Participants may stop or skip any task. Explain that errors are about the product, not their ability.

## Participant introduction

“Lugaish is an Arabic and English learning campus. My Classes contains published courses available to your account. Classroom presents available lessons. Study Library offers personal study tools and permission-controlled shared tables. Speaking Practice can record and replay your voice locally; it does not currently offer genuine AI assessment. We are testing whether these activities are understandable and usable. Please say what you expect before clicking. You can stop whenever you want.”

Current real catalog is empty. On the real local app, the expected outcome is an honest empty state. Lesson and enrollment tasks require the isolated staging fixture below; do not pretend missing teaching content is available.

## Tasks (avoid coaching until the student requests help)

| ID | Scenario and completion evidence | Availability |
|---|---|---|
| T01 | From Home, explain the languages offered and find courses/fees. Identify how to begin. | Local/public UI |
| T02 | Sign in, open My Classes, identify the next available action. Empty catalog should explain absence of lessons. | Real provider flow pending |
| T03 | On an enrolled staging account, find the private test lesson, play permitted media, change cameras, finish supported activity and return to My Classes. | Protected staging fixture required |
| T04 | On an unenrolled account, try that course URL. Expect an access explanation without protected content. | Protected staging fixture required |
| T05 | Open Library, find a free seat, confirm assignment, use My Desk. Identify zone/table without help. | Real authenticated backend assignment required |
| T06 | Write a non-sensitive Arabic/Bengali/English note, start timer, switch Library/My Desk, leave and return. Verify text and running timer remain. | Local preview tools / authenticated staging |
| T07 | Enable rain, reduce volume, pause/resume, open tools, leave. Expect no automatic start or duplicate audio. | User-enabled audio; physical listening required |
| T08 | Join your approved private group, send a harmless table message. Another group/account must not see it. Do not message unrelated students. | Separate authorized staging accounts required |
| T09 | Record a short personal reading in Arabic or English; stop, play, delete and leave. Explain the microphone status and limitations. | Physical microphone/browser support required |
| T10 | Temporarily disconnect network, reconnect; explain loading/error state and recover. Save work first. Recheck seat and note ownership. | Staging; facilitator-assisted |
| T11 | Use keyboard only to reach primary links, select a seat and close tools/dialogs; repeat with text zoom and mobile. | Emulation plus real device/accessibility testing |

Each task: record start/end times only when actually measured, completion (success/failure/skipped/blocked), assistance (none/prompt/direct help), number and description of confusing interactions, difficulty 1–5, optional exact comment and device/browser. Mark “not observed” instead of estimating. Stop if a privacy or data-loss issue appears; capture redacted reproduction steps and escalate P0 immediately.

## Isolated course fixture checklist

Use the existing integration suites first. For a human beta, owner-managed private staging must contain a fresh course generation, one reviewed English and one reviewed Arabic lesson, authorized playable media, reviewed MCQ answers/explanation where supported, and deliberate enrolled/unenrolled/revoked identities. Confirm draft and archived versions cannot be reached by students. Verify progress saves only against that generation. Other exercise types are engine-tested, not assumed publishable. Delete only disposable fixtures through the approved staging procedure; never reset the real catalog.

## Feedback questionnaire (5 minutes)

1. Was it easy to understand what Lugaish offers? (1–5; why?)
2. Could you find your next learning action? (yes / with help / no)
3. Did Classroom help you learn? (1–5 / not tried; why?)
4. Was Library comfortable to study in? (1–5 / not tried)
5. What confused or frustrated you? (optional text)
6. Would you want to return? (yes / maybe / no; why?)
7. What should be improved first? (optional text)
8. Were controls/text usable on your device? (yes / partly / no)

Do not ask for school, phone, address, date of birth, account email or sensitive notes. Participants should omit other people's details. Restrict collected records to the facilitator and owner, agree a deletion date before collection, and publish only anonymous aggregate findings. Storage/retention is an owner decision still pending; no feedback upload endpoint has been added.

## Reporting and release decision

Use observations.csv for raw observations, ISSUE-TEMPLATE.md for reproducible defects and RESULTS-TEMPLATE.md for the actual beta summary. Separate participant opinion, direct observation and automated checks. Small sample percentages do not represent all learners. Repeat blocked tasks once infrastructure is available. Public launch remains NO-GO until release-blocking issues and provider/media/device checks are resolved. Beta preparation is not beta completion.
