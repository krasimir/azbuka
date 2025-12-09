import { minifyCSS, expect } from "../../helpers.js";
import { extractStyles } from '../../../lib/inventory.js';
import { findUsages } from '../../../lib/processor.js';
import { generateOutputCSS } from '../../../lib/generator.js';
import { invalidateInvetory } from "../../../lib/inventory.js";
import { invalidateUsageCache } from "../../../lib/processor.js";

const CASES = [
  {
    styles: ".red { color: red }",
    usage: '<div class="hover:red"></div>',
    expected: ".hover_red:hover{color:red}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    invalidateInvetory();
    invalidateUsageCache();
    await extractStyles("styles.css", testCase.styles);
    await findUsages("usage.html", testCase.usage);
    if (!expect.toBe(minifyCSS(await generateOutputCSS()), testCase.expected)) {
      return false;
    }
  }
  return true;
}