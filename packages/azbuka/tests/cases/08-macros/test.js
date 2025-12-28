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
    usage: "red layout(flex-centered)",
    expectedCSS: ".layout-flex-centered{display:flex;justify-content:center;align-items:center}"
  },
  {
    styles: `
      .red { color: red }
      .fz2 { font-size: 2rem }
      .flex { display: flex }
      .justify-center { justify-content: center }
      .items-center { align-items: center }
    `,
    usage: "uknown(red text(big) layout(flex center))",
    expectedCSS:
      ".uknown-red-text-big-layout-flex-center{color:red;font-size:2rem;display:flex;justify-content:center;align-items:center}"
  },
  {
    styles: `
      .p1 { padding: 1rem }
      .mt2 { margin-top: 2rem }
      .white { color: white }
    `,
    usage: "text()",
    expectedCSS: ".text{padding:1rem}.dark .text{color:white;margin-top:2rem}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await Azbuka({
      verbose: false,
      macros: {
        layout: (args) => {
          return args
            .map(arg => {
              switch(arg) {
                case 'flex-centered':
                  return 'flex justify-center items-center';
                case 'center':
                  return 'justify-center items-center';
                default:
                  return arg;
              }
            }).filter(Boolean);
        },
        text: (args) => {
          if (args.length === 0) {
            return "[.dark &]:white,mt2 p1";
          }
          return args
            .map(arg => {
              switch(arg) {
                case 'big':
                  return 'fz2';
                default:
                  return arg;
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
