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
  toBe(value, expected) {
    const result = value === expected;
    if (!result) {
      console.error("Expected:\n", expected);
      console.error("Received:\n", value);
    }
    return result;
  },
  toEqualFile(str, file) {
    const expected = fs.readFileSync(getPath(file), "utf-8");
    const result = str === expected;
    if (!result) {
      console.error("\nExpected:\n", expected);
      console.error("\nReceived:\n", str);
    }
    return result;
  },
  deepEqual(actual, expected) {
    function deepEqual(a, b) {
      if (a === b) return true;

      if (a === null || b === null) return a === b;

      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
          if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
      }

      if (Array.isArray(a) || Array.isArray(b)) return false;

      if (typeof a === "object" && typeof b === "object") {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
          if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
          if (!deepEqual(a[key], b[key])) return false;
        }
        return true;
      }

      return false;
    }
    const result = deepEqual(actual, expected);
    if (!result) {
      console.error("\nExpected:\n", JSON.stringify(expected, null, 2));
      console.error("\nActual:\n", JSON.stringify(actual, null, 2));
    }
    return result;
  }
};
export function minifyCSS(css = '') {
  return css
    .replace(/\/\*[^]*?\*\//g, "") // remove comments
    .replace(/\s+/g, " ") // collapse spaces
    .replace(/\s*([{}:;,])\s*/g, "$1") // trim syntax whitespace
    .trim();

}