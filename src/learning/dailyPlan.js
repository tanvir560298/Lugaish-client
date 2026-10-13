const languages = new Set(["english", "arabic", "paid_batch"]);
const moduleTypes = new Set(["video", "ai_practice", "interview"]);
const validDay = (value) =>
  Number.isSafeInteger(value) && value >= 1 && value <= 365;
const count = (value) =>
  Number.isSafeInteger(value) && value >= 0 ? value : 0;

export function emptyDailyPlan(requestKey = "") {
  return {
    requestKey,
    modules: [],
    completedDays: [],
    currentDay: 0,
    courseDay: 0,
    courseStarted: false,
    courseStartAt: "",
    courseStartDate: "",
    nextUnlockAt: "",
  };
}

export function normalizeDailyPlan(response, language, requestKey = "") {
  if (
    !languages.has(language) ||
    !response ||
    typeof response !== "object" ||
    Array.isArray(response) ||
    !Array.isArray(response.modules)
  ) {
    throw Error("The latest course plan could not be verified. Please retry.");
  }
  const schedule =
    response.courseSchedule && typeof response.courseSchedule === "object"
      ? response.courseSchedule
      : response;
  const seen = new Set();
  const modules = response.modules
    .map((module) => {
      if (!module || !validDay(module.day) || seen.has(module.day)) {
        throw Error(
          "The latest course plan contains an invalid class. Please retry.",
        );
      }
      seen.add(module.day);
      const moduleType = moduleTypes.has(module.moduleType)
        ? module.moduleType
        : null;
      const title = typeof module.title === "string" ? module.title : "";
      return {
        day: module.day,
        id: `published-${language}-${module.day}`,
        title,
        description:
          typeof module.description === "string" ? module.description : "",
        moduleType,
        configured:
          module.configured === true && !!moduleType && !!title.trim(),
        published: module.published === true,
        publicationStatus: module.publicationStatus,
        available: module.available === true,
        premiumLocked: module.premiumLocked === true,
        questionCount: count(module.questionCount),
        videoCount: count(module.videoCount),
        daySchedule: module.daySchedule,
      };
    })
    .sort((a, b) => a.day - b.day);
  return {
    ...emptyDailyPlan(requestKey),
    modules,
    completedDays: [
      ...new Set(
        Array.isArray(response.completedDays)
          ? response.completedDays.filter(validDay)
          : [],
      ),
    ],
    currentDay: validDay(response.currentDay) ? response.currentDay : 0,
    courseDay: validDay(response.courseDay) ? response.courseDay : 0,
    courseStarted: schedule.courseStarted === true,
    courseStartAt:
      typeof schedule.courseStartAt === "string" ? schedule.courseStartAt : "",
    courseStartDate:
      typeof schedule.courseStartDate === "string"
        ? schedule.courseStartDate
        : "",
    nextUnlockAt:
      typeof response.nextUnlockAt === "string" ? response.nextUnlockAt : "",
  };
}

export function dailyCards(
  plan,
  {
    loaded = false,
    error = "",
    staff = false,
    language,
    privateAccess = false,
    paidMonths = 1,
    selectedMonth = "all",
    planningDays = 90,
  } = {},
) {
  const verified = loaded && !error && languages.has(language);
  let cards;
  if (staff) {
    const modules = verified ? plan.modules : [];
    const byDay = new Map(modules.map((module) => [module.day, module]));
    const dayCount = Math.min(
      365,
      Math.max(planningDays, ...modules.map((module) => module.day)),
    );
    cards = Array.from(
      { length: dayCount },
      (_, index) =>
        byDay.get(index + 1) || {
          day: index + 1,
          id: `planning-${language}-${index + 1}`,
          title: "Coming soon",
          description:
            "This day can be configured as a lesson, speaking practice, or interview.",
          moduleType: null,
          configured: false,
          published: false,
          available: false,
          questionCount: 0,
          videoCount: 0,
        },
    );
  } else {
    if (
      !verified ||
      !plan.courseStarted ||
      (language === "paid_batch" && !privateAccess)
    )
      return [];
    cards = plan.modules.filter(
      (module) =>
        module.configured &&
        module.published &&
        module.publicationStatus === "published" &&
        module.available &&
        module.day <= plan.courseDay,
    );
    // Month tiers can restrict an authoritative availability result; never grant one.
    if (language === "paid_batch")
      cards = cards.filter(
        (module) =>
          module.day <= Math.max(1, Math.min(5, Number(paidMonths) || 1)) * 12,
      );
  }
  if (language === "paid_batch" && selectedMonth !== "all") {
    const month = Math.max(1, Math.min(5, Number(selectedMonth) || 1));
    cards = cards.filter((module) => Math.ceil(module.day / 12) === month);
  }
  return cards;
}

export function dailyCardState(
  card,
  plan,
  { loaded = false, error = "", staff = false } = {},
) {
  const verified = loaded && !error;
  const available =
    verified &&
    plan.courseStarted &&
    card.configured &&
    card.published &&
    card.publicationStatus === "published" &&
    card.available &&
    card.day <= plan.courseDay;
  return {
    available: available && !card.premiumLocked,
    completed:
      verified && card.configured && plan.completedDays.includes(card.day),
    current: !staff && available && card.day === plan.currentDay,
    locked: !staff && (!available || card.premiumLocked),
  };
}

export function dailyDestination(card, language) {
  if (
    !languages.has(language) ||
    !validDay(card?.day) ||
    !moduleTypes.has(card.moduleType)
  )
    return null;
  if (card.moduleType === "ai_practice")
    return `/speaking-practice?language=${language}&day=${card.day}`;
  if (card.moduleType === "interview")
    return `/interview?language=${language}&day=${card.day}`;
  return `/lesson/${card.day}`;
}
