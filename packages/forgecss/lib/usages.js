let USAGES = {};

export async function findUsages(filePath, content, JSXParser) {
  try {
    if (USAGES[filePath]) {
      // already processed
      return;
    }
    USAGES[filePath] = [];
    const extension = filePath.split(".").pop().toLowerCase();

    // HTML
    if (extension === "html") {
      extractClassNamesFromHTML(content).forEach((cls) => {
        USAGES[filePath].push(cls);
      });
      return;
    }
    if (JSXParser && (extension === "jsx" || extension === "tsx")) {
      await JSXParser(content, USAGES, filePath);
      return;
    }
  } catch (err) {
    console.error(`forgecss: error processing file ${filePath.replace(process.cwd(), "")}`, err);
  }
}
export function invalidateUsageCache(filePath) {
  if (!filePath) {
    USAGES = {};
    return;
  }
  if (USAGES[filePath]) {
    delete USAGES[filePath];
  }
}
export function getUsages() {
  return USAGES;
}

function extractClassNamesFromHTML(html) {
  const result = [];
  const classAttrRE = /\bclass\s*=\s*(["'])(.*?)\1/gis;

  let match;
  while ((match = classAttrRE.exec(html))) {
    result.push(match[2].trim());
  }

  return result;
}