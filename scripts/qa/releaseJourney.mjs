import { visit, evaluate, send, close } from "./browserClient.mjs";
import { writeFile } from "node:fs/promises";
const rows = [];
try {
  for (const width of [390, 768, 1440])
    for (const path of [
      "/",
      "/pricing",
      "/practice-preview",
      "/classroom-preview",
      "/study-room-preview",
      "/speaking-preview",
      "/login",
      "/learning-spaces",
      "/privacy",
      "/terms",
      "/support",
    ]) {
      await visit("http://127.0.0.1:4174" + path, width);
      if (width === 390)
        await send("Emulation.setDeviceMetricsOverride", {
          width,
          height: 844,
          deviceScaleFactor: 1,
          mobile: false,
        });
      await new Promise((r) => setTimeout(r, 1800));
      const text = await evaluate('document.querySelector("main").textContent');
      if (
        /English Spelling Masterclass|IELTS Foundation|With Hasibuddin|With Ishaat/.test(
          text,
        )
      )
        throw Error("Legacy active course leaked at " + path);
      const overflow = await evaluate(
        "document.documentElement.scrollWidth>innerWidth+1",
      );
      if (overflow) throw Error("Overflow " + path + " " + width);
      if (
        path === "/practice-preview" &&
        !text.includes("No classes available yet")
      )
        throw Error("Missing empty state");
      const r = await send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false,
      });
      await writeFile(
        `docs/visual-checks/phase11-${path === "/" ? "home" : path.slice(1)}-${width}.png`,
        Buffer.from(r.data, "base64"),
      );
      rows.push({ width, path, legacyAbsent: true, overflow });
    }
  await writeFile(
    "docs/visual-checks/phase11-browser.json",
    JSON.stringify(rows, null, 2),
  );
  console.log(
    "33 rendered route/width checks passed; empty state verified without forged authentication",
  );
} finally {
  close();
}
