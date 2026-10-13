import { visit, evaluate, send, close } from "./browserClient.mjs";
import { writeFile, mkdir } from "node:fs/promises";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:4174",
  stage = process.env.QA_STAGE || "after";
const rows = [];
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function wait(expr) {
  for (let n = 0; n < 240; n++) {
    if (await evaluate(expr)) return;
    await delay(150);
  }
  throw Error("Timeout: " + expr);
}
async function click(text) {
  const found = await evaluate(
    `(()=>{const b=[...document.querySelectorAll('button')].find(e=>e.getBoundingClientRect().width&&e.textContent.trim()===${JSON.stringify(text)});if(!b)return false;b.click();return true})()`,
  );
  if (!found) throw Error("Missing " + text);
  await delay(150);
}
async function setNotes(text) {
  await evaluate(
    `(()=>{const e=document.querySelector('#study-notes');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,${JSON.stringify(text)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`,
  );
  await delay(150);
}
async function shot(name, width) {
  const r = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(
    `docs/visual-checks/phase19-${stage}-${name}-${width}.png`,
    Buffer.from(r.data, "base64"),
  );
}
try {
  for (const width of [390, 768, 1440]) {
    await visit(base + "/study-room-preview", width);
    if (width === 390)
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 844,
        deviceScaleFactor: 1,
        mobile: false,
      });
    await wait('!!document.querySelector(".sr-simple-stage,canvas")');
    if (await evaluate('!!document.querySelector(".sr-library-welcome")'))
      await click("Choose My Desk");
    else if (
      await evaluate(
        '[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="Change Seat")',
      )
    )
      await click("Change Seat");
    else await click("Choose Seat");
    await click("Accessible seat list");
    await wait('!!document.querySelector("dialog[open]")');
    await evaluate(
      'document.querySelector("dialog[open] .sr-seat:not(:disabled)").click()',
    );
    await click("Sit Here");
    await wait(
      '[...document.querySelectorAll(".sr-floating-dock button")].some(e=>e.textContent==="My Desk"&&e.getAttribute("aria-pressed")==="true")',
    );
    await click("Study Tools");
    await click("Notes");
    const note = "QA only — words to practise";
    await setNotes(note);
    await click("Timer");
    if (
      await evaluate(
        '[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="Continue Studying")',
      )
    )
      await click("Continue Studying");
    if (
      await evaluate(
        '[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="Resume")',
      )
    )
      await click("Resume");
    if (
      await evaluate(
        '[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="Start studying")',
      )
    )
      await click("Start studying");
    await wait(
      '[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="Pause")',
    );
    await click("Library");
    await click("My Desk");
    await click("Study Tools");
    await click("Notes");
    const persistedAcrossViews = await evaluate(
      `document.querySelector('#study-notes').value===${JSON.stringify(note)}`,
    );
    await shot("notes", width);
    await evaluate(
      `history.pushState({},'', '/learning-spaces-preview');dispatchEvent(new PopStateEvent('popstate'));`,
    );
    await delay(500);
    await evaluate(
      `history.pushState({},'', '/study-room-preview');dispatchEvent(new PopStateEvent('popstate'));`,
    );
    await wait('!!document.querySelector(".sr-simple-stage,canvas")');
    await click("Study Tools");
    await click("Notes");
    const persistedAfterNavigation = await evaluate(
      `document.querySelector('#study-notes').value===${JSON.stringify(note)}`,
    );
    await click("Timer");
    const timerRunningAfterNavigation = await evaluate(
      '[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="Pause")',
    );
    await click("Notes");

    await evaluate(
      `window.restoreWrites=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.includes('lugaish-study-v1:')&&k.endsWith(':notes'))throw new DOMException('QA quota failure','QuotaExceededError');return restoreWrites.call(this,k,v)}`,
    );
    await setNotes(note + " unsaved");
    await shot("storage-failed", width);
    const preservedAfterFailure = await evaluate(
      `document.querySelector('#study-notes').value===${JSON.stringify(note + " unsaved")}`,
    );
    const retryExists = await evaluate(
      '[...document.querySelectorAll("button")].some(e=>e.textContent.trim()==="Retry saving")',
    );
    await evaluate("Storage.prototype.setItem=restoreWrites");
    if (retryExists) {
      await click("Retry saving");
      await wait('!document.querySelector(".ls-error")');
    }
    rows.push({
      width,
      persistedAcrossViews,
      persistedAfterNavigation,
      timerRunningAfterNavigation,
      preservedAfterFailure,
      retryExists,
      overflow: await evaluate(
        "document.documentElement.scrollWidth>innerWidth+1",
      ),
    });
    await shot("recovered", width);
    await click("Close tools");
  }
  await writeFile(
    `docs/visual-checks/phase19-${stage}-journeys.json`,
    JSON.stringify(rows, null, 2),
  );
  console.log(rows);
  if (
    rows.some(
      (r) =>
        !r.persistedAcrossViews ||
        !r.persistedAfterNavigation ||
        !r.timerRunningAfterNavigation ||
        !r.preservedAfterFailure ||
        r.overflow ||
        (stage === "after" && !r.retryExists),
    )
  )
    throw Error("Journey regression");
} finally {
  close();
}
