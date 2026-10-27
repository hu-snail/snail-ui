/**
 * sn-rich-text style layer — inline-style sanitizer + composition.
 *
 * Reference library: wot-ui `wd-rich-text`
 *   (https://wot-ui.cn/component/rich-text.html)
 *
 * Content-supplied CSS is untrusted input (AGENTS.md §24: no DOM/global
 * escape). Only a fixed property allowlist survives, values are capped and
 * `url()` / `expression()` / `position` are dropped outright — the component
 * renders *typography*, not layout or resource loads. Composition order
 * mirrors the reference: tag defaults (CSS classes) → `tag-style` →
 * `class-styles` → HTML inline `style`, later winning per property.
 */

/** Inline style properties that may survive from content HTML. */
const STYLE_PROPERTY_ALLOWLIST = new Set([
  // color / font / text
  'color',
  'background-color',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'word-break',
  'word-wrap',
  'overflow-wrap',
  'white-space',
  'text-align',
  'text-decoration',
  'text-indent',
  'text-transform',
  'vertical-align',
  // box model
  'width',
  'height',
  'max-width',
  'min-width',
  'max-height',
  'min-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border',
  'border-width',
  'border-style',
  'border-color',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-radius',
]);

/** Value fragments that make a declaration unsafe regardless of property. */
const FORBIDDEN_VALUE_RE = /expression|javascript:|vbscript:|@import|position\s*:|url\s*\(/i;

/** Upper bounds so hostile content cannot blow up inline style strings. */
const MAX_DECLARATION_LENGTH = 256;
const MAX_STYLE_LENGTH = 2048;

/**
 * Parse a raw CSS declaration string into trimmed `property: value` pairs.
 * Malformed / unsafe / over-long declarations are dropped silently — the
 * sanitizer is a filter, not a validator that reports back.
 */
export function parseStyleDeclarations(raw: string): Array<{ property: string; value: string }> {
  const out: Array<{ property: string; value: string }> = [];
  if (raw === '' || raw.length > MAX_STYLE_LENGTH) return out;
  for (const piece of raw.split(';')) {
    const sep = piece.indexOf(':');
    if (sep <= 0) continue;
    const property = piece.slice(0, sep).trim().toLowerCase();
    const value = piece.slice(sep + 1).trim();
    if (!STYLE_PROPERTY_ALLOWLIST.has(property)) continue;
    if (value === '' || value.length > MAX_DECLARATION_LENGTH) continue;
    if (FORBIDDEN_VALUE_RE.test(value)) continue;
    if (/[<>{}]/.test(value)) continue;
    out.push({ property, value });
  }
  return out;
}

/**
 * Sanitize a raw inline `style` attribute value back to a declaration string.
 * Deterministic: declaration order follows the input, unsafe parts removed.
 */
export function sanitizeInlineStyle(raw: string): string {
  return parseStyleDeclarations(raw)
    .map((d) => `${d.property}:${d.value}`)
    .join(';');
}

/**
 * Merge declaration strings left-to-right; the rightmost wins per property.
 * Used for the default → tag-style → class-styles → inline priority chain.
 */
export function mergeStyles(...layers: string[]): string {
  const merged = new Map<string, string>();
  for (const layer of layers) {
    if (layer === '') continue;
    for (const { property, value } of parseStyleDeclarations(layer)) {
      merged.set(property, value);
    }
  }
  const parts: string[] = [];
  for (const [property, value] of merged) parts.push(`${property}:${value}`);
  return parts.join(';');
}

/**
 * Editor (Quill) built-in class styles: alignment, indent, size and font map
 * to concrete declarations. Custom classes are served through `class-styles`.
 */
const EDITOR_CLASS_STYLES: Record<string, string> = {
  'ql-align-center': 'text-align:center',
  'ql-align-right': 'text-align:right',
  'ql-align-justify': 'text-align:justify',
  'ql-indent-1': 'padding-left:3em',
  'ql-indent-2': 'padding-left:6em',
  'ql-indent-3': 'padding-left:9em',
  'ql-indent-4': 'padding-left:12em',
  'ql-indent-5': 'padding-left:15em',
  'ql-indent-6': 'padding-left:18em',
  'ql-indent-7': 'padding-left:21em',
  'ql-indent-8': 'padding-left:24em',
  'ql-size-small': 'font-size:0.75em',
  'ql-size-large': 'font-size:1.5em',
  'ql-size-huge': 'font-size:2.5em',
  'ql-font-serif': "font-family:Georgia,'Times New Roman',serif",
  'ql-font-monospace': "font-family:'Courier New',monospace",
};

/**
 * Resolve the inline style for one node:
 * `tag-style[tag]` → `class-styles[class]` (editor builtins first, user wins)
 * → the node's sanitized HTML inline style.
 */
export function resolveNodeStyle(
  node: { tag: string; classes: string[]; style: string },
  tagStyle: Record<string, string>,
  classStyles: Record<string, string>,
): string {
  const layers: string[] = [];
  const tagLayer = tagStyle[node.tag];
  if (typeof tagLayer === 'string') layers.push(tagLayer);
  for (const cls of node.classes) {
    const userLayer = classStyles[cls];
    if (typeof userLayer === 'string') {
      layers.push(userLayer);
      continue;
    }
    const builtinLayer = EDITOR_CLASS_STYLES[cls];
    if (typeof builtinLayer === 'string') layers.push(builtinLayer);
  }
  layers.push(node.style);
  return mergeStyles(...layers);
}

/**
 * Normalize a width/height attribute to CSS: bare numbers become px,
 * percentages and units pass through, everything else is dropped.
 */
export function normalizeSizeAttr(raw: string): string {
  const value = raw.trim();
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  if (/^\d+(\.\d+)?(px|%|em|rem|rpx)$/.test(value)) return value;
  return '';
}

/** True when `raw` looks like a `n`-digit width percent of the table. */
export function isPercentWidth(raw: string): boolean {
  return /^\d+(\.\d+)?%$/.test(raw.trim());
}
