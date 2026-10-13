// Temporary authenticated fixture server. Never seeds the user's Lugaish database.
import express from "../../server/node_modules/express/index.js";
import mongoose from "../../server/node_modules/mongoose/index.js";
import jwt from "../../server/node_modules/jsonwebtoken/index.js";
import { writeFile } from "node:fs/promises";
import analyticsRoutes from "../../server/src/routes/analytics.js";
import learningRoutes from "../../server/src/routes/learning.js";
import quizRoutes from "../../server/src/routes/quiz.js";
import lessonRoutes from "../../server/src/routes/lessons.js";
import courseRoutes from "../../server/src/routes/courses.js";
import authRoutes from "../../server/src/routes/auth.js";
import achievementRoutes from "../../server/src/routes/achievements.js";
import { User } from "../../server/src/models/User.js";
import { Course } from "../../server/src/models/Course.js";
import { Lesson } from "../../server/src/models/Lesson.js";
import { ReviewAttempt } from "../../server/src/models/ReviewAttempt.js";
import config from "../../server/src/config.js";
const database = `lugaish_phase16_qa_${process.pid}`;
await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`);
await ReviewAttempt.init();
const user = await User.create({
  name: "Developer Fixture Student",
  email: "phase16@fixture.invalid",
  role: "learner",
  enrolledPathways: ["english", "arabic"],
});
for (const language of process.env.QA_EMPTY_CATALOG === "1"
  ? []
  : ["english", "arabic"]) {
  const course = await Course.create({
    language,
    title: "DEVELOPER FIXTURE · " + language,
    status: "published",
  });
  await Lesson.create({
    language,
    courseGeneration: course.generation,
    day: 1,
    publicationStatus: "published",
    title:
      "DEVELOPER FIXTURE · " +
      (language === "english" ? "Welcoming a classmate" : "التحية"),
    description:
      "Isolated QA content. Not a public course or an instructor-approved curriculum.",
    quiz:
      language === "english"
        ? [
            {
              question: "You meet a new classmate. Choose a greeting.",
              options: ["Hello, nice to meet you.", "Goodbye, see you later."],
              correctAnswer: 0,
              explanation:
                "Hello welcomes someone; goodbye ends a conversation.",
            },
            {
              question: "Choose the polite way to ask for help.",
              options: ["Could you help me, please?", "Leave me alone."],
              correctAnswer: 0,
              explanation: "Could you… please? is a polite request.",
            },
          ]
        : [
            {
              question: "اختر التحية المناسبة عند اللقاء.",
              options: ["مَرْحَبًا", "وَدَاعًا"],
              correctAnswer: 0,
              explanation: "مَرْحَبًا تحية عند اللقاء.",
            },
          ],
  });
}
const app = express();
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "http://127.0.0.1:4175");
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-Lugaish-Learner-Preview",
  );
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json());
app.use("/api/learning", learningRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/achievements", achievementRoutes);
const server = app.listen(5016, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
await writeFile(
  "/tmp/lugaish-phase16-fixture-session.json",
  JSON.stringify({
    token: jwt.sign({ userId: String(user._id) }, config.JWT_SECRET, {
      expiresIn: "1h",
    }),
    email: user.email,
  }),
  { mode: 0o600 },
);
console.log("Isolated fixture API on 5016; temporary database: " + database);
async function stop() {
  await new Promise((r) => server.close(r));
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  process.exit(0);
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
