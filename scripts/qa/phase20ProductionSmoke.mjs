import { visit, evaluate, send, close } from "./browserClient.mjs";
import { writeFile } from "node:fs/promises";
const results = [];
try {
  await send("Page.enable");
  const hook = await send("Page.addScriptToEvaluateOnNewDocument", {
    source:
      "window.qaFaults=0;addEventListener('error',()=>qaFaults++);addEventListener('unhandledrejection',()=>qaFaults++);",
  });
  for (const width of [1440, 768, 390])
    for (const route of ["/", "/pricing", "/login"]) {
      await visit("http://127.0.0.1:4176" + route, width);
      if (width === 390)
        await send("Emulation.setDeviceMetricsOverride", {
          width,
          height: 844,
          deviceScaleFactor: 1,
          mobile: false,
        });
      await new Promise((resolve) => setTimeout(resolve, 600));
      const row = await evaluate(
        `({route:location.pathname,width:innerWidth,faults:qaFaults,crash:document.body.textContent.includes('This page could not load'),overflow:document.documentElement.scrollWidth>innerWidth+1,devPreviewLink:!!document.querySelector('a[href$="-preview"]')})`,
      );
      results.push(row);
      if (row.crash || row.overflow || row.faults || row.devPreviewLink)
        throw Error("Compiled production smoke failed");
    }
  await send("Page.removeScriptToEvaluateOnNewDocument", {
    identifier: hook.identifier,
  });
  await writeFile(
    "docs/visual-checks/phase20-production-smoke.json",
    JSON.stringify(
      { localCompiledBuild: true, publicDeployment: false, results },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(results));
} finally {
  close();
}
