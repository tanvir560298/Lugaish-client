# NOVYRA AI LEARNING AGENT — SYSTEM ARCHITECTURE SPECIFICATION

## 1. Executive Summary

**NOVYRA** is the intelligent, personalized AI learning companion for Lugaish. It is architected as an extensible, production-quality cognitive layer directly integrated into the Lugaish ecosystem across both modern languages (English, Arabic) and computer science disciplines (C, Java, Python, JavaScript, Full-Stack Web Development, Computer Science).

Unlike trivial chatbots or mock UI dialogs, NOVYRA is backed by a server-side agent runtime, persistent student memory, authoritative platform database tools, a provider-agnostic multi-LLM engine with an offline pedagogical fallback, and client-side 3D avatar animation state synchronization.

---

## 2. High-Level System Topology

```
+-----------------------------------------------------------------------------------+
|                               LUGAISH WEB CLIENT                                  |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  |  NovyraWorkspace   |  |   NovyraPanel        |  |  Classroom / Study Room   |  |
|  |  (/novyra route)   |  |   (Slide-out Drawer) |  |  Speaking Practice        |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|            |                         |                          |                 |
|            +-------------------------+--------------------------+                 |
|                                      |                                            |
|                         [ NovyraContext (React 19) ]                              |
|                          - Profile & Memory State                                 |
|                          - Active Study Plan & Timers                             |
|                          - Avatar State Dispatcher                                |
|                          - Quota & Request Telemetry                              |
|                                      |                                            |
|                           [ novyraClient.js ]                                     |
+--------------------------------------|--------------------------------------------+
                                       | HTTPS / JSON (Bearer JWT)
+--------------------------------------v--------------------------------------------+
|                             EXPRESS BACKEND RUNTIME                               |
|                                                                                   |
|  [ authMiddleware & objectBody Validation ]                                       |
|  [ /api/novyra Routes ]                                                           |
|    - GET/PUT /profile          - POST /chat             - GET/POST/PATCH /plans   |
|    - POST /practice/generate   - POST /code/analyze     - GET /usage              |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                     SERVER-SIDE AGENT TOOLS RUNTIME                         |  |
|  |  - getStudentProfile       - getVerifiedProgress     - createStudyPlan      |  |
|  |  - updateStudyPlan         - generatePracticeQuiz    - getMistakeHistory    |  |
|  |  - recommendNextActivity                                                    |  |
|  +-----------------------------------------------------------------------------+  |
|          |                                              |                         |
|  +-------v---------------------+              +---------v----------------------+  |
|  |    MONGODB STORAGE LAYER    |              |     AI PROVIDER ABSTRACTION    |  |
|  |  - NovyraProfile            |              |  - Gemini 1.5 Flash (Primary)  |  |
|  |  - NovyraStudyPlan          |              |  - OpenAI GPT-4o-mini (Alt)    |  |
|  |  - NovyraConversation       |              |  - Pedagogical Engine Fallback |  |
|  |  - NovyraUsage              |              |  - Quota Limiter / Token Meter |  |
|  +-----------------------------+              +--------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Architectural Subsystems

### 3.1. Provider-Agnostic LLM Engine (`server/src/services/aiProvider.js`)

The AI provider layer is completely decoupled from any single proprietary SDK. It interacts with official upstream REST endpoints using Node's native `fetch` and standard `AbortController` timeouts (default: 25,000ms):
1. **Google Gemini (`gemini-1.5-flash`)**: Primary provider for cost efficiency, long context windows, and native JSON mode.
2. **OpenAI (`gpt-4o-mini`)**: Seamless alternative provider when configured via `OPENAI_API_KEY`.
3. **Resilient Pedagogical Engine**: Deterministic fallback engine executing in-memory with deep subject knowledge across all 8 disciplines (Java, C, Python, JavaScript, English, Arabic, Web Dev, CS). It guarantees that in offline testing, CI/CD pipelines, or API outages, Lugaish continues to return structured study plans, quizzes, and code guidance without breaking user experience.

### 3.2. Server-Side Authenticated Tools (`server/src/services/agentTools.js`)

NOVYRA can invoke authoritative platform tools to enrich prompts with verified learner facts rather than hallucinating:
- `getStudentProfile(userId)`: Fetches learner name, streak, total XP, target subject, and past strengths.
- `getVerifiedProgress(userId)`: Inspects real database records from `Progress`, `Quiz`, and `ReviewAttempt`.
- `createStudyPlan(userId, params)`: Synthesizes a structured daily schedule with timed blocks.
- `updateStudyPlan(userId, planId, updates)`: Updates block completion status, calculates actual study duration, and credits learner profile focus minutes.
- `generatePracticeQuiz(userId, subject, topic)`: Synthesizes multi-question active-recall assessments.
- `getMistakeHistory(userId, subject)`: Targets questions the student previously missed for focused remediation.
- `recommendNextActivity(userId, subject)`: Computes authoritative next steps (daily lesson or weak area review).

### 3.3. Student Data Isolation & Security Architecture

1. **Authorization Scoping**: All `/api/novyra/*` endpoints are protected by `authMiddleware`. Every database query strictly filters by `{ userId: req.userId }`. Learner A can never query or mutate Learner B's profiles, conversation logs, or study plans.
2. **Untrusted Code Security**: In Milestone 4 (Code Mentorship), student code snippets are analyzed via static lexical reasoning and LLM explanation. The backend server **never** executes untrusted user code in its Node process, completely preventing remote code execution (RCE) vulnerabilities.
3. **Sanitization & Quotas**: Daily token quotas (`150,000 tokens/day`) and request counts (`200 requests/day`) are tracked in `NovyraUsage` by `(userId, YYYY-MM-DD)` compound index, preventing denial-of-wallet and quota exhaustion attacks.

### 3.4. 3D Avatar Synchronization

Zain (`public/models/student/student.glb`) remains the authoritative 3D student avatar on the Lugaish campus. NOVYRA acts as the intelligent companion. The avatar animation state synchronizes smoothly across 5 cognitive states:
- `idle`: Baseline breathing and neutral attention pose.
- `listening`: Triggered when student is formulating an inquiry or microphone is active.
- `thinking`: Pulsing indicator triggered while server-side inference or tool execution occurs.
- `responding`: Active explanation delivery with animated badges.
- `encouraging`: Triggered on quiz streaks, block completions, or milestone breakthroughs.

---

## 4. Extensibility & Multi-Discipline Matrix

| Discipline | Target Track | Core Pedagogical Concepts Covered |
|---|---|---|
| **English** | Language | Verb tenses, phrasal verbs, active vocabulary, formal writing, fluency |
| **Arabic** | Language | Fusha grammar (Nahw & Sarf), diacritics, sentence parsing, vocalization |
| **Java** | Programming | OOP, loop control, collections framework, exception hierarchies, generics |
| **C Language** | Programming | Memory pointers, dynamic allocation (`malloc`/`free`), structs, stack/heap |
| **Python** | Programming | List comprehensions, mutable defaults, OOP, decorators, generators |
| **JavaScript** | Programming | ES6+, async/await, closures, event loop, prototype chain, DOM API |
| **Web Dev** | Full-Stack | Semantic HTML, CSS flex/grid, React component state, REST endpoints |
| **Computer Science** | Academic | Tree data structures, Big-O complexity, OS processes, relational schemas |
