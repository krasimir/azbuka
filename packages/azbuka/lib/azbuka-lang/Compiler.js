import postcss from "postcss";
import { NODE_TYPE, ALLOWED_PSEUDO_CLASSES } from "./constants.js";
import { normalizeLabel } from "../az.js";
import { toAST } from "./Parser.js";

export function astToRules(ast, options) {
  let rules = [];
  const { getStylesByClassName, cache = {}, config, currentSelector } = options
  const breakpoints = config.breakpoints;
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
        } else if (breakpoints?.media?.[variantSelector] || breakpoints?.container?.[variantSelector]) {
          let isMedia = !!breakpoints?.media?.[variantSelector];
          const breakpointValue = breakpoints?.media?.[variantSelector] || breakpoints?.container?.[variantSelector];
          let mediaRule;
          if (cache[breakpointValue]) {
            mediaRule = cache[breakpointValue];
          } else {
            mediaRule = cache[breakpointValue] = postcss.atRule({
              name: isMedia ? "media" : "container",
              params: breakpointValue
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
              const selector = currentSelector ? `.${currentSelector}` : `.${variantSelector}_${cls}`;
              const rule = createRule(selector, cls, true, 'media_' + selector);
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
          const callCurrentSelector = nodeToClassNames(node);
          let rule = createRule(`.${callCurrentSelector}`);
          (function handleMacro(node) {
            if (options.config.macros) {
              if (typeof options.config.macros[node.name] === "function") {
                const macro = options.config.macros[node.name];
                const macroArgs = node.args.map((arg) => {
                  if (arg.type === NODE_TYPE.TOKEN) {
                    return arg.value;
                  } else if (arg.type === NODE_TYPE.CALL) {
                    handleMacro(arg);
                  }
                }).filter(Boolean);
                try {
                  const ast = toAST(macro(macroArgs), options.cache);
                  const globalTokens = ast.filter(n => n.type === NODE_TYPE.TOKEN);
                  globalTokens.forEach((t) => appendStylesToRule(rule, t.value));
                  const rulesToAppend = astToRules(ast, { ...options, currentSelector: callCurrentSelector });
                  rulesToAppend.forEach((r) => rules.push(r));
                } catch (err) {
                  console.error(`azbuka: error executing macro "${node.name}": ${err}`);
                }
              } else if (node.args.length > 0) {
                node.args.forEach((arg) => {
                  if (arg.type === NODE_TYPE.TOKEN) {
                    appendStylesToRule(rule, arg.value);
                  } else if (arg.type === NODE_TYPE.CALL) {
                    handleMacro(arg);
                  }
                });
              }
            }
          })(node);
        break;

    }
  }

  function createRule(selector, pickStylesFrom = '', dontAddToGlobal = false, cacheKey = null) {
    let rule = cache[cacheKey ?? selector];
    if (!rule) {
      rule = cache[cacheKey ?? selector] = postcss.rule({ selector });
      if (!dontAddToGlobal) {
        rules.push(rule);
      }
    }
    appendStylesToRule(rule, pickStylesFrom);
    return rule;
  }
  function appendStylesToRule(rule, pickStylesFrom = '') {
    let decls = [];
    pickStylesFrom.split(" ").forEach((cn) => {
      if (cache["decls-" + cn]) {
        decls = decls.concat(cache["decls-" + cn]);
        return;
      }
      if (cn.trim() === "") return;
      decls = decls.concat((cache["decls-" + cn] = getStylesByClassName(cn)));
    });
    if (decls.length === 0) {
      return rule;
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
  const normal = [];
  const media = [];

  rules.forEach((rule) => {
    if (rule.type === "atrule" && rule.name === "media") {
      media.push(rule);
    } else {
      normal.push(rule);
    }
  });

  return [...normal, ...media].map((r) => r.toString()).join("\n");
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