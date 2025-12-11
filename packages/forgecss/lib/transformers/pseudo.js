import postcss from "postcss";

import {setDeclarations} from "../helpers.js";
import {normalizeLabel} from "../../client/fx.js";

const ALLOWED_PSEUDO_CLASSES = [
  "hover",
  "active",
  "focus",
  "focus-visible",
  "focus-within",
  "disabled",
  "enabled",
  "read-only",
  "read-write",
  "checked",
  "indeterminate",
  "valid",
  "invalid",
  "required",
  "optional",
  "in-range",
  "out-of-range",
  "placeholder-shown",
  "autofill",
  "user-invalid"
];

export default function pseudoClassTransformer(label, selectors, bucket) {
  if (ALLOWED_PSEUDO_CLASSES.includes(label)) {
    selectors.forEach((selector) => {
      const key = normalizeLabel(label + ':' + selector);
      const transformedSelector = `.${key}:${label}`;
      const root = postcss.root();
      if (bucket[transformedSelector]) {
        // already have that
        return;
      }
      const rule = postcss.rule({ selector: transformedSelector });
      setDeclarations(selector, rule);
      root.append(rule);
      bucket[transformedSelector] = root;
    });
    return true;
  }
  return false;
}
