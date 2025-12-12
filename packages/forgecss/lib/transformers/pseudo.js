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

export default function pseudoClassTransformer(label, classes, bucket) {
  if (ALLOWED_PSEUDO_CLASSES.includes(label)) {
    classes.forEach((cls) => {
      const selector = `.${normalizeLabel(label)}--${cls}:${label}`;
      const root = postcss.root();
      if (bucket[selector]) {
        // already have that
        return;
      }
      const rule = postcss.rule({ selector });
      setDeclarations(cls, rule);
      root.append(rule);
      bucket[selector] = root;
    });
    return true;
  }
  return false;
}
