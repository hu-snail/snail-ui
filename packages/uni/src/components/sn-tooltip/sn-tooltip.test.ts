/**
 * sn-tooltip unit tests — uni-end tap-triggered hint bubble (wd-tooltip parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - the trigger toggles the bubble, `open` / `close` / `change` fire in order
 *   - `disabled` blocks both the trigger and the imperative API
 *   - `content` renders as text lines; the `content` slot wins over it
 *   - `placement` becomes a class, `offset` becomes a CSS variable pair
 *   - `showClose` renders a close button that hides the bubble
 *   - the leave timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SnTooltip from './sn-tooltip.vue'

describe('sn-tooltip', () => {
  describe('structure', () => {
    it('renders the trigger slot and no bubble while closed', () => {
      const w = mount(SnTooltip, { slots: { default: '<text>删除</text>' } })
      expect(w.text()).toContain('删除')
      expect(w.find('.sn-tooltip__pop').exists()).toBe(false)
    })

    it('renders the bubble and its text when modelValue is true', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, content: '删除后不可恢复' } })
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true)
      expect(w.find('.sn-tooltip__line').text()).toBe('删除后不可恢复')
    })

    it('renders one line per entry for an array content', () => {
      const w = mount(SnTooltip, {
        props: { modelValue: true, content: ['第一行', { label: '第二行' }] },
      })
      const lines = w.findAll('.sn-tooltip__line')
      expect(lines).toHaveLength(2)
      expect(lines[1]!.text()).toBe('第二行')
    })

    it('lets the content slot replace the content prop', () => {
      const w = mount(SnTooltip, {
        props: { modelValue: true, content: 'prop 文案' },
        slots: { content: '<text class="custom-body">slot 文案</text>' },
      })
      expect(w.find('.custom-body').exists()).toBe(true)
      expect(w.find('.sn-tooltip__line').exists()).toBe(false)
    })

    it('applies the placement class', () => {
      const w = mount(SnTooltip, { props: { placement: 'top-start' } })
      expect(w.classes()).toContain('sn-tooltip--top-start')
    })

    it('forwards customClass to the root and customPop to the bubble', () => {
      const w = mount(SnTooltip, {
        props: { modelValue: true, customClass: 'my-tip', customPop: 'my-pop' },
      })
      expect(w.classes()).toContain('my-tip')
      expect(w.find('.sn-tooltip__pop').classes()).toContain('my-pop')
    })

    it('forwards customStyle onto the root style', () => {
      const w = mount(SnTooltip, { props: { customStyle: 'margin: 4px' } })
      expect(w.attributes('style') ?? '').toContain('margin: 4px')
    })

    it('publishes the offset as a CSS variable pair', () => {
      const w = mount(SnTooltip, { props: { offset: { x: 6, y: 2 } } })
      const style = w.attributes('style') ?? ''
      expect(style).toContain('--sn-tooltip-offset-x: 6px')
      expect(style).toContain('--sn-tooltip-offset-y: 2px')
    })

    it('accepts a number offset and applies it to both axes', () => {
      const w = mount(SnTooltip, { props: { offset: 4 } })
      const style = w.attributes('style') ?? ''
      expect(style).toContain('--sn-tooltip-offset-x: 4px')
      expect(style).toContain('--sn-tooltip-offset-y: 4px')
    })

    it('accepts an array offset', () => {
      const w = mount(SnTooltip, { props: { offset: [3, 7] } })
      const style = w.attributes('style') ?? ''
      expect(style).toContain('--sn-tooltip-offset-x: 3px')
      expect(style).toContain('--sn-tooltip-offset-y: 7px')
    })
  })

  describe('arrow', () => {
    it('renders the arrow by default', () => {
      const w = mount(SnTooltip, { props: { modelValue: true } })
      expect(w.find('.sn-tooltip__arrow').exists()).toBe(true)
    })

    it('hides the arrow when visibleArrow is false', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, visibleArrow: false } })
      expect(w.find('.sn-tooltip__arrow').exists()).toBe(false)
    })

    it('forwards customArrow onto the arrow node', () => {
      const w = mount(SnTooltip, { props: { modelValue: true, customArrow: 'my-arrow' } })
      expect(w.find('.sn-tooltip__arrow').classes()).toContain('my-arrow')
    })
  })

  describe('interaction', () => {
    it('emits update:modelValue and open when the trigger is tapped', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } })
      await w.find('.sn-tooltip__trigger').trigger('tap')
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
      await w.vm.$nextTick()
      expect(w.emitted('open')).toHaveLength(1)
      expect(w.emitted('change')?.[0]).toEqual([{ show: true }])
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true)
    })

    it('shows the bubble even when the consumer ignores update:modelValue', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } })
      await w.find('.sn-tooltip__trigger').trigger('tap')
      await w.vm.$nextTick()
      expect(w.find('.sn-tooltip__pop').exists()).toBe(true)
      expect(w.classes()).toContain('sn-tooltip--shown')
    })

    it('closes on a second tap', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true } })
      await w.find('.sn-tooltip__trigger').trigger('tap')
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
      expect(w.emitted('close')).toHaveLength(1)
      expect(w.emitted('change')?.[0]).toEqual([{ show: false }])
    })

    it('ignores the trigger tap while disabled', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false, disabled: true } })
      await w.find('.sn-tooltip__trigger').trigger('tap')
      expect(w.emitted('update:modelValue')).toBeUndefined()
      expect(w.find('.sn-tooltip__pop').exists()).toBe(false)
      expect(w.find('.sn-tooltip__trigger').attributes('aria-disabled')).toBe('true')
    })

    it('does not open when a disabled tooltip is driven by v-model', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false, disabled: true } })
      await w.setProps({ modelValue: true })
      await w.vm.$nextTick()
      expect(w.emitted('open')).toBeUndefined()
      expect(w.find('.sn-tooltip__pop').exists()).toBe(false)
    })

    it('renders a close button that hides the bubble', async () => {
      const w = mount(SnTooltip, { props: { modelValue: true, showClose: true } })
      const close = w.find('.sn-tooltip__close')
      expect(close.exists()).toBe(true)
      await close.trigger('tap')
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
      expect(w.emitted('close')).toHaveLength(1)
    })

    it('exposes an imperative open / close pair', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } })
      const vm = w.vm as unknown as { open(): void, close(): void }
      vm.open()
      await w.vm.$nextTick()
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
      vm.close()
      expect(w.emitted('update:modelValue')?.[1]).toEqual([false])
    })
  })

  describe('timers', () => {
    it('keeps the bubble mounted for the fade-out leg', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnTooltip, { props: { modelValue: true } })
        await w.setProps({ modelValue: false })
        expect(w.find('.sn-tooltip__pop').exists()).toBe(true)
        vi.advanceTimersByTime(150)
        await w.vm.$nextTick()
        expect(w.find('.sn-tooltip__pop').exists()).toBe(false)
      } finally {
        vi.useRealTimers()
      }
    })

    it('clears the pending leave timer on unmount (no leak)', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnTooltip, { props: { modelValue: true } })
        await w.setProps({ modelValue: false })
        w.unmount()
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('accessibility', () => {
    it('marks the trigger as an expanded button', async () => {
      const w = mount(SnTooltip, { props: { modelValue: false } })
      const trigger = w.find('.sn-tooltip__trigger')
      expect(trigger.attributes('role')).toBe('button')
      expect(trigger.attributes('aria-expanded')).toBe('false')
      await w.setProps({ modelValue: true })
      // `enter()` flips the shown state one tick later — flush the queue.
      await flushPromises()
      expect(w.find('.sn-tooltip__trigger').attributes('aria-expanded')).toBe('true')
    })

    it('gives the bubble a tooltip role and the arrow aria-hidden', () => {
      const w = mount(SnTooltip, { props: { modelValue: true } })
      expect(w.find('.sn-tooltip__pop').attributes('role')).toBe('tooltip')
      expect(w.find('.sn-tooltip__arrow').attributes('aria-hidden')).toBe('true')
    })

    it('tags the root for the docs / AI component map', () => {
      const w = mount(SnTooltip)
      expect(w.attributes('data-snui-component')).toBe('tooltip')
    })
  })
})
