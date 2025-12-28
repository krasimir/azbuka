import { toAST } from "../../../lib/azbuka-lang/Parser.js";
import { astToRules, rulesToCSS, nodeToClassNames } from "../../../lib/azbuka-lang/Compiler.js";
import { minifyCSS } from "../../../lib/azbuka-lang/utils.js";
import az from '../../../az.js'

const mockGetStyleByClassName = (_) => [{ prop: "foo", value: "bar", important: false }];

export default function test() {
  // testing the parser
  const parserCases = [
    {
      input: "btn primary hover:red",
      expected: [
        { type: "token", value: "btn" },
        { type: "token", value: "primary" },
        {
          type: "variant",
          selector: "hover",
          payload: {
            type: "token",
            value: "red"
          },
          simple: true
        }
      ]
    },
    {
      input: "text [.dark &]:text-white mt1",
      expected: [
        { type: "token", value: "text" },
        {
          type: "variant",
          selector: [
            {
              type: "token",
              value: ".dark"
            },
            {
              type: "token",
              value: "&"
            }
          ],
          payload: { type: "token", value: "text-white" }
        },
        { type: "token", value: "mt1" }
      ]
    },
    {
      input: "foo layout(px4 rounded)",
      expected: [
        {
          type: "token",
          value: "foo"
        },
        {
          type: "call",
          name: "layout",
          args: [
            {
              type: "token",
              value: "px4"
            },
            {
              type: "token",
              value: "rounded"
            }
          ]
        }
      ]
    },
    {
      input: "disabled:opacity-50 desktop:layout(px6 py3)",
      expected: [
        {
          type: "variant",
          selector: "disabled",
          payload: {
            type: "token",
            value: "opacity-50"
          },
          simple: true
        },
        {
          type: "variant",
          selector: "desktop",
          payload: {
            type: "call",
            name: "layout",
            args: [
              {
                type: "token",
                value: "px6"
              },
              {
                type: "token",
                value: "py3"
              }
            ]
          },
          simple: true
        }
      ]
    },
    {
      input: "[.dark &[type='password']]:bg-black",
      expected: [
        {
          type: "variant",
          selector: [
            {
              type: "token",
              value: ".dark"
            },
            {
              type: "token",
              value: "&[type='password']"
            }
          ],
          payload: {
            type: "token",
            value: "bg-black"
          }
        }
      ]
    },
    {
      input: `[&:has(.desc[title="a[b] c"])]:text(underline)`,
      expected: [
        {
          type: "variant",
          selector: [
            {
              type: "token",
              value: '&:has(.desc[title="a[b] c"])'
            }
          ],
          payload: {
            type: "call",
            name: "text",
            args: [
              {
                type: "token",
                value: "underline"
              }
            ]
          }
        }
      ]
    },
    {
      input: `
        theme(
          [.dark &]:text(text-white),
          hover:layout(bg-blue-700),
        )
      `,
      expected: [
        {
          type: "call",
          name: "theme",
          args: [
            {
              type: "variant",
              selector: [
                {
                  type: "token",
                  value: ".dark"
                },
                {
                  type: "token",
                  value: "&"
                }
              ],
              payload: {
                type: "call",
                name: "text",
                args: [
                  {
                    type: "token",
                    value: "text-white"
                  }
                ]
              }
            },
            {
              type: "variant",
              selector: "hover",
              payload: {
                type: "call",
                name: "layout",
                args: [
                  {
                    type: "token",
                    value: "bg-blue-700"
                  }
                ]
              },
              simple: true
            }
          ]
        }
      ]
    },
    {
      input: "m1 theme(text(big) layout(flex center))",
      expected: [
        {
          type: "token",
          value: "m1"
        },
        {
          type: "call",
          name: "theme",
          args: [
            {
              type: "call",
              name: "text",
              args: [
                {
                  type: "token",
                  value: "big"
                }
              ]
            },
            {
              type: "call",
              name: "layout",
              args: [
                {
                  type: "token",
                  value: "flex"
                },
                {
                  type: "token",
                  value: "center"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  for (let i = 0; i < parserCases.length; i++) {
    const testCase = parserCases[i];
    const result = toAST(testCase.input);
    if (JSON.stringify(result) !== JSON.stringify(testCase.expected)) {
      console.error(`#${i} Test failed for input:`, testCase.input);
      console.error("Expected:", testCase.expected);
      console.error("Got     :", JSON.stringify(result, null, 2));
      return false;
    }
  }

  // testing the compiler
  const compilerCases = [
    {
      usage: ["hover:mt1 fz2 active:mt1,fz2,fz3"],
      classStr: ["hover_mt1 fz2 active_mt1 active_fz2 active_fz3"],
      expectedCSS:
        ".hover_mt1:hover{foo:bar}.active_mt1:active{foo:bar}.active_fz2:active{foo:bar}.active_fz3:active{foo:bar}"
    },
    {
      usage: ["desktop:mt1 fz2 desktop:p1", "mt2 pt1 desktop:mt1,fz3 fz2", "mobile:br-l"],
      classStr: ["desktop_mt1 fz2 desktop_p1", "mt2 pt1 desktop_mt1 desktop_fz3 fz2", "mobile_br-l"],
      expectedCSS:
        "@media all and (min-width:1024px){.desktop_mt1{foo:bar}.desktop_p1{foo:bar}.desktop_fz3{foo:bar}}@media all and (max-width:1023px){.mobile_br-l{foo:bar}}"
    },
    {
      usage: ["[&:hover]:red,fz2 mt1", "[.dark &]:b"],
      classStr: ["I-hover_red I-hover_fz2 mt1", "dark-I_b"],
      expectedCSS: ".I-hover_red:hover{foo:bar}.I-hover_fz2:hover{foo:bar}.dark .dark-I_b{foo:bar}"
    },
    {
      usage: ["desktop:[.dark &]:b desktop:mt1,p1"],
      classStr: ["desktop-dark-I_b desktop_mt1 desktop_p1"],
      expectedCSS:
        "@media all and (min-width:1024px){.dark .dark-I_b{foo:bar}.desktop_mt1{foo:bar}.desktop_p1{foo:bar}}"
    }
  ];
  for (let i = 0; i < compilerCases.length; i++) {
    const testCase = compilerCases[i];
    const ast = toAST(testCase.usage);
    const rules = astToRules(ast, {
      getStylesByClassName: mockGetStyleByClassName,
      config: {
        minify: true,
        breakpoints: {
          desktop: "all and (min-width: 1024px)",
          mobile: "all and (max-width: 1023px)",
          portrait: "all and (orientation: portrait)"
        }
      }
    });
    let usages = testCase.usage;
    const css = minifyCSS(rulesToCSS(rules, { minify: true }));
    if (
      !usages.every((usage, i) => {
        if (az(usage) !== testCase.classStr[i]) {
          console.error(`#${i} Compiler Test failed (classStr):`);
          console.error("Expected:\n", testCase.classStr[i]);
          console.error("Got:\n", az(usage));
          return false;
        }
        return true;
      })
    ) {
      return false;
    }
    if (css !== testCase.expectedCSS) {
      console.error(`#${i} Compiler Test failed (expectedCSS):`);
      console.error("Expected:\n", testCase.expectedCSS);
      console.error("Got:\n", css);
      return false;
    }
  }

  // testing nodeToClassNames
  const nodeToClassNamesCases = [
    {
      input: "mt2"
    },
    {
      input: "hover:mt1"
    },
    {
      input: "[.dark &]:text-white"
    },
    {
      input: "[&:hover]:red,fz2"
    },
    {
      input: "theme(text(big) layout(flex center))"
    }
  ];
  for (let i = 0; i < nodeToClassNamesCases.length; i++) {
    const testCase = nodeToClassNamesCases[i];
    const ast = toAST(testCase.input);
    const result = nodeToClassNames(ast[0]);
    if (result !== az(testCase.input)) {
      console.error(`#${i} nodeToClassNames Test failed:`);
      console.error("Expected:\n", az(testCase.input));
      console.error("Got:\n", result);
      return false;
    }
  }


  return true;
}