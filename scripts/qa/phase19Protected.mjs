import { readFile, writeFile } from "node:fs/promises";
import { visit, evaluate, send, close } from "./browserClient.mjs";
const stage = process.env.QA_PASS || "before",
  session = JSON.parse(
    await readFile("/tmp/lugaish-phase19-fixture-session.json", "utf8"),
  );
const rows = [];
try {
  await visit("http://127.0.0.1:4175/", 1440);
  await evaluate(
    `localStorage.clear();localStorage.setItem('lugaish_auth_token',${JSON.stringify(session.token)});localStorage.setItem('lugaish_state_v1',JSON.stringify({isLoggedIn:true,userEmail:${JSON.stringify(session.email)},userName:'Developer Fixture Student',userRole:'learner',activePathway:'english',enrolledPathways:['english','arabic']}))`,
  );
  for (const width of [1440, 768, 390])
    for (const path of [
      "/daily-lessons",
      "/review-mistakes",
      "/progress",
      "/speaking-practice",
    ]) {
      await visit("http://127.0.0.1:4175" + path, width);
      if (width === 390)
        await send("Emulation.setDeviceMetricsOverride", {
          width,
          height: 844,
          deviceScaleFactor: 1,
          mobile: false,
        });
      await new Promise((r) => setTimeout(r, 800));
      if ((await evaluate("location.pathname")) !== path)
        throw Error("Authenticated fixture expired or redirected: " + path);
      const r = await send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false,
      });
      await writeFile(
        `docs/visual-checks/phase19-${stage}-${path.slice(1)}-${width}.png`,
        Buffer.from(r.data, "base64"),
      );
      rows.push({
        width,
        path,
        emptyCatalogFixture: true,
        overflow: await evaluate(
          "document.documentElement.scrollWidth>innerWidth+1",
        ),
      });
    }
  await writeFile(
    `docs/visual-checks/phase19-${stage}-protected.json`,
    JSON.stringify(rows, null, 2),
  );
  if (rows.some((r) => r.overflow)) throw Error("Overflow");
  console.log("12 isolated authenticated empty-catalog route checks passed");
} finally {
  close();
}
