import { minifyCSS, expect } from "../../helpers.js";
import ForgeCSS from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
      .mt1 { margin-top: 1rem }
    `,
    usage: "red desktop:mt1",
    expectedCSS: ".red{color:red}.mt1{margin-top:1rem}@media @media (min-width:750px){.desktop_mt1{margin-top:1rem}}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await ForgeCSS({
      breakpoints: {
        desktop: "@media (min-width: 750px)"
      },
      bundleAll: true
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
