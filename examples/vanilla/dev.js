import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  .parseDirectory(path.join(__dirname, "public"), path.join(__dirname, "public/forgecss-output.css"))
  .then(() => {
    console.log("ForgeCSS parsing completed.");
  });

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
