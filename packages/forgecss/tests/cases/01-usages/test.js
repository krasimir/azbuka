import { invalidateInvetory } from "../../../lib/inventory.js";
import { findUsages, getUsages, invalidateUsageCache } from "../../../lib/usages.js";
import { getPath, expect } from "../../helpers.js";

export default async function test() {
  const cases = [
    {
      file: getPath("/cases/01-usages/src/page.html"),
      expected: {
        [getPath("/cases/01-usages/src/page.html")]: {
          desktop: ["mt2"],
          mobile: ["fz2", "red"],
          tablet: ["mt3", "blue"]
        }
      }
    },
    {
      file: getPath("/cases/01-usages/src/page.tsx"),
      expected: {
        [getPath("/cases/01-usages/src/page.tsx")]: {
          "desktop": [
            "b"
          ],
          "mobile": [
            "d"
          ],
          "[]": [
            "b",
            "c"
          ],
          "[&:hover]": [
            "a"
          ],
          "[.dark &]": [
            "b"
          ]
        }
      }
    }
  ];
  for (let i=0; i<cases.length; i++) {
    const { file, expected } = cases[i];
    invalidateUsageCache();
    invalidateInvetory();
    await findUsages(file);
    if (!expect.deepEqual(getUsages(), expected)) {
      return false;
    }
  }
  return true;
}
