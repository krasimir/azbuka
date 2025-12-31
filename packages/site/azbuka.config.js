export default {
  dir: "./src",
  output: "./public/styles.css",
  breakpoints: {
    media: {
      desktop: "all and (min-width: 780px)",
      mobile: "all and (max-width: 779px)"
    }
  },
  macros: {
    title: () => {
      return "tac fz2 desktop:fz3";
    }
  },
  bundleAll: true,
  minify: true
}