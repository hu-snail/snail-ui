import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { Fragment, h } from 'vue'
import type { VNode } from 'vue'
import SnWaterfall from './SnWaterfall.vue'

/**
 * Harness notes:
 *
 * 1. The layout is pure CSS (multi-column), so there is no geometry to
 *    assert in happy-dom — these tests pin the *contract* the CSS depends
 *    on: one wrapper per slot child, the column geometry the component
 *    inlines, and the two gap custom properties.
 *
 * 2. Column geometry is read from the root's inline style, not from
 *    `getComputedStyle`: happy-dom does not resolve `var()` / custom
 *    properties, but it does keep the inline declarations.
 *
 * 3. `<template v-for>` compiles to a Fragment vnode, so the fragment
 *    cases build `h(Fragment, [...])` by hand — the same shape the
 *    `default` slot receives from a real template.
 */

function mountWaterfall(
  options: ComponentMountingOptions<typeof SnWaterfall> = {},
) {
  return mount(SnWaterfall, options)
}

/** The mounted root (single-root component). */
function rootOf(wrapper: ReturnType<typeof mountWaterfall>): HTMLElement {
  return wrapper.element as HTMLElement
}

function readGap(el: HTMLElement, name: string): string {
  return el.style.getPropertyValue(name)
}

/** One Fragment vnode holding `entries` — mirrors `<template v-for>`. */
function fragmentList(entries: string[]): VNode {
  return h(
    Fragment,
    entries.map((entry) => h('span', { class: 'entry' }, entry)),
  )
}

