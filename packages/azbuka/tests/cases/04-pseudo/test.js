import { minifyCSS, expect } from "../../helpers.js";
import Azbuka from '../../../index.js'

const CASES = [
  {
    styles: ".red { color: red }",
    usage: '<div class="hover:red"></div>',
    expected: ".hover_red:hover{color:red}"
  },
  {
    styles: ".red { color: red }.mt2 { margin-top: 2rem }",
    usage: '<div class="focus:red,mt2 active:mt2"></div>',
    expected: ".focus_red:focus{color:red}.focus_mt2:focus{margin-top:2rem}.active_mt2:active{margin-top:2rem}"
  }
];

export default async function test() {
  for (let testCase of CASES) {
    const css = await Azbuka().parse({ css: testCase.styles, html: testCase.usage });
    if (!expect.toBe(minifyCSS(css), testCase.expected)) {
      return false;
    }
  }
  return true;
}