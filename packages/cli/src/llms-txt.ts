/**
 * llms.txt generator — converts `ai-description.md` files into a single
 * AI-friendly manifest. Reference: https://llmstxt.org and wot-ui's docs.
 *
 * Usage:
 *   const text = await generateLlmsTxt({
 *     sourceDir: '/path/to/packages/vue-web/src',
 *     libraryName: '@snui/vue-web',
 *   })
 *   await fs.writeFile('public/llms.txt', text)
 *
 * Output format:
 *   # <libraryName> Components
 *
 *   ## <ComponentName>
 *   File: <relative-path>
 *   <description>
 *   Props: <prop1> (<type1>), <prop2> (<type2>), ...
 *   Events: <event1> (<payload1>), ...
 *   Slots: <slot1>, <slot2>, ...
 *   Tokens: --sn-...
 */

import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

export interface LlmsTxtOptions {
  /** Source directory containing component subdirs. */
  sourceDir: string
  /** Library display name in the output header. */
  libraryName: string
  /** Only include components whose ai-description.md is found. */
  requireAiDescription?: boolean
}

interface ParsedDescription {
  description: string
  props: Array<{ name: string; type: string }>
  events: Array<{ name: string; payload: string }>
  slots: Array<string>
  tokens: Array<string>
}

/**
 * Parse a single ai-description.md into structured fields. The format is
 * Markdown tables; we use a tolerant line-by-line parser rather than a full
 * Markdown AST (descriptions are authored, not generated).
 */
export function parseAiDescription(markdown: string): ParsedDescription {
  const lines = markdown.split('\n')
  const result: ParsedDescription = {
    description: '',
    props: [],
    events: [],
    slots: [],
    tokens: [],
  }

  let section: 'header' | 'props' | 'events' | 'slots' | 'tokens' = 'header'
  let expectedCols = 0

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      expectedCols = 0
      continue
    }

    if (line.startsWith('## ')) {
      const heading = line.slice(3).toLowerCase()
      if (heading.startsWith('prop')) section = 'props'
      else if (heading.startsWith('event')) section = 'events'
      else if (heading.startsWith('slot')) section = 'slots'
      else if (heading.startsWith('token')) section = 'tokens'
      else section = 'header'
      expectedCols = 0
      continue
    }

    if (line.startsWith('# ')) {
      section = 'header'
      expectedCols = 0
      continue
    }

    if (section === 'header') {
      if (line.startsWith('>')) {
        const content = line.replace(/^>\s*/, '')
        if (!result.description && content) result.description = content
      }
    } else if (line.startsWith('|')) {
      // Skip separator rows like |---|---|
      if (line.match(/^\|[-\s|]+\|$/)) continue

      // Markdown table cells escape `|` as `\|`. Replace the escape sequence
      // with a placeholder so `split('|')` does not treat it as a column
      // separator, then restore it as a literal `|` afterwards.
      const PLACEHOLDER = '\u0001'
      const prepared = line.replace(/\\\|/g, PLACEHOLDER)

      const rawCells = prepared.split('|').map((c) => c.trim())
      // Markdown table rows begin and end with a `|`, producing empty
      // first/last entries when split. Strip those.
      const cells = rawCells[0] === '' ? rawCells.slice(1) : rawCells
      const trimmed = cells[cells.length - 1] === '' ? cells.slice(0, -1) : cells

      // Lock column count from the header row of each section.
      if (expectedCols === 0) {
        expectedCols = trimmed.length
        continue
      }
      if (trimmed.length < 2) continue
      // Type / payload columns may contain literal `|` (e.g. union types).
      // When split, those inflate `cells.length`. Reconcile by absorbing
      // the extra cells back into the second column until we match the
      // expected column count from the header.
      const name = (trimmed[0] ?? '').replace(new RegExp(PLACEHOLDER, 'g'), '|')
      const overflow = trimmed.length - expectedCols
      const typeEndIndex = overflow > 0 ? 2 + overflow : 2
      const typeOrPayload = trimmed.slice(1, typeEndIndex)
        .map((c) => c.replace(new RegExp(PLACEHOLDER, 'g'), '|'))
        .join(' | ')
      if (section === 'props') result.props.push({ name, type: typeOrPayload })
      else if (section === 'events') result.events.push({ name, payload: typeOrPayload })
      else if (section === 'slots') result.slots.push(name)
      else if (section === 'tokens') result.tokens.push(name)
    }
  }

  return result
}

/**
 * Walk a source directory looking for `ai-description.md` files and emit a
 * single llms.txt string.
 */
export async function generateLlmsTxt(options: LlmsTxtOptions): Promise<string> {
  const entries = await readdir(options.sourceDir, { withFileTypes: true })
  const out: Array<string> = [`# ${options.libraryName} Components`, '']

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const componentDir = join(options.sourceDir, entry.name)
    const mdPath = join(componentDir, 'ai-description.md')
    const vuePath = join(componentDir, `${entry.name}.vue`)

    let md: string
    try {
      md = await readFile(mdPath, 'utf-8')
    } catch {
      if (options.requireAiDescription) continue
      continue
    }

    const parsed = parseAiDescription(md)
    out.push(`## ${entry.name}`)
    out.push(`File: ${relative(options.sourceDir, vuePath)}`)
    if (parsed.description) out.push(parsed.description)
    if (parsed.props.length) {
      out.push(`Props: ${parsed.props.map((p) => `${p.name} (${p.type})`).join(', ')}`)
    }
    if (parsed.events.length) {
      out.push(`Events: ${parsed.events.map((e) => `${e.name} (${e.payload})`).join(', ')}`)
    }
    if (parsed.slots.length) {
      out.push(`Slots: ${parsed.slots.join(', ')}`)
    }
    if (parsed.tokens.length) {
      out.push(`Tokens: ${parsed.tokens.join(', ')}`)
    }
    out.push('')
  }

  return out.join('\n')
}
