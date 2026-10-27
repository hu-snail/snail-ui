/**
 * sn-rich-text parser — HTML subset → sanitized node tree.
 *
 * Reference library: wot-ui `wd-rich-text`
 *   (https://wot-ui.cn/component/rich-text.html)
 *
 * A deterministic, dependency-free tokenizer + tree builder for the supported
 * content subset: headings, paragraphs, emphasis, quotes, code, lists,
 * images, links, tables and media. Malformed input degrades gracefully —
 * unclosed tags are closed implicitly, stray close tags are dropped, unknown
 * tags render as generic containers, unsafe content is filtered. Hard limits
 * mirror the reference (200k UTF-16 units / 10k nodes / 128 depth) and
 * surface as RichTextParseError so the component can emit a structured
 * `error` event.
 *
 * Security posture (AGENTS.md §23/§24): no eval, no dynamic code paths; the
 * output is data only. script/style/iframe/svg are dropped with their
 * content, event-handler attributes never survive, styles go through the
 * node-style allowlist, and resource URLs are scheme-checked.
 */

import { sanitizeInlineStyle } from './sn-rich-text-node-style';
import type {
  RichTextNode,
  RichTextParseResult,
  RichTextImageInfo,
  RichTextTableCell,
  RichTextTableMeta,
} from './sn-rich-text-types';

/** Hard content limits (mirror the reference implementation). */
export const RICH_TEXT_MAX_CONTENT_LENGTH = 200_000;
export const RICH_TEXT_MAX_NODES = 10_000;
export const RICH_TEXT_MAX_DEPTH = 128;

/** Structured parse failure — surfaced as `error { source: 'parse' }`. */
export class RichTextParseError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'RichTextParseError';
    this.code = code;
  }
}

/** Void elements — never push onto the open-element stack. */
const VOID_TAGS = new Set(['img', 'br', 'hr', 'source', 'col']);

/** Tags whose raw content is dropped entirely. */
const DROP_WITH_CONTENT = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'svg',
  'canvas',
  'noscript',
  'template',
  'title',
  'head',
  'meta',
  'link',
  'form',
  'input',
  'button',
  'select',
  'textarea',
  'option',
]);

/** Block-level tags the renderer lays out as containers. */
export const BLOCK_TAGS = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'div',
  'section',
  'article',
  'header',
  'footer',
  'main',
  'aside',
  'blockquote',
  'pre',
  'ul',
  'ol',
  'li',
  'figure',
  'figcaption',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'hr',
  'video',
  'audio',
]);

/** Tags rendered as inline text runs (grouped into a single <text>). */
export const INLINE_TAGS = new Set([
  'text',
  'span',
  'a',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'strike',
  'ins',
  'code',
  'small',
  'sub',
  'sup',
  'mark',
  'br',
]);

/** Attributes that may survive per tag ('*' = any element). */
const ATTR_ALLOWLIST: Record<string, Set<string>> = {
  img: new Set(['src', 'alt', 'original-src', 'data-preview', 'width', 'height']),
  a: new Set(['href', 'title']),
  video: new Set(['src', 'poster', 'id', 'loop', 'muted']),
  audio: new Set(['src', 'id', 'title']),
  source: new Set(['src']),
  td: new Set(['colspan', 'rowspan', 'width']),
  th: new Set(['colspan', 'rowspan', 'width']),
  col: new Set(['width', 'span']),
  colgroup: new Set(['span']),
  '*': new Set(['style', 'class', 'id']),
};

/** Common named entities (the reference supports these plus numeric forms). */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  copy: '©',
  reg: '®',
  trade: '™',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  laquo: '«',
  raquo: '»',
  times: '×',
  divide: '÷',
  plusmn: '±',
  deg: '°',
  middot: '·',
  bull: '•',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  sect: '§',
  larr: '←',
  rarr: '→',
  uarr: '↑',
  darr: '↓',
};

