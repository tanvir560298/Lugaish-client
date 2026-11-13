# HTML Fundamentals Module 1

## Entry points
- `/learn/web-development/html/module-1`: reading roadmap and browser-local progress.
- `/learn/web-development/html/module-1/lessons/1-0` through `1-10`: 11 original Bengali lessons.
- `/learn/web-development/html/module-1/practice`: 24 topic/difficulty/status-filtered problems.
- `/learn/web-development/html/module-1/practice/01` through `24`: editors and checks.
- `/learn/web-development/html/module-1/assessment`: 15-question review.
- `/learn/web-development/html/module-1/project`: final project.
- Existing `/learn/web-development/html` and seven video URLs are retained, with a new reading-module entry.
- Homepage/catalog Web Development card enters the new reading module.

## Content authoring
`src/learn/html-module/lessons.js`: ordered lesson array. Each item has a unique id, English title, Bengali subtitle/objectives/introduction/sections, syntax, code, breakdown, output description, mistakes with fixes, revision, questions and task. Add new topics here; keep prose original. Use valid HTML and metadata when an example is a full document. The sample image is an embedded SVG, not a real student photo.

`problems.js`: add/edit problem metadata, Bengali statement, expected rendered output, starter, hidden hints, model solution and explanation. `rules` drive both the visible checklist and checking. Supported rule kinds are implemented in `engine.js`: count/text/attribute/directItems/labelled/requiredTypes/select/image/link/resourceList/imageGroups/nested/document. Rules accept valid whitespace and attribute order variations. New rule kinds require positive and negative tests. Keep problem IDs stable so saved progress remains meaningful.

`quiz.js`: original questions with kind, choices, zero-based answer and explanatory feedback. All questions must be answered before submission; explanations appear after submission. Quiz milestone requires 12/15, clearly stated as an app learning threshold, not an LPC policy or certificate.

`HtmlModulePage.jsx` and `module.css`: reusable scoped reading layout, responsive sidebar, editor, list explorer, practice and assessment screens. Uses existing theme variables and app context. No changes to C/Java course logic.

## Progress and drafts
Matches the pre-existing HTML course's browser-local persistence model. Key prefix `lugaish_html_module1_v1:<guest-or-user-email>` keeps guest and signed-in scopes separate. No backend persistence or cross-device sync is claimed. Switching account remounts the module. Guests are shared within the same browser profile; do not treat this as secure student records.

Tracks completed lessons, attempted problems, solved problems (including final project), last visited lesson and quiz milestone. 37 milestones = 11 lessons + 24 problems + final project + quiz. Completed lessons are self-reported. Failed later practice attempts do not erase earlier solved milestones. Solution viewing is available explicitly, but does not grant completion. It is not an exam/anti-cheat system.

Editor drafts persist with a 350ms debounce and a visible saving/saved/error state. Reload after “saved” to verify persistence. Reset requires confirmation when edits differ from starter. A storage failure never reports a successful save. Progress persists independently of drafts.

## Preview safety and limits
User HTML is never inserted into the application DOM. Browser DOMParser parses it; an isolated iframe has `sandbox=""` (no scripts, same-origin access, popups, navigation privileges or submissions) and a trusted first CSP. Sanitization strips executable/embedded elements, event handlers, navigation destinations and network-bearing extras. CSP blocks network and forms; images only allow embedded data images. External/local file-path images are checked structurally but not fetched in preview. Real path/loading tests must be done in a local HTML file. Students are told these limits beside every preview.

This is an educational preview and structural checker, not a full HTML conformance validator or plagiarism detector. Scripts/CSS/tables/embedded pages are outside this module's assessed scope. Checks do not grade originality, prose quality, truthful claims or actual image availability. The final project includes a manual review checklist.

## Verification
- `node --test src/learn/html-module/module.test.js`: curriculum, all 25 authored solutions, incomplete starters, source-format variants, labels, direct vs nested list counts, safe links, preview sanitization, full-document authorship and progress accounting.
- `npm test`: existing project suite including new tests.
- `npm run lint`: repository's JavaScript/JSX syntax checker (not semantic ESLint).
- `npm run build`: Vite production build.
- Browser QA: lesson navigation/completion reload; wrong and correct practice responses; draft reload; desktop/mobile and both themes.

No new credential, migration or backend service is required. jsdom is a dev-only test dependency to exercise checks with a real HTML document parser. Browser runtime uses native DOMParser.
