import { LearningNext } from "../learning/review/LearningNext.jsx";
import { DailyGoal } from "../learning/DailyGoal.jsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Film,
  Headphones,
  Lock,
  Mic,
  Plus,
  Settings2,
  Sparkles,
  TimerReset,
  UsersRound,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useCatalog } from "../courses/Catalog.jsx";
import { useAppContext } from "../state/AppContext.jsx";
import { serverLearningAccess } from "../state/identityPolicy.js";
import {
  emptyDailyPlan,
  normalizeDailyPlan,
  dailyCards,
  dailyCardState,
  dailyDestination,
} from "../learning/dailyPlan.js";
import { ROLES, isStudentPreview } from "../utils/roles.js";
import { BankDetailsModal } from "../components/BankDetailsModal.jsx";
import { TransferSubmissionModal } from "../components/TransferSubmissionModal.jsx";
import { StudentPaymentCard } from "../components/StudentPaymentCard.jsx";
import {
  getBankSettings,
  submitTransferDetails,
  MONTHLY_TUITION_FEE,
} from "../utils/paymentService.js";

const WEB_DEVELOPER_PLANNING_DAYS = 90;

function formatScheduledDate(dateKey) {
  if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey))
    return "";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

const MODULE_PRESENTATION = {
  video: {
    label: "Video lesson",
    startLabel: "Start lesson",
    reviewLabel: "Review lesson",
    Icon: Film,
    accent: "text-blue-300",
  },
  ai_practice: {
    label: "AI practice session",
    startLabel: "Start practice",
    reviewLabel: "Review practice",
    Icon: Mic,
    accent: "text-emerald-300",
  },
  interview: {
    label: "Interview session",
    startLabel: "Join interview",
    reviewLabel: "Open interview",
    Icon: UsersRound,
    accent: "text-violet-300",
  },
};

function ModuleStats({ day }) {
  const baseClass = "rounded-2xl border border-white/10 bg-white/5 p-3";
  if (!day.moduleType)
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Waiting for the course plan
      </div>
    );
  if (day.moduleType === "ai_practice")
    return (
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className={baseClass}>
          <Mic size={16} className="mx-auto mb-2 text-emerald-400" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Voice
          </p>
        </div>
        <div className={baseClass}>
          <Headphones size={16} className="mx-auto mb-2 text-blue-400" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {day.questionCount} Questions
          </p>
        </div>
        <div className={baseClass}>
          <Sparkles size={16} className="mx-auto mb-2 text-amber-400" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Practice
          </p>
        </div>
      </div>
    );
  if (day.moduleType === "interview")
    return (
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className={baseClass}>
          <UsersRound size={16} className="mx-auto mb-2 text-violet-300" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Live queue
          </p>
        </div>
        <div className={baseClass}>
          <Video size={16} className="mx-auto mb-2 text-blue-400" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Interview
          </p>
        </div>
        <div className={baseClass}>
          <Clock3 size={16} className="mx-auto mb-2 text-amber-400" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Scheduled
          </p>
        </div>
      </div>
    );
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 text-center">
      <div className={baseClass}>
        <Film size={16} className="mx-auto mb-2 text-blue-400" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {day.videoCount} Videos
        </p>
      </div>
      <div className={baseClass}>
        <BookOpen size={16} className="mx-auto mb-2 text-emerald-400" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Lesson content
        </p>
      </div>
    </div>
  );
}

