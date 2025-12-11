import swc from "@swc/core";
import { readFile, writeFile } from "fs/promises";
import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";
import { SPLIT_CLASSES_REGEXP } from "../client/fx.js";

const FUNC_NAME = 'fx';
let USAGES = {};

const { parse } = swc;

export async function findUsages(filePath, fileContent = null) {
  try {
    if (USAGES[filePath]) {
      // already processed
      return;
    }
    USAGES[filePath] = {};
    const content = fileContent ? fileContent : await readFile(filePath, "utf-8");
    const extension = filePath.split('.').pop().toLowerCase();

    // HTML
    if (extension === "html") {
      const ast = fromHtml(content);
      visit(ast, "element", (node) => {
        if (node.properties.className) {
          storeUsage(filePath, node.properties.className.join(' '));
        }
      });
      return;
    }

    // JSX/TSX
    const ast = await parse(content, {
      syntax: "typescript",
      tsx: true,
      decorators: false
    });
    // writeFile(process.cwd() + '/ast.json', JSON.stringify(ast, null, 2), 'utf-8').catch(() => {});
    traverseASTNode(ast, {
      JSXExpressionContainer(node) {
        if (node?.expression?.callee?.value === FUNC_NAME && node?.expression?.arguments) {
          if (node?.expression?.arguments[0]) {
            const arg = node.expression.arguments[0];
            let value = arg?.expression.value;
            if (arg.expression.type === "TemplateLiteral") {
              let quasis = arg.expression.quasis.map((elem) => elem?.cooked || "");
              value = quasis.join("");
            }
            storeUsage(filePath, value);
          }
        }
      }
    });
  } catch (err) {
    console.error(`forgecss: error processing file ${filePath.replace(process.cwd(), '')}`, err);
  }
}
export function invalidateUsageCache(filePath) {
  if (!filePath) {
    USAGES = {};
    return;
  }
  if (USAGES[filePath]) {
    delete USAGES[filePath];
  }
}
export function getUsages() {
  return USAGES;
}
function storeUsage(filePath, classesString = "") {
  if (!classesString) return;

  classesString.split(SPLIT_CLASSES_REGEXP).forEach((part) => {
    if (part.includes(":")) {
      const lastColonIndex = part.lastIndexOf(":");
      const label = part.slice(0, lastColonIndex); // "desktop" or "[&:hover]"
      const clsPart = part.slice(lastColonIndex + 1); // e.g. "mt1"

      const classes = clsPart.split(",");

      if (!USAGES[filePath][label]) {
        USAGES[filePath][label] = [];
      }
      classes.forEach((cls) => {
        USAGES[filePath][label].push(cls);
      });
    }
  });
}
function traverseASTNode(node, visitors, stack = []) {
  if (!node || typeof node.type !== "string") {
    return;
  }

  const visitor = visitors[node.type];
  if (visitor) {
    visitor(node, stack);
  }

  for (const key in node) {
    if (!node.hasOwnProperty(key)) continue;

    const child = node[key];

    if (Array.isArray(child)) {
      child.forEach((c) => {
        if (c) {
          if (typeof c.type === "string") {
            traverseASTNode(c, visitors, [node].concat(stack));
          } else if (c?.expression && typeof c.expression.type === "string") {
            traverseASTNode(c.expression, visitors, [node].concat(stack));
          } else if (c?.callee && typeof c.callee.type === "string") {
            traverseASTNode(c.callee, visitors, [node].concat(stack));
          } else if (c?.left && typeof c.left.type === "string") {
            traverseASTNode(c.left, visitors, [node].concat(stack));
          } else if (c?.right && typeof c.right.type === "string") {
            traverseASTNode(c.right, visitors, [node].concat(stack));
          }
        }
      });
    } else if (child && typeof child.type === "string") {
      traverseASTNode(child, visitors, [node].concat(stack));
    }
  }
}