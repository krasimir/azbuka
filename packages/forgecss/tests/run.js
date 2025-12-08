import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { getPath } from "./helpers.js";

function getCases(dir = getPath('/cases')) {
  const cases = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      cases.push(...getCases(filePath));
    } else if (file.endsWith("test.js")) {
      cases.push(filePath);
    }
  });

  return cases;
}
async function importTest(configPath) {
  const abs = path.resolve(configPath);
  const fileUrl = pathToFileURL(abs).href;

  const mod = await import(fileUrl);
  return mod.default ?? mod;
}

(async () => {
  const cases = getCases();
  for(let testFile of cases) {
    const test = await importTest(testFile);
    const testName = testFile.replace(process.cwd(), '');
    try {
      if (await test()) {
        console.log(`✅ ${testName}`);
      } else {
        console.error(`❌ ${testName}`);
      }
    } catch(err) {
      console.error(`❌ ${testName}`, err);
    }
  }
})();

