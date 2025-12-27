import fs from "node:fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import Azbuka from "../../packages/azbuka/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientAz = fs.readFileSync(path.join(__dirname, "../../packages/azbuka/dist/client.min.js"), "utf-8");

const PORT = 5173;
const app = express();

Azbuka({
  breakpoints: {
    desktop: "all and (min-width: 768px)",
    mobile: "all and (max-width: 768px)"
  },
  minify: false,
}).parseDirectory({
  dir: path.join(__dirname, "public"),
  output: path.join(__dirname, "public/azbuka.css"),
  watch: true
});

app.get("/client.min.js", (req, res) => {
  res.type("application/javascript");
  res.send(clientAz);
});
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
