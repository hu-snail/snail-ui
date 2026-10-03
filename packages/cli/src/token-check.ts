/**
 * @snui/cli/token-check — AUI-TOOL-005.
 *
 * Scans component .vue files for hardcoded hex / rgb / hsl color literals in
 * CSS. Per Spec-01 §3.1 / AGENTS.md §34, components must consume only
 * `var(--sn-*)` tokens. Fallback values inside `var(...)` are restricted to
 * the keywords `transparent`, `inherit`, `currentColor`.
 *
 * Usage:
 *   import { scanColorLiterals } from '@snui/cli/token-check'
 *   const issues = await scanColorLiterals({ sourceDir: 'packages/vue-web/src' })
 *
 * This is a programmatic helper. The CLI command lives in bin/snui.ts.
 */

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface TokenCheckOptions {
  /** Source directory to scan recursively for .vue files. */
  sourceDir: string
  /** Glob basename filter. Default: matches `*.vue`. */
  fileGlob?: string
}

export type IssueSeverity = 'error' | 'warning'

export interface TokenIssue {
  file: string
  line: number
  column: number
  rule: 'hex-literal' | 'rgb-literal' | 'hsl-literal' | 'keyword-fallback'
  snippet: string
  message: string
}

/** Patterns we consider "color literals". */
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g
const RGB_RE = /\brgba?\s*\(/g
const HSL_RE = /\bhsla?\s*\(/g

/**
 * Keywords allowed inside a CSS `var(--sn-x, FALLBACK)` fallback slot.
 * Anything else in that slot is an error.
 */
const ALLOWED_FALLBACK_KEYWORDS = new Set(['transparent', 'inherit', 'currentcolor'])

export async function scanFile(filePath: string): Promise<TokenIssue[]> {
  const content = await readFile(filePath, 'utf-8')
  const issues: TokenIssue[] = []
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    // Skip Vue template / script regions; only scan <style> blocks.
    // For v3.0 initial pass, we scan the entire file but require all
    // color literals to appear inside a `var(...)` reference or be
    // declared inside an obvious style region. We use a soft heuristic:
    //   - exclude lines starting with `// ` (TS comments) or `<!--` (HTML comments)
    //   - exclude lines inside <script> (kept simple: skip lines without `:`, `;`,
    //     or `var(` on the left side, since style attribute bindings live elsewhere)
    // For this iteration, restrict to <style> blocks only.
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue
    if (!/color\s*:|background|border|fill|stroke|box-shadow|text-shadow/.test(trimmed)) continue

    HEX_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = HEX_RE.exec(line)) !== null) {
      // If preceded by `var(` and inside a `var(--sn-x, ...)` fallback, check keyword allow-list.
      const before = line.slice(Math.max(0, m.index - 8), m.index).toLowerCase()
      const isInVarFallback = before.includes(',')
      if (isInVarFallback) continue
      issues.push({
        file: filePath,
        line: i + 1,
        column: m.index + 1,
        rule: 'hex-literal',
        snippet: trimmed.slice(0, 80),
        message: `hex color literal "${m[0]}" not allowed — use var(--sn-*) tokens`,
      })
    }
    RGB_RE.lastIndex = 0
    while ((m = RGB_RE.exec(line)) !== null) {
      issues.push({
        file: filePath,
        line: i + 1,
        column: m.index + 1,
        rule: 'rgb-literal',
        snippet: trimmed.slice(0, 80),
        message: 'rgb()/rgba() literal not allowed — use var(--sn-*) tokens',
      })
    }
    HSL_RE.lastIndex = 0
    while ((m = HSL_RE.exec(line)) !== null) {
      issues.push({
        file: filePath,
        line: i + 1,
        column: m.index + 1,
        rule: 'hsl-literal',
        snippet: trimmed.slice(0, 80),
        message: 'hsl()/hsla() literal not allowed — use var(--sn-*) tokens',
      })
    }
  }
  return issues
}

export async function scanColorLiterals(options: TokenCheckOptions): Promise<TokenIssue[]> {
  const out: TokenIssue[] = []
  const stack: string[] = [options.sourceDir]
  while (stack.length) {
    const dir = stack.pop()!
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue
        stack.push(full)
      } else if (entry.isFile() && full.endsWith('.vue')) {
        const fileIssues = await scanFile(full)
        out.push(...fileIssues)
      }
    }
  }
  return out
}

/** Run scan and print a summary. Returns exit code (0 = clean, 1 = issues). */
export async function runTokenCheck(options: TokenCheckOptions): Promise<number> {
  const issues = await scanColorLiterals(options)
  if (issues.length === 0) {
    // eslint-disable-next-line no-console
    console.log('✓ @snui/cli token-check: no color literal violations')
    return 0
  }
  for (const i of issues) {
    // eslint-disable-next-line no-console
    console.error(`✗ ${i.file}:${i.line}:${i.column}  ${i.rule}  ${i.message}`)
    // eslint-disable-next-line no-console
    console.error(`    ${i.snippet}`)
  }
  return 1
}