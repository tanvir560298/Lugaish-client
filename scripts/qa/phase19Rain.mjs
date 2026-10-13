import { visit, evaluate, send, close } from "./browserClient.mjs";
import { writeFile } from "node:fs/promises";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function wait(expr) {
  for (let n = 0; n < 80; n++) {
    if (await evaluate(expr)) return;
    await delay(150);
  }
  throw Error("Timeout " + expr);
}
async function click(text) {
  await send("Runtime.evaluate", {
    expression: `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)}).click()`,
    userGesture: true,
  });
  await delay(200);
}
try {
  const injection = await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.qaAudioContexts=[];window.qaAudioSources=[];window.qaAudioGains=[];const Native=window.AudioContext;window.AudioContext=class extends Native{constructor(...args){super(...args);qaAudioContexts.push(this)}createBufferSource(){const source=super.createBufferSource();qaAudioSources.push(source);return source}createGain(){const gain=super.createGain();qaAudioGains.push(gain);return gain}};`,
  });
  await visit("http://127.0.0.1:4174/study-room-preview", 390);
  await wait('!!document.querySelector(".ls-ambience")');
  await evaluate('document.querySelector(".ls-ambience").open=true');
  await click("Play rain");
  await wait(
    'document.querySelector(".ls-ambience summary").textContent.includes("Rain playing")',
  );
  const initial = await evaluate(
    "({contexts:qaAudioContexts.length,loop:qaAudioSources.at(-1).loop,duration:qaAudioSources.at(-1).buffer.duration,state:qaAudioContexts.at(-1).state})",
  );
  if (
    initial.contexts !== 1 ||
    !initial.loop ||
    initial.duration < 20 ||
    initial.state !== "running"
  )
    throw Error("Rain did not actually decode/loop");
  await evaluate(
    `(()=>{const e=document.querySelector('[aria-label="Rain volume"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'36');e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))})()`,
  );
  await delay(1000);
  const volume = await evaluate("qaAudioGains.at(-1).gain.value");
  if (Math.abs(volume - 0.18) > 0.01) throw Error("Gain did not follow volume");
  await evaluate('document.querySelector(".ls-ambience").open=false');
  await click("Study Tools");
  await click("Notes");
  if ((await evaluate("qaAudioContexts.length")) !== 1)
    throw Error("Tools duplicated audio context");
  await click("Close tools");
  await evaluate('document.querySelector(".ls-ambience").open=true');
  await click("Pause rain");
  await wait(
    'document.querySelector(".ls-ambience summary").textContent.includes("Rain paused")',
  );
  await click("Play rain");
  await wait(
    'document.querySelector(".ls-ambience summary").textContent.includes("Rain playing")',
  );
  await evaluate('document.querySelector("a.ls-back").click()');
  await wait('qaAudioContexts.every(c=>c.state==="closed")');
  await send("Page.removeScriptToEvaluateOnNewDocument", {
    identifier: injection.identifier,
  });
  await writeFile(
    "docs/visual-checks/phase19-rain.json",
    JSON.stringify(
      {
        decodedLicensedAsset: true,
        loop: true,
        volume: true,
        playPause: true,
        toolsDoNotDuplicateContext: true,
        navigationClosesContext: true,
        physicalAudioDeviceTested: false,
      },
      null,
      2,
    ),
  );
  console.log(
    "Real rain asset decoded and loops; volume, pause/resume, tools and navigation cleanup passed.",
  );
} finally {
  close();
}
