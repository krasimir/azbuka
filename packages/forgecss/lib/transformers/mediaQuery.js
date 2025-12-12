import postcss from "postcss";

import { setDeclarations } from "../helpers.js";
import {normalizeLabel} from "../../client/fx.js";

export default function mediaQueryTransformer(config, label, classes, bucket) {
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
  classes.forEach((cls) => {
    const selector = `.${normalizeLabel(label)}--${cls}`;
    if (bucket[label].classes[selector]) {
      return;
    }
    bucket[label].classes[selector] = true; // caching
    const rule = postcss.rule({ selector });
    setDeclarations(cls, rule);
    rules.append(rule);
  });
  return true;
}
