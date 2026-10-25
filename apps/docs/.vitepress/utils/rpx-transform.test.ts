/**
 * rpx-transform unit tests — the docs-preview rpx → px conversion.
 *
 * The regression core is the plugin's id filter: the demo scoped-style ids
 * must be converted (they carry the mobile rhythm in rpx) while the `?raw`
 * source modules shown in the code panel must keep their original `rpx` text.
 */

import { describe, it, expect } from 'vitest'
import { convertRpx, isCssModuleId, rpxTransform } from './rpx-transform'

/** Invoke the plugin's transform hook against one module id. */
function transform(id: string, code: string): string | undefined {
  const plugin = rpxTransform()
  const result = plugin.transform?.call({} as never, code, id)
  if (result === undefined || typeof result === 'string') return result
  return result.code
}

/**
 * Resolve a path relative to this test file into a `file://` id.
 *
 * `import.meta.url` is held in a variable on purpose: vite's asset plugin
 * statically rewrites `new URL('<literal>', import.meta.url)` into a served
 * module URL, which is exactly the distortion these ids must not have.
 */
const moduleUrl = import.meta.url
const demoId = (name: string, query: string): string =>
  new URL(`../demo/${name}.vue${query}`, moduleUrl).href
const demoEnId = (name: string, query: string): string =>
  new URL(`../demo-en/${name}.vue${query}`, moduleUrl).href

describe('convertRpx', () => {
  it('converts rpx at the 750→375 ratio', () => {
    expect(convertRpx('gap: 16rpx')).toBe('gap: 8px')
    expect(convertRpx('height: 400rpx')).toBe('height: 200px')
  })

  it('converts negative and decimal values', () => {
    expect(convertRpx('margin-left: -20rpx')).toBe('margin-left: -10px')
    expect(convertRpx('width: 1.5rpx')).toBe('width: 0.75px')
  })

  it('leaves unitless numbers and px alone', () => {
    expect(convertRpx('flex: 1')).toBe('flex: 1')
    expect(convertRpx('border: 1px solid')).toBe('border: 1px solid')
  })
})

describe('isCssModuleId', () => {
  it('accepts SFC virtual style modules and css files', () => {
    expect(isCssModuleId('/x/slider.vue?vue&type=style&index=0&scoped=abc&lang.css')).toBe(true)
    expect(isCssModuleId('/styles/index.css')).toBe(true)
  })

  it('rejects raw sources and js chunks', () => {
    expect(isCssModuleId('/x/slider.vue?raw')).toBe(false)
    expect(isCssModuleId('/x/slider.vue')).toBe(false)
  })
})

describe('rpxTransform filter', () => {
  const css = '.demo { gap: 16rpx; }'
  const scopedStyle = '?vue&type=style&index=0&scoped=abc&lang.css'

  it('converts a demo scoped style module', () => {
    expect(transform(demoId('slider-mp-basic', scopedStyle), css)).toBe('.demo { gap: 8px; }')
  })

  it('converts an english demo scoped style module', () => {
    expect(transform(demoEnId('slider-mp-basic', scopedStyle), css)).toBe('.demo { gap: 8px; }')
  })

  it('keeps the ?raw source module untouched so the code panel shows rpx', () => {
    expect(transform(demoId('slider-mp-basic', '?raw'), css)).toBeUndefined()
  })

  it('keeps the demo js chunk untouched', () => {
    expect(transform(demoId('slider-mp-basic', ''), css)).toBeUndefined()
  })

  it('converts a uni-src scoped style module', () => {
    const id = new URL('../../../../packages/uni/src/components/sn-slider/sn-slider.vue?vue&type=style&index=0&scoped=abc&lang.css', moduleUrl).href
    expect(transform(id, css)).toBe('.demo { gap: 8px; }')
  })

  it('converts the uni dist barrel css', () => {
    expect(transform('/node_modules/@snui/uni/dist/styles/index.css', css)).toBe('.demo { gap: 8px; }')
  })

  it('ignores modules outside the uni preview surface', () => {
    expect(transform('/node_modules/@snui/vue-web/src/sn-slider.vue?vue&type=style&index=0&lang.css', css)).toBeUndefined()
  })
})
