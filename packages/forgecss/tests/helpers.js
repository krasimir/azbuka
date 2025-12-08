import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function root() {
  return __dirname;
}
export function getPath(p) {
  return path.join(__dirname, p);
}
export const expect = {
  toEqualFile(str, file) {
    const expected = fs.readFileSync(getPath(file), "utf-8");
    const result = str === expected;
    if (!result) {
      console.error("Expected:\n", expected);
      console.error("Received:\n", str);
    }
    return result;
  }
}