import { send, evaluate, visit, close } from "./browserClient.mjs";
import { writeFile } from "node:fs/promises";
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const click = (label) =>
  evaluate(
    `(()=>{const e=[...document.querySelectorAll('button')].find(x=>x.getBoundingClientRect().width&&x.textContent.trim()===${JSON.stringify(label)});if(!e)throw Error('Missing '+${JSON.stringify(label)});e.click();})()`,
  );
const wait = async (expr) => {
  for (let i = 0; i < 160; i++) {
    if (await evaluate(expr)) return;
    await pause(300);
  }
  throw Error("Timed out " + expr);
};
const init = () =>
  evaluate(
    `(async()=>{const t=await fetch('/src/characters/CharacterPreview.jsx').then(r=>r.text());const u=t.match(/from "([^"]*@react-three_fiber[^"]*)"/)[1];window.qaRoots=(await import(u))._roots;window.qaScene=()=>[...qaRoots.values()][0]?.store.getState().scene;window.qaNative=()=>{let n;qaScene()?.traverse(o=>{if(o.userData.nativeCharacter)n=o});return n};})()`,
  );
const snapshot = () =>
  evaluate(
    `(()=>{const n=qaNative();if(!n)return {native:false};let meshes=[];n.traverse(o=>{if(o.isSkinnedMesh)meshes.push({name:o.name,bones:o.skeleton.bones.length})});return {native:true,meshes,animation:n.userData.animation,speeds:n.userData.clipSpeeds,leg:n.getObjectByName('UpperLegL').quaternion.toArray(),root:n.getWorldPosition(n.position.clone()).toArray()};})()`,
  );
const shot = async (name) => {
  const r = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(
    `docs/visual-checks/phase20-${name}.png`,
    Buffer.from(r.data, "base64"),
  );
};
const results = {};
try {
  await visit("http://127.0.0.1:4174/learning-spaces-preview", 1440);
  await evaluate(
    "localStorage.setItem('lugaish_chosen_character','zain');localStorage.removeItem('lugaish-personal-library-seat:local-preview')",
  );
  await visit("http://127.0.0.1:4174/learning-spaces-preview", 1440);
  await wait("!!document.querySelector('.campus-avatar-button')");
  await evaluate("document.querySelector('.campus-avatar-button').click()");
  await init();
  await wait("!!qaNative()");
  await pause(800);
  await click("Front");
  results.idle = await snapshot();
  await shot("preview-idle-desktop");
  for (const label of ["Walk", "Run"]) {
    await click(label);
    await pause(700);
    const a = await snapshot();
    await shot(`preview-${label.toLowerCase()}-1`);
    await pause(240);
    const b = await snapshot();
    await shot(`preview-${label.toLowerCase()}-2`);
    results[label.toLowerCase()] = {
      ...a,
      animated: a.leg.some((v, i) => Math.abs(v - b.leg[i]) > 0.005),
    };
  }
  await click("Idle");
  await click("Wave");
  await pause(700);
  results.wave = await snapshot();
  await shot("preview-wave");
  await click("Sit");
  await wait("qaNative()?.userData.animation==='seated'");
  await shot("preview-seated-native");
  results.seat = {
    native: true,
    notice: await evaluate(
      "document.querySelector('.avatar-preview').innerText.includes('authored sitting')",
    ),
  };
  await click("Idle");
  await wait("!!qaNative()");
  results.returnToNative = await snapshot();
  await click("Save avatar");
  await writeFile(
    "docs/visual-checks/phase20-animation-cycles.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
  if (
    !results.walk.animated ||
    !results.run.animated ||
    !results.wave.native ||
    !results.returnToNative.native
  )
    throw Error("Avatar cycle verification failed");
} finally {
  close();
}
