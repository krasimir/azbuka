export const DEFAULT_FILES = [
  {
    filename: "page.html",
    content: `<div class="mt1 d:mt2 [.dark &]:black-bg,white">
  <p>Hey world!</p>
  <p class="layout(full-page)">
    I'm <a class="hover:red" href="...">Azbuka</a>.
  </p>
</div>`,
    selected: true,
    type: "html"
  },
  {
    filename: "styles.css",
    content: `.mt1 { margin-top: 1rem; }
.mt2 { margin-top: 2rem; }
.white { color: #fff; }
.black-bg { background-color: #000; }
.red { color: #9f0000; }
.w100vw { width: 100vw; }
.flex-center { display: flex; justify-content: center; align-items: center; }
.flex-col { flex-direction: column; }`,
    selected: false,
    type: "css"
  },
  {
    filename: "azbuka.config.js",
    content: `export default {
  breakpoints: {
    d: "all and (min-width: 768px)"
  },
  macros: {
    layout: (args) => {
      if (args[0] === "full-page") {
        return "w100vw flex-center flex-col";
      }
    }
  },
  bundleAll: true
}`,
    selected: false,
    type: "javascript"
  }
];
export const ACTUAL_HTML_FILE = {
  filename: "page.html",
  content: "",
  selected: true,
  type: "html"
};
export const TOTAL_CSS_FILE = {
  filename: "styles.css",
  content: "",
  selected: false,
  type: "css"
};
export const DEFAULT_OUTPUT_FILES = [ACTUAL_HTML_FILE, TOTAL_CSS_FILE];