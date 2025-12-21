import postcss from "postcss";
import { NODE_TYPE, ALLOWED_PSEUDO_CLASSES } from "./constants.js";
import { minifyCSS } from './utils.js'
import { normalizeLabel } from "../../client/fx.js";

export function compileAST(ast, options) {
  let rules = [];
  const { getStylesByClassName, breakpoints, cache = {} } = options
  console.log(JSON.stringify(ast, null, 2));

  for(let node of ast) {
    switch (node.type) {
      case NODE_TYPE.TOKEN:
        // ignoring ... just tokens
        break;
      case NODE_TYPE.VARIANT:
        let variantSelector = node.selector;
        let classes = (node?.payload?.value ?? "").split(",").map((c) => c.trim()).filter(Boolean);
        let childRules;
        if (!node.payload.value && typeof node.payload === 'object') {
          const result = compileAST([node.payload], options);
          childRules = result.rules;
        }

        // -------------------------------------------------------- pseudo
        if (ALLOWED_PSEUDO_CLASSES.includes(variantSelector)) {
          classes.forEach(cls => {
            let selector = `${variantSelector}_${cls}`;
            const rule = createRule(`${selector}:${variantSelector}`, cls, cache);
            if (rule) {
              rules.push(rule);
            }
          });
        // -------------------------------------------------------- media queries
        } else if (breakpoints[variantSelector]) {
          let mediaRule;
          if (cache[breakpoints[variantSelector]]) {
            mediaRule = cache[breakpoints[variantSelector]];
          } else {
            mediaRule = cache[breakpoints[variantSelector]] = postcss.atRule({
              name: "media",
              params: `all and ${breakpoints[variantSelector]}`
            });
            rules.push(mediaRule);
          }
          if (childRules) {
            childRules.forEach(r => {
              mediaRule.append(r);
            })
          } else {
            classes.forEach((cls) => {
              let selector = `${variantSelector}_${cls}`;
              const rule = createRule(selector, cls, cache);
              if (rule) {
                mediaRule.append(rule);
              }
            });
          }
        // -------------------------------------------------------- arbitrary
        } else {
          classes.forEach(cls => {
            if (Array.isArray(variantSelector)) {
              variantSelector = variantSelector
                .map(({ type, value, selector, payload }) => {
                  if (type === "token") {
                    return value;
                  }
                })
                .filter(Boolean)
                .join(" ");
            }
            if (["", "true"].includes(variantSelector)) {
              return;
            }
            const I = normalizeLabel(variantSelector) + "_" + cls;
            const selector = evaluateArbitrary(variantSelector, I);
            const rule = createRule(selector, cls, cache);
            if (rule) {
              rules.push(rule);
            }
          })
        }
        break;
    }
  }

  return {
    rules,
    css: minifyCSS(rules.map((r) => r.toString()).join(""))
  };

  function createRule(selector, pickStylesFrom, cache = {}) {
    if (cache[selector]) {
      return;
    }
    pickStylesFrom = pickStylesFrom.split(",").map((c) => c.trim()).filter(Boolean);
    if (pickStylesFrom.length === 0) {
      return;
    }
    const newRule = cache[selector] = postcss.rule({ selector });
    pickStylesFrom.forEach((className) => setDeclarations(className, newRule));
    return newRule;
  }
  function setDeclarations(selector, rule) {
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
  function evaluateArbitrary(variant, I) {
    variant = variant.replace(/[&]/g, `.${I}`);
    return variant;
  }
}