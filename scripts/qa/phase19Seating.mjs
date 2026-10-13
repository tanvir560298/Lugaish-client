import { send, evaluate, visit, close } from "./browserClient.mjs";
import { writeFile } from "node:fs/promises";
const pause = (ms) => new Promise((r) => setTimeout(r, ms)),
  report = {};
const wait = async (expr, limit = 160) => {
  for (let i = 0; i < limit; i++) {
    if (await evaluate(expr)) return;
    await pause(250);
  }
  throw Error("Timed out " + expr);
};
const click = (label) =>
  evaluate(
    `(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.getBoundingClientRect().width&&b.textContent.trim()===${JSON.stringify(label)});if(!b)throw Error('Missing '+${JSON.stringify(label)});b.click()})()`,
  );
const init = () =>
  evaluate(
    `(async()=>{const t=await fetch('/src/characters/CharacterPreview.jsx').then(r=>r.text()),u=t.match(/from "([^"]*@react-three_fiber[^"]*)"/)[1];window.qaRoots=(await import(u))._roots;window.qaState=()=>[...qaRoots.values()][0]?.store.getState();window.qaNative=()=>{let nodes=[];qaState()?.scene.traverse(o=>{if(o.userData.nativeCharacter)nodes.push(o)});return nodes.find(n=>{let o=n;while(o){if(!o.visible)return false;o=o.parent}return true})};})()`,
  );
const sample = () =>
  evaluate(
    `(()=>{const n=qaNative();if(!n)return {native:false};const p=name=>n.getObjectByName(name).getWorldPosition(n.position.clone()).toArray();return{native:true,identity:n.uuid,mesh:n.getObjectByName('Casual2_Body_1').uuid,animation:n.userData.animation,motion:n.userData.motionState,progress:n.userData.seatProgress,body:p('Body'),footL:p('FootL'),footR:p('FootR'),head:p('Head'),root:n.getWorldPosition(n.position.clone()).toArray()};})()`,
  );
const stage = process.env.QA_PASS || "before";
const shot = async (name) => {
  const s = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(
    `docs/visual-checks/phase19-${stage}-${name}.png`,
    Buffer.from(s.data, "base64"),
  );
};
const record = () =>
  evaluate(
    `(()=>{const c=document.querySelector('canvas'),stream=c.captureStream(12),mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(MediaRecorder.isTypeSupported);window.qaChunks=[];window.qaRecorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:800000});qaRecorder.ondataavailable=e=>{if(e.data.size)qaChunks.push(e.data)};qaRecorder.start();return mime})()`,
  );
