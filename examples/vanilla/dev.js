import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import ForgeCSS from '../../packages/forgecss/index.js';

const PORT = 5203;
const app = express();

ForgeCSS({
  source: path.join(__dirname, "public"),
  mapping: {
    queries: {
      desktop: { query: "min-width: 768px" }, // desktop
      mobile: { query: "max-width: 768px" } // mobile
    }
  },
  output: path.join(__dirname, "public/forgecss-output.css")
})
  .parse()
  .then(() => {
    console.log("ForgeCSS parsing completed.");
  });

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
