function splitClassName(label) {
  const lastColonIndex = label.lastIndexOf(":");
  if (lastColonIndex === -1) {
    return [null, label];
  }
  const prefix = label.slice(0, lastColonIndex);
  const rest = label.slice(lastColonIndex + 1);
  return [prefix, rest];
}
function parseClass(str) {
  const out = [];
  let buf = "";

  // Tracks nesting inside [] or ()
  let depth = 0;
  let quote = null;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    // If we're inside [] or (), handle quotes specially
    if (depth > 0) {
      if (quote) {
        buf += ch;
        if (ch === quote && str[i - 1] !== "\\") quote = null;
        continue;
      } else if (ch === "'" || ch === '"') {
        quote = ch;
        buf += ch;
        continue;
      }
    }

    // Enter group: [ or (
    if (ch === "[" || ch === "(") {
      depth++;
      buf += ch;
      continue;
    }

    // Leave group: ] or )
    if ((ch === "]" || ch === ")") && depth > 0) {
      depth--;
      buf += ch;
      continue;
    }

    // Split on whitespace only when not inside [] or ()
    if (depth === 0 && /\s/.test(ch)) {
      if (buf) out.push(buf);
      buf = "";
      // skip consecutive whitespace
      while (i + 1 < str.length && /\s/.test(str[i + 1])) i++;
      continue;
    }

    buf += ch;
  }

  if (buf) out.push(buf);
  return out;
}

export default function az(classes) {
  return parseClass(classes)
    .map((className) => {
      let [label, rest] = splitClassName(className);
      if (!label || label === "[true]") return normalizeLabel(rest);
      if (label === "[false]") return false;
      label = normalizeLabel(label);
      return rest
        .split(",")
        .map((cls) => `${label}_${cls}`)
        .join(" ");
    })
    .filter(Boolean)
    .join(" ");
}
export function normalizeLabel(label) {
  let normalized = label.trim();
  normalized = normalized.replace(/[&]/g, "I");
  normalized = normalized.replace(/[:| =|(]/g, "-");
  normalized = normalized.replace(/[^a-zA-Z0-9_-]/g, "");
  return normalized;
}