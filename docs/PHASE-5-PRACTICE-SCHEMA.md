# Practice content contract

`src/learning/practice/engine.js` validates and evaluates supplied content. `ExerciseInput.jsx` renders native accessible inputs; `PracticeSession.jsx` handles introduction, checks, retry, review, bounded browser drafts and submission status. No HTML from content is injected.

Common fields: stable string `id`, `type`, nonempty string `prompt`, optional existing approved `explanation`. A question set belongs to a specific lesson/language and must be approved before production publication. A matching title alone is not a lesson relationship.

| Type | Required content | Answer representation | Interaction |
|---|---|---|---|
| `choice` | `options: string[]` (at least two), integer `answer` indexing options | integer option index | Native radio group; keyboard and touch |
| `blank` | `acceptedAnswers: string[]`; optional `caseSensitive` | string | Labeled text input, language and direction |
| `matching` | `pairs: {left:string,right:string}[]` | Array mapping each left index to a distinct right index | Labeled native select for every pair; choose every match once |
| `ordering` | `tokens: string[]`, `order: number[]` containing each index once | Ordered token indices | Buttons to append/remove words; repeated text stays distinct through indices |

English blanks normalize NFC, trim/collapse whitespace and lowercase unless `caseSensitive`. Arabic blanks normalize NFC and whitespace only: hamza, ta marbuta, ya/alif maqsura and diacritics remain significant. Supply all instructor-approved alternatives explicitly. Ordering compares exact supplied token indices; the engine does not invent alternative sentences or punctuation rules. Matching requires one-to-one selection. A question set containing malformed MCQ content is rejected as a whole, rather than silently shrinking a server quiz.

Production currently adapts **only existing bundled MCQs** from `src/data/courseData.js`; no new questions or translations were generated. `fromLessonQuiz` maps `question/options/answer/explanation` (or `correctAnswer`) into the common schema. `matchingLessonContent` refuses a differing live question/option set rather than checking it against unrelated bundled keys. Empty remote quiz content can use the existing published bundled curriculum after server access is verified.

`fixture.js` is explicitly technical QA content, not curriculum. `/practice-preview` is registered only under `import.meta.env.DEV`; it never submits completion, XP or goals. Additional types work in that isolated fixture. `/practice-preview?course=english&day=2` and its Arabic equivalent display actual existing bundled questions as read-only curriculum previews. They are not enrollment bypasses for production routes.

To publish blank/matching/ordering activities, provide instructor-approved lesson-linked content and add a reviewed server scoring/result contract for their answer representations. The existing `/quiz/submit` accepts integer MCQ options and must not receive the other types. No unsupported activities are presented as production learning content.

Draft key: `lugaish-practice-draft-v1:[staff:]email:language:day`; JSON contains content fingerprint, current index and checked responses. Fingerprint changes invalidate old drafts. Storage failures show an explicit visit-only notice. Unsubmitted typed inputs are not claimed to be saved. Drafts never unlock a course.

Server receipts are fetched from owner-scoped `GET /quiz/result/:language/:day`, not restored as trusted facts from browser storage. Successful `POST /quiz/submit` supplies the actual saved result. `saveConfirmedQuiz` records course state only after a complete result shape; rejection, offline failure or malformed results leave a draft and retry action. A transport interruption after server save can be resolved by reopening the page and reading the saved receipt. No fabricated success fallback or client-derived reward is permitted.
