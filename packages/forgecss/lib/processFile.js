import swc from "@swc/core";
import { readFile, writeFile } from "fs/promises";
import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";

const FUNC_NAME = 'mq';
const DECLARATIONS = {};

const { parse } = swc;

export async function extractDeclarations(filePath) {
  const extension = filePath.split('.').pop().toLowerCase();
  try {
    if (DECLARATIONS[filePath]) {
      return;
    }
    DECLARATIONS[filePath] = {};
    const content = await readFile(filePath, "utf-8");

    // HTML
    if (extension === "html") {
      const ast = fromHtml(content);
      visit(ast, "element", (node) => {
        if (node.properties.className) {
          pushToDeclarations(filePath, node.properties.className.join(' '));
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
    traverseNode(ast, {
      JSXExpressionContainer(node) {
        if (node?.expression?.callee?.value === FUNC_NAME && node?.expression?.arguments) {
          if (node?.expression?.arguments[0]) {
            const arg = node.expression.arguments[0];
            let value = arg?.expression.value;
            if (arg.expression.type === "TemplateLiteral") {
              value = "";
              arg.expression.quasis.forEach((elem) => {
                value += elem?.cooked || "";
              });
            }
            pushToDeclarations(filePath, value);
          }
        }
      }
    });
  } catch (err) {
    console.error(`forgecss: error processing file ${filePath}: ${err}`);
  }
}
function pushToDeclarations(filePath, classesString = "") {
  if (classesString) {
    classesString.split(" ").forEach((part) => {
      if (part.indexOf(":") > -1) {
        let [label, classes] = part.split(":");
        classes = classes.split(",");
        classes.forEach((cls) => {
          if (!DECLARATIONS[filePath][label]) {
            DECLARATIONS[filePath][label] = [];
          }
          DECLARATIONS[filePath][label].push(cls);
        });
      }
    });
  }
}

function traverseNode(node, visitors, stack = []) {
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
            traverseNode(c, visitors, [node].concat(stack));
          } else if (c?.expression && typeof c.expression.type === "string") {
            traverseNode(c.expression, visitors, [node].concat(stack));
          } else if (c?.callee && typeof c.callee.type === "string") {
            traverseNode(c.callee, visitors, [node].concat(stack));
          } else if (c?.left && typeof c.left.type === "string") {
            traverseNode(c.left, visitors, [node].concat(stack));
          } else if (c?.right && typeof c.right.type === "string") {
            traverseNode(c.right, visitors, [node].concat(stack));
          }
        }
      });
    } else if (child && typeof child.type === "string") {
      traverseNode(child, visitors, [node].concat(stack));
    }
  }
}

export function getDeclarations() {
  return DECLARATIONS;
}