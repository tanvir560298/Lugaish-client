// Redirect recovery must settle even when Firebase cannot refresh an ID token.
export function waitForIdentity(subscribe, timeoutMs = 3500) {
  return new Promise((resolve, reject) => {
    let unsubscribe = () => {},
      settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      unsubscribe();
      error ? reject(error) : resolve(result);
    };
    const timer = setTimeout(() => finish(null, null), timeoutMs);
    try {
      unsubscribe = subscribe(
        async (user) => {
          if (!user) {
            finish(null, null);
            return;
          }
          try {
            const idToken = await user.getIdToken();
            finish(null, { idToken, user });
          } catch (error) {
            finish(error);
          }
        },
        (error) => finish(error),
      );
      if (settled) unsubscribe();
    } catch (error) {
      finish(error);
    }
  });
}
