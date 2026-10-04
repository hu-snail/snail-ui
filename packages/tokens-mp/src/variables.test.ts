/**
 * @snui/tokens-mp tests — AUI-FOUND-006.
 *
 * Verifies rpx conversion is correct (px × 2 for 750 design) and the static
 * stylesheet stays in sync with the JS alias map.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { describe, it, expect } from 'vitest'

import {
  snMpSizeMap,
  snMpColorMap,
  snMpAliasMap,
  renderSnMpStyles,
  listSnMpAliases,
  pxToRpx,
} from './variables.js'

const here = dirname(fileURLToPath(import.meta.url))
const stylesheetPath = join(here, '..', 'styles', 'index.css')

describe('@snui/tokens-mp rpx conversion', () => {
  it('converts px to rpx at 1:2 ratio (750 design width)', () => {
    expect(pxToRpx(36)).toBe('72rpx')
    expect(pxToRpx('36')).toBe('72rpx')
    expect(pxToRpx(8)).toBe('16rpx')
    expect(pxToRpx(0)).toBe('0rpx')
    expect(pxToRpx(1.5)).toBe('3rpx')
  })

  it('emits rpx literals for size aliases (not `var()` indirection)', () => {
    for (const [alias, value] of snMpSizeMap) {
      // `--sn-mp-icon-stroke-width` is a raw design unit, not a CSS length,
      // so it intentionally stays as a bare number (`2`), not `rpx`. Every
      // other size alias must end in `rpx`.
      if (alias === '--sn-mp-icon-stroke-width') continue
      expect(value.endsWith('rpx'), `${alias} should be rpx (got ${value})`).toBe(true)
      expect(value.startsWith('var(')).toBe(false)
    }
  })

  it('emits `var(--aui-*)` indirection for color aliases (no unit conversion)', () => {
    // color aliases + focus-ring (counting pass-through indirection)
    for (const [alias, value] of snMpColorMap) {
      expect(value.startsWith('var(--aui-')).toBe(true)
      // semantic colors use --sn-mp-color-* prefix; focus-ring is a separate slot
      if (alias.includes('color-')) {
        expect(alias.startsWith('--sn-mp-color-')).toBe(true)
      }
    }
  })

  it('declares expected component tokens (button / input / card / icon)', () => {
    const aliases = listSnMpAliases()
    expect(aliases).toContain('--sn-mp-button-height-medium')
    expect(aliases).toContain('--sn-mp-button-radius')
    expect(aliases).toContain('--sn-mp-input-radius')
    expect(aliases).toContain('--sn-mp-card-radius')
    // icon (AUI-MP-002 follow-up)
    expect(aliases).toContain('--sn-mp-icon-size-medium')
    expect(aliases).toContain('--sn-mp-icon-size-tiny')
    expect(aliases).toContain('--sn-mp-icon-size-small')
    expect(aliases).toContain('--sn-mp-icon-size-large')
    expect(aliases).toContain('--sn-mp-icon-size-xlarge')
    expect(aliases).toContain('--sn-mp-icon-stroke-width')
    expect(aliases).toContain('--sn-mp-color-action-primary')
    expect(aliases).toContain('--sn-mp-focus-ring')
  })

  it('has unique aliases (no duplicate mappings)', () => {
    const aliases = listSnMpAliases()
    expect(new Set(aliases).size).toBe(aliases.length)
  })

  it('keeps the static stylesheet in sync with the JS alias map', async () => {
    const css = await readFile(stylesheetPath, 'utf-8')
    for (const [alias, value] of snMpAliasMap) {
      expect(css).toContain(`${alias}: ${value};`)
    }
    const cssAliases = [...css.matchAll(/--sn-mp-[a-z0-9-]+/g)].map((m) => m[0])
    const jsAliases = new Set(listSnMpAliases())
    for (const found of cssAliases) {
      expect(jsAliases.has(found)).toBe(true)
    }
  })

  it('renders `:root { ... }` block with all aliases', () => {
    const css = renderSnMpStyles()
    expect(css.startsWith(':root {')).toBe(true)
    for (const [alias] of snMpAliasMap) {
      expect(css).toContain(`${alias}:`)
    }
  })
})