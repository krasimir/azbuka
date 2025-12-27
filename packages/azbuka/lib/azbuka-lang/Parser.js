export function toAST(input, cache = {}) {
  if (cache[input]) return cache[input];

  if (Array.isArray(input)) {
    const optimized = [];
    input.forEach((str) => {
      str
        .trim()
        .split(" ")
        .forEach((part) => {
          if (!optimized.includes(part)) optimized.push(part);
        });
    });
    input = optimized.join(" ");
  }

  const s = String(input ?? "").trim();
  let i = 0;

  const isWS = (ch) => ch === " " || ch === "\n" || ch === "\t" || ch === "\r";

  function skipWS() {
    while (i < s.length && isWS(s[i])) i++;
  }

  function parseSequence(stopChar) {
    const nodes = [];
    while (i < s.length) {
      skipWS();
      if (stopChar && s[i] === stopChar) break;
      if (i >= s.length) break;
      nodes.push(parseItem());
    }
    return nodes;
  }

  function readIdentUntilDelimiter() {
    let out = "";
    while (i < s.length) {
      const ch = s[i];
      // stop at whitespace, "(", ")", ":" (variant separator)
      if (isWS(ch) || ch === "(" || ch === ")" || ch === ":") break;
      // IMPORTANT: DO NOT consume "[" here; it may be:
      //  - leading bracket variant (handled in parseItem when ch === "[")
      //  - attribute selector suffix (handled in parseItem after reading head)
      if (ch === "[") break;

      out += ch;
      i++;
    }
    return out.trim();
  }

  function isVariantLabel(str) {
    return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(str);
  }

  function isCallName(str) {
    return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(str);
  }

  function parseItem() {
    skipWS();
    const ch = s[i];

    // Bracket variant: [selector]:payload
    if (ch === "[") {
      const selectorRaw = parseBracketContent(); // returns content WITHOUT outer []
      const selectorAst = toAST(selectorRaw, cache);

      if (s[i] === ":") {
        i++;
        const payload = parseItem();
        return { type: "variant", selector: selectorAst, payload };
      }

      // If it's just a standalone bracket chunk (not a variant),
      // keep it as a token string. (You can change this if you prefer AST here.)
      return { type: "token", value: `[${selectorRaw}]` };
    }

    // Read label/name/token
    let head = readIdentUntilDelimiter();

    // NEW: absorb attribute selector suffixes: foo[...][...]
    // This handles &\[type=...\] and similar.
    while (s[i] === "[") {
      const inner = parseBracketContent(); // consumes the bracket block
      head += `[${inner}]`;
    }

    // Label variant: hover:..., desktop:..., focus:...
    if (s[i] === ":" && isVariantLabel(head)) {
      i++; // consume ":"
      const payload = parseItem();
      return { type: "variant", selector: head, payload, simple: true };
    }

    // Call: name(...)
    if (s[i] === "(" && isCallName(head)) {
      i++; // consume "("
      const args = [];
      while (i < s.length) {
        skipWS();
        if (s[i] === ")") {
          i++;
          break;
        }
        args.push(parseItem());
        skipWS();
        if (s[i] === ",") i++;
      }
      return { type: "call", name: head, args };
    }

    if (s[i] === ":") {
      head += ":";
      i++; // consume ":"

      // absorb following identifier / call / selector chunk
      while (i < s.length) {
        const ch = s[i];
        if (isWS(ch) || ch === ")" || ch === ",") break;

        if (ch === "[") {
          const inner = parseBracketContent();
          head += `[${inner}]`;
          continue;
        }

        if (ch === "(") {
          head += "(";
          i++;
          let depth = 1;
          while (i < s.length && depth > 0) {
            if (s[i] === "(") depth++;
            if (s[i] === ")") depth--;
            head += s[i++];
          }
          continue;
        }

        head += ch;
        i++;
      }
    }

    return { type: "token", value: head };
  }

  function parseBracketContent() {
    // assumes s[i] === "["
    i++; // consume "["
    let out = "";
    let bracket = 1;
    let quote = null;

    while (i < s.length) {
      const ch = s[i];

      if (quote) {
        out += ch;
        if (ch === "\\" && i + 1 < s.length) {
          i++;
          out += s[i];
        } else if (ch === quote) {
          quote = null;
        }
        i++;
        continue;
      }

      if (ch === "'" || ch === '"') {
        quote = ch;
        out += ch;
        i++;
        continue;
      }

      if (ch === "[") {
        bracket++;
        out += ch;
        i++;
        continue;
      }

      if (ch === "]") {
        bracket--;
        if (bracket === 0) {
          i++; // consume final "]"
          break;
        }
        out += ch;
        i++;
        continue;
      }

      out += ch;
      i++;
    }

    return out;
  }

  const ast = parseSequence(null);
  cache[input] = ast;
  return ast;
}
