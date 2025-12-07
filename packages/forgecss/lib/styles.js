import { readFile } from "fs/promises";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";

const STYLES = [];

export async function extractStyles(filePath) {
  const content = await readFile(filePath, 'utf-8');
  STYLES.push(postcss.parse(content, { parser: safeParser }));
}
export function getStylesByClassName(selector) {
  const decls = [];
  for (let root of STYLES) {
    root.walkRules((rule) => {
      if (rule.selectors && rule.selectors.includes(`.${selector}`)) {
        rule.walkDecls((d) => {
          decls.push({ prop: d.prop, value: d.value, important: d.important });
        });
      }
    });
  }
  return decls;
}
export function createMediaStyle(config, label, selectors, cache) {
  if (!config.mapping.queries[label]) {
    throw new Error(
      `Unknown media query label: ${label}. Check app-fe/wwwroot/scripts/lib/generateMediaQueries.js for available mappings.`
    );
  }
  if (!cache[label]) {
    cache[label] = {
      mq: postcss.atRule({
        name: "media",
        params: `all and (${config.mapping.queries[label].query})`
      }),
      classes: {}
    };
  }
  const mq = cache[label].mq;
  selectors.forEach((selector) => {
    const prefixedSelector = `.${label}_${selector}`;
    if (cache[label].classes[prefixedSelector]) return;
    cache[label].classes[prefixedSelector] = true;
    const rule = postcss.rule({ selector: prefixedSelector });
    const decls = getStylesByClassName(selector);
    if (decls.length === 0) {
      console.warn(`Warning: No styles found for class .${selector} used in media query ${label}`);
      return;
    }
    decls.forEach((d) => {
      rule.append(
        postcss.decl({
          prop: d.prop,
          value: d.value,
          important: d.important
        })
      );
    });
    mq.append(rule);
  });
}