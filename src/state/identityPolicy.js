export function serverLearningAccess(user) {
  const revoked = user?.privateBatchExplicitlyRevoked === true;
  const enrolled = Array.isArray(user?.enrolledPathways)
    ? user.enrolledPathways
    : [];
  const privateBatchAccess =
    !revoked &&
    (user?.privateBatchAccess === true || enrolled.includes("paid_batch"));
  return {
    privateBatchAccess,
    privateBatchExplicitlyRevoked: revoked,
    enrolledPathways: enrolled.filter(
      (p) =>
        p === "english" ||
        p === "arabic" ||
        (p === "paid_batch" && privateBatchAccess),
    ),
  };
}
export function visibleEnrollments(enrolled, activePathway, loggedIn) {
  return enrolled.length ? enrolled : loggedIn ? [] : [activePathway];
}

export function shouldClearSession(requestToken, currentToken) {
  return !!requestToken && requestToken === currentToken;
}
