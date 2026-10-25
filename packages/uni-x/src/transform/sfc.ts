/**
 * Minimal SFC block parser for .vue sources. Tolerates stray content outside
 * top-level blocks (e.g. sn-icon.vue's trailing CSS after `</style>`) — stray
 * content is reported and dropped rather than crashing the pipeline.
 */

export interface SfcBlock {
  tag: 'script' | 'template' | 'style';
  attrs: string;
  content: string;
}

export interface ParsedSfc {
  blocks: SfcBlock[];
  /** Non-whitespace source found outside top-level blocks. */
  stray: string;
}

const OPEN_BLOCK_RE = /<(script|template|style)\b([^>]*)>/g;
const TEMPLATE_INNER_RE = /<(\/?)template\b[^>]*>/g;

export function parseSfc(src: string): ParsedSfc {
  const blocks: SfcBlock[] = [];
  const strays: string[] = [];
  let pos = 0;

  for (;;) {
    OPEN_BLOCK_RE.lastIndex = pos;
    const m = OPEN_BLOCK_RE.exec(src);
    if (m === null) break;
    const gap: string = src.slice(pos, m.index);
    if (gap.trim() !== '') strays.push(gap.trim());

    const tag = m[1] as SfcBlock['tag'];
    const attrs: string = (m[2] ?? '').trim();
    const contentStart: number = m.index + m[0].length;
    let contentEnd: number;
    let blockEnd: number;
    if (tag === 'template') {
      const close = findTemplateClose(src, contentStart);
      if (close === null) break;
      contentEnd = close.content;
      blockEnd = close.blockEnd;
    } else {
      const close = src.indexOf(`</${tag}>`, contentStart);
      if (close === -1) break;
      contentEnd = close;
      blockEnd = close + tag.length + 3;
    }
    blocks.push({ tag, attrs, content: src.slice(contentStart, contentEnd) });
    pos = blockEnd;
  }
  const tail: string = src.slice(pos);
  if (tail.trim() !== '') strays.push(tail.trim());

  return { blocks, stray: strays.join('\n') };
}

/** Finds the matching root `</template>`; returns content/blockEnd offsets. */
function findTemplateClose(src: string, from: number): { content: number; blockEnd: number } | null {
  TEMPLATE_INNER_RE.lastIndex = from;
  let depth = 1;
  let mm: RegExpExecArray | null = TEMPLATE_INNER_RE.exec(src);
  while (mm !== null) {
    depth += mm[1] === '/' ? -1 : 1;
    if (depth === 0) {
      const content: number = mm.index;
      return { content, blockEnd: src.indexOf('>', mm.index) + 1 };
    }
    mm = TEMPLATE_INNER_RE.exec(src);
  }
  return null;
}
