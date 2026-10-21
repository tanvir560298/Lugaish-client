# Student journey browser checks

These scripts use Node 24's WebSocket API to drive an **isolated** Chrome profile through CDP. They do not inject an authenticated frontend session. Developer preview routes are local fixtures, not production course completion. Backend integration tests create valid isolated accounts in their own test databases.

Start the existing Vite app at `http://127.0.0.1:4174`, plus the existing API for backend checks. Launch a separate Chrome process (adjust executable for your OS):

```sh
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --headless --no-sandbox --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --use-fake-device-for-media-stream --use-fake-ui-for-media-stream --remote-debugging-port=9229 --user-data-dir=/tmp/lugaish-phase9 --no-first-run http://127.0.0.1:4174/
```

Run sequentially; all scripts operate on the same isolated tab:

```sh
node scripts/qa/studentJourney.mjs
node scripts/qa/practiceJourney.mjs
node scripts/qa/voiceJourney.mjs
node scripts/qa/recoveryJourney.mjs
node scripts/qa/classroomJourney.mjs
```

`CDP_PORT` defaults to 9229. Student/recovery/classroom support `QA_BASE_URL`; practice/voice use the default local app URL. Screenshots and JSON results are written under `docs/visual-checks/phase9-*`. Synthetic microphone checks exercise recording/playback controls, not microphone hardware or speech service accuracy. Recovery checks intentionally inject microphone, audio fetch, storage and WebGL failures. Unsaved test-note downloads go into a dedicated temporary directory. Use this profile only for QA; do not run against personal notes.

Production build and ordinary regression tests:

```sh
npm run build
node --test tests/*.test.mjs src/classroom/*.test.js src/data/*.test.js src/utils/*.test.js server/src/services/*.test.js server/src/data/*.test.js
```

With configured local MongoDB/API, isolated integration checks:

```sh
RUN_QUIZ_INTEGRATION=1 RUN_PAID_ACCESS_TEST=1 RUN_STUDY_INTEGRATION=1 RUN_PUBLIC_STUDY_TEST=1 RUN_TABLE_SESSION_TEST=1 node --test server/src/routes/quiz.integration.test.js server/src/routes/paidBatchAccess.integration.test.js server/study/social.integration.test.js server/study/public.integration.test.js server/study/tableSession.integration.test.js
```

Stop only the Chrome process you started. Provider authentication, enrolled frontend lessons, physical microphone, external media and human participant sessions are separate launch checks; these scripts do not substitute for them.

Theme and text contrast checks (use the same isolated Chrome profile):

```sh
node scripts/qa/themeContrastJourney.mjs
```

This checks 17 public routes in both themes, Tanu workspace tabs and drawer,
mobile navigation, input placeholders, opposite operating-system colour preferences,
and saved theme restoration. Ordinary text needs 4.5:1 and large text 3:1 against
composited CSS background colours. Disabled controls, decorative text and canvas
content are excluded. Gradient/image backgrounds and authenticated course screens
still require visual review. Results go to `docs/visual-checks/theme-contrast.json`;
PNG screenshots stay local.
