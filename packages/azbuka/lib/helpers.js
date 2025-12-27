import swc from "@swc/core";
import fs from "fs/promises";
import path from "path";

const FUNC_NAME = "fx";
const { parse } = swc;

export async function getAllFiles(dir, matchFiles) {
  const result = [];
  const stack = [dir];

  while (stack.length > 0) {
    const currentDir = stack.pop();

    let dirHandle;
    try {
      dirHandle = await fs.opendir(currentDir);
    } catch (err) {
      throw err;
    }

    for await (const entry of dirHandle) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (matchFiles.includes(fullPath.split(".").pop()?.toLowerCase())) {
        result.push(fullPath);
      }
    }
  }

  return result;
}
export function readFileContent(filePath) {
  return fs.readFile(filePath, "utf-8");
}
export async function JSXParser(content, USAGES, filePath) {
  const ast = await parse(content, {
    syntax: "typescript",
    tsx: true,
    decorators: false
  });
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
          USAGES[filePath].push(value);
        }
      }
    }
  });
}
