import { visit, evaluate, send, close } from "./browserClient.mjs";
import { writeFile } from "node:fs/promises";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function click(label) {
  await send("Runtime.evaluate", {
    expression: `[...document.querySelectorAll('button')].find(e=>e.textContent.trim()===${JSON.stringify(label)}).click()`,
    userGesture: true,
  });
  await delay(200);
}

try {
  await visit("http://127.0.0.1:4174/speaking-preview", 390);
  await delay(500);
  await evaluate(
    `window.qaStreams=[];window.qaGetMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async c=>{const s=await window.qaGetMedia(c);window.qaStreams.push(s);return s}`,
  );
  await click("Record my voice");
  await delay(1700);
  if (
    !(await evaluate(`document.body.textContent.includes('Microphone active')`))
  )
    throw Error("Not recording");
  await click("Stop recording");
  await delay(700);
  if (
    !(await evaluate(
      `document.body.textContent.includes('Your recording is ready')`,
    ))
  )
    throw Error("Recording not ready");
  await click("Play my recording");
  await delay(250);
  if (
    !(await evaluate(
      `document.body.textContent.includes('Playing your recording')`,
    ))
  )
    throw Error("Playback not active");
  await click("Delete recording");
  await delay(200);
  if (
    await evaluate(
      `!![...document.querySelectorAll('button')].find(b=>b.textContent==='Play my recording')`,
    )
  )
    throw Error("Audio not deleted");
  await click("Record my voice");
  await delay(500);
  await evaluate(
    `document.querySelector('a[href="/learning-spaces"]').click()`,
  );
  await delay(400);
  const stopped = await evaluate(
    `window.qaStreams.every(s=>s.getTracks().every(t=>t.readyState==='ended'))`,
  );
  if (!stopped) throw Error("Track leak");
  await writeFile(
    `docs/visual-checks/${process.env.QA_STAGE||"phase10"}-voice.json`,
    JSON.stringify(
      {
        syntheticMicrophone: true,
        physicalDeviceTested: false,
        record: true,
        play: true,
        delete: true,
        navigationStopsTracks: stopped,
      },
      null,
      2,
    ),
  );
  console.log(
    "Independent local recording, playback, deletion and navigation cleanup passed (synthetic microphone).",
  );
} finally {
  close();
}
