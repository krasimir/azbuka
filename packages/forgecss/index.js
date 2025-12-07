import getAllFiles from "./lib/getAllFiles.js";
import { extractStyles } from "./lib/styles.js";
import { deleteDeclarations, extractDeclarations } from "./lib/processFile.js";
import { generateOutputCSS } from "./lib/generator.js";

const DEFAULT_OPTIONS = {
  source: null,
  stylesMatch: ['css', 'less', 'scss'],
  declarationsMatch: ['html', 'jsx', 'tsx'],
  declarationsMatchAttributes: ['class', 'className'],
  mapping: {
    queries: {}
  },
  output: null
};

export default function forgecss(options = { source: null, output: null, mapping: {} }) {
  const config = { ...DEFAULT_OPTIONS };

  config.source = options.source || DEFAULT_OPTIONS.source;
  config.mapping = Object.assign({}, DEFAULT_OPTIONS.mapping, options.mapping || {});
  config.output = options.output || DEFAULT_OPTIONS.output;

  if (!config.source) {
    throw new Error('forgecss: "source" option is required.');
  }
  if (!config.output) {
    throw new Error('forgecss: "output" option is required.');
  }

  return {
    async parse(lookAtPath = null) {
      // fetching the styles
      try {
        if (lookAtPath) {
          if (config.stylesMatch.includes(lookAtPath.split(".").pop().toLowerCase())) {
            await extractStyles(lookAtPath);
          }
        } else {
          let files = await getAllFiles(config.source, config.stylesMatch);
          for (let file of files) {
            await extractStyles(file);
          }
        }
      } catch (err) {
        console.error(`forgecss: error extracting styles: ${err}`);
      }
      // fetching the declarations
      try {
        if (lookAtPath) {
          if (config.declarationsMatch.includes(lookAtPath.split(".").pop().toLowerCase())) {
            deleteDeclarations(lookAtPath);
            await extractDeclarations(lookAtPath);
          }
        } else {
          let files = await getAllFiles(config.source, config.declarationsMatch);
          for (let file of files) {
            await extractDeclarations(file);
          }
        }
      } catch (err) {
        console.error(`forgecss: error extracting declarations: ${err}`);
      }
      // generating the output CSS
      try {
        await generateOutputCSS(config);
      } catch (err) {
        console.error(`forgecss: error generating output CSS: ${err}`);
      }
    }
  };
}
