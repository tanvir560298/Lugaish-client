# Phase 6 — Speaking practice

Implemented in the existing authenticated Speaking Practice page. Its existing enrollment, scheduled question loading, instructor controls and completion API remain in place. The developer-only `/speaking-preview` renders the same new recording component with existing local English/Arabic prompts; it cannot submit course completion.

## Visible changes

- A calm, responsive speaking studio with Guided Conversation, Listen & Repeat and an explicitly unavailable Free Conversation panel.
- User-initiated recording, real microphone input level, elapsed duration, stop, playback, pause and delete. Reference playback preserves the current recording for comparison.
- Instructor reference audio where supplied, otherwise browser speech synthesis with clear playback errors. Arabic prompts use RTL presentation.
- Local session summaries count actual recordings, distinct phrases and duration. These are activity counts, not proficiency or pronunciation scores.
- Existing scripted partner replies are identified as scripted. Guided reviews use supplied transcript keyword marks; browser recognition confidence no longer creates fluency/proficiency claims.
- A course goal advances only after a fresh successful completion response from the existing server. Failed or already-completed responses do not advance it. Stale responses after account/day/language changes are ignored.

## Privacy and lifecycle

One recording is held in memory, capped at 60 seconds and 8 MB. Lugaish does not upload or persist the recording. Retry, phrase/mode changes, hiding the page and leaving the component discard it, release microphone tracks and revoke object URLs. Playback and reference audio are mutually coordinated. Native recording is independent of existing browser speech recognition; that existing transcription service may use the browser provider's online service.

No microphone permission is requested on load. Permission denial, unsupported recording and playback restrictions produce actionable visible errors. Late permission responses after cancellation have their tracks stopped. Reduced motion disables the decorative breathing animation.

## Files

- `src/speaking/recording.js`: native recording and playback controller, level sampling and cleanup.
- `src/speaking/SpeakingStudio.jsx`, `src/speaking/speaking.css`: shared responsive UI and reference audio.
- `src/speaking/progress.js`: confirmed completion helper.
- `src/pages/SpeakingPracticePage.jsx`: existing lesson integration and honest feedback.
- `src/pages/SpeakingPreviewPage.jsx`, `src/App.jsx`: development-only visual test route.
- `tests/voiceRecording.test.mjs`: recording lifecycle and completion tests.

No new dependency, third-party audio asset, model or backend contract was introduced. Browser recording follows the native [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder).

## Checks

- Production build passed. Existing large-chunk warning remains.
- 97 automated tests passed, including recording cancellation, failure, cleanup and fresh completion handling.
- Two real HTTP/MongoDB integration tests passed for quiz progress and paid enrollment access, using isolated test data.
- Chrome at 1440×900, 768×900 and 390×844: verified no permission request on load, recording, nonzero real input meter, track release, reference/recording comparison, playback/pause, delete, mode-change cleanup and no horizontal overflow. Arabic mobile prompt also verified.
- Browser tests used Chrome's synthetic microphone, not the user's physical microphone. Results: [voice check JSON](visual-checks/phase6-voice.json).
- A separate client-side route departure check confirmed component unmount and microphone track release without a full page reload.

## Screenshots

These are real renders of the developer preview, not an authenticated learner session:

- [Desktop guided studio](visual-checks/phase6-guided-1440.png)
- [Desktop recording](visual-checks/phase6-recording-1440.png)
- [Desktop playback ready](visual-checks/phase6-playback-ready-1440.png)
- [Tablet studio](visual-checks/phase6-guided-768.png)
- [Mobile studio](visual-checks/phase6-guided-390.png)
- [Mobile playback controls](visual-checks/phase6-playback-ready-390.png)
- [Arabic mobile](visual-checks/phase6-arabic-390.png)

## Remaining limitations

No real conversational AI backend/provider exists in the inspected project, so Free Conversation is not enabled. No pronunciation scoring service was added. Physical microphone quality, audible speaker output, live browser transcription and Safari/iOS device behavior require device testing. A real enrolled learner session was unavailable for browser verification; authenticated lesson integration was checked in code and existing access integration tests. Native reference speech depends on available browser voices. There is no new pre-change screenshot of the authenticated speaking route; the screenshots above document the implemented component without implying a before/after account test.
