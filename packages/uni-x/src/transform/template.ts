/**
 * Template transform (ADR-0004):
 *  - bare text nodes wrapped in `<text>` (uni-app x App renders raw text only
 *    inside `<text>`; auto-wrapped text inherits no styles)
 *  - `@tap` → `@click` (uni-app x view documents `click`; `tap` support is
 *    unconfirmed on vapor)
 *  - `data-*` / `:data-*` attributes stripped (docs preview-bridge hooks only;
 *    App-side attribute allowlist risk)
 *
 * `aria-*` attributes are kept — uni-app x ships accessibility support but
 * per-attribute coverage is a spike-verify item.
 */

import type { TextTransformResult, TransformIssue } from './types.ts';

/** Parents whose text content must not be wrapped (already text-ish or void). */
const NO_WRAP_TAGS = new Set(['text', 'textarea', 'input', 'image']);

const OPEN_TAG_RE = /^<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/;
const CLOSE_TAG_RE = /^<\/\s*([\w-]+)\s*>/;
const TAP_RE = /@tap(?=[.=\s])/g;
const DATA_ATTR_RE =
  /(\s)(?::)?data-[A-Za-z0-9_.-]+(?:="[^"]*"|='[^']*'|=[^\s"'<>/`]+|(?=[\s/<>]))/g;

// scroll-x / scroll-y are deprecated no-ops in uni-app x (vapor honors only
// `direction`, which defaults to vertical) — a scroll-x scroll-view silently
// loses horizontal scrolling. Bare attr and the :scroll-x="true" literal map
// to direction="horizontal"; combined with any scroll-y form they map to
// direction="all". scroll-y-only stays untouched (default is vertical).
// Non-literal :scroll-x bindings cannot map (App forbids dynamic direction
// switches) — left in place and flagged via issue.
const SCROLL_X_BARE_TEST = /(\s)scroll-x(?=[\s/=>])/;
const SCROLL_X_BARE_RE = /(\s)scroll-x(?=[\s/=>])/g;
const SCROLL_X_LITERAL_TEST = /(\s):scroll-x="true"(?=[\s/=>])/;
const SCROLL_X_LITERAL_RE = /(\s):scroll-x="true"(?=[\s/=>])/g;
const SCROLL_X_DYNAMIC_TEST = /(\s):scroll-x="(?!true")/;
const SCROLL_Y_TEST = /(\s)(?::scroll-y="[^"]*"|scroll-y)(?=[\s/=>])/;
const SCROLL_Y_RE = /(\s)(?::scroll-y="[^"]*"|scroll-y)(?=[\s/=>])/g;

interface OpenTag {
  raw: string;
  name: string;
  selfClosing: boolean;
  end: number;
}

function parseOpenTag(src: string, start: number): OpenTag | null {
  const m = OPEN_TAG_RE.exec(src.slice(start));
  if (m === null) return null;
  const raw: string = m[0];
  const attrs: string = m[2] ?? '';
  return {
    raw,
    name: m[1]!,
    selfClosing: attrs.trimEnd().endsWith('/'),
    end: start + raw.length,
  };
}

function countMatches(text: string, re: RegExp): number {
  return (text.match(re) ?? []).length;
}

export function transformTemplate(src: string, file: string): TextTransformResult {
  const issues: TransformIssue[] = [];
  const stack: string[] = [];
  let out = '';
  let i = 0;
  let bareText = 0;
  let renamedTap = 0;
  let strippedDataAttrs = 0;
  let scrollDirRewrites = 0;
  let firstBareLine = 0;
  const lineAt = (pos: number): number => src.slice(0, pos).split('\n').length;

  while (i < src.length) {
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      const stop = end === -1 ? src.length : end + 3;
      out += src.slice(i, stop);
      i = stop;
      continue;
    }
    const c: string = src.charAt(i);
    if (c === '<') {
      if (src.charAt(i + 1) === '/') {
        const m = CLOSE_TAG_RE.exec(src.slice(i));
        if (m !== null) {
          stack.pop();
          // The source uses glued-bracket chains (`></slot\n        >`) to keep
          // whitespace-only text nodes out of tight layouts. The uts (uni-app x)
          // parser rejects an end tag whose `>` sits on a later line — it reads
          // as an unterminated element ("Element is missing end tag"). Re-emit
          // the tag compactly: the newline lived INSIDE the end tag, so no
          // text node is introduced and the zero-whitespace glue semantics hold.
          out += `</${m[1]!}>`;
          i += m[0].length;
          continue;
        }
      }
      const tag = parseOpenTag(src, i);
      if (tag === null) {
        out += c;
        i++;
        continue;
      }
      let tagText: string = tag.raw;
      renamedTap += countMatches(tagText, TAP_RE);
      tagText = tagText.replace(TAP_RE, '@click');
      strippedDataAttrs += countMatches(tagText, DATA_ATTR_RE);
      tagText = tagText.replace(DATA_ATTR_RE, '$1');

      // uni-app x scroll-view: deprecated scroll-x / scroll-y → direction
      if (
        SCROLL_X_BARE_TEST.test(tagText) ||
        SCROLL_X_LITERAL_TEST.test(tagText) ||
        SCROLL_X_DYNAMIC_TEST.test(tagText)
      ) {
        if (SCROLL_X_DYNAMIC_TEST.test(tagText)) {
          issues.push({
            file,
            kind: 'template-attr',
            detail: 'dynamic :scroll-x binding left in place — uni-app x App forbids dynamic direction switches, map to a static direction manually',
          });
        }
        if (SCROLL_X_BARE_TEST.test(tagText) || SCROLL_X_LITERAL_TEST.test(tagText)) {
          const direction = SCROLL_Y_TEST.test(tagText) ? 'all' : 'horizontal';
          tagText = tagText
            .replace(SCROLL_X_BARE_RE, `$1direction="${direction}"`)
            .replace(SCROLL_X_LITERAL_RE, `$1direction="${direction}"`);
          if (direction === 'all') tagText = tagText.replace(SCROLL_Y_RE, '$1');
          scrollDirRewrites++;
        }
      }

      out += tagText;
      if (!tag.selfClosing) stack.push(tag.name);
      i = tag.end;
      continue;
    }
    const next = src.indexOf('<', i);
    const stop = next === -1 ? src.length : next;
    const text: string = src.slice(i, stop);
    if (/\S/.test(text)) {
      const parent: string | undefined = stack[stack.length - 1];
      if (parent === undefined || !NO_WRAP_TAGS.has(parent)) {
        bareText++;
        if (firstBareLine === 0) firstBareLine = lineAt(i);
        out += `<text>${text}</text>`;
        i = stop;
        continue;
      }
    }
    out += text;
    i = stop;
  }

  if (bareText > 0) {
    issues.push({
      file,
      kind: 'template-bare-text',
      detail: `${bareText} bare text node(s) wrapped in <text>`,
      line: firstBareLine > 0 ? firstBareLine : undefined,
    });
  }
  if (renamedTap > 0) {
    issues.push({
      file,
      kind: 'template-attr',
      detail: `${renamedTap} @tap binding(s) renamed to @click`,
    });
  }
  if (strippedDataAttrs > 0) {
    issues.push({
      file,
      kind: 'template-attr',
      detail: `${strippedDataAttrs} data-* attribute(s) stripped`,
    });
  }
  if (scrollDirRewrites > 0) {
    issues.push({
      file,
      kind: 'template-attr',
      detail: `${scrollDirRewrites} scroll-x/scroll-y attr(s) rewritten to direction`,
    });
  }
  return { code: out, issues };
}
