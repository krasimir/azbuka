import postcss from "postcss";

import { getStylesByClassName } from "../inventory.js";

export default function mediaQueryTransformer(config, label, selectors, bucket) {
  if (!config?.mapping?.queries[label]) {
    return false;
  }
  if (!bucket[label]) {
    bucket[label] = {
      rules: postcss.atRule({
        name: "media",
        params: `all and (${config.mapping.queries[label]})`
      }),
      classes: {}
    };
  }
  const rules = bucket[label].rules;
  selectors.forEach((selector) => {
    const prefixedSelector = `.${label}_${selector}`;
    if (bucket[label].classes[prefixedSelector]) {
      return;
    }
    bucket[label].classes[prefixedSelector] = true;
    const rule = postcss.rule({ selector: prefixedSelector });
    const decls = getStylesByClassName(selector);
    if (decls.length === 0) {
      console.warn(`forgecss: no styles found for class ".${selector}" used in media query "${label}"`);
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
    rules.append(rule);
  });
  return true;
}
