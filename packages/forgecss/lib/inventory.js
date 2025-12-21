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
  if (decls.length === 0) {
    console.warn(`forgecss: no styles found for class "${selector}".`);
  }
  return decls;
}
export function invalidateInventory(filePath) {
  if (!filePath) {
    INVENTORY = {};
    return;
  }
  if (INVENTORY[filePath]) {
    delete INVENTORY[filePath];
  }
}
export function resolveApplys() {
  let resolvedApplies;
  Object.keys(INVENTORY).forEach((filePath) => {
    INVENTORY[filePath].walkRules((rule) => {
      rule.walkDecls((d) => {
        if (d.prop === '--apply') {
          const classesToApply = d.value.split(' ').map(c => c.trim()).filter(Boolean);
          const newRule = postcss.rule({ selector: rule.selector });
          classesToApply.forEach((className) => {
            const styles = getStylesByClassName(className);
            styles.forEach((style) => {
              newRule.append({
                prop: style.prop,
                value: style.value,
                important: style.important
              });
            });
          });
          if (!resolvedApplies) {
            resolvedApplies = postcss.root();
          }
          resolvedApplies.append(newRule);
        }
      });
    });
  });
  return resolvedApplies;
}