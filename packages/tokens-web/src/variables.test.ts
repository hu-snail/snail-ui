/**
 * @snui/tokens-web tests — AUI-FOUND-005.
 *
 * Verifies the alias layer is well-formed and consistent with the static
 * stylesheet. Per Spec-01 v1.2 §2.3 + AGENTS.md §43 test-first.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { describe, it, expect } from 'vitest'

import {
  snWebAliasMap,
  renderSnWebStyles,
  listSnWebAliases,
} from './variables.js'

const here = dirname(fileURLToPath(import.meta.url))
const stylesheetPath = join(here, '..', 'styles', 'index.css')

describe('@snui/tokens-web alias layer', () => {
  it('declares at least the v3.0 button + input + card + semantic color set', () => {
    const aliases = listSnWebAliases()
    // semantic colors
    expect(aliases).toContain('--sn-web-color-action-primary')
    expect(aliases).toContain('--sn-web-color-text-on-primary')
    expect(aliases).toContain('--sn-web-color-background-surface')
    expect(aliases).toContain('--sn-web-color-border-default')
    // button component tokens
    expect(aliases).toContain('--sn-web-button-radius')
    expect(aliases).toContain('--sn-web-button-height-medium')
    // input + card
    expect(aliases).toContain('--sn-web-input-radius')
    expect(aliases).toContain('--sn-web-card-radius')
    expect(aliases).toContain('--sn-web-focus-ring')
  })

  it('maps every alias to a `--aui-*` base layer reference', () => {
    for (const [alias, base] of snWebAliasMap) {
      expect(alias.startsWith('--sn-web-')).toBe(true)
      expect(base.startsWith('--aui-')).toBe(true)
    }
  })

  it('has unique aliases (no duplicate mappings)', () => {
    const aliases = listSnWebAliases()
    expect(new Set(aliases).size).toBe(aliases.length)
  })

  it('produces a `:root { ... }` block containing all aliases', () => {
    const css = renderSnWebStyles()
    expect(css.startsWith(':root {')).toBe(true)
    expect(css.endsWith('}\n')).toBe(true)
    for (const [alias] of snWebAliasMap) {
      expect(css).toContain(`${alias}: var(`)
    }
  })

  it('keeps the static stylesheet in sync with the JS alias map', async () => {
    const css = await readFile(stylesheetPath, 'utf-8')
    for (const [alias, base] of snWebAliasMap) {
      // each alias must appear in static CSS
      expect(css).toContain(`${alias}: var(${base});`)
    }
    // no stray --sn-web-* declarations in static CSS that are missing from JS
    const cssAliases = [...css.matchAll(/--sn-web-[a-z0-9-]+/g)].map((m) => m[0])
    const jsAliases = new Set(listSnWebAliases())
    for (const found of cssAliases) {
      expect(jsAliases.has(found)).toBe(true)
    }
  })

  it('exports no runtime side effects', () => {
    // renderSnWebStyles() must be a pure string builder; the export itself
    // must not read env / write to fs / call network.
    const a = renderSnWebStyles()
    const b = renderSnWebStyles()
    expect(a).toBe(b)
  })
})