export function DailyLessonsPage() {
  const { state, actions, courseData } = useAppContext();
  const navigate = useNavigate();
  const [comingSoon, setComingSoon] = useState(null);
  const [dayModuleData, setDayModuleData] = useState(() => emptyDailyPlan());
  const [hasLoadedDayModules, setHasLoadedDayModules] = useState(false);
  const [dayModuleError, setDayModuleError] = useState("");
  const [selectedPaidMonth, setSelectedPaidMonth] = useState(1);
  // Manual payment state & modals
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [submissionNotice, setSubmissionNotice] = useState("");

  const handleOpenBankDetails = async () => {
    try {
      const details = await getBankSettings();
      setBankDetails(details);
    } catch {
      // Fallback
    }
    setIsBankModalOpen(true);
  };

  const handleSubmitTransfer = async (formData) => {
    await submitTransferDetails(state.userEmail, state.userName, {
      ...formData,
      month: selectedPaidMonth !== "all" ? selectedPaidMonth : 2,
    });
    setSubmissionNotice(
      `Transfer details submitted for Month ${selectedPaidMonth !== "all" ? selectedPaidMonth : 2}! We'll verify and update you within 24 hours.`,
    );
    setTimeout(() => setSubmissionNotice(""), 6000);
  };

  const isWebDeveloper =
    !isStudentPreview(state) &&
    [
      ROLES.webDeveloper,
      ROLES.tester,
      ROLES.instructor,
      ROLES.editor,
      ROLES.intern,
    ].includes(state.userRole);
  const studentPaidMonths = Math.max(Number(state.paidBatchMonths) || 1, 1);
  const learnerAccess = serverLearningAccess(state);
  const canAccessPrivateBatch =
    isWebDeveloper || learnerAccess.privateBatchAccess;
  const baseEnrolled = [
    ...new Set([
      ...(isWebDeveloper
        ? Object.keys(courseData)
        : learnerAccess.enrolledPathways),
      ...(canAccessPrivateBatch ? ["paid_batch"] : []),
    ]),
  ];
  const enrolledPathways = baseEnrolled.filter((pathwayKey) => {
    if (pathwayKey === "paid_batch") return canAccessPrivateBatch;
    return Boolean(courseData[pathwayKey]);
  });
  const catalog = useCatalog();
  const availableToEnroll = (catalog.courses || [])
    .map((c) => c.language)
    .filter((pathway) => {
      if (enrolledPathways.includes(pathway)) return false;
      if (courseData[pathway]?.isPrivate) return false;
      return true;
    });
  const pathway = courseData[state.activePathway] ?? {
    title: "Published courses",
    modules: [],
  };
  const planKey = JSON.stringify([
    state.userEmail,
    state.isLoggedIn,
    state.activePathway,
    state.userRole,
    state.webDeveloperMode,
  ]);
  const hasCurrentPlan = dayModuleData.requestKey === planKey;
  const loadedCurrentPlan = hasCurrentPlan && hasLoadedDayModules;
  const currentPlanError = hasCurrentPlan ? dayModuleError : "";
  const hasRemoteDayPlan = loadedCurrentPlan && !currentPlanError;
  const courseStartedForLearner =
    hasRemoteDayPlan && dayModuleData.courseStarted === true;
  const days = useMemo(
    () =>
      dailyCards(dayModuleData, {
        loaded: hasRemoteDayPlan,
        error: currentPlanError,
        staff: isWebDeveloper,
        language: state.activePathway,
        privateAccess: canAccessPrivateBatch,
        paidMonths: studentPaidMonths,
        selectedMonth: selectedPaidMonth,
        planningDays: WEB_DEVELOPER_PLANNING_DAYS,
      }),
    [
      dayModuleData,
      hasRemoteDayPlan,
      currentPlanError,
      isWebDeveloper,
      state.activePathway,
      canAccessPrivateBatch,
      studentPaidMonths,
      selectedPaidMonth,
    ],
  );
  const nextAvailableDay = days.find(
    (day) =>
      dailyCardState(day, dayModuleData, { loaded: hasRemoteDayPlan })
        .available,
  );

  useEffect(() => {
    if (!comingSoon) return undefined;

    const timeout = window.setTimeout(() => setComingSoon(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [comingSoon]);

  useEffect(() => {
    let ignore = false;
    setHasLoadedDayModules(false);
    setDayModuleError("");

    setDayModuleData(emptyDailyPlan(planKey));

    api
      .getDayModules(state.activePathway, {
        learnerPreview: isStudentPreview(state),
      })
      .then((response) => {
        if (ignore) return;
        setDayModuleData(
          normalizeDailyPlan(response, state.activePathway, planKey),
        );
      })
      .catch((error) => {
        if (!ignore)
          setDayModuleError(
            error.message || "The latest day plan could not be loaded.",
          );
      })
      .finally(() => {
        if (!ignore) setHasLoadedDayModules(true);
      });

    return () => {
      ignore = true;
    };
  }, [planKey]);

  const openDay = (day) => {
    if (
      !isWebDeveloper &&
      !dailyCardState(day, dayModuleData, {
        loaded: hasRemoteDayPlan,
        error: currentPlanError,
      }).available
    )
      return;
    const destination = dailyDestination(day, state.activePathway);
    if (destination) navigate(destination);
    else if (isWebDeveloper) navigate(`/lesson/${day.day}?configure=1`);
  };

  const enrollCourse = (pathwayKey) => {
    actions.enrollPathway(pathwayKey);
  };

  return (
    <section className="daily-lessons-page academic-learning space-y-8 pb-20">
      <LearningNext />
      <div className="section-card overflow-hidden p-0">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-blue-500/10 to-transparent lg:block" />
          <div className="relative max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-purple-300">
              {state.activePathway === "paid_batch"
                ? pathway.title
                : "Your classes & materials"}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              My Learning
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
              {state.activePathway === "paid_batch"
                ? pathway.description ||
                  "Private lessons are available only with confirmed batch enrollment. Your historical learning records remain saved."
                : "Find your lessons, videos, PDFs, and quizzes here. Choose your course below, then open an available class."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-2 sm:flex">
          {enrolledPathways.map((pathwayKey) => {
            const isActive = state.activePathway === pathwayKey;
            const course = courseData[pathwayKey];
            if (!course) return null;
            const isPaidBatch = pathwayKey === "paid_batch";

            return (
              <button
                key={pathwayKey}
                type="button"
                aria-pressed={isActive}
                onClick={() => actions.switchPathway(pathwayKey)}
                className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-black uppercase tracking-widest transition ${
                  isActive
                    ? isPaidBatch
                      ? "border-purple-400/40 bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                      : "border-blue-400/30 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : isPaidBatch
                      ? "border-purple-400/20 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {isPaidBatch ? (
                  <>
                    <span>💎</span>
                    <span>Paid Batch</span>
                  </>
                ) : (
                  <span>{course.title.replace(" Pathway", "")} Lessons</span>
                )}
              </button>
            );
          })}
        </div>

        {availableToEnroll.length > 0 && (
          <div className="grid gap-2 sm:flex">
            {availableToEnroll.map((pathwayKey) => (
              <button
                key={pathwayKey}
                type="button"
                onClick={() => enrollCourse(pathwayKey)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
              >
                <Plus size={16} />
                Add{" "}
                {courseData[pathwayKey]?.title?.replace(" Pathway", "") ||
                  pathwayKey}
              </button>
            ))}
          </div>
        )}
      </div>

      <section
        className="learning-next-action"
        aria-label="Your next learning action"
      >
        <div>
          <span className="platform-eyebrow">READY WHEN YOU ARE</span>
          <h2>
            {isWebDeveloper
              ? "Plan and review your learning days."
              : days.length
                ? "Choose your next small step."
                : "Your next class will appear here."}
          </h2>
          <p>
            {isWebDeveloper
              ? `${pathway.title} · ${days.length} planning slots. Configure a day and publish reviewed content when it is ready.`
              : days.length
                ? `${pathway.title} · ${days.length} class entries in the current view. Choose an available class below to begin.`
                : "We’ll show lessons when your course schedule and access can be verified. You can still make time for personal study."}
          </p>
        </div>
        <div>
          {nextAvailableDay && (
            <button
              className="campus-button campus-button-primary"
              onClick={() => openDay(nextAvailableDay)}
            >
              Open an available class
            </button>
          )}
          <Link
            className="campus-button campus-button-secondary"
            to="/classroom"
          >
            Choose a classroom lesson
          </Link>
          <Link
            className="campus-button campus-button-secondary"
            to="/study-room"
          >
            Start a focus session
          </Link>
        </div>
      </section>
      <DailyGoal
        key={`${state.userEmail}:${state.activePathway}`}
        scope={`${encodeURIComponent(state.userEmail || "learner")}:${state.activePathway}`}
      />

      {state.activePathway === "paid_batch" && canAccessPrivateBatch && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 rounded-3xl border border-purple-500/25 bg-gradient-to-br from-purple-950/40 via-slate-900/70 to-slate-950 p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-purple-200">
                Enrolled Status:
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-purple-200">
                💎{" "}
                {isWebDeveloper
                  ? "All 5 Months (Staff Full Access)"
                  : `Month ${studentPaidMonths} (Days 1–${studentPaidMonths * 12})`}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                <CheckCircle2 size={13} /> Saved Progress Preserved
              </span>

              <button
                type="button"
                onClick={handleOpenBankDetails}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-cyan-200 hover:bg-cyan-500/25 transition shadow-sm"
              >
                <span>💳</span>
                <span>Bank Details (50 SAR)</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">
                Filter Month:
              </span>
              {[1, 2, 3, 4, 5].map((monthNum) => {
                const isUnlocked =
                  isWebDeveloper || monthNum <= studentPaidMonths;
                const isSelected = selectedPaidMonth === monthNum;
                return (
                  <button
                    key={monthNum}
                    type="button"
                    onClick={() => setSelectedPaidMonth(monthNum)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition ${
                      isSelected
                        ? "border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-900/50"
                        : isUnlocked
                          ? "border-purple-400/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20"
                          : "border-white/10 bg-white/5 text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    {isUnlocked ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : (
                      <span className="text-amber-400">🔒</span>
                    )}
                    <span>Month {monthNum}</span>
                    <span className="text-[10px] opacity-70">
                      ({(monthNum - 1) * 12 + 1}–{monthNum * 12})
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedPaidMonth("all")}
                className={`rounded-xl border px-3 py-1.5 text-xs font-black transition ${
                  selectedPaidMonth === "all"
                    ? "border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-900/50"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-300"
                }`}
              >
                All classes
              </button>
            </div>
          </div>

          {/* STUDENT TUITION & BANK PAYMENT CARD */}
          <StudentPaymentCard user={state} />

          {selectedPaidMonth !== "all" &&
            selectedPaidMonth > studentPaidMonths &&
            !isWebDeveloper && (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 text-amber-200 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Lock className="shrink-0 text-amber-400" size={24} />
                    <div>
                      <h4 className="text-sm font-black text-white">
                        Month {selectedPaidMonth} Enrollment Required (Days{" "}
                        {(selectedPaidMonth - 1) * 12 + 1}–
                        {selectedPaidMonth * 12})
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
                        Your current subscription covers up to Month{" "}
                        {studentPaidMonths} (Days 1–{studentPaidMonths * 12}).
                        Your completed classes remain permanently stored in your
                        account. Transfer the tuition fee (50 SAR / 50 Riyals)
                        for Month {selectedPaidMonth} to unlock these lessons.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenBankDetails}
                      className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      View bank details
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="rounded-xl border border-purple-400/30 bg-purple-600 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-purple-900/40 hover:bg-purple-500 transition"
                    >
                      I've transferred payment
                    </button>
                  </div>
                </div>

                {submissionNotice && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-xs font-bold text-emerald-200">
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-emerald-400"
                    />
                    <span>{submissionNotice}</span>
                  </div>
                )}
              </div>
            )}
        </div>
      )}

      {currentPlanError && (
        <p className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {isWebDeveloper
            ? `${currentPlanError} You can retry when the connection is back.`
            : `${currentPlanError} The day plan is read-only until it can be verified, so no lesson can be opened from this screen yet.`}
        </p>
      )}

      {!loadedCurrentPlan && !isWebDeveloper && (
        <p className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          Loading your verified course-day plan…
        </p>
      )}

      {hasRemoteDayPlan && !isWebDeveloper && !courseStartedForLearner && (
        <p className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-4 text-sm leading-6 text-blue-100">
          Your course has not started yet. Daily lessons and speaking tests will
          appear here only when the server opens the scheduled course date
          {dayModuleData.courseStartDate || dayModuleData.courseStartAt
            ? ` (${dayModuleData.courseStartDate || dayModuleData.courseStartAt})`
            : ""}
          .
        </p>
      )}

      {hasRemoteDayPlan &&
        !isWebDeveloper &&
        courseStartedForLearner &&
        days.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
            No published learning box is scheduled for you right now. Your
            course team&apos;s next server-configured date will appear here when
            it opens.
          </p>
        )}

      {hasRemoteDayPlan &&
        !isWebDeveloper &&
        dayModuleData.nextUnlockAt &&
        dayModuleData.completedDays.includes(dayModuleData.currentDay) && (
          <div className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-5 py-4 text-sm leading-6 text-cyan-50">
            <strong>Day {dayModuleData.currentDay} complete.</strong> Your next
            learning day unlocks after 12:00 AM Bangladesh time. Your progress
            is safely stored in your account.
          </div>
        )}

      <div
        className={
          state.activePathway === "paid_batch"
            ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        }
      >
        {days.map((day) => {
          const isPaidBatch = state.activePathway === "paid_batch";
          const dayMonth = Math.ceil(day.day / 12);
          const presentation = MODULE_PRESENTATION[day.moduleType] ?? null;
          const scheduledDate = formatScheduledDate(
            day.daySchedule?.scheduledFor,
          );
          const cardState = dailyCardState(day, dayModuleData, {
            loaded: hasRemoteDayPlan,
            error: currentPlanError,
            staff: isWebDeveloper,
          });
          const isCurrentDay = cardState.current;
          const isPublished =
            day.published && day.publicationStatus === "published";
          const premiumLocked = day.premiumLocked === true;
          const planPendingForLearner = !loadedCurrentPlan && !isWebDeveloper;
          const planUnavailableForLearner =
            Boolean(currentPlanError) && !isWebDeveloper;
          const planReadOnlyForLearner =
            planPendingForLearner || planUnavailableForLearner;
          const completed = cardState.completed;
          const isMonthLocked =
            isPaidBatch && !isWebDeveloper && day.day > studentPaidMonths * 12;
          const isLocked = isMonthLocked || cardState.locked;
          const Icon = presentation?.Icon ?? Clock3;
          const actionLabel = planPendingForLearner
            ? "Loading plan"
            : planUnavailableForLearner
              ? "Plan unavailable"
              : isMonthLocked
                ? `Month ${dayMonth} required`
                : !day.moduleType
                  ? isWebDeveloper
                    ? "Configure day"
                    : "Coming soon"
                  : isLocked
                    ? premiumLocked
                      ? "Premium required"
                      : !isPublished
                        ? "Coming soon"
                        : "Not available yet"
                    : completed
                      ? presentation.reviewLabel
                      : presentation.startLabel;

          return (
            <article
              key={day.id}
              className={`section-card relative overflow-hidden p-5 transition sm:p-6 ${
                !isLocked && !completed && day.moduleType
                  ? "border-blue-400/30 shadow-[0_24px_70px_rgba(37,99,235,0.16)]"
                  : ""
              } ${isCurrentDay ? "border-cyan-300/80 ring-2 ring-cyan-300/50 shadow-[0_0_35px_rgba(34,211,238,0.65),0_0_90px_rgba(37,99,235,0.38)]" : ""} ${!day.moduleType && !isWebDeveloper ? "border-dashed opacity-70" : ""}`}
            >
              {isCurrentDay && (
                <>
                  <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-cyan-300/15 via-blue-500/5 to-transparent" />
                  <div className="absolute right-20 top-5 z-10 rounded-full border border-cyan-200/50 bg-cyan-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 shadow-[0_0_24px_rgba(103,232,249,0.9)]">
                    Today
                  </div>
                </>
              )}
              <div className="relative mb-5 flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-[0.28em] ${presentation?.accent ?? "text-slate-500"}`}
                  >
                    Day {day.day}
                    {presentation ? ` · ${presentation.label}` : ""}
                  </p>
                  {scheduledDate && (
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {scheduledDate}
                    </p>
                  )}
                  <h2 className="mt-2 text-xl font-black leading-tight text-white">
                    {day.title}
                  </h2>
                </div>
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                    completed
                      ? "bg-emerald-500/15 text-emerald-400"
                      : isLocked
                        ? "bg-white/5 text-slate-500"
                        : "bg-blue-500 text-white"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 size={20} />
                  ) : isLocked ? (
                    <Lock size={18} />
                  ) : (
                    <Icon size={19} />
                  )}
                </div>
              </div>

              <p className="min-h-12 text-sm leading-6 text-slate-400">
                {day.description}
              </p>
              <ModuleStats day={day} />

              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  disabled={
                    planReadOnlyForLearner || (isLocked && !isWebDeveloper)
                  }
                  onClick={() => {
                    if (planReadOnlyForLearner) return;
                    if (isLocked && !isWebDeveloper) {
                      if (isMonthLocked) {
                        setComingSoon(
                          `Class ${day.day} requires Month ${dayMonth} enrollment.`,
                        );
                      } else {
                        setComingSoon(
                          premiumLocked ? "Premium access" : `Day ${day.day}`,
                        );
                      }
                      return;
                    }
                    openDay(day);
                  }}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-widest transition disabled:cursor-not-allowed ${
                    isLocked && !isWebDeveloper
                      ? "border border-white/5 bg-white/5 text-slate-500"
                      : completed
                        ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500 hover:text-white"
                        : isPaidBatch
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500"
                          : "bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-emerald-500"
                  }`}
                >
                  {actionLabel}
                  {!isLocked && <Sparkles size={15} />}
                </button>

                {isWebDeveloper && (
                  <button
                    type="button"
                    onClick={() => navigate(`/lesson/${day.day}?configure=1`)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-100"
                  >
                    <Settings2 size={15} />{" "}
                    {day.configured ? "Configure day" : "Plan this day"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <AnimatePresence>
        {comingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] grid place-items-center bg-slate-950/80 p-6 backdrop-blur-xl"
            onClick={() => setComingSoon(null)}
          >
            <motion.div
              initial={{ scale: 0.82, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 12 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-slate-950 p-8 text-center shadow-[0_30px_100px_rgba(16,185,129,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              >
                <TimerReset size={42} />
              </motion.div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-emerald-400">
                Daily course plan
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">
                {comingSoon} is not open yet
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Your course team will publish this day when it is ready.
                Complete the current day to unlock the next scheduled session.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Details Modal */}
      <BankDetailsModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        bankDetails={bankDetails}
      />

      {/* Transfer Submission Modal */}
      <TransferSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitTransfer}
        month={selectedPaidMonth !== "all" ? selectedPaidMonth : 2}
        studentName={state.userName || ""}
        fee={MONTHLY_TUITION_FEE}
      />
    </section>
  );
}
