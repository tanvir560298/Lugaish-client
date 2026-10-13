import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyDailyPlan,
  normalizeDailyPlan,
  dailyCards,
  dailyCardState,
  dailyDestination,
} from "./dailyPlan.js";

const module = (day, overrides = {}) => ({
  day,
  title: `Reviewed class ${day}`,
  description: `Published description ${day}`,
  moduleType: "video",
  configured: true,
  published: true,
  publicationStatus: "published",
  available: true,
  videoCount: 1,
  questionCount: 0,
  ...overrides,
});
const plan = (modules, overrides = {}, language = "paid_batch") =>
  normalizeDailyPlan(
    {
      modules,
      completedDays: [],
      currentDay: 1,
      courseDay: 12,
      courseSchedule: { courseStarted: true },
      ...overrides,
    },
    language,
    "authenticated-owner:current-plan",
  );
const options = { language: "paid_batch", loaded: true, privateAccess: true };

test("new private Day 1 and Day 2 show published content and routes without historical curriculum overrides", () => {
  const current = plan([
    module(1, {
      title: "Library research workshop",
      description: "Learn to evaluate sources.",
      moduleType: "interview",
      staticLesson: {
        topicTitle: "Old listening course",
        dayType: "Listening",
      },
    }),
    module(2, {
      title: "Academic presentation",
      description: "Practice reviewed presentation prompts.",
      moduleType: "ai_practice",
      questionCount: 3,
      staticLesson: { topicTitle: "Old PDF course" },
    }),
  ]);
  const cards = dailyCards(current, options);
  assert.deepEqual(
    cards.map((card) => [
      card.day,
      card.title,
      card.description,
      card.moduleType,
    ]),
    [
      [
        1,
        "Library research workshop",
        "Learn to evaluate sources.",
        "interview",
      ],
      [
        2,
        "Academic presentation",
        "Practice reviewed presentation prompts.",
        "ai_practice",
      ],
    ],
  );
  assert.equal(cards[0].staticLesson, undefined);
  assert.equal(
    dailyDestination(cards[0], "paid_batch"),
    "/interview?language=paid_batch&day=1",
  );
  assert.equal(
    dailyDestination(cards[1], "paid_batch"),
    "/speaking-practice?language=paid_batch&day=2",
  );
});

test("every learner language requires configured published available content within the verified course day", () => {
  for (const language of ["english", "arabic", "paid_batch"]) {
    const current = plan(
      [
        module(1),
        module(2, { published: false }),
        module(3, { available: false }),
        module(4),
        module(5, { publicationStatus: "draft" }),
        module(6, { configured: false }),
        module(7, { publicationStatus: undefined }),
      ],
      { courseDay: 3, completedDays: [2, 3, 4, 5, 6, 7] },
      language,
    );
    assert.deepEqual(
      dailyCards(current, { ...options, language }).map((card) => card.day),
      [1],
      language,
    );
  }
});

test("loading failure future course and revoked private access never revive a retained plan", () => {
  const current = plan([module(1)]);
  for (const changed of [
    { loaded: false },
    { error: "Permission denied" },
    { privateAccess: false },
  ]) {
    assert.deepEqual(dailyCards(current, { ...options, ...changed }), []);
  }
  assert.deepEqual(
    dailyCards(
      plan([module(1)], { courseSchedule: { courseStarted: false } }),
      options,
    ),
    [],
  );
  assert.deepEqual(dailyCards(emptyDailyPlan(), options), []);
  assert.equal(
    dailyCardState(current.modules[0], current, {
      loaded: true,
      error: "Connection failed",
    }).available,
    false,
  );
});

test("saved completion belongs to its exact server day and cannot complete or unlock the preceding day", () => {
  const current = plan(
    [module(1), module(2), module(3, { available: false })],
    { completedDays: [2, 2, "1", -1, 3], courseDay: 2 },
  );
  assert.deepEqual(current.completedDays, [2, 3]);
  assert.equal(
    dailyCardState(current.modules[0], current, { loaded: true }).completed,
    false,
  );
  assert.equal(
    dailyCardState(current.modules[1], current, { loaded: true }).completed,
    true,
  );
  assert.equal(
    dailyCardState(current.modules[2], current, { loaded: true }).available,
    false,
  );
  assert.equal(
    dailyCardState(current.modules[1], current, { loaded: false }).completed,
    false,
  );
});

test("paid month filters restrict verified content and cannot authorize locked content", () => {
  const current = plan(
    [module(1), module(13), module(25, { available: false })],
    { courseDay: 36 },
  );
  assert.deepEqual(
    dailyCards(current, {
      ...options,
      paidMonths: 1,
      selectedMonth: "all",
    }).map((card) => card.day),
    [1],
  );
  assert.deepEqual(
    dailyCards(current, { ...options, paidMonths: 2, selectedMonth: 2 }).map(
      (card) => card.day,
    ),
    [13],
  );
  assert.deepEqual(
    dailyCards(current, { ...options, paidMonths: 5, selectedMonth: 3 }),
    [],
  );
});

test("staff retain explicit planning placeholders and actual draft content without fabricated availability", () => {
  const draft = plan([
    module(2, {
      published: false,
      publicationStatus: "draft",
      title: "Draft oral seminar",
      moduleType: "interview",
    }),
  ]);
  const cards = dailyCards(draft, { ...options, staff: true, planningDays: 3 });
  assert.equal(cards.length, 3);
  assert.equal(cards[0].configured, false);
  assert.equal(cards[0].available, false);
  assert.equal(cards[1].title, "Draft oral seminar");
  assert.equal(cards[1].moduleType, "interview");
  assert.equal(
    dailyCardState(cards[1], draft, { loaded: true, staff: true }).available,
    false,
  );
  const failed = dailyCards(draft, {
    ...options,
    staff: true,
    error: "Unavailable",
    planningDays: 3,
  });
  assert.equal(failed.length, 3);
  assert.ok(
    failed.every(
      (card) => !card.configured && !card.available && card.moduleType === null,
    ),
  );
});

test("premium access and malformed plans fail closed while routes follow module type for all languages", () => {
  const premium = plan([module(1, { premiumLocked: true })]);
  assert.equal(dailyCards(premium, options).length, 1);
  const state = dailyCardState(premium.modules[0], premium, { loaded: true });
  assert.equal(state.locked, true);
  assert.equal(state.available, false);
  for (const response of [
    null,
    [],
    {},
    { modules: [module(1), module(1)] },
    { modules: [module("1")] },
  ]) {
    assert.throws(() => normalizeDailyPlan(response, "paid_batch"));
  }
  const badType = plan([module(1, { moduleType: "legacy_reels" })]);
  assert.deepEqual(dailyCards(badType, options), []);
  for (const language of ["english", "arabic", "paid_batch"]) {
    assert.equal(
      dailyDestination(module(1, { moduleType: "ai_practice" }), language),
      `/speaking-practice?language=${language}&day=1`,
    );
    assert.equal(dailyDestination(module(2), language), "/lesson/2");
  }
  assert.equal(dailyDestination(module(1), "unexpected"), null);
  assert.equal(dailyDestination(module(0), "english"), null);
});
