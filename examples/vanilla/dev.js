import fs from "node:fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fxCode = fs.readFileSync(path.join(__dirname, "../../packages/forgecss/dist/forgecss.min.js"), "utf-8");

import ForgeCSS from '../../packages/forgecss/index.js';

const PORT = 5203;
const app = express();

ForgeCSS({
  mapping: {
    queries: {
      desktop: "min-width: 768px",
      mobile: "max-width: 768px"
    }
  }
})
  .parseDirectory({
    dir: path.join(__dirname, "public"),
    output: path.join(__dirname, "public/forgecss-output.css")
  })
  .then(() => {
    console.log("ForgeCSS parsing completed.");
  });
app.get("/forgecss.min.js", (req, res) => {
  res.type("application/javascript");
  res.send(fxCode);
});
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
