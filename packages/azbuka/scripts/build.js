import path from "path";
import esbuild from "esbuild";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const minify = true;

(async function () {
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "index.az.js")],
    bundle: true,
    minify,
    outfile: path.join(__dirname, "..", "dist", "client.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: []
  });
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "index.browser.js")],
    bundle: true,
    minify,
    outfile: path.join(__dirname, "..", "dist", "standalone.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: []
  });
})();
