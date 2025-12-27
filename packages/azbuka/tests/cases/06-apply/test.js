import { minifyCSS, expect } from "../../helpers.js";
import Azbuka from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
      .mt1 { margin-top: 1rem }
      .box > div, p + p {
        padding: 1rem;
        --apply: red mt1;
      }
    `,
    usage: "box",
    expectedCSS: ".box > div,p + p{color:red;margin-top:1rem}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await Azbuka().parse({
      css: testCase.styles,
      html: `<div class="${testCase.usage}"></div>`
    });
    if (!expect.toBe(minifyCSS(css), testCase.expectedCSS)) {
      return false;
    }
  }
  return true;
}
