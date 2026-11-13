# Revised HTML learning flow

Owner revision: teach a little at a time, starting with motivation, then headings and paragraphs. Show a target output as a picture; learners reproduce it with HTML. Hints and solution code are optional and hidden initially. No VS Code setup or large textbook/quiz release in the current student flow.

## Published
`/learn/web-development/html/module-1` and `/steps/motivation`, `/steps/heading`, `/steps/paragraph`, `/steps/practice`.
`FirstStepsPage.jsx` is the route's active component. The earlier comprehensive module source is retained for future reference but is not mounted or linked from this journey. Its earlier release documentation describes that archived implementation, not the active student experience.

- `firstSteps.js`: short original Bengali content, the single picture-based task, hint/solution and future-topic roadmap.
- `public/images/html-first-page-target.svg`: deterministic output picture (not a stock illustration). Keep its words consistent with `firstPractice.solution` and validation rules.
- `firstSteps.css`: compact reading and editor layout, existing theme tokens.
- Progress/drafts: browser-local, scoped by current account or guest; separate key from the previous comprehensive module so old completion does not complete new steps. Completed learning steps are self-reported; practice completion requires passing checks.
- Preview uses the existing restricted sandbox/CSP helper. No user HTML is injected into the app DOM. Answer checks validate heading/paragraph text rather than exact source formatting; this is not pixel grading.
- Existing seven video class URLs remain available separately.

## Extend later
Add the next small topic only after owner review. Do not re-enable the previous 11-lesson/24-problem roadmap wholesale. Each new practice should have its own expected-output image, concise task, optional hints, hidden help code and appropriate structural checks.

Verify with `npm test`, `npm run lint`, `npm run build` and desktop/mobile browser checks.
