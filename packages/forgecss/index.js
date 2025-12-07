import getAllFiles from "./lib/getAllFiles.js";
import { extractStyles } from "./lib/styles.js";
import { extractDeclarations } from "./lib/processFile.js";
import { generateOutputCSS } from "./lib/generator.js";

const DEFAULT_OPTIONS = {
  styles: {
    sourceDir: null,
    match: ['css']
  },
  ui: {
    sourceDir: null,
    match: ["html", "jsx", "tsx"],
    attribute: ['class', 'className']
  },
  mapping: {
    queries: {}
  },
  output: null
};

export default function forgecss(options = { styles: {}, ui: {}, mapping: {}, output: null }) {
  const config = { ...DEFAULT_OPTIONS };

  config.styles = Object.assign({}, DEFAULT_OPTIONS.styles, options.styles || {});
  config.ui = Object.assign({}, DEFAULT_OPTIONS.ui, options.ui || {});
  config.mapping = Object.assign({}, DEFAULT_OPTIONS.mapping, options.mapping || {});
  config.output = options.output || DEFAULT_OPTIONS.output;

  if (!config.styles.sourceDir) {
    throw new Error('forgecss: "styles.sourceDir" option is required.');
  }
  if (!config.ui.sourceDir) {
    throw new Error('forgecss: "ui.sourceDir" option is required.');
  }
  if (!config.output) {
    throw new Error('forgecss: "output" option is required.');
  }

  return {
    async parse() {
      // fetching the styles
      try {
        let files = await getAllFiles(config.styles.sourceDir, config.styles.match);
        for (let file of files) {
          await extractStyles(file);
        }
      } catch (err) {
        console.error(`forgecss: error extracting styles: ${err}`);
      }
      // fetching the declarations
      try {
        let files = await getAllFiles(config.ui.sourceDir, config.ui.match);
        for (let file of files) {
          await extractDeclarations(file);
        }
      } catch(err) {
        console.error(`forgecss: error extracting declarations: ${err}`);
      }
      // generating the output CSS
      try {
        await generateOutputCSS(config);
      } catch(err) {
        console.error(`forgecss: error generating output CSS: ${err}`);
      }
    }
  };
}
