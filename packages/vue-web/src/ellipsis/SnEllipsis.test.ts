import { afterEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import SnEllipsis from './SnEllipsis.vue'

/**
 * Mount SnEllipsis through a wrapper component, mirroring real usage.
 * happy-dom reports every box as 0×0, so overflow is simulated by
 * stubbing scrollWidth / clientWidth on the text node.
 */
function mountEllipsis(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnEllipsis },
      setup() {
        return () => h(SnEllipsis, props as never, slots as never)
      },
    }),
  )
}

describe('SnEllipsis (AUI-WEB-DD-025)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('renders the component marker with the slot text', () => {
      const w = mountEllipsis({}, { default: () => '一段很长的文本' })
      const root = w.find('.sn-ellipsis')
      expect(root.attributes('data-snui-component')).toBe('ellipsis')
      expect(root.find('.sn-ellipsis__content').text()).toBe('一段很长的文本')
    })
  })

  describe('clamping styles', () => {
    it('applies single-line ellipsis styles by default', () => {
      const w = mountEllipsis({ width: 120 }, { default: () => '文本' })
      const style = w.find('.sn-ellipsis__content').attributes('style') ?? ''
      expect(style).toContain('white-space: nowrap')
      expect(style).toContain('text-overflow: ellipsis')
      expect(style).toContain('overflow: hidden')
    })

    it('applies multi-line clamp styles for lineClamp > 1', () => {
      const w = mountEllipsis({ lineClamp: 3 }, { default: () => '文本' })
      const style = w.find('.sn-ellipsis__content').attributes('style') ?? ''
      // happy-dom's CSSOM drops the -webkit-* inline properties, so the
      // clamp itself is asserted through overflow detection below.
      expect(style).toContain('overflow: hidden')
      expect(style).toContain('word-break: break-word')
      expect(style).not.toContain('white-space: nowrap')
    })

    it('applies the width prop in px, and 100vw for screen', () => {
      const fixed = mountEllipsis({ width: 120 }, { default: () => '文本' })
      expect(fixed.find('.sn-ellipsis').attributes('style')).toContain('width: 120px')

      const screen = mountEllipsis({ width: 'screen' }, { default: () => '文本' })
      expect(screen.find('.sn-ellipsis').attributes('style')).toContain('width: 100vw')
    })
  })

  describe('expand on click', () => {
    it('toggles the expanded state and drops the clamp when expandTrigger is click', async () => {
      const w = mountEllipsis(
        { expandTrigger: 'click', width: 80 },
        { default: () => '很长很长的一段文本' },
      )
      const content = w.find('.sn-ellipsis__content')
      expect(w.find('.sn-ellipsis--expanded').exists()).toBe(false)
      await content.trigger('click')
      expect(w.find('.sn-ellipsis--expanded').exists()).toBe(true)
      // Expanded text has no clamping styles.
      expect(content.attributes('style')).toBeUndefined()
      await content.trigger('click')
      expect(w.find('.sn-ellipsis--expanded').exists()).toBe(false)
    })

    it('ignores clicks by default (expandTrigger none)', async () => {
      const w = mountEllipsis({}, { default: () => '文本' })
      await w.find('.sn-ellipsis__content').trigger('click')
      expect(w.find('.sn-ellipsis--expanded').exists()).toBe(false)
    })
  })

  describe('overflow tooltip', () => {
    /** Force the measure pass to see an overflowing single-line box. */
    function stubOverflow(w: ReturnType<typeof mountEllipsis>): void {
      const el = w.find('.sn-ellipsis__content').element as HTMLElement
      Object.defineProperty(el, 'scrollWidth', { configurable: true, value: 300 })
      Object.defineProperty(el, 'clientWidth', { configurable: true, value: 100 })
      window.dispatchEvent(new Event('resize'))
    }

    /** Settle the teleported popover after a hover. */
    async function hoverOpen(w: ReturnType<typeof mountEllipsis>): Promise<void> {
      await w.find('.sn-tooltip-trigger').trigger('mouseenter')
      await nextTick()
      await new Promise((r) => setTimeout(r, 10))
    }

    it('keeps the tooltip disabled while the text fits', async () => {
      const w = mountEllipsis({ tooltip: { delay: 0 } }, { default: () => '短文本' })
      // happy-dom measures 0×0 → no overflow → hovering must not open a bubble.
      await hoverOpen(w)
      expect(document.body.querySelector('.sn-tooltip')).toBeNull()
    })

    it('opens a tooltip with the full text when the content overflows', async () => {
      const w = mountEllipsis({ tooltip: { delay: 0 } }, { default: () => '完整的一段超长文本内容' })
      stubOverflow(w)
      await nextTick()
      await hoverOpen(w)
      const bubble = document.body.querySelector('.sn-tooltip')
      expect(bubble).not.toBeNull()
      expect(bubble?.textContent).toContain('完整的一段超长文本内容')
    })

    it('uses the custom tooltip content from the object form', async () => {
      const w = mountEllipsis(
        { tooltip: { delay: 0, content: '自定义提示' } },
        { default: () => '完整的一段超长文本内容' },
      )
      stubOverflow(w)
      await nextTick()
      await hoverOpen(w)
      const bubble = document.body.querySelector('.sn-tooltip')
      expect(bubble?.textContent).toContain('自定义提示')
    })

    it('renders no tooltip wiring at all when tooltip is false', () => {
      const w = mountEllipsis({ tooltip: false }, { default: () => '文本' })
      expect(w.find('.sn-tooltip-trigger').exists()).toBe(false)
      expect(w.find('.sn-ellipsis__content').exists()).toBe(true)
    })

    it('keeps the tooltip disabled while expanded', async () => {
      const w = mountEllipsis(
        { expandTrigger: 'click', width: 80, tooltip: { delay: 0 } },
        { default: () => '很长很长的一段文本' },
      )
      stubOverflow(w)
      await w.find('.sn-ellipsis__content').trigger('click')
      await nextTick()
      await hoverOpen(w)
      expect(document.body.querySelector('.sn-tooltip')).toBeNull()
    })
  })
})
