export function verifiedGoalStatus(goal, today) {
  if (!today) return null;
  if (goal === "Complete one available lesson" && today.lessons > 0)
    return "Goal achieved: a lesson completion was verified today.";
  if (goal === "Finish an eligible practice activity" && today.practice > 0)
    return "Goal achieved: a complete practice submission was verified today.";
  if (goal === "Review mistakes" && today.reviews > 0)
    return "Goal achieved: a correct review retry was verified today.";
  return null;
}
