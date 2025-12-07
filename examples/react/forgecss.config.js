export default {
  source: "./src",
  mapping: {
    queries: {
      desktop: { query: "min-width: 768px" }, // desktop
      mobile: { query: "max-width: 768px" } // mobile
    }
  },
  output: "./src/forgecss.css"
};