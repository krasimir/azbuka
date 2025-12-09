import postcss from "postcss";
import { getStylesByClassName } from "../inventory.js";

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
  if (!ALLOWED_PSEUDO_CLASSES.includes(label)) {
    return false;
  }
  const root = postcss.root();
  selectors.forEach((selector) => {
    const key = `${label}_${selector}`;
    if (bucket[key]) {
      // already have that
      return;
    }
    const rule = postcss.rule({ selector: `.${key}:${label}` });
    const decls = getStylesByClassName(selector);
    if (decls.length === 0) {
      console.warn(`forgecss: no styles found for class ".${selector}" used in state class "${label}"`);
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
    root.append(rule);
    bucket[key] = root;
  });
  return true;
}
