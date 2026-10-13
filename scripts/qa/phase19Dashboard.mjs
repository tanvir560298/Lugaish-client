import { readFile, writeFile } from "node:fs/promises";
import { visit, evaluate, send, close } from "./browserClient.mjs";
const session = JSON.parse(
    await readFile("/tmp/lugaish-phase19-fixture-session.json", "utf8"),
  ),
  rows = [];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function wait(expr) {
  for (let n = 0; n < 80; n++) {
    if (await evaluate(expr)) return;
    await pause(150);
  }
  throw Error("Dashboard readiness check failed.");
}
async function identity(user, role, enrolled) {
  await visit("http://127.0.0.1:4175/", 1440);
  await evaluate(
    `localStorage.clear();localStorage.setItem('lugaish_auth_token',${JSON.stringify(user.token)});localStorage.setItem('lugaish_state_v1',JSON.stringify({isLoggedIn:true,userEmail:${JSON.stringify(user.email)},userName:'Developer Fixture',userRole:${JSON.stringify(role)},activePathway:'english',enrolledPathways:${JSON.stringify(enrolled)},privateBatchAccess:false}));`,
  );
}
try {
  for (const [kind, user, role, enrolled] of [
    ["learner", session, "learner", ["english", "arabic"]],
    ["staff", session.staff, "web_developer", []],
    ["unenrolled", session.unenrolled, "learner", ["english"]],
  ]) {
    await identity(user, role, enrolled);
    for (const width of [1440, 768, 390]) {
      await visit("http://127.0.0.1:4175/dashboard", width);
      if (width === 390)
        await send("Emulation.setDeviceMetricsOverride", {
          width,
          height: 844,
          deviceScaleFactor: 1,
          mobile: false,
        });
      await wait(
        kind === "staff"
          ? "document.querySelector('main')?.textContent.includes('Staff Dashboard')"
          : "location.pathname==='/progress'&&!!document.querySelector('.learning-analytics')",
      );
      const result = await evaluate(
        `({kind:${JSON.stringify(kind)},width:innerWidth,path:location.pathname,crash:document.body.textContent.includes('This page could not load'),overflow:document.documentElement.scrollWidth>innerWidth+1,emptyStaff:document.body.textContent.includes('No published course data is available'),enrollments:JSON.parse(localStorage.getItem('lugaish_state_v1')).enrolledPathways})`,
      );
      rows.push(result);
      const shot = await send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false,
      });
      await writeFile(
        `docs/visual-checks/phase19-${kind}-dashboard-${width}.png`,
        Buffer.from(shot.data, "base64"),
      );
    }
  }
  await writeFile(
    "docs/visual-checks/phase19-dashboard.json",
    JSON.stringify(rows, null, 2),
  );
  console.log(JSON.stringify(rows));
  if (
    rows.some(
      (r) =>
        r.crash ||
        r.overflow ||
        (r.kind === "staff" && !r.emptyStaff) ||
        (r.kind === "unenrolled" && r.enrollments.length),
    )
  )
    throw Error("Dashboard or enrollment regression");
} finally {
  close();
}
