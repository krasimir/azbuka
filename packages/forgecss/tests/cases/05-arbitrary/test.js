import { minifyCSS, expect } from "../../helpers.js";
import ForgeCSS from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
    `,
    usage: `
      <div class="[&:hover]:red"></div>
    `,
    expected:
      ".\\[\\&\\:hover\\]\\:red:hover{color:red}"
  },
  {
    styles: `
      .red { color: red }
      .fz2 { font-size: 2rem }
      .mt2 { margin-top: 2rem }
    `,
    usage: `
      <div class="[&:hover]:red,fz2 [&:hover]:mt2"></div>
    `,
    expected:
      ".\\[\\&\\:hover\\]\\:red:hover{color:red}.\\[\\&\\:hover\\]\\:fz2:hover{font-size:2rem}.\\[\\&\\:hover\\]\\:mt2:hover{margin-top:2rem}"
  },
  {
    styles: `
      .red { color: red }
      .fz2 { font-size: 2rem }
    `,
    usage: `
      <div class="[&:required:disabled]:red,fz2"></div>
    `,
    expected:
      ".\\[\\&\\:required\\:disabled\\]\\:red:required:disabled{color:red}.\\[\\&\\:required\\:disabled\\]\\:fz2:required:disabled{font-size:2rem}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await ForgeCSS().parse({ css: testCase.styles, html: testCase.usage });
    // console.log(css);
    if (!expect.toBe(minifyCSS(css), testCase.expected)) {
      return false;
    }
  }
  return true;
}