export default {
  source: "./src",
  mapping: {
    queries: {
      desktop: "min-width: 768px", // desktop
      mobile: "max-width: 768px" // mobile
    }
  },
  output: "./src/forgecss.css"
};