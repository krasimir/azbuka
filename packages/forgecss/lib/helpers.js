import postcss from "postcss";
import { getStylesByClassName } from "./inventory.js";

export function setDeclarations(selector, rule) {
  const decls = getStylesByClassName(selector);
  if (decls.length === 0) {
    console.warn(`forgecss: no class ".${selector}" found`);
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
}
