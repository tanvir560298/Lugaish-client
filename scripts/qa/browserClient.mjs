import { writeFile } from "node:fs/promises";
import { cdpTransport } from "./cdpTransport.mjs";
const page = (
  await fetch(
    `http://127.0.0.1:${process.env.CDP_PORT || 9229}/json/list`,
  ).then((r) => r.json())
).find((p) => p.type === "page");
if (!page) throw Error("No isolated QA browser page is available.");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    ws.close();
    reject(Error("QA browser connection timed out."));
  }, 10000);
  ws.addEventListener(
    "open",
    () => {
      clearTimeout(timer);
      resolve();
    },
    { once: true },
  );
  ws.addEventListener(
    "error",
    () => {
      clearTimeout(timer);
      reject(Error("QA browser could not connect."));
    },
    { once: true },
  );
});
const transport = cdpTransport(ws);
export const send = transport.send;
export const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.exceptionDetails)
    throw Error(
      r.exceptionDetails.exception?.description || r.exceptionDetails.text,
    );
  return r.result.value;
};
export const close = () => transport.close();
export async function visit(url, width = 1280) {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const previous = await evaluate("performance.timeOrigin");
  const navigation = await send("Page.navigate", { url });
  if (navigation.errorText)
    throw Error("QA route navigation failed: " + navigation.errorText);
  const origin = new URL(url).origin;
  for (let n = 0; n < 160; n++) {
    try {
      const ready = await evaluate(
        `document.readyState==='complete'&&location.origin===${JSON.stringify(origin)}&&(${navigation.loaderId ? "performance.timeOrigin!==" + previous : "true"})&&!!document.querySelector('main')&&document.querySelector('main').textContent.length>10`,
      );
      if (ready) return;
    } catch (error) {
      if (![-32000, -32603].includes(error.code)) throw error;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw Error("QA route did not become ready within 32 seconds.");
}
export async function shot(file) {
  try {
    const r = await send(
      "Page.captureScreenshot",
      { format: "png", captureBeyondViewport: false, fromSurface: true },
      15000,
    );
    await writeFile(file, Buffer.from(r.data, "base64"));
    return true;
  } catch (error) {
    process.stderr.write(
      "QA screenshot failed: " + String(error.message || error.code) + "\n",
    );
    return false;
  }
}
