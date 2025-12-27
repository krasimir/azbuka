import { minifyCSS, expect } from "../../helpers.js";
import Azbuka from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
      .mt1 { margin-top: 1rem }
    `,
    usage: "red layout(flex-centered)",
    expectedCSS: "..."
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await Azbuka({
      macros: {
        layout: (args) => {
          return args
            .map(arg => {
              switch(arg) {
                case 'flex-centered':
                  return 'flex justify-center items-center';
              }
            }).filter(Boolean);
        }
      }
    }).parse({
      css: testCase.styles,
      html: `<div class="${testCase.usage}"></div>`
    });
    if (!expect.toBe(minifyCSS(css), testCase.expectedCSS)) {
      return false;
    }
  }
  return true;
}
