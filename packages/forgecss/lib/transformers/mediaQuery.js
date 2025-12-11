import postcss from "postcss";

import { setDeclarations } from "../helpers.js";
import {normalizeLabel} from "../../client/fx.js";

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
    const prefixedSelector = `.${normalizeLabel(label + ':' + selector)}`;
    if (bucket[label].classes[prefixedSelector]) {
      return;
    }
    bucket[label].classes[prefixedSelector] = true; // caching
    const rule = postcss.rule({ selector: prefixedSelector });
    setDeclarations(selector, rule);
    rules.append(rule);
  });
  return true;
}
