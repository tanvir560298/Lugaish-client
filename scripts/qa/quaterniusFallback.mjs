import { send, evaluate, visit, close } from "./browserClient.mjs";
import { writeFile } from "node:fs/promises";
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const wait = async (expr) => {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expr)) return;
    await pause(300);
  }
  throw Error("Timed out " + expr);
};
const init = () =>
  evaluate(
    `(async()=>{const t=await fetch('/src/characters/CharacterPreview.jsx').then(r=>r.text());const u=t.match(/from "([^"]*@react-three_fiber[^"]*)"/)[1];window.qaRoots=(await import(u))._roots;window.qaScene=()=>[...qaRoots.values()][0]?.store.getState().scene;window.qaNative=()=>{let n;qaScene()?.traverse(o=>{if(o.userData.nativeCharacter)n=o});return n};})()`,
  );
const open = async () => {
  await wait("!!document.querySelector('.campus-avatar-button')");
  await evaluate("document.querySelector('.campus-avatar-button').click()");
  await init();
};
const results = {};
try {
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Network.setBlockedURLs", { urls: ["*casual-character.glb*"] });
  await visit("http://127.0.0.1:4174/learning-spaces-preview", 1440);
  await send("Page.reload");
  await pause(800);
  await open();
  await wait("!!qaScene()?.getObjectByName('LugaishCartoonSkin')");
  await pause(500);
  results.failedLoad = {
    native: await evaluate("!!qaNative()"),
    fallback: true,
    savedZain: await evaluate(
      "localStorage.getItem('lugaish_chosen_character')==='zain'",
    ),
  };
  const shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(
    "docs/visual-checks/casual-failed-load-fallback.png",
    Buffer.from(shot.data, "base64"),
  );
  await send("Network.setBlockedURLs", { urls: [] });
  await send("Page.reload");
  await pause(800);
  await open();
  await wait("!!qaNative()");
  results.restoredNative = true;
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await send("Page.reload");
  await pause(800);
  await open();
  await wait("!!qaNative()");
  await pause(500);
  const a = await evaluate(
    "qaNative().getObjectByName('UpperLegL').quaternion.toArray()",
  );
  await pause(700);
  const b = await evaluate(
    "qaNative().getObjectByName('UpperLegL').quaternion.toArray()",
  );
  results.reducedMotion = {
    stablePose: a.every((v, i) => Math.abs(v - b[i]) < 1e-6),
    walkRunDisabled: await evaluate(
      "[...document.querySelectorAll('.avatar-preview button')].filter(b=>['Walk','Run'].includes(b.textContent)).every(b=>b.disabled)",
    ),
  };
  await send("Emulation.setEmulatedMedia", { features: [] });
  await send("Network.setCacheDisabled", { cacheDisabled: false });
  await writeFile(
    "docs/visual-checks/casual-fallback.json",
    JSON.stringify(results, null, 2),
  );
  console.log(results);
  if (
    results.failedLoad.native ||
    !results.failedLoad.savedZain ||
    !results.reducedMotion.stablePose ||
    !results.reducedMotion.walkRunDisabled
  )
    throw Error("Fallback assertions failed");
} finally {
  await send("Network.setBlockedURLs", { urls: [] });
  close();
}
