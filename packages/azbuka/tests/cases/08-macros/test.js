import { minifyCSS, expect } from "../../helpers.js";
import Azbuka from "../../../index.js";

const CASES = [
  {
    styles: `
      .tac { text-align: center; }
      .fz2 { font-size: 2rem }
      .fz3 { font-size: 3rem }
    `,
    usage: "title()",
    expectedCSS: ".title{text-align:center;font-size:2rem}@media (min-width:1024px){.title{font-size:3rem}}"
  },
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
  },
  {
    styles: `
      .p1 { padding: 1rem }
      .mt2 { margin-top: 2rem }
      .white { color: white }
      .disabled { opacity: 0.5 }
      .border { border: solid 1px #000; }
      .tac { text-align: center; }
    `,
    usage: "primary(space() disabled())",
    expectedCSS:
      ".primary-space-disabled{margin-top:2rem;opacity:0.5;color:white;padding:1rem;border:solid 1px #000}@media (min-width:1024px){.primary-space-disabled{text-align:center}}"
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
        layout: (args) => {
          return args
            .map((arg) => {
              switch (arg) {
                case "flex-centered":
                  return "flex justify-center items-center";
                case "center":
                  return "justify-center items-center";
                default:
                  return arg;
              }
            })
            .filter(Boolean);
        },
        text: (args) => {
          if (args.length === 0) {
            return "[.dark &]:white,mt2 p1";
          }
          return args
            .map((arg) => {
              switch (arg) {
                case "big":
                  return "fz2";
                default:
                  return arg;
              }
            })
            .filter(Boolean);
        },
        primary: (args) => {
          return "border p1";
        },
        space: () => {
          return "mt2";
        },
        disabled: () => {
          return "disabled white p1 d:tac";
        },
        title: () => {
          return "tac fz2 d:fz3";
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
