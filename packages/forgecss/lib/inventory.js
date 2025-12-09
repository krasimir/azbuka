import { readFile } from "fs/promises";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";

let INVENTORY = {};

export async function extractStyles(filePath, css = null) {
  const content = css !== null ? css : await readFile(filePath, 'utf-8');
  INVENTORY[filePath] = postcss.parse(content, { parser: safeParser });
}
export function getStylesByClassName(selector) {
  const decls = [];
  Object.keys(INVENTORY).forEach((filePath) => {
    INVENTORY[filePath].walkRules((rule) => {
      if (rule.selectors && rule.selectors.includes(`.${selector}`)) {
        rule.walkDecls((d) => {
          decls.push({ prop: d.prop, value: d.value, important: d.important });
        });
      }
    });
  });
  return decls;
}
export function invalidateInvetory() {
  INVENTORY = {};
}