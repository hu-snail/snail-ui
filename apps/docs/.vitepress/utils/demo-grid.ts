/**
 * markdown-it plugin: lay component demos out as a card grid, two per row
 * (naive-ui style).
 *
 * ## Why a plugin instead of wrapping the markdown
 *
 * A demo section in these docs is `## 标题` + optional note + `<Demo … />`.
 * Markdown emits those blocks as flat siblings, so a `display: grid` on the
 * prose would drag every heading, paragraph and API table into the grid too,
 * and two different demos can never be made to share a row.
 *
 * Wrapping the sections by hand would mean editing ~600 sections across ~185
 * pages — and the wrappers would leak into the raw markdown that the "copy
 * document source" button hands to the reader.
 *
 * Doing the grouping on the token stream keeps every `.md` untouched: the
 * plugin runs as a core rule, finds the section boundaries and inserts
 * `html_block` tokens for the wrappers. Because the wrappers are raw HTML and
 * the headings stay real markdown headings, the sidebar outline, the `#`
 * anchors and the "on this page" links keep working.
 *
 * ## Rules
 *
 *   - A *cell* is a section that starts with an `h2`..`h4` heading and holds
 *     exactly one `<Demo>` block. Sections holding several demos (the
 *     "实时预览" playgrounds) keep their full-width stacked layout.
 *   - A run of two or more consecutive cells becomes a `sn-demo-grid`; a lone
 *     cell is still a card, merely full width.
 *   - Anything before the first heading (title + intro) is never wrapped.
 */

/** Markdown-it's `Token` exposes far more than this; the structural slice
 *  keeps the docs package free of a direct `markdown-it` dependency (same
 *  approach as ./raw-doc-source.ts). */
interface MarkdownToken {
  type: string
  tag: string
  content: string
  children?: MarkdownToken[] | null
}

interface MarkdownStateCore {
  Token: new (type: string, tag: string, nesting: number) => MarkdownToken
  tokens: MarkdownToken[]
}

interface MarkdownRenderer {
  core: {
    ruler: {
      push: (name: string, rule: (state: MarkdownStateCore) => void) => void
    }
  }
}

/** Matches a `<Demo … />` / `<Demo …>` opening tag. */
const DEMO_TAG = /<Demo(?=[\s/>])/g

/** `data-sn-doc-source` marks the hidden div carrying the page's raw markdown
 *  (see ./raw-doc-source.ts); its payload must never be read as a demo. */
const RAW_SOURCE_MARKER = 'data-sn-doc-source'

/** HTML-bearing token kinds that can carry a `<Demo>` tag. */
const HTML_TOKEN_TYPES = new Set(['html_block', 'html_inline'])

interface Section {
  /** Index of the section's `heading_open` token. */
  start: number
  /** Index of the section's last token (inclusive). */
  end: number
  /** Heading level (2 = `h2`). */
  level: number
  /** Number of `<Demo>` tags inside the section. */
  demos: number
}

function countDemoTags(token: MarkdownToken): number {
  if (!HTML_TOKEN_TYPES.has(token.type)) return 0
  const content = token.content || ''
  if (content.includes(RAW_SOURCE_MARKER)) return 0
  return (content.match(DEMO_TAG) || []).length
}

function countDemosIn(tokens: MarkdownToken[], start: number, end: number): number {
  let count = 0
  for (let i = start; i <= end; i++) {
    const token = tokens[i]
    count += countDemoTags(token)
    const children = token.children
    if (Array.isArray(children)) {
      for (const child of children) count += countDemoTags(child)
    }
  }
  return count
}

/** Split the token stream into heading-anchored sections. */
function splitSections(tokens: MarkdownToken[]): Section[] {
  const starts: number[] = []
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'heading_open') starts.push(i)
  }

  return starts.map((start, index) => {
    const next = index + 1 < starts.length ? starts[index + 1] : tokens.length
    const end = next - 1
    return {
      start,
      end,
      level: Number((tokens[start].tag || '').slice(1)) || 0,
      demos: countDemosIn(tokens, start, end),
    }
  })
}

/** A section that renders as one demo card. */
function isCell(section: Section): boolean {
  return section.level >= 2 && section.demos === 1
}

/** Collect wrapper HTML per token index, preserving insertion order. */
function push(map: Map<number, string[]>, index: number, html: string): void {
  const list = map.get(index)
  if (list === undefined) {
    map.set(index, [html])
  } else {
    list.push(html)
  }
}

export function demoGrid(md: MarkdownRenderer): void {
  md.core.ruler.push('sn-demo-grid', (state) => {
    const tokens = state.tokens
    const sections = splitSections(tokens)
    if (!sections.length) return

    // Wrapper opens/closes are collected per token index, then spliced in one
    // pass so the section indexes stay valid.
    const before = new Map<number, string[]>()
    const after = new Map<number, string[]>()

    let index = 0
    while (index < sections.length) {
      if (!isCell(sections[index])) {
        index++
        continue
      }

      // Extend over the maximal run of consecutive cells.
      let last = index
      while (last + 1 < sections.length && isCell(sections[last + 1])) last++

      const grouped = last > index
      if (grouped) push(before, sections[index].start, '<div class="sn-demo-grid">')
      for (let k = index; k <= last; k++) {
        push(before, sections[k].start, '<div class="sn-demo-cell">')
        push(after, sections[k].end, '</div>')
      }
      if (grouped) push(after, sections[last].end, '</div>')

      index = last + 1
    }

    if (!before.size) return

    const out: MarkdownToken[] = []
    const emit = (html: string): void => {
      const token = new state.Token('html_block', '', 0)
      token.content = html
      out.push(token)
    }

    tokens.forEach((token, i) => {
      const opens = before.get(i)
      if (opens !== undefined) opens.forEach(emit)
      out.push(token)
      const closes = after.get(i)
      if (closes !== undefined) closes.forEach(emit)
    })

    state.tokens = out
  })
}
