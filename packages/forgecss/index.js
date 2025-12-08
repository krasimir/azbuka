import getAllFiles from "./lib/getAllFiles.js";
import { extractStyles } from "./lib/inventory.js";
import { invalidateUsageCache, findUsages } from "./lib/processor.js";
import { generateOutputCSS } from "./lib/generator.js";

const DEFAULT_OPTIONS = {
  source: null,
  inventoryFiles: ["css", "less", "scss"],
  usageFiles: ["html", "jsx", "tsx"],
  usageAttributes: ["class", "className"],
  mapping: {
    queries: {}
  },
  output: null
};

export default function ForgeCSS(options = { source: null, output: null, mapping: {} }) {
  const config = { ...DEFAULT_OPTIONS };

  config.source = options.source ?? DEFAULT_OPTIONS.source;
  config.mapping = Object.assign({}, DEFAULT_OPTIONS.mapping, options.mapping ?? {});
  config.output = options.output ?? DEFAULT_OPTIONS.output;

  if (!config.source) {
    throw new Error('forgecss: missing "source" in configuration.');
  }

  return {
    async parse(lookAtPath = null) {
      // filling the inventory
      try {
        if (lookAtPath) {
          if (config.inventoryFiles.includes(lookAtPath.split(".").pop().toLowerCase())) {
            await extractStyles(lookAtPath);
          }
        } else {
          let files = await getAllFiles(config.source, config.inventoryFiles);
          for (let file of files) {
            await extractStyles(file);
          }
        }
      } catch (err) {
        console.error(`forgecss: error extracting styles: ${err}`);
      }
      // finding the usages
      try {
        if (lookAtPath) {
          if (config.usageFiles.includes(lookAtPath.split(".").pop().toLowerCase())) {
            invalidateUsageCache(lookAtPath);
            await findUsages(lookAtPath);
          }
        } else {
          let files = await getAllFiles(config.source, config.usageFiles);
          for (let file of files) {
            await findUsages(file);
          }
        }
      } catch (err) {
        console.error(`forgecss: error extracting declarations: ${err}`);
      }
      // generating the output CSS
      try {
        return await generateOutputCSS(config);
      } catch (err) {
        console.error(`forgecss: error generating output CSS: ${err}`);
      }
    }
  };
}
