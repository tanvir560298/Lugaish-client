// One provider load at a time; retries must not retain old readiness callbacks.
export function createYouTubeLoader({
  window,
  document,
  setTimeout,
  clearTimeout,
}) {
  let pending;
  return function load() {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (pending) return pending;
    pending = new Promise((resolve, reject) => {
      const script = document.createElement("script"),
        previous = window.onYouTubeIframeAPIReady;
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      let settled = false;
      const restore = () => {
        clearTimeout(timer);
        script.onerror = null;
        if (window.onYouTubeIframeAPIReady === ready)
          window.onYouTubeIframeAPIReady = previous;
      };
      const fail = (message) => {
        if (settled) return;
        settled = true;
        restore();
        script.remove();
        pending = null;
        reject(Error(message));
      };
      const ready = () => {
        if (settled) return;
        if (!window.YT?.Player) {
          fail("The video player could not initialize. Please retry.");
          return;
        }
        settled = true;
        restore();
        resolve(window.YT);
        try {
          previous?.();
        } catch {
          /* Another provider callback cannot strand this load. */
        }
      };
      const timer = setTimeout(
        () =>
          fail(
            "YouTube took too long to load. Check your connection and retry.",
          ),
        20000,
      );
      window.onYouTubeIframeAPIReady = ready;
      script.onerror = () =>
        fail("YouTube could not load. Check your connection and retry.");
      document.head.appendChild(script);
    });
    return pending;
  };
}
export function placeReadyYouTubeFrame(player, destination) {
  const iframe = player?.getIframe();
  if (
    !iframe ||
    !destination ||
    destination.isConnected === false ||
    typeof destination.moveBefore !== "function"
  )
    return false;
  if (iframe.parentElement !== destination)
    destination.moveBefore(iframe, null);
  return iframe.parentElement === destination;
}
