import {
  extractStyles,
  getStylesByClassName,
  invalidateInventory,
  resolveApplys,
  getInventory,
  getAllCSS
} from "./lib/inventory.js";
import { invalidateUsageCache, findUsages, getUsages } from "./lib/usages.js";
import az from './lib/az.js'
import { astToRules, rulesToCSS } from "./lib/azbuka-lang/Compiler.js";
import { toAST } from "./lib/azbuka-lang/Parser.js";
import { DEFAULT_OPTIONS } from "./lib/constants.js";

function Azbuka(options) {
  const config = { ...DEFAULT_OPTIONS };

  config.breakpoints = Object.assign({}, DEFAULT_OPTIONS.breakpoints, options?.breakpoints ?? {});
  config.usageAttributes = options?.usageAttributes ?? DEFAULT_OPTIONS.usageAttributes;
  config.verbose = options?.verbose ?? DEFAULT_OPTIONS.verbose;
  config.minify = options?.minify ?? DEFAULT_OPTIONS.minify;
  config.bundleAll = options?.bundleAll ?? DEFAULT_OPTIONS.bundleAll;

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
      let css = rulesToCSS(rules.filter(Boolean), config);
      if (config.bundleAll) {
        css = getAllCSS() + "\n" + css;
      }
      if (config.minify) {
        css = minifyCSS(css);
      }
      if (config.verbose) {
        console.log("azbuka: output CSS generated successfully.");
      }
      return css;
    } catch (err) {
      console.error(`azbuka: error generating output CSS: ${err}`);
    }
    return null;
  }

  return {
    async parse({ css, html, jsx }) {
      if (!css) {
        throw new Error('azbuka: parse requires "css".');
      }
      if (!html && !jsx) {
        throw new Error('azbuka: parse requires "html" or "jsx".');
      }
      invalidateInventory();
      invalidateUsageCache();
      // filling the inventory
      try {
        extractStyles("styles.css", css);
      } catch (err) {
        console.error(`azbuka: error extracting styles.`, err);
      }
      // finding the usages
      try {
        if (html) {
          await findUsages("usage.html", html);
        } else if (jsx) {
          await findUsages("usage.jsx", jsx);
        }
      } catch (err) {
        console.error(`azbuka: error extracting usages.`, err);
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

        let transformed = az(original);

        if (typeof transformed === "string" && transformed !== original) {
          el.setAttribute("class", transformed);
        }
      }
    },
    az,
    getUsages,
    getStylesByClassName,
    getInventory
  };
}

window.Azbuka = Azbuka;