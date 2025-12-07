import { writeFile } from "fs/promises";
const OUTPUT = "forgecss-media-queries.css";
import { getDeclarations } from "./processFile.js";
import { createMediaStyle, extractStyles } from "./styles.js";

export async function generateOutputCSS(config) {
  const cache = {};
  const declarations = getDeclarations();
  Object.keys(declarations).map((file) => {
    Object.keys(declarations[file]).forEach(async (label) => {
      try {
        createMediaStyle(config, label, declarations[file][label], cache);
      } catch (err) {
        console.error(`Error generating media query for label ${label} in file ${file}: ${err}`);
      }
    });
  });
  const result = Object.keys(cache)
    .map((label) => cache[label].mq.toString())
    .join("\n");
  await writeFile(
    config.output,
    `${result}`,
    "utf-8"
  );
}