const saveVideo = async (name) => {
  const b64 = await evaluate(
    `new Promise(resolve=>{qaRecorder.onstop=async()=>{const blob=new Blob(qaChunks,{type:qaRecorder.mimeType});const reader=new FileReader();reader.onload=()=>{qaRecorder.stream.getTracks().forEach(t=>t.stop());resolve(reader.result.split(',')[1])};reader.readAsDataURL(blob)};qaRecorder.stop()})`,
  );
  await writeFile(
    `docs/visual-checks/phase19-${stage}-${name}.webm`,
    Buffer.from(b64, "base64"),
  );
};
try {
  await visit("http://127.0.0.1:4174/learning-spaces-preview", 1440);
  await evaluate(
    "localStorage.setItem('lugaish_chosen_character','zain');localStorage.removeItem('lugaish-personal-library-seat:local-preview')",
  );
  await visit("http://127.0.0.1:4174/learning-spaces-preview", 1440);
  await pause(1000);
  await wait("!!document.querySelector('.campus-avatar-button')");
  await evaluate("document.querySelector('.campus-avatar-button').click()");
  await init();
  await wait("!!qaNative()");
  await pause(300);
  report.standing = await sample();
  await shot("standing");
  report.videoMime = await record();
  await click("Sit");
  await pause(650);
  report.lowering = await sample();
  await shot("sitting-transition");
  await wait("qaNative()?.userData.animation==='seated'");
  await pause(300);
  report.previewSeated = await sample();
  await shot("seated-preview");
  await click("Idle");
  await pause(400);
  report.rising = await sample();
  await shot("standing-transition");
  await wait("qaNative()?.userData.animation==='idle'");
  await pause(500);
  report.previewReturned = await sample();
  await saveVideo("sit-stand-continuity");
  await click("Save avatar");
  await visit("http://127.0.0.1:4174/study-room-preview", 1440);
  await wait("!!document.querySelector('canvas')");
  await init();
  await wait("!!qaNative()");
  report.libraryStanding = await sample();
  const image64 = await evaluate(
    `(()=>{const s=qaState(),v={set(x,y){this.x=x;this.y=y;return this}},old=s.gl.getSize(v),ratio=s.gl.getPixelRatio(),aspect=s.camera.aspect;s.gl.setPixelRatio(1);s.gl.setSize(1200,800,false);s.camera.aspect=1.5;s.camera.updateProjectionMatrix();s.gl.render(s.scene,s.camera);const image=s.gl.domElement.toDataURL('image/png').split(',')[1];s.gl.setPixelRatio(ratio);s.gl.setSize(old.x,old.y,false);s.camera.aspect=aspect;s.camera.updateProjectionMatrix();return image})()`,
  );
  await writeFile(
    "docs/visual-checks/phase19-library-preview-source.png",
    Buffer.from(image64, "base64"),
  );

  await click("Choose My Desk");
  await click("Accessible seat list");
  await evaluate(
    "document.querySelector('dialog[open] .sr-seat:not(:disabled)').click()",
  );
  await click("Sit Here");
  await pause(6500);
  report.libraryWalking = await sample();
  await shot("walking");
  // The existing table surface opens its own table camera; use a real projected mouse click.
  const target = await evaluate(
    `(()=>{const s=qaState(),r=s.gl.domElement.getBoundingClientRect(),p=s.scene.position.clone().set(-10.5,.78,-11).project(s.camera);return{x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2}})()`,
  );
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    button: "left",
    clickCount: 1,
    ...target,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    button: "left",
    clickCount: 1,
    ...target,
  });
  await wait(
    "(()=>{const n=qaNative();if(!n||n.userData.motionState!=='walk')return false;const p=n.getWorldPosition(n.position.clone());return Math.hypot(p.x+11.35,p.z+10)<1.4})()",
  );
  report.approach = await sample();
  await shot("approaching-chair");
  await wait("qaNative()?.userData.motionState==='sit'");
  report.libraryLowering = await sample();
  await shot("library-sit-down");
  await wait("qaNative()?.userData.animation==='seated'");
  await wait(
    "[...document.querySelectorAll('.sr-floating-dock button')].some(b=>b.textContent==='My Desk'&&b.getAttribute('aria-pressed')==='true')",
  );
  await pause(700);
  report.myDesk = await sample();
  await shot("my-desk");
  await record();
  await click("Seat menu");
  await click("Leave Table");
  await pause(200);
  report.libraryStand = await sample();
  await shot("library-stand-up");
  await pause(1600);
  report.libraryReturned = await sample();
  await saveVideo("library-stand-walk");
  await visit("http://127.0.0.1:4174/classroom-preview", 1440);
  await wait("!!document.querySelector('canvas')");
  await init();
  await click("Room view");
  await evaluate(
    "(()=>{const s=document.querySelector('[aria-label=\"Choose classroom desk\"]');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'s91');s.dispatchEvent(new Event('change',{bubbles:true}))})()",
  );
  await wait("qaNative()?.userData.animation==='seated'");
  await pause(700);
  report.classroom = await sample();
  await shot("classroom-seated");
  await evaluate(
    "(()=>{const s=document.querySelector('[aria-label=\"Choose classroom desk\"]');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'s92');s.dispatchEvent(new Event('change',{bubbles:true}))})()",
  );
  await wait("qaNative()?.userData.motionState==='stand'");
  report.classroomStand = await sample();
  await shot("classroom-standing-up");
  await visit("http://127.0.0.1:4174/learning-spaces-preview", 390);
  await evaluate("document.querySelector('.campus-avatar-button').click()");
  await init();
  await wait("!!qaNative()");
  await click("Sit");
  await wait("qaNative()?.userData.animation==='seated'");
  await evaluate(
    "document.querySelector('.avatar-preview').scrollIntoView({block:'center'})",
  );
  report.mobile = await sample();
  report.mobile.overflow = await evaluate(
    "document.documentElement.scrollWidth>innerWidth+1",
  );
  await shot("mobile-seated");
  await click("Cancel");
  await visit("http://127.0.0.1:4174/study-room-preview", 390);
  await click("Choose My Desk");
  await click("Accessible seat list");
  await evaluate(
    "document.querySelector('dialog[open] .sr-seat:not(:disabled)').click()",
  );
  await click("Sit Here");
  await pause(700);
  report.mobile2D = {
    canvas: await evaluate("!!document.querySelector('canvas')"),
    overflow: await evaluate(
      "document.documentElement.scrollWidth>innerWidth+1",
    ),
  };
  await shot("mobile-my-desk-2d");
  const ids = [
    report.standing,
    report.lowering,
    report.previewSeated,
    report.rising,
    report.previewReturned,
  ];
  report.previewIdentityStable = ids.every(
    (v) => v.native && v.mesh === ids[0].mesh,
  );
  const lib = [
    report.libraryStanding,
    report.libraryWalking,
    report.approach,
    report.libraryLowering,
    report.myDesk,
    report.libraryStand,
    report.libraryReturned,
  ];
  report.libraryIdentityStable = lib.every(
    (v) => v.native && v.mesh === lib[0].mesh,
  );
  await writeFile(
    `docs/visual-checks/phase19-${stage}-seating.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  if (
    !report.previewIdentityStable ||
    !report.libraryIdentityStable ||
    !report.classroom.native ||
    report.mobile.overflow
  )
    throw Error("Native identity or visual checks failed");
} finally {
  close();
}
