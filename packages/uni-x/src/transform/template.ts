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
const DATA_ATTR_RE = /(\s)(?::)?data-[A-Za-z0-9_.-]+(?:="[^"]*"|='[^']*'|=[^\s"'<>/`]+|(?=[\s/<>]))/g;

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
          out += m[0];
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
    issues.push({ file, kind: 'template-attr', detail: `${renamedTap} @tap binding(s) renamed to @click` });
  }
  if (strippedDataAttrs > 0) {
    issues.push({
      file,
      kind: 'template-attr',
      detail: `${strippedDataAttrs} data-* attribute(s) stripped`,
    });
  }
  return { code: out, issues };
}
