import { minifyCSS, expect } from "../../helpers.js";
import Azbuka from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
      .mt1 { margin-top: 1rem }
      .flex { display: flex }
      .justify-center { justify-content: center }
      .items-center { align-items: center }
    `,
    usages: ["red d:mt1 d:mt1", "mt1 d:red text()", "[.dark &]:flex d:mt1", "text()"],
    expectedCSS:
      ".text{color:red;margin-top:1rem}.dark .dark-I_flex{display:flex}@media (min-width:1024px){.d_mt1{margin-top:1rem}.d_red{color:red}.text{display:flex}}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await Azbuka({
      verbose: false,
      breakpoints: {
        media: {
          d: "(min-width: 1024px)"
        }
      },
      macros: {
        text: () => {
          return 'red mt1 d:flex'
        }
      }
    }).parse({
      css: testCase.styles,
      html: testCase.usages.map(usage => `<div class="${usage}"></div>`).join("")
    });
    if (!expect.toBe(minifyCSS(css), testCase.expectedCSS)) {
      return false;
    }
  }
  return true;
}
