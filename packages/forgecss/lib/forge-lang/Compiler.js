import postcss from "postcss";
import { NODE_TYPE, ALLOWED_PSEUDO_CLASSES } from "./constants.js";
import { minifyCSS } from './utils.js'

export function compileClassAST(ast, getStylesByClassName) {
  let resultClasses = [];
  let rules = [];

  function visitor(node, context = {}) {
    if (Array.isArray(node)) {
      return ast.forEach((n) => visitor(n, context));
    }
    if (node.type === NODE_TYPE.TOKEN && !context.parent) {
      resultClasses.push(node.value);
    } else if (node.type === NODE_TYPE.VARIANT) {
      const nodeClassName = generateClass(node);
      resultClasses.push(nodeClassName);
      if (ALLOWED_PSEUDO_CLASSES.includes(node.selector)) {
        rules.push(createRule(
          `${nodeClassName}:${node.selector}`,
          node.payload.value
        ));
      }
    }
  }

  visitor(ast);
  return {
    classValue: resultClasses.join(" "),
    rules,
    css: minifyCSS(rules.map((r) => r.toString()).join(''))
  };

  function createRule(selector, pickStylesFrom) {
    pickStylesFrom = pickStylesFrom.split(',').map(c => c.trim()).filter(Boolean);
    const newRule = postcss.rule({ selector: selector });
    pickStylesFrom.forEach((className) => {
      const styles = getStylesByClassName(className);
      styles.forEach((style) => {
        newRule.append({
          prop: style.prop,
          value: style.value,
          important: style.important
        });
      });
    });
    return newRule;
  }
}

function generateClass(node) {
  if (node.type === NODE_TYPE.VARIANT) {
    return `${node.selector.replace(/[: ]/g, '_')}${generateClass(node.payload)}`;
  } else if (node.type === NODE_TYPE.TOKEN) {
    return `_${node.value}`;
  }
  return '----';
}