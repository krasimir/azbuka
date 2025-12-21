import path from 'path';
import { writeFile } from "fs/promises";
import chokidar from "chokidar";

import { extractStyles, getStylesByClassName, invalidateInventory, resolveApplys } from "./lib/inventory.js";
import { invalidateUsageCache, findUsages, getUsages } from "./lib/usages.js";
import { astToRules, rulesToCSS } from './lib/forge-lang/Compiler.js';
import { toAST } from './lib/forge-lang/Parser.js';
import { getAllFiles } from './lib/helpers.js';

const DEFAULT_OPTIONS = {
  inventoryFiles: ["css", "less", "scss"],
  usageFiles: ["html", "jsx", "tsx"],
  usageAttributes: ["class", "className"],
  breakpoints: {},
  verbose: true,
  minify: true
};

export default function ForgeCSS(options) {
  const config = { ...DEFAULT_OPTIONS };

  config.breakpoints = Object.assign({}, DEFAULT_OPTIONS.breakpoints, options?.breakpoints ?? {});
  config.inventoryFiles = options?.inventoryFiles ?? DEFAULT_OPTIONS.inventoryFiles;
  config.usageFiles = options?.usageFiles ?? DEFAULT_OPTIONS.usageFiles;
  config.usageAttributes = options?.usageAttributes ?? DEFAULT_OPTIONS.usageAttributes;
  config.verbose = options?.verbose ?? DEFAULT_OPTIONS.verbose;
  config.minify = options?.minify ?? DEFAULT_OPTIONS.minify;

  async function result(output) {
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
      if (output) {
        await writeFile(output, `/* ForgeCSS auto-generated file */\n${css}`, "utf-8");
      }
      if (config.verbose) {
        console.log("forgecss: Output CSS generated successfully.");
      }
      return css;
    } catch (err) {
      console.error(`forgecss: error generating output CSS: ${err}`);
    }
    return null;
  }
  function runWatcher(what, output, callback) {
    const watcher = chokidar.watch(what, {
      persistent: true,
      ignoreInitial: true,
      ignored: (p, stats) => output && path.resolve(p) === path.resolve(output)
    });
    watcher.on("change", async (filePath) => {
      if (config.verbose) {
        invalidateUsageCache(filePath)
        invalidateInventory(filePath);
        console.log(`forgecss: Detected change in ${filePath}`);
      }
      callback();
    });
    if (config.verbose) {
      console.log("forgecss: Watch mode enabled. Listening for file changes...");
    }
  }

  return {
    async parseDirectory({ dir, output = null, watch = false }) {
      if (!dir) {
        throw new Error('forgecss: parseDirectory requires "dir" as an argument.');
      }
      try {
        // filling the inventory
        let files = await getAllFiles(dir, config.inventoryFiles);
        for (let file of files) {
          await extractStyles(file);
        }
      } catch (err) {
        console.error(`forgecss: error extracting styles.`, err);
      }
      // finding the usages
      try {
        let files = await getAllFiles(dir, config.usageFiles);
        for (let file of files) {
          await findUsages(file);
        }
      } catch (err) {
        console.error(`forgecss: error extracting usages`, err);
      }
      watch && runWatcher(dir, output, () => {
        this.parseDirectory({ dir, output, watch: false });
      });
      // generating the output CSS
      return result(output);
    },
    async parseFile({ file, output = null, watch = false }) {
      if (!file) {
        throw new Error('forgecss: parseFile requires "file" as an argument.');
      }
      const ext = file.split(".").pop().toLowerCase();
      // filling the inventory
      try {
        if (config.inventoryFiles.includes(ext)) {
          await extractStyles(file);
        }
      } catch (err) {
        console.error(`forgecss: error extracting styles.`, err);
      }
      // finding the usages
      try {
        if (config.usageFiles.includes(ext)) {
          invalidateUsageCache(file);
          await findUsages(file);
        }
      } catch (err) {
        console.error(`forgecss: error extracting usages.`, err);
      }
       watch && runWatcher(file, output, () => {
        this.parseFile({ file, output, watch: false });
       });
      // generating the output CSS
      return result(output);
    },
    async parse({ css, html, jsx, output = null }) {
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
        await extractStyles("styles.css", css);
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
      return result(output);
    }
  };
}
