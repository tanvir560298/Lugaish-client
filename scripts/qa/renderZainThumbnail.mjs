import { send, evaluate, visit, close } from "./browserClient.mjs";
import { writeFile } from "node:fs/promises";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  await visit("http://127.0.0.1:4174/learning-spaces-preview", 1440);
  await evaluate("document.querySelector('.campus-avatar-button').click()");
  await sleep(1800);
  await evaluate(
    "[...document.querySelectorAll('.avatar-preview button')].find(b=>b.textContent==='Idle').click()",
  );
  await sleep(1200);
  const png = await evaluate(
    `(async()=>{const t=await fetch('/src/characters/CharacterPreview.jsx').then(r=>r.text()),url=t.match(/from "([^"]*@react-three_fiber[^"]*)"/)[1],m=await import(url),state=[...m._roots.values()][0].store.getState();const {scene,camera,gl}=state;let native;scene.traverse(o=>{if(o.userData.nativeCharacter)native=o});if(!native)throw Error('Native character is not loaded');scene.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh)o.visible=false});scene.background=null;gl.setClearColor(0,0);gl.setPixelRatio(1);gl.setSize(256,320,false);camera.position.set(1.05,1.15,3.1);camera.aspect=.8;camera.fov=34;camera.lookAt(0,.86,0);camera.updateProjectionMatrix();gl.render(scene,camera);return gl.domElement.toDataURL('image/png').split(',')[1]})()`,
  );
  await writeFile(
    "public/avatars/zain-quaternius.png",
    Buffer.from(png, "base64"),
  );
  console.log("Rendered the actual CC0 GLB to a transparent 256×320 PNG.");
} finally {
  close();
}
