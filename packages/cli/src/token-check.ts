/**
 * @snui/cli/token-check — AUI-TOOL-005 + AUI-FOUND-009.
 *
 * Scans .vue files for two classes of violations:
 *   1. Color literals (hex / rgb / hsl) outside `var(--x, FALLBACK)` slots.
 *      Per AGENTS.md §34, components must consume only `var(--sn-{end}-*)`
 *      tokens. Allowed fallbacks: `transparent`, `inherit`, `currentColor`.
 *
 *   2. Wrong-end alias reference (v3.1+). When `--end web` is passed, the
 *      scanner flags any `--sn-mp-*` or `--aui-*` reference (Web components
 *      must use `--sn-web-*` aliases only). Conversely for `--end mp`.
 *
 * Usage:
 *   import { scanFile, scanColorLiterals, scanWrongEndAliases } from '@snui/cli/token-check'
 *   const colorIssues = await scanColorLiterals({ sourceDir: 'packages/vue-web/src' })
 *   const aliasIssues  = await scanWrongEndAliases({ sourceDir: 'packages/uni/src', end: 'mp' })
 */

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export type End = 'web' | 'mp'

export interface TokenCheckOptions {
  /** Source directory to scan recursively for .vue files. */
  sourceDir: string
  /** Glob basename filter. Default: matches `*.vue`. */
  fileGlob?: string
}

export type IssueSeverity = 'error' | 'warning'

export type IssueRule =
  | 'hex-literal'
  | 'rgb-literal'
  | 'hsl-literal'
  | 'keyword-fallback'
  | 'wrong-end-alias'

export interface TokenIssue {
  file: string
  line: number
  column: number
  rule: IssueRule
  snippet: string
  message: string
}

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g
const RGB_RE = /\brgba?\s*\(/g
const HSL_RE = /\bhsla?\s*\(/g

/** End-specific forbidden alias prefixes. */
const FORBIDDEN_PREFIXES: Readonly<Record<End, ReadonlyArray<string>>> = {
  // Web components must use --sn-web-* only; never --sn-mp-* or --aui-*
  web: ['--sn-mp-', '--aui-'],
  // MP components must use --sn-mp-* only; never --sn-web-* or --aui-*
  mp: ['--sn-web-', '--aui-'],
}

/** Run all configured scanners against a single file. */
export async function scanFile(filePath: string, end?: End): Promise<TokenIssue[]> {
  const content = await readFile(filePath, 'utf-8')
  const issues: TokenIssue[] = []
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue
    // only scan lines that look like CSS rules
    if (!/color\s*:|background|border|fill|stroke|box-shadow|text-shadow/.test(trimmed)) continue

    // (1) color literals
    HEX_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = HEX_RE.exec(line)) !== null) {
      const before = line.slice(Math.max(0, m.index - 8), m.index).toLowerCase()
      if (before.includes(',')) continue // inside var(...) fallback
      issues.push({
        file: filePath,
        line: i + 1,
        column: m.index + 1,
        rule: 'hex-literal',
        snippet: trimmed.slice(0, 80),
        message: `hex color literal "${m[0]}" not allowed — use var(--sn-*-*) tokens`,
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
        message: 'rgb()/rgba() literal not allowed — use var(--sn-*-*) tokens',
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
        message: 'hsl()/hsla() literal not allowed — use var(--sn-*-*) tokens',
      })
    }
  }

  // (2) wrong-end alias references (whole-file scan, not per-line filter)
  if (end) {
    const forbidden = FORBIDDEN_PREFIXES[end]
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? ''
      const trimmed = line.trim()
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue
      // match every complete alias name on this line
      const aliasMatches = line.matchAll(/--(?:sn-(?:web|mp)-|aui-)[a-z0-9-]+/gi)
      for (const m of aliasMatches) {
        const alias = m[0]
        const ok = forbidden.some((p) => alias.startsWith(p))
        if (!ok) continue
        issues.push({
          file: filePath,
          line: i + 1,
          column: (m.index ?? 0) + 1,
          rule: 'wrong-end-alias',
          snippet: trimmed.slice(0, 80),
          message: `alias "${alias}" is not allowed for end "${end}" — use ${end === 'web' ? '--sn-web-*' : '--sn-mp-*'} aliases only`,
        })
      }
    }
  }

  return issues
}

export async function scanColorLiterals(options: TokenCheckOptions): Promise<TokenIssue[]> {
  return scanAll(options)
}

export async function scanWrongEndAliases(
  options: TokenCheckOptions,
  end: End,
): Promise<TokenIssue[]> {
  return scanAll(options, end)
}

async function scanAll(options: TokenCheckOptions, end?: End): Promise<TokenIssue[]> {
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
        const fileIssues = await scanFile(full, end)
        out.push(...fileIssues)
      }
    }
  }
  return out
}

/** Run scan and print a summary. Returns exit code (0 = clean, 1 = issues). */
export async function runTokenCheck(options: TokenCheckOptions, end?: End): Promise<number> {
  const issues = await scanAll(options, end)
  if (issues.length === 0) {
     
    console.log(
      end
        ? `✓ @snui/cli token-check (end=${end}): no violations in ${options.sourceDir}`
        : `✓ @snui/cli token-check: no violations in ${options.sourceDir}`,
    )
    return 0
  }
  for (const i of issues) {
     
    console.error(`✗ ${i.file}:${i.line}:${i.column}  ${i.rule}  ${i.message}`)
     
    console.error(`    ${i.snippet}`)
  }
  return 1
}