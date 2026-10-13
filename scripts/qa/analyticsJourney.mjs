import { readFile, writeFile } from "node:fs/promises";
import { visit, evaluate, send, close } from "./browserClient.mjs";
const session = JSON.parse(
  await readFile("/tmp/lugaish-phase16-fixture-session.json", "utf8"),
);
const origin = "http://127.0.0.1:4175",
  report = { fixture: true, viewports: [] };
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function wait(expr) {
  for (let i = 0; i < 80; i++) {
    if (await evaluate(expr)) return;
    await delay(150);
  }
  throw Error("Missing " + expr);
}
async function click(text) {
  const exists = await evaluate(
    `(()=>{const b=[...document.querySelectorAll('button,a')].find(b=>b.getBoundingClientRect().width&&b.textContent.trim()===${JSON.stringify(text)});b?.click();return !!b})()`,
  );
  if (!exists) throw Error("Missing action " + text);
  await delay(180);
}
async function screenshot(name) {
  const r = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
    fromSurface: true,
  });
  await writeFile(
    "docs/visual-checks/phase17-" + name + ".png",
    Buffer.from(r.data, "base64"),
  );
}
async function viewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
}
try {
  await visit(origin, 1440);
  await evaluate(
    `localStorage.clear();localStorage.setItem('lugaish_auth_token',${JSON.stringify(session.token)});localStorage.setItem('lugaish_state_v1',JSON.stringify({isLoggedIn:true,userEmail:${JSON.stringify(session.email)},userName:'Developer Fixture Student',userRole:'learner',activePathway:'english',enrolledPathways:['english','arabic']}))`,
  );
  await visit(origin + "/progress", 1440);
  await wait("!!document.querySelector('.analytics-empty')");
  await screenshot("no-activity-1440");
  report.noFakeCharts = await evaluate(
    "!document.querySelector('.accuracy-track')&&!document.querySelector('.analytics-timeline')",
  );
  if (process.env.QA_EMPTY_CATALOG === "1") {
    for (const [width, height] of [
      [1440, 900],
      [390, 844],
    ]) {
      await viewport(width, height);
      await screenshot("empty-catalog-" + width);
    }
    report.emptyCatalog = await evaluate(
      "document.body.textContent.includes('No published course is available yet')&&!document.querySelector('.accuracy-track')",
    );
    await writeFile(
      "docs/visual-checks/phase17-empty.json",
      JSON.stringify(report, null, 2),
    );
    console.log(JSON.stringify(report));
    if (!report.emptyCatalog) throw Error("Empty acceptance failed");
  } else {
    await visit(origin + "/quiz?day=1", 1440);
    await wait("!!document.querySelector('form fieldset')");
    await evaluate(
      "document.querySelectorAll('fieldset')[0].querySelectorAll('input')[1].click();document.querySelectorAll('fieldset')[1].querySelectorAll('input')[0].click()",
    );
    await click("Submit complete activity");
    await wait("document.body.textContent.includes('Result saved')");
    await evaluate(
      `(async()=>{const headers={'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem('lugaish_auth_token')};const submit=await fetch('http://127.0.0.1:5016/api/quiz/submit',{method:'POST',headers,body:JSON.stringify({language:'english',day:1,responses:[{selectedAnswer:1},{selectedAnswer:0}]})});if(!submit.ok)throw Error('Fixture repeat failed')})()`,
    );
    await visit(origin + "/progress", 1440);
    await wait("!!document.querySelector('.analytics-overview')");
    await wait(
      "document.body.textContent.includes('1 question needs another try')",
    );
    report.initialVsRepeat = await evaluate(
      "document.querySelectorAll('.accuracy-row')[0].textContent.includes('1 correct / 2 evaluated')&&document.querySelectorAll('.accuracy-row')[1].textContent.includes('1 correct / 2 evaluated')",
    );
    for (const [width, height] of [
      [1440, 900],
      [768, 900],
      [390, 844],
    ]) {
      await viewport(width, height);
      await delay(150);
      await screenshot("dashboard-" + width);
      report.viewports.push({
        width,
        height,
        overflow: await evaluate(
          "document.documentElement.scrollWidth>innerWidth+1",
        ),
      });
    }
    await evaluate(
      "document.querySelector('.analytics-accuracy').scrollIntoView({block:'start'})",
    );
    await screenshot("accuracy-390");
    await evaluate(
      "document.querySelector('.daily-focus').scrollIntoView({block:'start'})",
    );
    await click("Review mistakes");
    await click("Save my focus");
    report.goalNotPremature = await evaluate(
      "!document.body.textContent.includes('Goal achieved')",
    );
    await click("Review Mistakes");
    await wait("!!document.querySelector('.review-question')");
    await evaluate("document.querySelector('.review-option input').click()");
    await click("Check and save retry");
    await wait("document.body.textContent.includes('Correct retry saved')");
    await visit(origin + "/progress", 390);
    await viewport(390, 844);
    await wait(
      "document.body.textContent.includes('Goal achieved: a correct review retry')",
    );
    report.goalVerified = true;
    report.reviewImprovement = await evaluate(
      "document.querySelector('.analytics-review').textContent.includes('1 of 1')",
    );
    await evaluate(
      "document.querySelector('.analytics-review').scrollIntoView({block:'start'})",
    );
    await screenshot("review-insights-390");
    await send("Page.bringToFront");
    await send("Emulation.setFocusEmulationEnabled",{enabled:true});
    await evaluate("document.querySelector('[data-range=all]').focus()");
    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: " ",
      code: "Space",
      windowsVirtualKeyCode: 32,
    });
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: " ",
      code: "Space",
      windowsVirtualKeyCode: 32,
    });
    await delay(500);
    report.keyboardFilter = await evaluate(
      "document.querySelector('[data-range=all]').getAttribute('aria-pressed')==='true'",
    );
    await evaluate(
      "window.qaFetch=window.fetch;window.fetch=(url,opts)=>String(url).includes('/api/analytics/')?Promise.resolve(new Response(JSON.stringify({error:'Simulated QA service interruption'}),{status:503,headers:{'Content-Type':'application/json'}})):qaFetch(url,opts)",
    );
    await click("Last 30 days");
    await wait(
      "document.body.textContent.includes('Your progress could not be loaded')",
    );
    report.errorShown = true;
    await screenshot("error-390");
    await evaluate("window.fetch=window.qaFetch");
    await click("Retry analytics");
    await wait("!!document.querySelector('.analytics-overview')");
    report.errorRecovered = true;
    await evaluate(
      "document.querySelector('.analytics-recent').scrollIntoView({block:'start'})",
    );
    await screenshot("activity-390");
    await send("Page.reload");
    await delay(800);
    await wait(
      "document.body.textContent.includes('Goal achieved: a correct review retry')",
    );
    report.savedProgress = true;
    await evaluate(
      "localStorage.removeItem('lugaish_auth_token');localStorage.removeItem('lugaish_state_v1')",
    );
    await visit(origin + "/progress", 390);
    report.unauthorizedRedirect = await evaluate(
      "location.pathname==='/login'&&!document.querySelector('.analytics-overview')",
    );
    await writeFile(
      "docs/visual-checks/phase17-journey.json",
      JSON.stringify(report, null, 2),
    );
    console.log(JSON.stringify(report));
    if (
      !report.noFakeCharts ||
      !report.initialVsRepeat ||
      !report.goalNotPremature ||
      !report.goalVerified ||
      !report.reviewImprovement ||
      !report.keyboardFilter ||
      !report.errorShown ||
      !report.errorRecovered ||
      !report.savedProgress ||
      !report.unauthorizedRedirect ||
      report.viewports.some((v) => v.overflow)
    )
      throw Error("Analytics acceptance failed");
  }
} finally {
  close();
}
