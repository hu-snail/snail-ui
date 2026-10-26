/**
 * sn-layout / sn-col unit tests — uni-end 24-column grid.
 *
 * Behaviour only (AGENTS.md §46): the justify / align classes, the gutter
 * plumbing from row to column, the span / offset percentages and the clamping
 * of out-of-range values. No rpx numbers in assertions — happy-dom discards
 * lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnLayout from './sn-layout.vue'
import SnCol from './sn-col.vue'

/** Harness: a layout row with the given columns. */
function mountLayout(
  layoutProps: Record<string, unknown> = {},
  cols: Record<string, unknown>[] = [{ span: 12 }, { span: 12 }],
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnLayout, layoutProps, {
          default: () => cols.map((col) => h(SnCol, col, { default: () => 'cell' })),
        })
    },
  })
  return mount(Harness)
}

describe('sn-layout', () => {
  describe('alignment', () => {
    it('defaults to justify start / align top', () => {
      const wrapper = mountLayout()
      expect(wrapper.find('.sn-layout').classes()).toContain('sn-layout--justify-start')
      expect(wrapper.find('.sn-layout').classes()).toContain('sn-layout--align-top')
    })

    it('applies each justify value', () => {
      for (const value of ['center', 'end', 'space-between', 'space-around', 'space-evenly']) {
        expect(mountLayout({ justify: value }).find('.sn-layout').classes())
          .toContain(`sn-layout--justify-${value}`)
      }
    })

    it('applies each align value', () => {
      for (const value of ['middle', 'bottom']) {
        expect(mountLayout({ align: value }).find('.sn-layout').classes())
          .toContain(`sn-layout--align-${value}`)
      }
    })
  })

  describe('gutter', () => {
    it('pulls the row out by half a gutter on each side', () => {
      const style = mountLayout({ gutter: 20 }).find('.sn-layout').attributes('style')
      expect(style).toContain('margin-left: -10px')
      expect(style).toContain('margin-right: -10px')
    })

    it('pads each column by half a gutter', () => {
      const style = mountLayout({ gutter: 20 }).find('.sn-col').attributes('style')
      expect(style).toContain('padding-left: 10px')
      expect(style).toContain('padding-right: 10px')
    })

    it('omits the gutter styles at zero', () => {
      expect(mountLayout().find('.sn-layout').attributes('style')).toBeUndefined()
      expect(mountLayout().find('.sn-col').attributes('style')).not.toContain('padding-left')
    })
  })

  describe('columns', () => {
    it('renders one column per child', () => {
      expect(mountLayout({}, [{ span: 8 }, { span: 8 }, { span: 8 }])
        .findAll('.sn-col')).toHaveLength(3)
    })

    it('renders the slot content of each column', () => {
      expect(mountLayout({}, [{ span: 24 }]).find('.sn-col').text()).toBe('cell')
    })

    it('sets the width from span', () => {
      const style = mountLayout({}, [{ span: 6 }]).find('.sn-col').attributes('style')
      /* happy-dom expands `flex` into longhands, so assert those. */
      expect(style).toContain('flex-basis: 25%')
      expect(style).toContain('max-width: 25%')
    })

    it('defaults span to the full 24 columns', () => {
      const style = mountLayout({}, [{}]).find('.sn-col').attributes('style')
      expect(style).toContain('flex-basis: 100%')
    })

    it('sets the offset as a left margin', () => {
      const style = mountLayout({}, [{ span: 12, offset: 6 }]).find('.sn-col').attributes('style')
      expect(style).toContain('margin-left: 25%')
    })

    it('omits the offset margin at zero', () => {
      expect(mountLayout({}, [{ span: 12 }]).find('.sn-col').attributes('style'))
        .not.toContain('margin-left')
    })

    it('clamps a span above the grid', () => {
      const style = mountLayout({}, [{ span: 99 }]).find('.sn-col').attributes('style')
      expect(style).toContain('flex-basis: 100%')
    })

    it('clamps a span below one column', () => {
      const style = mountLayout({}, [{ span: 0 }]).find('.sn-col').attributes('style')
      expect(style).toContain('flex-basis: 4.1666')
    })
  })

  describe('forwarding', () => {
    it('forwards customClass / customStyle on the row', () => {
      const wrapper = mountLayout({ customClass: 'my-row', customStyle: 'margin: 4px;' })
      expect(wrapper.find('.sn-layout').classes()).toContain('my-row')
      expect(wrapper.find('.sn-layout').attributes('style')).toContain('margin: 4px')
    })

    it('forwards customClass / customStyle on the column', () => {
      const wrapper = mountLayout({}, [{ customClass: 'my-col', customStyle: 'color: red;' }])
      expect(wrapper.find('.sn-col').classes()).toContain('my-col')
      expect(wrapper.find('.sn-col').attributes('style')).toContain('color: red')
    })
  })
})
