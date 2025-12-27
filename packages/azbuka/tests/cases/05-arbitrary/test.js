import { minifyCSS, expect } from "../../helpers.js";
import az from "../../../lib/az.js";
import Azbuka from "../../../index.js";

const CASES = [
  {
    styles: `
      .red { color: red }
    `,
    usage: "[&:hover]:red",
    expectedClass: "I-hover_red",
    expectedCSS: ".I-hover_red:hover{color:red}",
    type: "html"
  },
  {
    styles: `
      .red { color: red }
      .fz2 { font-size: 2rem }
      .mt2 { margin-top: 2rem }
    `,
    usage: `[&:hover]:red,fz2 [&:hover]:mt2`,
    expectedClass: "I-hover_red I-hover_fz2 I-hover_mt2",
    expectedCSS:
      ".I-hover_red:hover{color:red}.I-hover_fz2:hover{font-size:2rem}.I-hover_mt2:hover{margin-top:2rem}",
    type: "html"
  },
  {
    styles: `
      .red { color: red }
      .fz2 { font-size: 2rem }
    `,
    usage: `[&:required:disabled]:red,fz2`,
    expectedClass: "I-required-disabled_red I-required-disabled_fz2",
    expectedCSS:
      ".I-required-disabled_red:required:disabled{color:red}.I-required-disabled_fz2:required:disabled{font-size:2rem}",
    type: "html"
  },
  {
    styles: `
      .red { color: red }
    `,
    usage: `[.dark &]:red`,
    expectedClass: "dark-I_red",
    expectedCSS: ".dark .dark-I_red{color:red}",
    type: "html"
  },
  {
    styles: `
      .red { color: red }
    `,
    usage: "[true]:red",
    expectedClass: "red",
    expectedCSS: "",
    type: "jsx"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await Azbuka().parse({
      css: testCase.styles,
      [testCase.type || "html"]:
        testCase.type === "html"
          ? `<div class="${testCase.usage}"></div>`
          : `function Component() { return <div className={az("${testCase.usage}")}></div> }`
    });
    if (!expect.toBe(az(testCase.usage), testCase.expectedClass)) {
      return false;
    }
    if (!expect.toBe(minifyCSS(css), testCase.expectedCSS)) {
      return false;
    }
  }
  return true;
}