describe('SnWaterfall', () => {
  describe('item wrapping', () => {
    it('should render one item box per slot child', () => {
      const wrapper = mountWaterfall({
        slots: {
          default: () => [
            h('span', { class: 'entry' }, 'a'),
            h('span', { class: 'entry' }, 'b'),
            h('span', { class: 'entry' }, 'c'),
          ],
        },
      })

      const items = wrapper.findAll('.sn-waterfall__item')
      expect(items).toHaveLength(3)
      items.forEach((item, index) => {
        expect(item.find('.entry').text()).toBe(['a', 'b', 'c'][index])
      })
    })

    it('should render nothing for an empty slot', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [] } })
      expect(wrapper.find('.sn-waterfall__item').exists()).toBe(false)
    })

    it('should skip null and boolean slot children', () => {
      const wrapper = mountWaterfall({
        slots: {
          default: () => [null, false, h('span', { class: 'entry' }, 'a')],
        },
      })
      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(1)
    })

    it('should tag the root as this component', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [h('span')] } })
      expect(rootOf(wrapper).getAttribute('data-snui-component')).toBe(
        'waterfall',
      )
    })
  })

  describe('fragment flattening', () => {
    it('should render one item per entry inside a v-for fragment', () => {
      const wrapper = mountWaterfall({
        slots: { default: () => fragmentList(['a', 'b', 'c', 'd']) },
      })

      const items = wrapper.findAll('.sn-waterfall__item')
      expect(items).toHaveLength(4)
      expect(items.map((item) => item.find('.entry').text())).toEqual([
        'a',
        'b',
        'c',
        'd',
      ])
    })

    it('should flatten nested fragments recursively', () => {
      const wrapper = mountWaterfall({
        slots: {
          default: () =>
            h(Fragment, [
              h(Fragment, [
                h('span', { class: 'entry' }, 'a'),
                h('span', { class: 'entry' }, 'b'),
              ]),
              h('span', { class: 'entry' }, 'c'),
            ]),
        },
      })

      const items = wrapper.findAll('.sn-waterfall__item')
      expect(items).toHaveLength(3)
      expect(items.map((item) => item.find('.entry').text())).toEqual([
        'a',
        'b',
        'c',
      ])
    })
  })

  describe('columns', () => {
    it('should default to three columns', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [h('span')] } })
      expect(rootOf(wrapper).style.columnCount).toBe('3')
    })

    it('should apply columns as column-count', () => {
      const wrapper = mountWaterfall({
        props: { columns: 5 },
        slots: { default: () => [h('span')] },
      })
      expect(rootOf(wrapper).style.columnCount).toBe('5')
    })

    it('should coerce columns to an integer of at least 1', () => {
      const fractional = mountWaterfall({
        props: { columns: 2.7 },
        slots: { default: () => [h('span')] },
      })
      expect(rootOf(fractional).style.columnCount).toBe('2')

      const zero = mountWaterfall({
        props: { columns: 0 },
        slots: { default: () => [h('span')] },
      })
      expect(rootOf(zero).style.columnCount).toBe('1')
    })

    it('should mark the root as a masonry container', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [h('span')] } })
      expect(rootOf(wrapper).classList.contains('sn-waterfall--masonry')).toBe(
        true,
      )
    })
  })

  describe('minColumnWidth', () => {
    it('should switch to column-width and drop column-count', () => {
      const wrapper = mountWaterfall({
        props: { minColumnWidth: 200, columns: 5 },
        slots: { default: () => [h('span')] },
      })

      const root = rootOf(wrapper)
      expect(root.style.columnWidth).toBe('200px')
      // Responsive mode: `columns` is ignored.
      expect(root.style.columnCount).toBe('')
    })

    it('should pass a string minColumnWidth through untouched', () => {
      const wrapper = mountWaterfall({
        props: { minColumnWidth: '12rem' },
        slots: { default: () => [h('span')] },
      })
      expect(rootOf(wrapper).style.columnWidth).toBe('12rem')
    })
  })

  describe('gaps', () => {
    it('should expose the default gaps as custom properties', () => {
      const wrapper = mountWaterfall({ slots: { default: () => [h('span')] } })
      const root = rootOf(wrapper)
      expect(readGap(root, '--sn-waterfall-column-gap')).toBe('16px')
      expect(readGap(root, '--sn-waterfall-row-gap')).toBe('16px')
    })

    it('should accept numeric gaps as px and string gaps verbatim', () => {
      const wrapper = mountWaterfall({
        props: { columnGap: 24, rowGap: '2rem' },
        slots: { default: () => [h('span')] },
      })
      const root = rootOf(wrapper)
      expect(readGap(root, '--sn-waterfall-column-gap')).toBe('24px')
      expect(readGap(root, '--sn-waterfall-row-gap')).toBe('2rem')
    })
  })

  describe('masonry off switch', () => {
    it('should drop the multi-column layout when masonry is false', () => {
      const wrapper = mountWaterfall({
        props: { masonry: false, columns: 4 },
        slots: { default: () => [h('span', { class: 'entry' }, 'a')] },
      })

      const root = rootOf(wrapper)
      expect(root.style.columnCount).toBe('')
      expect(root.style.columnWidth).toBe('')
      expect(root.classList.contains('sn-waterfall--stacked')).toBe(true)
      expect(root.classList.contains('sn-waterfall--masonry')).toBe(false)
    })

    it('should still wrap the items when masonry is false', () => {
      const wrapper = mountWaterfall({
        props: { masonry: false },
        slots: { default: () => [h('span', { class: 'entry' }, 'a'), h('span', { class: 'entry' }, 'b')] },
      })
      expect(wrapper.findAll('.sn-waterfall__item')).toHaveLength(2)
    })

    it('should ignore minColumnWidth when masonry is false', () => {
      const wrapper = mountWaterfall({
        props: { masonry: false, minColumnWidth: 200 },
        slots: { default: () => [h('span')] },
      })
      expect(rootOf(wrapper).style.columnWidth).toBe('')
    })
  })

  describe('accessibility', () => {
    it('should expose the items as an ARIA list', () => {
      const wrapper = mountWaterfall({
        slots: {
          default: () => [h('span', { class: 'entry' }, 'a'), h('span', { class: 'entry' }, 'b')],
        },
      })

      expect(rootOf(wrapper).getAttribute('role')).toBe('list')
      wrapper.findAll('.sn-waterfall__item').forEach((item) => {
        expect(item.attributes('role')).toBe('listitem')
      })
    })
  })
})