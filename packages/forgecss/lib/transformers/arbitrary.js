import postcss from "postcss";

import { normalizeLabel } from "../../client/fx.js";
import { setDeclarations } from "../helpers.js";

export default function arbitraryTransformer(label, selectors, bucket) {
  if (label.startsWith("[") && label.endsWith("]")) {
    const arbitrarySelector = label.slice(1, -1).trim();
    selectors.forEach((selector) => {
      const key = normalizeLabel(label + ':' + selector);
      let transformedSelector = `.${arbitrarySelector.replace(/[&]/g, key)}`;
      if (transformedSelector === '.true?') {
        return;
      }
      const root = postcss.root();
      if (bucket[transformedSelector]) {
        // already have that
        return;
      }
      const rule = postcss.rule({
        selector: transformedSelector
      });
      setDeclarations(selector, rule);
      root.append(rule);
      bucket[transformedSelector] = root;
    });
    return true;
  }
  return false;
}
