import postcss from "postcss";
import { NODE_TYPE, ALLOWED_PSEUDO_CLASSES } from "./constants.js";
import { normalizeLabel } from "../az.js";
import { toAST } from "./Parser.js";

export function astToRules(ast, options) {
  let rules = [];
  const { getStylesByClassName, cache = {}, config, currentSelector } = options
  // console.log(
  //   "\n====================================================================== ^\n",
  //   JSON.stringify(ast, null, 2)
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
            let selector = currentSelector ?? `.${variantSelector}_${cls}`;
            createRule(`${selector}:${variantSelector}`, cls);
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
            childRules.forEach((r) => {
              if (!hasRuleWithSelector(mediaRule, r.selector)) {
                mediaRule.append(r);
              }
            });
          } else {
            classes.forEach((cls) => {
              const selector = `.${variantSelector}_${cls}`;
              const rule = createRule(selector, cls, true);
              if (!rule || !mediaRule) return;
              if (!hasRuleWithSelector(mediaRule, selector)) {
                mediaRule.append(rule);
              }
            });
          }
        } else if (node.payload?.type === NODE_TYPE.TOKEN && node.simple === true) {
          console.warn(`azbuka: there is no breakpoint defined for label "${variantSelector}".`);
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
            const I = currentSelector ?? normalizeLabel(variantSelector) + "_" + cls;
            const selector = evaluateArbitrary(variantSelector, I);
            createRule(selector, cls);
          })
        }
        break;

        case NODE_TYPE.CALL:
          function handleMacro(node, currentRule) {
            let rule = currentRule;
            function registerRule(pickStylesFrom) {
              if (!rule) {
                rule = createRule(`.${nodeToClassNames(node)}`, pickStylesFrom);
              } else {
                appendStylesToRule(rule, pickStylesFrom);
              }
            }
            if (options.config.macros) {
              if (typeof options.config.macros[node.name] === "function") {
                const macro = options.config.macros[node.name];
                const macroArgs = node.args.map((arg) => {
                  if (arg.type === NODE_TYPE.TOKEN) {
                    return arg.value;
                  }
                });
                try {
                  let newStr = macro(macroArgs);
                  if (newStr) {
                    if (Array.isArray(newStr)) {
                      newStr = newStr.join(" ");
                    }
                  }
                  const ast = toAST(newStr, options.cache);
                  const rulesToAppend = astToRules(ast, { ...options, currentSelector: nodeToClassNames(node) });
                  rulesToAppend.forEach(r => {
                    rules.push(r);
                  });
                } catch (err) {
                  console.error(`azbuka: error executing macro "${node.name}": ${err}`);
                }
              } else if (node.args.length > 0) {
                node.args.forEach((arg) => {
                  if (arg.type === NODE_TYPE.TOKEN) {
                    registerRule(arg.value);
                  } else if (arg.type === NODE_TYPE.CALL) {
                    handleMacro(arg, rule);
                  }
                });
              }
            }
          }
          handleMacro(node);
        break;

    }
  }

  function createRule(selector, pickStylesFrom, dontAddToGlobal = false) {
    let rule = cache[selector];
    if (!rule) {
      rule = cache[selector] = postcss.rule({ selector });
      if (!dontAddToGlobal) {
        rules.push(rule);
      }
    }
    let decls = [];
    pickStylesFrom.split(' ').forEach(cn => {
      if (cn.trim() === "") return;
      decls = decls.concat(getStylesByClassName(cn));
    });
    if (decls.length === 0) {
      return;
    }
    decls.forEach((d) => {
      if (rule.some((existingDecl) => existingDecl.prop === d.prop)) {
        return;
      }
      rule.append(
        postcss.decl({
          prop: d.prop,
          value: d.value,
          important: d.important
        })
      );
    });
    return rule;
  }
  function appendStylesToRule(rule, pickStylesFrom) {
    let decls = [];
    pickStylesFrom.split(' ').forEach(cn => {
      if (cn.trim() === "") return;
      decls = decls.concat(getStylesByClassName(cn));
    });
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
  function hasRuleWithSelector(container, selector) {
    if (!container.nodes) return false;

    return container.nodes.some((node) => node.type === "rule" && node.selector === selector);
  }
  
  return rules;
}

export function rulesToCSS(rules) {
  return rules.map((r) => r.toString()).join("\n");
}

export function nodeToClassNames(node) {
  let classNameBits = '';
  switch (node.type) {
    case NODE_TYPE.TOKEN:
      return normalizeLabel(node.value);
    case NODE_TYPE.VARIANT:
      if (Array.isArray(node.selector)) {
        node.selector.forEach(sel => {
          classNameBits = (classNameBits !== "" ? classNameBits + "-" : classNameBits) + nodeToClassNames(sel);
        })
      } else {
        classNameBits = normalizeLabel(node.selector);
      }
      if (node.payload) {
        const clses = (node?.payload?.value ?? "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
        return clses.map(cls => {
          return classNameBits + "_" + cls;
        }).join(' ');
      } else {
        return classNameBits;
      }
    case NODE_TYPE.CALL:
      classNameBits = node.name;
      node.args.forEach(arg => {
        classNameBits = classNameBits + "-" + nodeToClassNames(arg);
      });
      return classNameBits;
  }
}