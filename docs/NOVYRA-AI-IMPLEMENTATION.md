# NOVYRA AI LEARNING AGENT — FULL-STACK IMPLEMENTATION GUIDE

## 1. Overview & Codebase Integration

NOVYRA is fully implemented and integrated across the Lugaish repository on branch `feature/novyra-ai-agent`. It introduces zero new external npm dependencies, using Node native `fetch` for upstream AI provider communication, and integrates seamlessly into the existing Express + Mongoose + React 19 + Vite architecture.

---

## 2. Server-Side Artifacts

### 2.1. Database Schemas (`server/src/models/`)

- `NovyraProfile.js`:
  - `userId` (ObjectId, unique index)
  - `targetSubject` (enum: english, arabic, c, java, python, javascript, web_dev, computer_science)
  - `experienceLevel` (enum: beginner, intermediate, advanced)
  - `primaryGoal` (enum: general_mastery, exam_preparation, interview_prep, skill_transition)
  - `dailyTimeMinutes` (Number, default: 60)
  - `explanationLanguage` (enum: english, arabic, bilingual)
  - `weakAreas` (Array of Strings)
  - `masteredTopics` (Array of Strings)
  - `totalStudyMinutes`, `completedSessionsCount`

- `NovyraStudyPlan.js`:
  - `userId` (ObjectId, indexed)
  - `subject`, `topic`, `title`
  - `targetDurationMinutes`, `actualDurationMinutes`
  - `status` (enum: active, paused, completed, abandoned)
  - `blocks`: Array of `{ id, title, type, durationMinutes, objectives, instructions, materials, completed, completedAt, studentNotes }`
  - `currentBlockIndex` (Number)

- `NovyraConversation.js`:
  - `userId`, `sessionId` (compound index)
  - `contextType`, `subject`
  - `messages`: Array of `{ id, sender, content, toolCalls, avatarState, timestamp, tokenCount }`

- `NovyraUsage.js`:
  - `userId`, `date` (YYYY-MM-DD, compound unique index)
  - `promptTokens`, `completionTokens`, `totalTokens`, `requestCount`, `costEstimatedCents`

### 2.2. Core Services (`server/src/services/`)

- `aiProvider.js`: Multi-provider abstraction (Gemini, OpenAI, In-Memory Pedagogical Engine), daily quota validation, and token accounting.
- `agentTools.js`: Server-side authenticated tool functions (`getStudentProfile`, `getVerifiedProgress`, `createStudyPlan`, `updateStudyPlan`, `generatePracticeQuiz`, `getMistakeHistory`, `recommendNextActivity`).

### 2.3. Endpoints Catalog (`server/src/routes/novyra.js`)

All endpoints are mounted at `/api/novyra` and require standard `Bearer <JWT>` authentication:

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/novyra/profile` | Retrieve student's Novyra profile & verified platform metrics |
| `PUT` | `/api/novyra/profile` | Update learner preferences, target subject, goals, and weak areas |
| `POST` | `/api/novyra/chat` | Send message to AI tutor with automatic tool calling and avatar state |
| `GET` | `/api/novyra/chat/history` | Retrieve conversation messages for a session |
| `GET` | `/api/novyra/plans/active` | Fetch student's currently active study plan |
| `GET` | `/api/novyra/plans` | Fetch historical study plans (paginated, latest 20) |
| `POST` | `/api/novyra/plans` | Create a new structured daily study plan with timed blocks |
| `PATCH` | `/api/novyra/plans/:id` | Mark block completed, update notes, or adjust plan status |
| `POST` | `/api/novyra/practice/generate`| Generate a 3-question adaptive practice quiz with explanations |
| `POST` | `/api/novyra/code/analyze` | Guided programming code analysis and debugging hints |
| `GET` | `/api/novyra/usage` | Fetch student's daily token and request quota metrics |

---

## 3. Frontend Architecture (`src/novyra/`)

- `novyraClient.js`: API client wrapping standard `request` utility with retry and timeout policies.
- `NovyraContext.jsx`: Global React context providing reactive state, session management, block timers, and avatar state transitions.
- `NovyraAvatarBadge.jsx`: Micro-animated status badge (`idle`, `listening`, `thinking`, `responding`, `encouraging`).
- `NovyraOnboardingModal.jsx`: Conversational 3-step setup modal for onboarding new students.
- `StudyPlannerCard.jsx`: Interactive daily study schedule with block timers, countdown displays, and completion tracking.
- `CodeMentorView.jsx`: Guided code editor with presets for Java, C, Python, JavaScript, and diagnostic guidance.
- `PracticeQuizCard.jsx`: Interactive adaptive practice quiz cards with instant answers and explanations.
- `StudentMemoryCard.jsx`: Profile inspector to manage weak areas, goals, and daily study budget.
- `NovyraChatView.jsx`: Message stream with suggested prompt chips and tool call execution badges.
- `NovyraWorkspace.jsx`: Dedicated full-page learning workspace at `/novyra`.
- `NovyraPanel.jsx`: Slide-out contextual companion drawer accessible from any page.

---

## 4. Configuration Environment Variables

Add the following to `server/.env` (or Render environment settings):

```bash
# AI Provider Configuration ('gemini', 'openai', or 'auto')
NOVYRA_AI_PROVIDER=auto

# Upstream API Keys (Optional: pedagogical engine acts as seamless fallback if unset)
GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...

# Model Selection
NOVYRA_MODEL_NAME=gemini-1.5-flash

# Quota Limits
NOVYRA_DAILY_TOKEN_LIMIT=150000
NOVYRA_DAILY_REQUEST_LIMIT=200
```
