# Phase 12 verified issue register

No human observations yet. These findings come from rendered local UI and code inspection.

| ID | Page / reproduction | Expected / actual / impact | Severity | Fix / status | Regression |
|---|---|---|---|---|---|
| B12-01 | Speaking preview / personal reading: inspect phrase selector and reference controls; inspect Learning Spaces speaking description | Personal reading should instruct students to read their own notes. It offered a single “supplied phrase” whose reference was only an instruction, promised comparison, and pointed to My Classes to change language despite the local language selector. Misleads students about available teaching content. | P2 | Fixed: personal-specific instructions; hide course-only phrase/reference/change-language controls; truthful campus description and recording deletion notice. Guided course references remain unchanged. | personalSpeakingUx.mjs: instructions, absent misleading controls, labelled language selector, Arabic change and retained focus at three widths; independentVoiceJourney.mjs records/plays/deletes. |
| B12-02 | Dark theme / Speaking preview: inspect cream studio paragraphs | Instructions/status should be readable. Global `.platform-page p` overrides studio text with light dark-theme text on a cream surface. Screenshot shows near-invisible eyebrow/instruction text. | P2 | Fixed: scoped studio paragraph, eyebrow, privacy and error colors with stronger specificity. | personalSpeakingUx.mjs checks rendered paragraph contrast ≥4.5:1. Not a whole-site accessibility certification. |

No new P0 or P1 defect was reproduced in this iteration. This does not establish absence of undiscovered defects. Hosted Google sign-in, authorized media, monitoring and human/device testing remain verification gaps and release blockers in the report, not fabricated beta bugs.
