import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnWatermark from './SnWatermark.vue'
import {
  watermarkTileCanvasSize,
  watermarkTileCssSize,
  watermarkTileDrawOffsets,
} from './watermark-tile'

/**
 * Mount SnWatermark through a wrapper component, mirroring real usage.
 * happy-dom's canvas getContext returns null, so every test exercises the
 * documented degraded path (repeated text-tile grid).
 */
function mountWatermark(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnWatermark },
      setup() {
        return () => h(SnWatermark, props as never, slots as never)
      },
    }),
  )
}

describe('SnWatermark (AUI-WEB-DD-024)', () => {
  beforeEach(() => {
    // No real canvas in happy-dom — force the degraded path deterministically.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // Unmount leftovers so teleported fullscreen overlays don't leak
    // between tests (happy-dom keeps one shared document.body).
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('renders the component marker with the default slot content', () => {
      const w = mountWatermark(
        { content: '版权所有' },
        { default: () => h('p', '受保护内容') },
      )
      const root = w.find('.sn-watermark')
      expect(root.attributes('data-snui-component')).toBe('watermark')
      expect(root.find('p').text()).toBe('受保护内容')
    })

    it('degrades to the repeated text grid when canvas is unavailable', () => {
      const w = mountWatermark({ content: '内部资料' })
      const overlay = w.find('.sn-watermark__overlay')
      expect(overlay.exists()).toBe(true)
      const tiles = w.findAll('.sn-watermark__fallback-tile')
      expect(tiles.length).toBeGreaterThan(0)
      expect(tiles[0].find('.sn-watermark__fallback-text').text()).toContain('内部资料')
    })

    it('renders one line per content array item', () => {
      const w = mountWatermark({ content: ['AUI', '内部资料'] })
      const firstTile = w.find('.sn-watermark__fallback-text')
      const lines = firstTile.findAll('.sn-watermark__fallback-line')
      expect(lines).toHaveLength(2)
      expect(lines[0].text()).toBe('AUI')
      expect(lines[1].text()).toBe('内部资料')
    })
  })

  describe('overlay styling', () => {
    it('applies opacity and zIndex to the overlay', () => {
      const w = mountWatermark({ content: 'x', opacity: 0.3, zIndex: 99 })
      const style = w.find('.sn-watermark__overlay').attributes('style') ?? ''
      expect(style).toContain('opacity: 0.3')
      expect(style).toContain('z-index: 99')
    })

    it('maps blend and grayscale onto the overlay', () => {
      const w = mountWatermark({ content: 'x', blend: 'overlay', grayscale: 1 })
      const style = w.find('.sn-watermark__overlay').attributes('style') ?? ''
      expect(style).toContain('mix-blend-mode: overlay')
      expect(style).toContain('grayscale(1)')
    })

    it('applies the background prop as the overlay tint in degraded mode', () => {
      const w = mountWatermark({ content: 'x', background: '#fffaaa' })
      expect(w.find('.sn-watermark__overlay').attributes('style')).toContain('#fffaaa')
    })
  })

  describe('fullscreen', () => {
    it('teleports a fixed overlay to body when fullscreen is set', () => {
      const w = mountWatermark({ content: '全屏', fullscreen: true })
      expect(w.find('.sn-watermark--fullscreen').exists()).toBe(true)
      // Wrapper keeps its content; the fixed overlay lives in body.
      expect(document.body.querySelector('.sn-watermark__overlay--fixed')).not.toBeNull()
    })

    it('keeps the overlay inside the wrapper when not fullscreen', () => {
      mountWatermark({ content: '局部' })
      expect(document.body.querySelector('.sn-watermark__overlay--fixed')).toBeNull()
    })
  })

  describe('degraded grid geometry', () => {
    it('sizes fallback tiles from width / height and rotates the text', () => {
      const w = mountWatermark({ content: '水印', width: 200, height: 80, rotate: -30 })
      const tileStyle = w.find('.sn-watermark__fallback-tile').attributes('style') ?? ''
      expect(tileStyle).toContain('width: 200px')
      expect(tileStyle).toContain('height: 80px')
      const textStyle = w.find('.sn-watermark__fallback-text').attributes('style') ?? ''
      expect(textStyle).toContain('rotate(-30deg)')
    })

    it('applies font metrics to the fallback text', () => {
      const w = mountWatermark({
        content: '水印',
        fontSize: 18,
        lineHeight: 22,
        fontColor: 'rgba(0, 0, 0, 0.2)',
        fontWeight: 600,
      })
      const textStyle = w.find('.sn-watermark__fallback-text').attributes('style') ?? ''
      expect(textStyle).toContain('font-size: 18px')
      expect(textStyle).toContain('line-height: 22px')
      expect(textStyle).toContain('rgba(0, 0, 0, 0.2)')
      expect(textStyle).toContain('font-weight: 600')
    })

    it('stagger alternate tiles when cross is set', () => {
      const cross = mountWatermark({ content: 'x', cross: true })
      const crossFirst = cross.findAll('.sn-watermark__fallback-tile')[1]
      // The second tile (row 0, col 1) is staggered by half a tile width (128 + 64).
      expect(crossFirst.attributes('style')).toContain('left: 192px')
    })
  })

  describe('cleanup', () => {
    it('unmounts without leaving the fullscreen overlay behind', () => {
      const w = mountWatermark({ content: 'x', fullscreen: true })
      expect(document.body.querySelector('.sn-watermark__overlay--fixed')).not.toBeNull()
      w.unmount()
      expect(document.body.querySelector('.sn-watermark__overlay--fixed')).toBeNull()
    })
  })
  describe('tile geometry (cross / dpr regression)', () => {
    it('keeps a plain grid single-copy at logical size', () => {
      expect(watermarkTileCanvasSize({ width: 128, height: 64, dpr: 2 })).toEqual({
        width: 256,
        height: 128,
      })
      expect(watermarkTileDrawOffsets({ width: 128, height: 64, dpr: 2 })).toEqual([
        { width: 0, height: 0 },
      ])
      expect(watermarkTileCssSize({ width: 128, height: 64 })).toBe('128px 64px')
    })

    it('doubles the canvas, the paint passes and the CSS tile when cross is set', () => {
      // Regression: `cross` used to be honoured only by the degraded text grid,
      // so the canvas tile — the path every browser takes — ignored it.
      expect(
        watermarkTileCanvasSize({ width: 128, height: 64, cross: true, dpr: 2 }),
      ).toEqual({ width: 512, height: 256 })
      expect(watermarkTileDrawOffsets({ width: 128, height: 64, cross: true, dpr: 2 })).toEqual([
        { width: 0, height: 0 },
        { width: 256, height: 128 },
      ])
      // Regression: the tile is sized in CSS px, so a HiDPI canvas does not
      // render dpr× too large (and 2× again for cross).
      expect(watermarkTileCssSize({ width: 128, height: 64, cross: true })).toBe('256px 128px')
    })

    it('never produces a zero-sized canvas', () => {
      expect(watermarkTileCanvasSize({ width: 0, height: 0, dpr: 0 })).toEqual({
        width: 1,
        height: 1,
      })
    })
  })

})