/** `&#13;` / `&#x1F;` / named — one scan handles all three forms. */
const ENTITY_RE = /&(?:#([0-9]+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z][a-zA-Z0-9]*));/g;

/** Anchor-target ids must stay selector-safe. */
const SAFE_ID_RE = /^[\w-]{1,128}$/;

/** Media ids follow the reference: ≤128 code units, no whitespace/control. */
const MEDIA_ID_RE = /^[\w-]{1,128}$/;

/** Tags that never become anchor targets (mirrors the reference). */
const NON_ANCHOR_TAGS = new Set(['source', 'col', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr']);

export interface RichTextParseOptions {
  /** Accept ≤64KiB PNG/JPEG/GIF/WebP base64 images (default: drop them). */
  allowDataImage: boolean;
  /** Absolute HTTP(S) base used to resolve relative resource addresses. */
  baseUrl: string;
}

/** True for `http(s):` and protocol-relative addresses. */
function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith('//');
}

/** True for addresses the platform can load as a resource. */
function isSafeResourceUrl(url: string, options: RichTextParseOptions): boolean {
  const value = url.trim();
  if (value === '') return false;
  if (value.startsWith('data:')) {
    if (!options.allowDataImage) return false;
    // PNG/JPEG/GIF/WebP base64 only, ≤64KiB of decoded bytes (≈len×3/4).
    const match = /^data:image\/(png|jpe?g|gif|webp);base64,([a-zA-Z0-9+/=]+)$/.exec(value);
    if (match === null) return false;
    const payload: string = match[2] ?? '';
    return (payload.length * 3) / 4 <= 64 * 1024;
  }
  if (isHttpUrl(value)) return true;
  if (/^(mailto|tel|javascript|vbscript|file|blob):/i.test(value)) return false;
  // Relative / root-relative / ./ ../ forms — anything with a scheme before
  // the first slash (and no slash at all, e.g. `foo:bar`) is rejected.
  const schemeEnd = value.indexOf(':');
  if (schemeEnd === -1) return true;
  const slashEnd = value.indexOf('/');
  if (slashEnd === -1) return false;
  return schemeEnd > slashEnd;
}

/** True for hrefs a link may carry (resources + mailto/tel/#anchor). */
function isSafeLinkHref(url: string): boolean {
  const value = url.trim();
  if (value === '') return false;
  if (value.startsWith('#')) return true;
  if (/^(mailto|tel):/i.test(value)) return true;
  return isSafeResourceUrl(value, { allowDataImage: false, baseUrl: '' });
}

/** Resolve a relative resource against an absolute HTTP(S) base. */
function resolveWithBase(url: string, baseUrl: string): string {
  const value = url.trim();
  if (baseUrl === '' || isHttpUrl(value) || value.startsWith('data:')) return value;
  if (!/^https?:\/\//i.test(baseUrl)) return value;
  if (value.startsWith('/')) {
    const originEnd = baseUrl.indexOf('/', baseUrl.indexOf('//') + 2);
    const origin = originEnd === -1 ? baseUrl : baseUrl.slice(0, originEnd);
    return origin + value;
  }
  const dirEnd = baseUrl.lastIndexOf('/');
  const originPrefix = baseUrl.indexOf('//') + 2;
  const dir = dirEnd > originPrefix ? baseUrl.slice(0, dirEnd + 1) : baseUrl;
  return dir + value.replace(/^\.\//, '');
}

/** Decode HTML entities: numeric (decimal + hex) and the named subset. */
export function decodeEntities(raw: string): string {
  if (!raw.includes('&')) return raw;
  return raw.replace(
    ENTITY_RE,
    (match: string, dec: string | undefined, hex: string | undefined, name: string | undefined) => {
      if (dec !== undefined || hex !== undefined) {
        const code = Number.parseInt(
          dec !== undefined ? dec : (hex ?? ''),
          dec !== undefined ? 10 : 16,
        );
        if (!Number.isFinite(code) || code < 0x20 || code > 0x10ffff) return match;
        if (code >= 0xd800 && code <= 0xdfff) return match;
        return String.fromCodePoint(code);
      }
      const named = name !== undefined ? NAMED_ENTITIES[name] : undefined;
      return named !== undefined ? named : match;
    },
  );
}

interface ParsedTag {
  name: string;
  attrs: Record<string, string>;
  selfClosing: boolean;
  /** Total source length consumed by the open tag. */
  length: number;
}

const TAG_OPEN_RE = /^<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/;
const ATTR_RE = /([a-zA-Z_][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

/** Parse one open tag at the string head; null when there is no tag there. */
function parseOpenTag(src: string): ParsedTag | null {
  const match = TAG_OPEN_RE.exec(src);
  if (match === null) return null;
  const raw: string = match[0];
  const name: string = match[1]!.toLowerCase();
  const attrs: Record<string, string> = {};
  const attrSource: string = match[2] ?? '';
  ATTR_RE.lastIndex = 0;
  let attrMatch: RegExpExecArray | null = ATTR_RE.exec(attrSource);
  while (attrMatch !== null) {
    const attrName: string = attrMatch[1]!.toLowerCase();
    const value = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
    if (attrs[attrName] === undefined) attrs[attrName] = decodeEntities(value);
    attrMatch = ATTR_RE.exec(attrSource);
  }
  return { name, attrs, selfClosing: attrSource.trimEnd().endsWith('/'), length: raw.length };
}

/** Filter attributes through the per-tag allowlist (+ style sanitizer). */
function sanitizeAttrs(tag: string, attrs: Record<string, string>): Record<string, string> {
  const universal = ATTR_ALLOWLIST['*']!;
  const allowed = ATTR_ALLOWLIST[tag];
  const out: Record<string, string> = {};
  for (const name of Object.keys(attrs)) {
    const permitted = universal.has(name) || (allowed !== undefined && allowed.has(name));
    if (!permitted) continue;
    if (name === 'style') out.style = sanitizeInlineStyle(attrs.style ?? '');
    else out[name] = attrs[name] ?? '';
  }
  return out;
}

function createNode(tag: string, attrs: Record<string, string>): RichTextNode {
  return {
    tag,
    attrs,
    classes:
      typeof attrs.class === 'string' && attrs.class !== ''
        ? attrs.class.split(/\s+/).filter((c) => c !== '')
        : [],
    style: typeof attrs.style === 'string' ? attrs.style : '',
    children: [],
  };
}

/** Append a text run; adjacent runs merge to keep the tree small. */
function appendText(children: RichTextNode[], text: string): void {
  if (text === '') return;
  const last = children[children.length - 1];
  if (last !== undefined && last.tag === 'text' && last.text !== undefined) {
    last.text += text;
    return;
  }
  children.push({ tag: 'text', attrs: {}, classes: [], style: '', children: [], text });
}

/**
 * Parse `content` into a sanitized tree. Throws RichTextParseError when a
 * hard limit is exceeded — the component converts that into `error` + empty
 * state. Pure: same input + options always produce the same tree.
 */
export function parseRichText(content: string, options: RichTextParseOptions): RichTextParseResult {
  if (content.length > RICH_TEXT_MAX_CONTENT_LENGTH) {
    throw new RichTextParseError('CONTENT_TOO_LARGE', 'content exceeds 200000 UTF-16 code units');
  }

  const lowerContent = content.toLowerCase();
  let nodeCount = 0;
  const root: RichTextNode[] = [];
  // Open elements; `raw` marks whitespace-preserving contexts (pre).
  const stack: Array<{ node: RichTextNode; raw: boolean }> = [];
  // Assigned media ids across the whole content (duplicates lose theirs).
  const usedMediaIds = new Set<string>();

  const bumpNodes = (): void => {
    nodeCount += 1;
    if (nodeCount > RICH_TEXT_MAX_NODES) {
      throw new RichTextParseError('NODE_LIMIT_EXCEEDED', 'content exceeds 10000 parse nodes');
    }
    if (stack.length >= RICH_TEXT_MAX_DEPTH) {
      throw new RichTextParseError('DEPTH_LIMIT_EXCEEDED', 'content nesting exceeds 128 levels');
    }
  };

  const currentChildren = (): RichTextNode[] => {
    const parent = stack[stack.length - 1];
    return parent === undefined ? root : parent.node.children;
  };

  let i = 0;
  while (i < content.length) {
    if (content.startsWith('<!--', i)) {
      const end = content.indexOf('-->', i + 4);
      i = end === -1 ? content.length : end + 3;
      continue;
    }
    if (content.charAt(i) !== '<') {
      const next = content.indexOf('<', i);
      const stop = next === -1 ? content.length : next;
      const rawChunk = content.slice(i, stop);
      const rawMode = stack[stack.length - 1]?.raw === true;
      const decoded = decodeEntities(rawChunk);
      appendText(currentChildren(), rawMode ? decoded : decoded.replace(/[ \t\r\n\f]+/g, ' '));
      i = stop;
      continue;
    }

    if (content.charAt(i + 1) === '/') {
      const closeEnd = content.indexOf('>', i);
      const closeMatch = /^<\/\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(
        content.slice(i, closeEnd === -1 ? content.length : closeEnd),
      );
      const name = closeMatch === null ? '' : closeMatch[1]!.toLowerCase();
      // Close the nearest matching open element (implicitly closes inner ones).
      let openIndex = -1;
      for (let s = stack.length - 1; s >= 0; s -= 1) {
        if (stack[s] !== undefined && stack[s]!.node.tag === name) {
          openIndex = s;
          break;
        }
      }
      if (openIndex !== -1) stack.length = openIndex;
      i = closeEnd === -1 ? content.length : closeEnd + 1;
      continue;
    }

    const tag = parseOpenTag(content.slice(i));
    if (tag === null) {
      // Lone '<' — literal text.
      appendText(currentChildren(), '<');
      i += 1;
      continue;
    }

    if (DROP_WITH_CONTENT.has(tag.name)) {
      const closeTag = '</' + tag.name + '>';
      const close = lowerContent.indexOf(closeTag, i + tag.name.length);
      i = close === -1 ? content.length : close + closeTag.length;
      continue;
    }

    if (tag.name === 'br' || tag.name === 'hr') {
      bumpNodes();
      appendNodeRef(createNode(tag.name, sanitizeAttrs(tag.name, tag.attrs)));
      i += tag.length;
      continue;
    }

    // HTML implicit close: a block-level start tag ends an open paragraph.
    if (BLOCK_TAGS.has(tag.name)) {
      const top = stack[stack.length - 1];
      if (top !== undefined && top.node.tag === 'p') stack.pop();
    }

    bumpNodes();
    const cleanAttrs = sanitizeAttrs(tag.name, tag.attrs);
    const node = createNode(tag.name, cleanAttrs);

    if (tag.name === 'a') {
      const href = cleanAttrs.href ?? '';
      node.attrs.href = isSafeLinkHref(href) ? href.trim() : '';
    }
    if (tag.name === 'li') {
      const listAncestor = findListAncestor();
      if (listAncestor !== undefined) {
        node.list = {
          ordered: listAncestor.tag === 'ol',
          index: listAncestor.node.children.filter((c) => c.tag === 'li').length + 1,
        };
      }
    }
    if (tag.name === 'img') {
      const src = cleanAttrs.src ?? '';
      node.attrs.src = isSafeResourceUrl(src, options) ? resolveWithBase(src, options.baseUrl) : '';
      const original = cleanAttrs['original-src'] ?? '';
      node.attrs['original-src'] =
        original !== '' && isSafeResourceUrl(original, options)
          ? resolveWithBase(original, options.baseUrl)
          : '';
    }
    if (tag.name === 'video' || tag.name === 'audio') {
      const src = cleanAttrs.src ?? '';
      node.attrs.src = isSafeResourceUrl(src, options) ? resolveWithBase(src, options.baseUrl) : '';
      if (tag.name === 'video') {
        const poster = cleanAttrs.poster ?? '';
        node.attrs.poster =
          poster !== '' && isSafeResourceUrl(poster, options)
            ? resolveWithBase(poster, options.baseUrl)
            : '';
      }
      const rawId = cleanAttrs.id ?? '';
      const addressable = rawId !== '' && MEDIA_ID_RE.test(rawId) && !usedMediaIds.has(rawId);
      if (addressable) usedMediaIds.add(rawId);
      node.media = {
        kind: tag.name,
        id: addressable ? rawId : '',
        src: node.attrs.src ?? '',
        poster: tag.name === 'video' ? (node.attrs.poster ?? '') : '',
      };
    }

    appendNodeRef(node);
    i += tag.length;

    const selfClosing = tag.selfClosing || VOID_TAGS.has(tag.name);
    if (selfClosing) continue;
    stack.push({ node, raw: tag.name === 'pre' });
  }

  applySourceFallback(root, options);
  trimBlockEdges(root);
  const imageCount = assignImageInfo(root);
  assignAnchorIds(root);
  const images = collectImageInfos(root);
  buildTableGrids(root);

  return { root, imageCount, images };

  function appendNodeRef(node: RichTextNode): void {
    const parent = stack[stack.length - 1];
    if (parent === undefined) root.push(node);
    else parent.node.children.push(node);
  }

  /** Nearest ul/ol on the open stack (li markers derive from it). */
  function findListAncestor(): { node: RichTextNode; tag: string } | undefined {
    for (let s = stack.length - 1; s >= 0; s -= 1) {
      const entry = stack[s];
      if (entry !== undefined && (entry.node.tag === 'ul' || entry.node.tag === 'ol')) {
        return { node: entry.node, tag: entry.node.tag };
      }
    }
    return undefined;
  }
}

/**
 * `video` may declare sources via child `<source>` — fall back to the first
 * valid one when the element itself has no usable src.
 */
function applySourceFallback(nodes: RichTextNode[], options: RichTextParseOptions): void {
  for (const node of nodes) {
    if (node.tag === 'video' && node.media !== undefined && node.media.src === '') {
      const sourceNode = node.children.find((c) => c.tag === 'source');
      const src = sourceNode?.attrs.src ?? '';
      if (src !== '' && isSafeResourceUrl(src, options)) {
        const resolved = resolveWithBase(src, options.baseUrl);
        node.attrs.src = resolved;
        node.media.src = resolved;
      }
    }
    applySourceFallback(node.children, options);
  }
}

/** Trim whitespace-only text runs at block-container edges (pre excluded). */
function trimBlockEdges(nodes: RichTextNode[]): void {
  for (const node of nodes) {
    if (node.children.length > 0) trimBlockEdges(node.children);
    if (!BLOCK_TAGS.has(node.tag) || node.tag === 'pre') continue;
    while (node.children.length > 0) {
      const first = node.children[0];
      if (first === undefined || first.tag !== 'text' || !/^\s*$/.test(first.text ?? '')) break;
      node.children.shift();
    }
    while (node.children.length > 0) {
      const last = node.children[node.children.length - 1];
      if (last === undefined || last.tag !== 'text' || !/^\s*$/.test(last.text ?? '')) break;
      node.children.pop();
    }
  }
}

/**
 * Assign document-order image indexes; a nested walk fills `imageIndex` and
 * `linkHref` (nearest valid ancestor link — filtered links read as absent).
 * Returns the image count.
 */
function assignImageInfo(nodes: RichTextNode[], linkHref = '', counter = { index: 0 }): number {
  for (const node of nodes) {
    if (node.tag === 'img') {
      node.imageIndex = counter.index;
      node.linkHref = linkHref;
      counter.index += 1;
      continue;
    }
    const childHref = node.tag === 'a' ? (node.attrs.href ?? '') : linkHref;
    assignImageInfo(node.children, childHref !== '' ? childHref : linkHref, counter);
  }
  return counter.index;
}

/** Collect display info per image in document order. */
function collectImageInfos(nodes: RichTextNode[]): RichTextImageInfo[] {
  const out: RichTextImageInfo[] = [];
  const walk = (list: RichTextNode[]): void => {
    for (const node of list) {
      if (node.tag === 'img') {
        const src = node.attrs.src ?? '';
        const original = node.attrs['original-src'] ?? '';
        const previewSrc = original !== '' ? original : src;
        const previewOff = (node.attrs['data-preview'] ?? '').toLowerCase() === 'false';
        out.push({
          index: node.imageIndex ?? out.length,
          src,
          previewSrc,
          previewable: previewSrc !== '' && !previewOff && (node.linkHref ?? '') === '',
          inLink: (node.linkHref ?? '') !== '',
        });
        continue;
      }
      walk(node.children);
    }
  };
  walk(nodes);
  return out;
}

/**
 * Assign anchor ids: headings (h1-h6) and any element carrying an `id`
 * (except non-target tags). First occurrence keeps the HTML id; later
 * duplicates get a numbered id; unsafe ids on headings are replaced with
 * generated ones (unsafe ids on non-headings simply don't anchor).
 */
function assignAnchorIds(nodes: RichTextNode[]): void {
  const used = new Set<string>();
  let headingSeq = 0;
  const walk = (list: RichTextNode[]): void => {
    for (const node of list) {
      const isHeading = /^h[1-6]$/.test(node.tag);
      const rawId = node.attrs.id ?? '';
      // Every heading consumes a sequence number so generated ids stay stable
      // and duplicate HTML ids cannot collide with them.
      if (isHeading) headingSeq += 1;
      const wantsAnchor = (isHeading || rawId !== '') && !NON_ANCHOR_TAGS.has(node.tag);
      if (wantsAnchor) {
        let id = '';
        if (rawId !== '' && SAFE_ID_RE.test(rawId) && !used.has(rawId)) {
          id = rawId;
        } else if (isHeading) {
          id = `sn-rt-h-${headingSeq}`;
          let bump = 2;
          while (used.has(id)) {
            id = `sn-rt-h-${headingSeq}-${bump}`;
            bump += 1;
          }
        }
        if (id !== '') {
          used.add(id);
          node.anchorId = id;
        }
      }
      walk(node.children);
    }
  };
  walk(nodes);
}

/**
 * Pre-compute each table's grid: colspan/rowspan resolved into a sparse
 * occupancy map, column count and per-column widths (col/colgroup first,
 * then the first explicitly sized cell of each column). Bare numbers are
 * treated as px; percents pass through for the renderer to scale.
 */
function buildTableGrids(nodes: RichTextNode[]): void {
  for (const node of nodes) {
    if (node.tag === 'table') {
      node.table = buildTableMeta(node);
      continue;
    }
    buildTableGrids(node.children);
  }
}

function buildTableMeta(table: RichTextNode): RichTextTableMeta {
  const rows: RichTextTableCell[][] = [];
  const columnWidths: string[] = [];
  const occupied = new Set<string>();
  let columnCount = 0;

  const colWidths = collectColWidths(table);
  const rowNodes = collectRows(table);

  rowNodes.forEach((rowNode, rowIndex) => {
    const rowCells: RichTextTableCell[] = [];
    let col = 0;
    const cellNodes = rowNode.children.filter((c) => c.tag === 'td' || c.tag === 'th');
    for (const cellNode of cellNodes) {
      while (occupied.has(`${rowIndex}:${col}`)) col += 1;
      const colSpan = clampSpan(cellNode.attrs.colspan ?? '1');
      const rowSpan = clampSpan(cellNode.attrs.rowspan ?? '1');
      for (let r = 0; r < rowSpan; r += 1) {
        for (let c = 0; c < colSpan; c += 1) occupied.add(`${rowIndex + r}:${col + c}`);
      }
      const colWidth = colWidths[col] ?? '';
      const width = colWidth !== '' ? colWidth : widthAttrToCss(cellNode.attrs.width ?? '');
      rowCells.push({ node: cellNode, col, row: rowIndex, colSpan, rowSpan, width });
      if (width !== '' && (columnWidths[col] ?? '') === '') columnWidths[col] = width;
      col += colSpan;
    }
    columnCount = Math.max(columnCount, col);
    rows.push(rowCells);
  });

  for (let c = 0; c < columnCount; c += 1) {
    if ((columnWidths[c] ?? '') === '') columnWidths[c] = colWidths[c] ?? '';
  }

  return { rows, columnCount: Math.max(columnCount, colWidths.length), columnWidths };
}

/** colgroup/col widths (per span); '' marks auto columns. */
function collectColWidths(table: RichTextNode): string[] {
  const widths: string[] = [];
  const walk = (list: RichTextNode[]): void => {
    for (const node of list) {
      if (node.tag === 'colgroup') {
        const groupSpan = clampSpan(node.attrs.span ?? '1');
        let declared = 0;
        for (const col of node.children) {
          if (col.tag !== 'col') continue;
          const colSpan = clampSpan(col.attrs.span ?? '1');
          const width = widthAttrToCss(col.attrs.width ?? '');
          for (let s = 0; s < colSpan; s += 1) widths.push(width);
          declared += colSpan;
        }
        for (let s = declared; s < groupSpan; s += 1) widths.push('');
        continue;
      }
      walk(node.children);
    }
  };
  walk(table.children);
  return widths;
}

/** All tr nodes in document order (thead/tbody/tfoot are transparent). */
function collectRows(table: RichTextNode): RichTextNode[] {
  const rows: RichTextNode[] = [];
  const walk = (list: RichTextNode[]): void => {
    for (const node of list) {
      if (node.tag === 'tr') rows.push(node);
      else walk(node.children);
    }
  };
  walk(table.children);
  return rows;
}

function clampSpan(raw: string): number {
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(value, 99);
}

/** Width attribute → css value (number = px, unit forms pass through). */
function widthAttrToCss(raw: string): string {
  const value = raw.trim();
  if (value === '') return '';
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  if (/^\d+(\.\d+)?(px|%|em|rem|rpx)$/.test(value)) return value;
  return '';
}
