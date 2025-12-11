export const SPLIT_CLASSES_REGEXP = /\s+(?![^\[]*\])/;

export default function fx(classes) {
  return classes
    .split(SPLIT_CLASSES_REGEXP)
    .map((className) => {
      const [label, rest] = splitClassName(className);
      if (!label || label === "[true]") return rest;
      if (label === "[false]") return null;
      return rest
        .split(",")
        .map((cls) => `${label}:${cls}`)
        .join(" ");
    })
    .filter(Boolean)
    .join(" ");
}
export function splitClassName(label) {
  const lastColonIndex = label.lastIndexOf(":");
  if (lastColonIndex === -1) {
    return [null, label];
  }
  const prefix = label.slice(0, lastColonIndex);
  const rest = label.slice(lastColonIndex + 1);
  return [prefix, rest];
}

export function normalizeLabel(label) {
  let normalized = label.trim();
  normalized = normalized.replace(/[^a-zA-Z0-9_-]/g, (m) => "\\" + m);
  return normalized;
}
