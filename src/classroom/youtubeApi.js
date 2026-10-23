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

export function youtubePlayerErrorMessage(code) {
  switch (code) {
    case 2: return 'This YouTube video link is invalid. Choose another video or open the source on YouTube.';
    case 5: return 'YouTube could not play this video in the embedded player. Open it on YouTube instead.';
    case 100: return 'This video is unavailable or private. Open it on YouTube or choose another video.';
    case 101:
    case 150: return 'The video owner does not allow embedded playback. Open it on YouTube instead.';
    case 153: return 'YouTube could not verify this embedded player. Open the source on YouTube or retry.';
    default: return 'The YouTube player could not start. Check your connection, retry, or open the source on YouTube.';
  }
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
