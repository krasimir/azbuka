import { JSXParser, readFileContent } from "../../../lib/helpers.js";
import { invalidateInventory } from "../../../lib/inventory.js";
import { findUsages, getUsages, invalidateUsageCache } from "../../../lib/usages.js";
import { getPath, expect } from "../../helpers.js";

export default async function test() {
  const cases = [
    {
      file: getPath("/cases/01-usages/src/page.html"),
      expected: {
        [getPath("/cases/01-usages/src/page.html")]: [
          "mt1 desktop:red",
          "fz3 mx-l [.dark &:hover]:red",
          "vibe"
        ]
      }
    },
    {
      file: getPath("/cases/01-usages/src/page.tsx"),
      expected: {
        [getPath("/cases/01-usages/src/page.tsx")]: [
          "a desktop:b",
          "c mobile:d desktop:b2  e",
          "a []:b []:c",
          "[&:hover]:a",
          "a [.dark &]:b c",
          "a [.dark desktop:b]:c d",
          "a [.dark &:has(.desc)]:c d",
          "a [.dark &[type='password']]:c d"
        ]
      }
    }
  ];
  for (let i=0; i<cases.length; i++) {
    const { file, expected } = cases[i];
    invalidateUsageCache();
    invalidateInventory();
    await findUsages(file, await readFileContent(file), JSXParser);
    if (!expect.deepEqual(getUsages(), expected)) {
      return false;
    }
  }
  return true;
}
