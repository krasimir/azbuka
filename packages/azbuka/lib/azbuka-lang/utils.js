export function minifyCSS(css) {
  return (
    css
      // remove comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // remove whitespace around symbols
      .replace(/\s*([{}:;,])\s*/g, "$1")
      // remove trailing semicolons
      .replace(/;}/g, "}")
      // collapse multiple spaces
      .replace(/\s+/g, " ")
      // remove spaces before/after braces
      .replace(/\s*{\s*/g, "{")
      .replace(/\s*}\s*/g, "}")
      // trim
      .trim()
  );
}
