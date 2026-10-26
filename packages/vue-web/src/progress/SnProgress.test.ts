import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnProgress from './SnProgress.vue'

/** Mount SnProgress through a wrapper component, mirroring real usage. */
function mountProgress(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnProgress },
      setup() {
        return () => h(SnProgress, props as never, slots as never)
      },
    }),
  )
}

describe('SnProgress (AUI-WEB-FB-014)', () => {
  describe('line', () => {
    it('renders the component marker and default line structure', () => {
      const w = mountProgress({ percentage: 60 })
      const root = w.find('.sn-progress')
      expect(root.attributes('data-snui-component')).toBe('progress')
      expect(root.classes()).toContain('sn-progress--line')
      expect(root.attributes('role')).toBe('progressbar')
      expect(root.attributes('aria-valuenow')).toBe('60')
    })

    it('widths the fill by percentage and keeps the default rail metrics', () => {
      const w = mountProgress({ percentage: 40 })
      const fill = w.find('.sn-progress__line-fill')
      expect(fill.attributes('style')).toContain('width: 40%')
      // default fill color = action-primary token
      expect(fill.attributes('style')).toContain('var(--sn-web-color-action-primary)')
    })

    it('clamps out-of-range percentages into 0–100', () => {
      const high = mountProgress({ percentage: 140 })
      expect(high.find('.sn-progress__line-fill').attributes('style')).toContain('width: 100%')
      const low = mountProgress({ percentage: -10 })
      expect(low.find('.sn-progress__line-fill').attributes('style')).toContain('width: 0%')
    })

    it('applies the height prop in px and keeps a px fallback when unset', () => {
      const withHeight = mountProgress({ percentage: 10, height: 14 })
      expect(withHeight.find('.sn-progress__line').attributes('style')).toContain('height: 14px')
      const withoutHeight = mountProgress({ percentage: 10 })
      expect(withoutHeight.find('.sn-progress__line').attributes('style')).toContain('height: 8px')
    })

    it('renders the outside indicator text by default and supports the default slot', () => {
      const w = mountProgress({ percentage: 80 })
      expect(w.find('.sn-progress__line-indicator--outside').text()).toBe('80%')

      const custom = mountProgress(
        { percentage: 80 },
        { default: (scope: { percentage: number }) => `已完成 ${scope.percentage}` },
      )
      expect(custom.find('.sn-progress__line-indicator--outside').text()).toBe('已完成 80')
    })

    it('hides the indicator when showIndicator is false', () => {
      const w = mountProgress({ percentage: 30, showIndicator: false })
      expect(w.find('.sn-progress__line-indicator--outside').exists()).toBe(false)
    })

    it('places the indicator inside the fill for indicatorPlacement="inside"', () => {
      const w = mountProgress({ percentage: 30, indicatorPlacement: 'inside' })
      expect(w.find('.sn-progress__line-indicator--inside').exists()).toBe(true)
      expect(w.find('.sn-progress__line-indicator--outside').exists()).toBe(false)
    })

    it('places the indicator above the rail for indicatorPlacement="top"', () => {
      const w = mountProgress({ percentage: 30, indicatorPlacement: 'top' })
      expect(w.find('.sn-progress__line-indicator--top').exists()).toBe(true)
      expect(w.find('.sn-progress__line-indicator--outside').exists()).toBe(false)
    })

    it('maps status to feedback tokens', () => {
      const success = mountProgress({ percentage: 30, status: 'success' })
      expect(success.find('.sn-progress__line-fill').attributes('style')).toContain(
        'var(--sn-web-color-feedback-success)',
      )
      const error = mountProgress({ percentage: 30, status: 'error' })
      expect(error.find('.sn-progress__line-fill').attributes('style')).toContain(
        'var(--sn-web-color-feedback-danger)',
      )
      const warning = mountProgress({ percentage: 30, status: 'warning' })
      expect(warning.find('.sn-progress__line-fill').attributes('style')).toContain(
        'var(--sn-web-color-feedback-warning)',
      )
      const info = mountProgress({ percentage: 30, status: 'info' })
      expect(info.find('.sn-progress__line-fill').attributes('style')).toContain(
        'var(--sn-web-color-feedback-info)',
      )
    })

    it('prefers the color prop over the status color (solid and gradient forms)', () => {
      const solid = mountProgress({ percentage: 30, status: 'error', color: '#2080f0' })
      expect(solid.find('.sn-progress__line-fill').attributes('style')).toContain('#2080f0')

      const gradient = mountProgress({
        percentage: 30,
        color: [
          { color: '#0e80eb', stop: 0 },
          { color: '#85aa39', stop: 100 },
        ],
      })
      const style = gradient.find('.sn-progress__line-fill').attributes('style') ?? ''
      expect(style).toContain('linear-gradient')
      expect(style).toContain('#0e80eb')
      expect(style).toContain('#85aa39')
    })

    it('resolves a function color with the current percentage', () => {
      const w = mountProgress({ percentage: 45, color: (pct: number) => `rgb(${pct}, 0, 0)` })
      expect(w.find('.sn-progress__line-fill').attributes('style')).toContain('rgb(45, 0, 0)')
    })

    it('applies a custom railColor', () => {
      const w = mountProgress({ percentage: 30, railColor: '#eee' })
      expect(w.find('.sn-progress__line').attributes('style')).toContain('#eee')
    })

    it('marks the fill with the processing class for the stripe animation', () => {
      const w = mountProgress({ percentage: 30, processing: true })
      expect(w.find('.sn-progress__line-fill--processing').exists()).toBe(true)
      expect(w.classes()).toContain('sn-progress--processing')
    })

    it('applies borderRadius to the rail and fillBorderRadius to the fill', () => {
      const w = mountProgress({ percentage: 30, borderRadius: 4, fillBorderRadius: 2 })
      expect(w.find('.sn-progress__line').attributes('style')).toContain('border-radius: 4px')
      expect(w.find('.sn-progress__line-fill').attributes('style')).toContain('border-radius: 2px')
    })

    it('falls back to the rail radius when fillBorderRadius is unset', () => {
      const w = mountProgress({ percentage: 30, borderRadius: 4 })
      expect(w.find('.sn-progress__line-fill').attributes('style')).toContain('border-radius: 4px')
    })
  })

  describe('circle', () => {
    it('renders an SVG ring with a stroke-dasharray proportional to the percentage', () => {
      const w = mountProgress({ type: 'circle', percentage: 50 })
      expect(w.classes()).toContain('sn-progress--circle')
      const svg = w.find('svg')
      expect(svg.exists()).toBe(true)
      expect(svg.attributes('viewBox')).toBe('0 0 120 120')
      // r = 60 - strokeWidth(6) / 2 = 57 → C = 2π·57 ≈ 358.14
      const fill = w.find('.sn-progress__circle-fill')
      expect(fill.attributes('stroke-dasharray')).toBe('179.07 358.14')
    })

    it('centres the indicator text and honours the default slot', () => {
      const w = mountProgress({ type: 'circle', percentage: 25 })
      expect(w.find('.sn-progress__circle-text').text()).toBe('25%')

      const custom = mountProgress({ type: 'circle', percentage: 25 }, { default: () => '四分之一' })
      expect(custom.find('.sn-progress__circle-text').text()).toBe('四分之一')
    })

    it('shows the built-in success / error glyphs for those statuses', () => {
      const success = mountProgress({ type: 'circle', percentage: 100, status: 'success' })
      expect(success.find('.sn-progress__circle-status-icon--success').exists()).toBe(true)
      expect(success.find('.sn-progress__circle-status-icon--success svg').exists()).toBe(true)

      const error = mountProgress({ type: 'circle', percentage: 30, status: 'error' })
      expect(error.find('.sn-progress__circle-status-icon--error').exists()).toBe(true)
    })

    it('replaces the built-in glyph with the icon slot', () => {
      const w = mountProgress(
        { type: 'circle', percentage: 100, status: 'success' },
        { icon: () => h('b', '自定义图标') },
      )
      expect(w.find('.sn-progress__circle-status-icon').text()).toBe('自定义图标')
      expect(w.find('.sn-progress__circle-status-icon svg').exists()).toBe(false)
    })

    it('hides the circle indicator when showIndicator is false', () => {
      const w = mountProgress({ type: 'circle', percentage: 30, showIndicator: false })
      expect(w.find('.sn-progress__circle-indicator').exists()).toBe(false)
    })

    it('applies offsetDegree as a rotation around the ring centre', () => {
      const w = mountProgress({ type: 'circle', percentage: 30, offsetDegree: 45 })
      // SVG dash origin sits at 3 o'clock; base rotation is -90deg + offset.
      expect(w.find('g').attributes('transform')).toBe('rotate(-45 60 60)')
    })

    it('applies strokeWidth to both circles', () => {
      const w = mountProgress({ type: 'circle', percentage: 30, strokeWidth: 12 })
      const circles = w.findAll('circle')
      for (const circle of circles) {
        expect(circle.attributes('stroke-width')).toBe('12')
      }
    })
  })

  describe('multiple-circle', () => {
    it('renders one ring per percentage with per-ring colors', () => {
      const w = mountProgress({
        type: 'multiple-circle',
        percentage: [20, 50, 86],
        color: ['#0e80eb', '#85aa39', '#8f3c3c'],
      })
      expect(w.classes()).toContain('sn-progress--multiple-circle')
      const fills = w.findAll('.sn-progress__circle-fill')
      expect(fills).toHaveLength(3)
      expect(fills[0].attributes('stroke')).toBe('#0e80eb')
      expect(fills[1].attributes('stroke')).toBe('#85aa39')
      expect(fills[2].attributes('stroke')).toBe('#8f3c3c')
    })

    it('renders a legend with a dot and text per ring', () => {
      const w = mountProgress({
        type: 'multiple-circle',
        percentage: [20, 50],
        color: ['#0e80eb', '#85aa39'],
      })
      const items = w.findAll('.sn-progress__legend-item')
      expect(items).toHaveLength(2)
      expect(items[0].text()).toBe('20%')
      expect(items[1].text()).toBe('50%')
      expect(items[0].find('.sn-progress__legend-dot').attributes('style')).toContain('#0e80eb')
    })

    it('exposes an aria summary for the multi-value variant', () => {
      const w = mountProgress({ type: 'multiple-circle', percentage: [20, 50] })
      expect(w.attributes('role')).toBe('img')
      expect(w.attributes('aria-label')).toBe('Progress 20%, 50%')
    })
  })
})
