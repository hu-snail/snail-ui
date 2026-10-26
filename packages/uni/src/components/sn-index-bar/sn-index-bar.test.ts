/**
 * sn-index-bar / sn-index-anchor unit tests — uni-end index list.
 *
 * Behaviour only (AGENTS.md §46): anchor registration drives the sidebar,
 * tapping a sidebar entry emits `change` and retargets the scroll-view, and
 * the tab roles stay in sync. No rpx numbers in assertions — happy-dom
 * discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnIndexBar from './sn-index-bar.vue'
import SnIndexAnchor from './sn-index-anchor.vue'

/** Harness: a bar with one anchor per letter. */
function mountBar(
  props: Record<string, unknown> = {},
  letters: string[] = ['A', 'B', 'C'],
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnIndexBar, props, {
          default: () =>
            letters.map((letter) =>
              h(SnIndexAnchor, { index: letter }, { default: () => `items ${letter}` }),
            ),
        })
    },
  })
  return mount(Harness)
}

describe('sn-index-bar', () => {
  describe('sidebar', () => {
    it('renders one sidebar entry per anchor', async () => {
      const wrapper = mountBar()
      await wrapper.vm.$nextTick()
      const entries = wrapper.findAll('.sn-index-bar__index')
      expect(entries).toHaveLength(3)
      expect(entries[0]!.text()).toBe('A')
    })

    it('highlights the first anchor by default', async () => {
      const wrapper = mountBar()
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('.sn-index-bar__index')[0]!.classes())
        .toContain('sn-index-bar__index--active')
    })

    it('moves the highlight to the tapped anchor', async () => {
      const wrapper = mountBar()
      await wrapper.vm.$nextTick()
      await wrapper.findAll('.sn-index-bar__index')[2]!.trigger('tap')
      await wrapper.vm.$nextTick()
      const entries = wrapper.findAll('.sn-index-bar__index')
      expect(entries[2]!.classes()).toContain('sn-index-bar__index--active')
      expect(entries[0]!.classes()).not.toContain('sn-index-bar__index--active')
    })

    it('emits change with the tapped index', async () => {
      const wrapper = mountBar()
      await wrapper.vm.$nextTick()
      await wrapper.findAll('.sn-index-bar__index')[1]!.trigger('tap')
      expect(wrapper.findComponent(SnIndexBar).emitted('change')?.at(-1)).toEqual([{ index: 'B' }])
    })

    it('does not emit change for an unknown index', async () => {
      const wrapper = mountBar({}, ['A'])
      await wrapper.vm.$nextTick()
      const vm = wrapper.findComponent(SnIndexBar).vm as unknown as {
        scrollTo: (index: string) => void
      }
      vm.scrollTo('Z')
      expect(wrapper.findComponent(SnIndexBar).emitted('change')).toBeUndefined()
    })

    it('points scroll-into-view at the tapped anchor id', async () => {
      const wrapper = mountBar()
      await wrapper.vm.$nextTick()
      await wrapper.findAll('.sn-index-bar__index')[1]!.trigger('tap')
      await wrapper.vm.$nextTick()
      const anchorId = wrapper.findAll('.sn-index-anchor')[1]!.attributes('id')
      expect(anchorId).toBeTruthy()
      expect(wrapper.find('.sn-index-bar__list').attributes('scroll-into-view')).toBe(anchorId)
    })

    it('drops the highlight when every anchor unmounts', async () => {
      const wrapper = mountBar({}, ['A'])
      await wrapper.vm.$nextTick()
      wrapper.findAll('.sn-index-anchor')[0]!.unmount?.()
    })
  })

  describe('layout / accessibility', () => {
    it('adds the sticky class', () => {
      expect(mountBar({ sticky: true }).find('.sn-index-bar').classes())
        .toContain('sn-index-bar--sticky')
    })

    it('forwards customClass and customStyle', () => {
      const wrapper = mountBar({ customClass: 'my-bar', customStyle: 'margin: 4px;' })
      expect(wrapper.find('.sn-index-bar').classes()).toContain('my-bar')
      expect(wrapper.find('.sn-index-bar').attributes('style')).toContain('margin: 4px')
    })

    it('exposes role="tablist" on the sidebar', async () => {
      const wrapper = mountBar()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.sn-index-bar__sidebar').attributes('role')).toBe('tablist')
    })

    it('exposes role="tab" and aria-selected per entry', async () => {
      const wrapper = mountBar()
      await wrapper.vm.$nextTick()
      const entries = wrapper.findAll('.sn-index-bar__index')
      expect(entries[0]!.attributes('role')).toBe('tab')
      expect(entries[0]!.attributes('aria-selected')).toBe('true')
      expect(entries[1]!.attributes('aria-selected')).toBe('false')
    })
  })
})

describe('sn-index-anchor', () => {
  it('renders the index character in the header', async () => {
    const wrapper = mountBar({}, ['A'])
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.sn-index-anchor__index').text()).toBe('A')
  })

  it('renders the default slot in the body', async () => {
    const wrapper = mountBar({}, ['A'])
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.sn-index-anchor__body').text()).toBe('items A')
  })

  it('renders a stable DOM id for the scroll target', async () => {
    const wrapper = mountBar()
    await wrapper.vm.$nextTick()
    const ids = wrapper.findAll('.sn-index-anchor').map((node) => node.attributes('id'))
    expect(ids).toHaveLength(3)
    expect(new Set(ids).size).toBe(3)
  })

  it('marks the active anchor', async () => {
    const wrapper = mountBar()
    await wrapper.vm.$nextTick()
    await wrapper.findAll('.sn-index-bar__index')[1]!.trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.sn-index-anchor')[1]!.classes())
      .toContain('sn-index-anchor--active')
  })

  it('forwards customClass on the anchor', async () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(SnIndexBar, {}, {
            default: () => [h(SnIndexAnchor, { index: 'A', customClass: 'my-anchor' })],
          })
      },
    })
    const wrapper = mount(Harness)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.sn-index-anchor').classes()).toContain('my-anchor')
  })
})
