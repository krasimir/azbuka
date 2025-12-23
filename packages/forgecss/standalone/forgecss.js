import {
  extractStyles,
  getStylesByClassName,
  invalidateInventory,
  resolveApplys,
  getInventory
} from "../lib/inventory.js";
import { invalidateUsageCache, findUsages, getUsages } from "../lib/usages.js";
import { astToRules, rulesToCSS } from "../lib/forge-lang/Compiler.js";
import { toAST } from "../lib/forge-lang/Parser.js";
import fx from '../lib/fx.js'

const DEFAULT_OPTIONS = {
  usageAttributes: ["class", "className"],
  breakpoints: {},
  verbose: true,
  minify: true
};

function ForgeCSS(options) {
  const config = { ...DEFAULT_OPTIONS };

  config.breakpoints = Object.assign({}, DEFAULT_OPTIONS.breakpoints, options?.breakpoints ?? {});
  config.usageAttributes = options?.usageAttributes ?? DEFAULT_OPTIONS.usageAttributes;
  config.verbose = options?.verbose ?? DEFAULT_OPTIONS.verbose;
  config.minify = options?.minify ?? DEFAULT_OPTIONS.minify;

  async function result() {
    try {
      const cache = {};
      const usages = getUsages();
      const ast = toAST(
        Object.values(usages).reduce((acc, i) => {
          return acc.concat(i);
        }, [])
      );
      let rules = astToRules(ast, {
        getStylesByClassName,
        cache,
        config
      });
      rules.push(resolveApplys());
      const css = rulesToCSS(rules.filter(Boolean), config);
      if (config.verbose) {
        console.log("forgecss: output CSS generated successfully.");
      }
      return css;
    } catch (err) {
      console.error(`forgecss: error generating output CSS: ${err}`);
    }
    return null;
  }

  return {
    async parse({ css, html, jsx }) {
      if (!css) {
        throw new Error('forgecss: parse requires "css".');
      }
      if (!html && !jsx) {
        throw new Error('forgecss: parse requires "html" or "jsx".');
      }
      invalidateInventory();
      invalidateUsageCache();
      // filling the inventory
      try {
        extractStyles("styles.css", css);
      } catch (err) {
        console.error(`forgecss: error extracting styles.`, err);
      }
      // finding the usages
      try {
        if (html) {
          await findUsages("usage.html", html);
        } else if (jsx) {
          await findUsages("usage.jsx", jsx);
        }
      } catch (err) {
        console.error(`forgecss: error extracting usages.`, err);
      }
      return result();
    },
    fxAll: function (root) {
      const rootNode = root || document;
      const nodes = rootNode.querySelectorAll("[class]");

      for (let i = 0; i < nodes.length; i++) {
        let el = nodes[i];
        let original = el.getAttribute("class");
        if (!original) continue;

        let transformed = fx(original);

        if (typeof transformed === "string" && transformed !== original) {
          el.setAttribute("class", transformed);
        }
      }
    },
    getPageCSS() {
      let css = "";
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            css += rule.cssText + "\n";
          }
        } catch {}
      }
      return css;
    },
    getPageHTML() {
      return document.body.outerHTML;
    },
    fx,
    getUsages,
    getStylesByClassName,
    getInventory
  };
}

window.ForgeCSS = ForgeCSS;