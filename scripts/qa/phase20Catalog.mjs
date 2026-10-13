import { readFile, writeFile } from "node:fs/promises";
import { visit, evaluate, send, close } from "./browserClient.mjs";
const session = JSON.parse(
  await readFile("/tmp/lugaish-phase19-fixture-session.json", "utf8"),
);
const base = "http://127.0.0.1:4175",
  rows = [],
  pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function wait(expression) {
  for (let i = 0; i < 120; i++) {
    if (await evaluate(expression)) return;
    await pause(150);
  }
  throw Error("Catalog check timed out: " + expression);
}
async function identify(user, role) {
  await visit(base, 1440);
  await evaluate(
    `localStorage.clear();localStorage.setItem('lugaish_auth_token',${JSON.stringify(user.token)});localStorage.setItem('lugaish_state_v1',JSON.stringify({isLoggedIn:true,userEmail:${JSON.stringify(user.email)},userRole:${JSON.stringify(role)},activePathway:'english',enrolledPathways:[]}));localStorage.setItem('lugaish_tanvir_courses_v7',JSON.stringify([{id:'old-course',title:'OLD QA COURSE'}]));localStorage.setItem('lugaish_tanvir_courses_v8',JSON.stringify([{id:'old-course',title:'OLD QA COURSE'}]));`,
  );
}
async function screenshot(name) {
  const r = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(
    "docs/visual-checks/phase20-" + name + ".png",
    Buffer.from(r.data, "base64"),
  );
}
async function api(path, body) {
  const r = await fetch("http://127.0.0.1:5016/api/" + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + session.staff.token,
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw Error("Isolated authoring failed: " + path + " " + r.status);
  return r.json();
}
try {
  await identify(session.unenrolled, "learner");
  for (const width of process.env.QA_ONLY_ADMIN === "1" ? [] : [1440, 768, 390])
    for (const path of [
      "/pricing",
      "/daily-lessons",
      "/course/english",
      "/course/paid_batch",
      "/course/ielts-foundation",
      "/profile",
    ]) {
      await visit(base + path, width);
      if (width === 390)
        await send("Emulation.setDeviceMetricsOverride", {
          width,
          height: 844,
          deviceScaleFactor: 1,
          mobile: false,
        });
      await pause(500);
      const result = await evaluate(
        `({width:innerWidth,path:location.pathname,crash:document.body.textContent.includes('This page could not load'),oldCourse:document.body.textContent.includes('OLD QA COURSE'),overflow:document.documentElement.scrollWidth>innerWidth+1,enrollButton:[...document.querySelectorAll('button')].some(b=>/Request enrollment|Enroll now/i.test(b.textContent))})`,
      );
      rows.push(result);
      if (
        result.crash ||
        result.oldCourse ||
        result.overflow ||
        result.enrollButton
      )
        throw Error("Empty or stale route failed: " + path);
      await screenshot(path.slice(1).replaceAll("/", "-") + "-" + width);
    }
  await identify(session.staff, "web_developer");
  await visit(base + "/manage-courses", 1440);
  await wait("!!document.querySelector('.course-editor')");
  await evaluate(
    `(()=>{for(const [label,value]of[['Course title','ISOLATED PHASE 20 COURSE'],['Description','Developer verification only']]){const e=[...document.querySelectorAll('.course-editor label')].find(l=>l.textContent.trim().startsWith(label)).querySelector('input,textarea');Object.getOwnPropertyDescriptor(e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set.call(e,value);e.dispatchEvent(new Event('input',{bubbles:true}));}})()`,
  );
  await pause(200);
  await evaluate("document.querySelector('.course-editor').requestSubmit()");
  await wait(
    "document.querySelector('[role=status]')?.textContent.includes('Course saved')",
  );
  await screenshot("admin-course-draft-1440");
  await api("lessons/english/1/module", {
    moduleType: "video",
    title: "ISOLATED NEW LESSON",
    description: "Developer verification only",
    published: true,
  });
  await api("courses/manage/english/lessons/1/content", {
    quiz: [
      {
        question: "Choose a greeting",
        options: ["Hello", "Goodbye"],
        correctAnswer: 0,
      },
    ],
    materials: [],
  });
  await api("courses/manage/english/lessons/1/publication", {
    status: "published",
  });
  await api("courses/manage/english", {
    title: "ISOLATED PHASE 20 COURSE",
    description: "Developer verification only",
    status: "published",
  });
  await identify(session, "learner");
  await visit(base + "/pricing", 390);
  await wait("!!document.querySelector('a[href=\"/course/english\"]')");
  await screenshot("new-published-catalog-390");
  await visit(base + "/course/english", 390);
  await wait(
    "document.querySelector('h1')?.textContent==='ISOLATED PHASE 20 COURSE'",
  );
  const newlyPublishedVisible = await evaluate(
    "document.body.textContent.includes('1 published lessons')",
  );
  await screenshot("new-published-course-390");
  await api("courses/manage/english", {
    title: "ISOLATED PHASE 20 COURSE",
    status: "archived",
  });
  await visit(base + "/course/english", 390);
  await wait("document.body.textContent.includes('No classes available yet')");
  const archivedHidden = await evaluate(
    "!document.body.textContent.includes('ISOLATED PHASE 20 COURSE')",
  );
  const report = {
    isolatedFixture: true,
    emptyAndStaleChecks: rows,
    adminDraftViaUI: true,
    publishedViaAuthorizedApi: true,
    newlyPublishedVisible,
    archivedHidden,
    physicalDevicesTested: false,
  };
  await writeFile(
    "docs/visual-checks/phase20-catalog.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
  if (!newlyPublishedVisible || !archivedHidden)
    throw Error("Publication visibility failed");
} finally {
  close();
}
