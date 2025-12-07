import fs from "fs/promises";
import path from "path";

export default async function getAllFiles(dir, matchFiles) {
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
