# NOVYRA AI LEARNING AGENT — FUTURE EVOLUTION ROADMAP (2.1 – 2.5)

## 1. Overview

NOVYRA 2.0 establishes the foundational intelligent learning companion architecture on Lugaish. This roadmap details planned milestones for incremental capability upgrades without disrupting established core features.

---

## 2. Milestone Evolution Breakdown

### Milestone 2.1: Real-Time Audio & Vocal Tutoring
- **Goal**: Enable hands-free conversational tutoring in English and Arabic.
- **Architecture**:
  - Client-side Web Speech API / MediaRecorder capture.
  - Streaming audio processing via Whisper or Gemini Multimodal Live API.
  - Text-to-speech vocalization with adjustable playback rates (0.75x for beginners, 1.0x for conversational).
  - Zain avatar lip-sync morph targets (`viseme` blending) synchronized to audio playback.

### Milestone 2.2: Isolated WebAssembly Code Playground
- **Goal**: Safe client-side execution of student code snippets for immediate test execution.
- **Architecture**:
  - Python: Pyodide WebAssembly runtime in a web worker.
  - C: WebAssembly compilation via Clang/Emscripten worker.
  - JavaScript: Sandboxed iframe with disabled parent access and timeout loops.
  - Zero execution on backend server, preserving complete host process isolation.

### Milestone 2.3: Spaced Repetition Memory Engine (SM-2)
- **Goal**: Optimize student long-term memory retention based on cognitive science.
- **Architecture**:
  - SuperMemo-2 (SM-2) algorithm implementation on `NovyraProfile.weakAreas`.
  - Dynamic calculation of optimal review intervals ($I_n$) and ease factors ($EF$).
  - Daily review queues surfaced in `StudyPlannerCard` as dedicated flashcard review blocks.

### Milestone 2.4: 3D Campus Group Study Table Agent
- **Goal**: Integrate Novyra directly into the 3D Study Room (`src/pages/StudyRoomPage.jsx`).
- **Architecture**:
  - Novyra bot seated as an AI tutor at shared tables in the 3D Library.
  - Students seated at the same table can invite Novyra to arbitrate technical debates or run group quizzes.
  - Spatial audio cues and synchronized avatar animations when Novyra addresses the group.

### Milestone 2.5: Specialized Arabic Dialect & Nahw Fine-Tuning
- **Goal**: Superior grammatical precision for classical Arabic and regional dialects.
- **Architecture**:
  - Domain-adapted prompt templates and fine-tuned embeddings for Arabic grammar (Nahw, Sarf, and I'rab).
  - Automatic tashkeel (diacritization) verification and explanation.
  - Quranic and classical literature vocabulary exploration modules.
