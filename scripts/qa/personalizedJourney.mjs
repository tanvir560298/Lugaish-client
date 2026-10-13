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
  await delay(200);
}
async function screenshot(name) {
  const r = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
    fromSurface: true,
  });
  await writeFile(
    "docs/visual-checks/phase16-" + name + ".png",
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
    `localStorage.clear();localStorage.setItem('lugaish_auth_token',${JSON.stringify(session.token)});localStorage.setItem('lugaish_state_v1',JSON.stringify({isLoggedIn:true,userEmail:${JSON.stringify(session.email)},userName:'Developer Fixture Student',userRole:'learner',activePathway:'english',enrolledPathways:['english','arabic']}));`,
  );
  await visit(origin + "/quiz?day=1", 1440);
  await wait("!!document.querySelector('form fieldset')");
  await screenshot("published-practice-1440");
  await evaluate(
    "document.querySelectorAll('fieldset')[0].querySelectorAll('input')[1].click();document.querySelectorAll('fieldset')[1].querySelectorAll('input')[0].click()",
  );
  await click("Submit complete activity");
  await wait("document.body.textContent.includes('Result saved')");
  report.verifiedFeedback = await evaluate(
    "document.body.textContent.includes('1 / 2 correct')&&document.body.textContent.includes('Correct answer verified')",
  );
  await click("Review saved mistakes");
  await wait("!!document.querySelector('.review-question')");
  for (const [width, height] of [
    [1440, 900],
    [768, 900],
    [390, 844],
  ]) {
    await viewport(width, height);
    await delay(200);
    await screenshot("review-" + width);
    report.viewports.push({
      width,
      height,
      overflow: await evaluate(
        "document.documentElement.scrollWidth>innerWidth+1",
      ),
      question: await evaluate(
        "document.querySelector('.review-question legend').textContent",
      ),
    });
  }
  await viewport(390, 844);
  await evaluate("document.querySelector('.review-option input').focus()");
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
  await delay(150);
  await click("Check and save retry");
  await wait("document.body.textContent.includes('Correct retry saved')");
  report.correctRetry = true;
  await evaluate(
    "document.querySelector('.review-question').scrollIntoView({block:'start'})",
  );
  await screenshot("confirmed-retry-390");
  await send("Page.reload");
  await delay(800);
  await wait("document.body.textContent.includes('Correct retry saved')");
  report.persisted = true;
  await visit(origin, 1440);
  await wait("!!document.querySelector('.learning-next')");
  await wait(
    "document.querySelector('.learning-next').textContent.includes('Open lesson')",
  );
  await screenshot("personalized-home-1440");
  report.nextAction = await evaluate(
    "document.querySelector('.learning-next').textContent.includes('Open lesson')&&!document.querySelector('.learning-next').textContent.includes('Review 1 saved mistake')",
  );
  await evaluate(
    "const s=JSON.parse(localStorage.getItem('lugaish_state_v1'));s.activePathway='arabic';localStorage.setItem('lugaish_state_v1',JSON.stringify(s))",
  );
  await visit(origin + "/quiz?day=1", 390);
  await viewport(390, 844);
  await wait(
    "document.querySelector('fieldset legend')?.textContent.includes('التحية')",
  );
  await evaluate("document.querySelectorAll('fieldset input')[1].click()");
  await click("Submit complete activity");
  await wait("document.body.textContent.includes('Result saved')");
  await click("Review saved mistakes");
  await wait("!!document.querySelector('.review-question')");
  await screenshot("arabic-review-390");
  await evaluate(
    "document.querySelector('.review-question').scrollIntoView({block:'start'})",
  );
  await screenshot("arabic-question-390");
  report.arabicRTL = await evaluate(
    "document.querySelector('.review-question fieldset').dir==='rtl'&&document.body.textContent.includes('مَرْحَبًا')",
  );
  await evaluate(
    "localStorage.removeItem('lugaish_auth_token');localStorage.removeItem('lugaish_state_v1')",
  );
  await visit(origin + "/review-mistakes", 390);
  report.unauthorizedRedirect = await evaluate(
    "location.pathname==='/login'&&!document.querySelector('.review-question')",
  );
  await writeFile(
    "docs/visual-checks/phase16-journey.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
  if (
    !report.verifiedFeedback ||
    !report.correctRetry ||
    !report.persisted ||
    !report.nextAction ||
    !report.arabicRTL ||
    !report.unauthorizedRedirect ||
    report.viewports.some((v) => v.overflow)
  )
    throw Error("Phase16 acceptance failed");
} finally {
  close();
}
