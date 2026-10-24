/**
 * sn-collapse / sn-collapse-item unit tests — uni-end collapse panels.
 *
 * Behaviour only (AGENTS.md §46): the three v-model shapes (normal /
 * accordion / view-more), the disabled guard, the beforeExpend veto and the
 * toggleAll method. No rpx numbers in assertions — happy-dom discards lengths
 * it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnCollapse from './sn-collapse.vue'
import SnCollapseItem from './sn-collapse-item.vue'

/** Harness: a collapse container with N named panels. */
function mountCollapse(
  props: Record<string, unknown> = {},
  items: Record<string, unknown>[] = [
    { name: 'a', title: 'A' },
    { name: 'b', title: 'B' },
    { name: 'c', title: 'C' },
  ],
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnCollapse, props, {
          default: () =>
            items.map((item) =>
              h(SnCollapseItem, item, { default: () => `body ${String(item.name)}` }),
            ),
        })
    },
  })
  return mount(Harness)
}

describe('sn-collapse', () => {
  describe('normal mode', () => {
    it('renders every panel header', () => {
      const wrapper = mountCollapse()
      expect(wrapper.findAll('.sn-collapse-item__header')).toHaveLength(3)
    })

    it('opens the panels listed in the bound array', () => {
      const wrapper = mountCollapse({ modelValue: ['a', 'c'] })
      const items = wrapper.findAll('.sn-collapse-item')
      expect(items[0]!.classes()).toContain('sn-collapse-item--expanded')
      expect(items[1]!.classes()).not.toContain('sn-collapse-item--expanded')
      expect(items[2]!.classes()).toContain('sn-collapse-item--expanded')
    })

    it('emits the opened-name array on tap', async () => {
      const wrapper = mountCollapse({ modelValue: ['a'] })
      await wrapper.findAll('.sn-collapse-item__header')[1]!.trigger('tap')
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
        .toEqual([['a', 'b']])
    })

    it('closes an open panel', async () => {
      const wrapper = mountCollapse({ modelValue: ['a', 'b'] })
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap')
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
        .toEqual([['b']])
    })

    it('emits change with { value }', async () => {
      const wrapper = mountCollapse({ modelValue: [] })
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap')
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('change')?.at(-1))
        .toEqual([{ value: ['a'] }])
    })

    it('works uncontrolled', async () => {
      const wrapper = mountCollapse()
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap')
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('.sn-collapse-item')[0]!.classes())
        .toContain('sn-collapse-item--expanded')
    })
  })

  describe('accordion mode', () => {
    it('opens the single named panel', () => {
      const wrapper = mountCollapse({ accordion: true, modelValue: 'b' })
      const items = wrapper.findAll('.sn-collapse-item')
      expect(items[1]!.classes()).toContain('sn-collapse-item--expanded')
      expect(items[0]!.classes()).not.toContain('sn-collapse-item--expanded')
    })

    it('replaces the open panel instead of adding', async () => {
      const wrapper = mountCollapse({ accordion: true, modelValue: 'a' })
      await wrapper.findAll('.sn-collapse-item__header')[2]!.trigger('tap')
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
        .toEqual(['c'])
      const items = wrapper.findAll('.sn-collapse-item')
      expect(items[2]!.classes()).toContain('sn-collapse-item--expanded')
      expect(items[0]!.classes()).not.toContain('sn-collapse-item--expanded')
    })

    it('closes the open panel when tapped again', async () => {
      const wrapper = mountCollapse({ accordion: true, modelValue: 'a' })
      await wrapper.findAll('.sn-collapse-item__header')[0]!.trigger('tap')
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
        .toEqual([''])
    })

    it('adds the accordion class', () => {
      expect(mountCollapse({ accordion: true }).find('.sn-collapse').classes())
        .toContain('sn-collapse--accordion')
    })
  })

  describe('view-more mode', () => {
    it('shows the body without expanding a panel', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false }, [{ name: 'a' }])
      expect(wrapper.find('.sn-collapse-item__body').isVisible()).toBe(true)
    })

    it('clamps the body while collapsed', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false, lineNum: 3 }, [{ name: 'a' }])
      const body = wrapper.find('.sn-collapse-item__body')
      expect(body.classes()).toContain('sn-collapse-item__body--clamped')
      expect(body.attributes('style')).toContain('-webkit-line-clamp: 3')
    })

    it('drops the clamp once expanded', () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: true }, [{ name: 'a' }])
      expect(wrapper.find('.sn-collapse-item__body').classes())
        .not.toContain('sn-collapse-item__body--clamped')
    })

    it('renders the more control and flips the flag', async () => {
      const wrapper = mountCollapse({ viewmore: true, modelValue: false }, [{ name: 'a' }])
      const more = wrapper.find('.sn-collapse__more')
      expect(more.exists()).toBe(true)
      await more.trigger('tap')
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
        .toEqual([true])
    })

    it('exposes the expanded flag to the more slot', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnCollapse, { viewmore: true, modelValue: true }, {
              default: () => [h(SnCollapseItem, { name: 'a' })],
              more: ({ expanded }: { expanded: boolean }) =>
                h('text', { class: 'custom-more' }, String(expanded)),
            })
        },
      })
      expect(mount(Harness).find('.custom-more').text()).toBe('true')
    })
  })

  describe('disabled / beforeExpend', () => {
    it('does not toggle a disabled panel', async () => {
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', title: 'A', disabled: true }])
      await wrapper.find('.sn-collapse-item__header').trigger('tap')
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')).toBeUndefined()
    })

    it('marks a disabled panel with aria-disabled', () => {
      const wrapper = mountCollapse({}, [{ name: 'a', disabled: true }])
      expect(wrapper.find('.sn-collapse-item__header').attributes('aria-disabled')).toBe('true')
    })

    it('opens when beforeExpend resolves true', async () => {
      const beforeExpend = vi.fn(() => true)
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', beforeExpend }])
      await wrapper.find('.sn-collapse-item__header').trigger('tap')
      await vi.waitFor(() => {
        expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
          .toEqual([['a']])
      })
      expect(beforeExpend).toHaveBeenCalledWith('a')
    })

    it('stays closed when beforeExpend resolves false', async () => {
      const beforeExpend = vi.fn(async () => false)
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', beforeExpend }])
      await wrapper.find('.sn-collapse-item__header').trigger('tap')
      await vi.waitFor(() => expect(beforeExpend).toHaveBeenCalled())
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')).toBeUndefined()
    })

    it('stays closed when beforeExpend rejects', async () => {
      const beforeExpend = vi.fn(async () => {
        throw new Error('denied')
      })
      const wrapper = mountCollapse({ modelValue: [] }, [{ name: 'a', beforeExpend }])
      await wrapper.find('.sn-collapse-item__header').trigger('tap')
      await vi.waitFor(() => expect(beforeExpend).toHaveBeenCalled())
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')).toBeUndefined()
    })

    it('closes without consulting beforeExpend', async () => {
      const beforeExpend = vi.fn(() => false)
      const wrapper = mountCollapse({ modelValue: ['a'] }, [{ name: 'a', beforeExpend }])
      await wrapper.find('.sn-collapse-item__header').trigger('tap')
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
        .toEqual([[]])
      expect(beforeExpend).not.toHaveBeenCalled()
    })
  })

  describe('toggleAll', () => {
    it('opens every panel with expanded: true', async () => {
      const wrapper = mountCollapse({ modelValue: [] })
      await wrapper.vm.$nextTick()
      const vm = wrapper.findComponent(SnCollapse).vm as unknown as {
        toggleAll: (options?: { expanded?: boolean }) => void
      }
      vm.toggleAll({ expanded: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
        .toEqual([['a', 'b', 'c']])
    })

    it('closes every panel with expanded: false', async () => {
      const wrapper = mountCollapse({ modelValue: ['a', 'b'] })
      await wrapper.vm.$nextTick()
      const vm = wrapper.findComponent(SnCollapse).vm as unknown as {
        toggleAll: (options?: { expanded?: boolean }) => void
      }
      vm.toggleAll({ expanded: false })
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(SnCollapse).emitted('update:modelValue')?.at(-1))
        .toEqual([[]])
    })
  })

  describe('slots / accessibility', () => {
    it('renders the title slot over the title prop', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnCollapse, { modelValue: [] }, {
              default: () => [
                h(SnCollapseItem, { name: 'a', title: 'ignored' }, {
                  title: () => h('text', { class: 'custom-title' }, 'slot'),
                }),
              ],
            })
        },
      })
      const wrapper = mount(Harness)
      expect(wrapper.find('.custom-title').text()).toBe('slot')
      expect(wrapper.find('.sn-collapse-item__title-text').exists()).toBe(false)
    })

    it('marks the header as role="button" with aria-expanded', () => {
      const wrapper = mountCollapse({ modelValue: ['a'] })
      const header = wrapper.find('.sn-collapse-item__header')
      expect(header.attributes('role')).toBe('button')
      expect(header.attributes('aria-expanded')).toBe('true')
    })

    it('forwards customClass on the container and the item', () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(SnCollapse, { customClass: 'my-collapse' }, {
              default: () => [h(SnCollapseItem, { name: 'a', customClass: 'my-item' })],
            })
        },
      })
      const wrapper = mount(Harness)
      expect(wrapper.find('.sn-collapse').classes()).toContain('my-collapse')
      expect(wrapper.find('.sn-collapse-item').classes()).toContain('my-item')
    })
  })
})
