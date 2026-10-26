/**
 * sn-swipe-action unit tests — uni-end swipe-to-reveal row (wd-swipe-action parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - a horizontal swipe opens the matching side; a vertical gesture is ignored
 *   - `v-model` reports the new status; `disabled` blocks every gesture
 *   - `before-close` returning false blocks the close (sync and async)
 *   - `touchcancel` settles the row closed
 *   - tapping the open content area closes it and emits `click`
 *   - slot presence decides which sides can open
 *   - the settle timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { afterEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SnSwipeAction from './sn-swipe-action.vue'

const slots = {
  default: '<text class="row-content">内容</text>',
  right: '<view class="row-delete">删除</view>',
}

/** Swipe horizontally across the root node by `dx` design px. */
async function swipe(
  w: ReturnType<typeof mount>,
  dx: number,
  dy = 0,
): Promise<void> {
  const root = w.find('.sn-swipe-action')
  await root.trigger('touchstart', { touches: [{ clientX: 200, clientY: 100 }] })
  await root.trigger('touchmove', { touches: [{ clientX: 200 + dx, clientY: 100 + dy }] })
  await root.trigger('touchend', { touches: [{ clientX: 200 + dx, clientY: 100 + dy }] })
  await flushPromises()
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni
})

describe('sn-swipe-action', () => {
  describe('structure', () => {
    it('renders the content slot', () => {
      const w = mount(SnSwipeAction, { slots })
      expect(w.find('.row-content').exists()).toBe(true)
    })

    it('renders only the action areas that have a slot', () => {
      const w = mount(SnSwipeAction, { slots })
      expect(w.find('.sn-swipe-action__actions--right').exists()).toBe(true)
      expect(w.find('.sn-swipe-action__actions--left').exists()).toBe(false)
    })

    it('renders no action area without slots', () => {
      const w = mount(SnSwipeAction, { slots: { default: 'x' } })
      expect(w.find('.sn-swipe-action__actions').exists()).toBe(false)
    })

    it('forwards customClass and customStyle', () => {
      const w = mount(SnSwipeAction, {
        props: { customClass: 'my-row', customStyle: 'margin: 4px' },
      })
      expect(w.classes()).toContain('my-row')
      expect(w.attributes('style') ?? '').toContain('margin: 4px')
    })

    it('applies the open class from modelValue', () => {
      const w = mount(SnSwipeAction, { props: { modelValue: 'right' }, slots })
      expect(w.classes()).toContain('sn-swipe-action--open')
      expect(w.find('.sn-swipe-action__content').attributes('aria-expanded')).toBe('true')
    })
  })

  describe('gestures', () => {
    it('opens the right actions on a leftward swipe', async () => {
      const w = mount(SnSwipeAction, { slots })
      await swipe(w, -120)
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['right'])
      expect(w.classes()).toContain('sn-swipe-action--open')
    })

    it('opens the left actions on a rightward swipe', async () => {
      const leftSlots = { default: 'x', left: '<view class="row-star">收藏</view>' }
      const w = mount(SnSwipeAction, { slots: leftSlots })
      await swipe(w, 120)
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['left'])
    })

    it('ignores a rightward swipe when there is no left slot', async () => {
      const w = mount(SnSwipeAction, { slots })
      await swipe(w, 120)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('ignores a mostly-vertical gesture', async () => {
      const w = mount(SnSwipeAction, { slots })
      await swipe(w, -40, -120)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('ignores the gesture while disabled', async () => {
      const w = mount(SnSwipeAction, { props: { disabled: true }, slots })
      await swipe(w, -120)
      expect(w.emitted('update:modelValue')).toBeUndefined()
      expect(w.classes()).toContain('sn-swipe-action--disabled')
    })

    it('does not start a gesture without any action slot', async () => {
      const w = mount(SnSwipeAction, { slots: { default: 'x' } })
      await swipe(w, -120)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('cancels the horizontal gesture so the page does not scroll', async () => {
      const w = mount(SnSwipeAction, { slots })
      const root = w.find('.sn-swipe-action')
      await root.trigger('touchstart', { touches: [{ clientX: 200, clientY: 100 }] })
      const move = new Event('touchmove', { cancelable: true, bubbles: true })
      Object.assign(move, { touches: [{ clientX: 120, clientY: 100 }] })
      root.element.dispatchEvent(move)
      expect(move.defaultPrevented).toBe(true)
    })

    it('settles closed on touchcancel', async () => {
      const w = mount(SnSwipeAction, { props: { modelValue: 'right' }, slots })
      const root = w.find('.sn-swipe-action')
      await root.trigger('touchstart', { touches: [{ clientX: 200, clientY: 100 }] })
      await root.trigger('touchmove', { touches: [{ clientX: 150, clientY: 100 }] })
      await root.trigger('touchcancel')
      await flushPromises()
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['close'])
    })

    it('closes on a rightward swipe back while open', async () => {
      const w = mount(SnSwipeAction, { props: { modelValue: 'right' }, slots })
      await swipe(w, 60)
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['close'])
    })
  })

  describe('before-close guard', () => {
    it('blocks a swipe-driven close when the guard returns false', async () => {
      const beforeClose = vi.fn(() => false)
      const w = mount(SnSwipeAction, {
        props: { modelValue: 'right', beforeClose },
        slots,
      })
      await swipe(w, 60)
      expect(beforeClose).toHaveBeenCalledWith('swipe', 'right')
      expect(w.emitted('update:modelValue')).toBeUndefined()
      expect(w.classes()).toContain('sn-swipe-action--open')
    })

    it('closes when the guard resolves true asynchronously', async () => {
      const beforeClose = vi.fn(async () => true)
      const w = mount(SnSwipeAction, {
        props: { modelValue: 'right', beforeClose },
        slots,
      })
      await swipe(w, 60)
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['close'])
    })

    it('blocks the close when the guard throws', async () => {
      const beforeClose = vi.fn(() => {
        throw new Error('nope')
      })
      const w = mount(SnSwipeAction, {
        props: { modelValue: 'right', beforeClose },
        slots,
      })
      await swipe(w, 60)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('is consulted by the imperative close() method too', async () => {
      const beforeClose = vi.fn(() => false)
      const w = mount(SnSwipeAction, {
        props: { modelValue: 'right', beforeClose },
        slots,
      })
      const vm = w.vm as unknown as { close(reason?: string): Promise<boolean> }
      const closed = await vm.close('other')
      expect(closed).toBe(false)
      expect(beforeClose).toHaveBeenCalledWith('other', 'right')
    })
  })

  describe('content tap', () => {
    it('closes the open row and emits click', async () => {
      const w = mount(SnSwipeAction, { props: { modelValue: 'right' }, slots })
      await w.find('.sn-swipe-action__content').trigger('tap')
      await flushPromises()
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['close'])
      expect(w.emitted('click')?.[0]).toEqual([{ reason: 'click', position: 'right' }])
    })

    it('does nothing when the row is already closed', async () => {
      const w = mount(SnSwipeAction, { slots })
      await w.find('.sn-swipe-action__content').trigger('tap')
      await flushPromises()
      expect(w.emitted('click')).toBeUndefined()
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('does not emit click when the close is blocked', async () => {
      const beforeClose = vi.fn(() => false)
      const w = mount(SnSwipeAction, {
        props: { modelValue: 'right', beforeClose },
        slots,
      })
      await w.find('.sn-swipe-action__content').trigger('tap')
      await flushPromises()
      expect(w.emitted('click')).toBeUndefined()
    })
  })

  describe('measurement', () => {
    it('opens with the fallback distance when no measurement is available', async () => {
      const w = mount(SnSwipeAction, { slots })
      await swipe(w, -120)
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['right'])
      // The content is offset — the exact length is not asserted (rpx).
      expect(w.find('.sn-swipe-action__content').attributes('style') ?? '')
        .toContain('translateX')
    })

    it('uses uni.createSelectorQuery when the runtime provides it', async () => {
      const exec = vi.fn()
      const boundingClientRect = vi.fn((cb: (rect: { width: number }) => void) => {
        cb({ width: 140 })
        return { exec }
      })
      ;(globalThis as { uni?: unknown }).uni = {
        createSelectorQuery: () => ({ select: () => ({ boundingClientRect }) }),
      }
      const w = mount(SnSwipeAction, { slots })
      await swipe(w, -200)
      expect(boundingClientRect).toHaveBeenCalled()
      expect(exec).toHaveBeenCalled()
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['right'])
    })

    it('survives a throwing selector query', async () => {
      ;(globalThis as { uni?: unknown }).uni = {
        createSelectorQuery: () => {
          throw new Error('no runtime')
        },
      }
      const w = mount(SnSwipeAction, { slots })
      await swipe(w, -120)
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['right'])
    })
  })

  describe('timers', () => {
    it('clears the settle timer on unmount (no leak)', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnSwipeAction, { slots })
        await w.find('.sn-swipe-action').trigger('touchstart', {
          touches: [{ clientX: 200, clientY: 100 }],
        })
        await w.find('.sn-swipe-action').trigger('touchmove', {
          touches: [{ clientX: 100, clientY: 100 }],
        })
        await w.find('.sn-swipe-action').trigger('touchend')
        w.unmount()
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
      } finally {
        vi.useRealTimers()
      }
    })

    it('drops the animating class once the settle timer elapses', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnSwipeAction, { slots })
        const root = w.find('.sn-swipe-action')
        await root.trigger('touchstart', { touches: [{ clientX: 200, clientY: 100 }] })
        await root.trigger('touchmove', { touches: [{ clientX: 100, clientY: 100 }] })
        await root.trigger('touchend')
        await flushPromises()
        expect(w.classes()).toContain('sn-swipe-action--animating')
        vi.advanceTimersByTime(200)
        await w.vm.$nextTick()
        expect(w.classes()).not.toContain('sn-swipe-action--animating')
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('accessibility', () => {
    it('reports the expanded state on the content area', () => {
      const closed = mount(SnSwipeAction, { slots })
      expect(closed.find('.sn-swipe-action__content').attributes('role')).toBe('button')
      expect(closed.find('.sn-swipe-action__content').attributes('aria-expanded')).toBe('false')
      const open = mount(SnSwipeAction, { props: { modelValue: 'left' }, slots })
      expect(open.find('.sn-swipe-action__content').attributes('aria-expanded')).toBe('true')
    })

    it('tags the root for the docs / AI component map', () => {
      expect(mount(SnSwipeAction, { slots }).attributes('data-snui-component'))
        .toBe('swipe-action')
    })
  })
})
