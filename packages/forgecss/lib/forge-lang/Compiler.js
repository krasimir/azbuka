import postcss from "postcss";
import { NODE_TYPE, ALLOWED_PSEUDO_CLASSES } from "./constants.js";
import { normalizeLabel } from "../fx.js";

export function astToRules(ast, options) {
  let rules = [];
  const { getStylesByClassName, cache = {}, config } = options
  // console.log(
  //   "\n====================================================================== ^\n",
  //   JSON.stringify(ast, null, 2),
  //   "\n====================================================================== $\n"
  // );

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
          childRules = astToRules([node.payload], options);
        }

        // -------------------------------------------------------- pseudo
        if (ALLOWED_PSEUDO_CLASSES.includes(variantSelector)) {
          classes.forEach(cls => {
            let selector = `.${variantSelector}_${cls}`;
            const rule = createRule(`${selector}:${variantSelector}`, cls, cache);
            if (rule) {
              rules.push(rule);
            }
          });
        // -------------------------------------------------------- media queries
        } else if (config.breakpoints[variantSelector]) {
          let mediaRule;
          if (cache[config.breakpoints[variantSelector]]) {
            mediaRule = cache[config.breakpoints[variantSelector]];
          } else {
            mediaRule = cache[config.breakpoints[variantSelector]] = postcss.atRule({
              name: "media",
              params: config.breakpoints[variantSelector]
            });
            rules.push(mediaRule);
          }
          if (childRules) {
            childRules.forEach(r => {
              mediaRule.append(r);
            })
          } else {
            classes.forEach((cls) => {
              let selector = `.${variantSelector}_${cls}`;
              const rule = createRule(selector, cls, cache);
              if (rule) {
                mediaRule.append(rule);
              }
            });
          }
        } else if (node.payload?.type === NODE_TYPE.TOKEN && node.simple === true) {
          console.warn(`forgecss: there is no breakpoint defined for label "${variantSelector}".`);
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
        case NODE_TYPE.CALL:
          if(options.config.macros && typeof options.config.macros[node.name] === 'function') {
            const macro = options.config.macros[node.name];
            const macroArgs = node.args.map(arg => {
              if (arg.type === NODE_TYPE.TOKEN) {
                return arg.value;
              }
            });
            let newStr = macro(macroArgs);
            if (newStr) {
              if (Array.isArray(newStr)) {
                newStr = newStr.join(" ");
              }
            }
          }
        break;
    }
  }

  function createRule(selector, pickStylesFrom, cache = {}) {
    if (cache[selector]) {
      return;
    }
    const newRule = cache[selector] = postcss.rule({ selector });
    const decls = getStylesByClassName(pickStylesFrom);
    if (decls.length === 0) {
      return;
    }
    decls.forEach((d) => {
      newRule.append(
        postcss.decl({
          prop: d.prop,
          value: d.value,
          important: d.important
        })
      );
    });
    return newRule;
  }
  function evaluateArbitrary(variant, I) {
    variant = variant.replace(/[&]/g, `.${I}`);
    return variant;
  }
  
  return rules;
}

export function rulesToCSS(rules) {
  return rules.map((r) => r.toString()).join("\n");
}