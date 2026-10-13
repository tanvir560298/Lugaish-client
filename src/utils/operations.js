const EVENTS = new Set([
  "frontend_exception",
  "frontend_rejection",
  "api_failure",
  "auth_failure",
  "classroom_media_failure",
  "classroom_render_failure",
  "library_render_failure",
]);
export function createOperationalReporter({
  enabled = false,
  send = () => {},
  now = () => Date.now(),
} = {}) {
  let start = 0,
    count = 0;
  return (event) => {
    if (!enabled || !EVENTS.has(event)) return;
    const time = now();
    if (time - start >= 60000) {
      start = time;
      count = 0;
    }
    if (count >= 10) return;
    count++;
    try {
      Promise.resolve(send({ event })).catch(() => {});
    } catch {}
  };
}
export const reportOperationalEvent = createOperationalReporter({
  enabled: import.meta.env?.VITE_TELEMETRY_ENABLED === "true",
  send: (body) =>
    fetch(
      `${(import.meta.env.VITE_API_URL || "").replace(/\/$/, "")}/telemetry`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "omit",
        keepalive: true,
      },
    ),
});
export function installOperationalMonitoring() {
  const error = () => reportOperationalEvent("frontend_exception"),
    rejection = () => reportOperationalEvent("frontend_rejection");
  window.addEventListener("error", error);
  window.addEventListener("unhandledrejection", rejection);
  return () => {
    window.removeEventListener("error", error);
    window.removeEventListener("unhandledrejection", rejection);
  };
}
