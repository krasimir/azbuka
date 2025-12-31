import { minifyCSS, expect } from "../../helpers.js";
import Azbuka from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
    `,
    usages: ["c500:red"],
    expectedCSS: ".red{color:red}@container (min-width:500px){.c500_red{color:red}}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await Azbuka({
      verbose: false,
      breakpoints: {
        container: {
          c500: "(min-width: 500px)"
        }
      },
      bundleAll: true
    }).parse({
      css: testCase.styles,
      html: testCase.usages.map((usage) => `<div class="${usage}"></div>`).join("")
    });
    if (!expect.toBe(minifyCSS(css), testCase.expectedCSS)) {
      return false;
    }
  }
  return true;
}
