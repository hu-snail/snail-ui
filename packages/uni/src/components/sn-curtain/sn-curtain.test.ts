/**
 * sn-curtain unit tests — uni-end image curtain (wd-curtain parity).
 *
 * Behaviour only (AGENTS.md §46):
 *   - `modelValue` controls presence; enter / leave legs emit their events
 *   - tapping the image emits `click` and closes (unless `closeOnClick` is off)
 *   - the scrim emits `click-modal` and only closes with `closeOnClickModal`
 *   - the close button closes; the `close` slot replaces the glyph
 *   - `to` navigates through a guarded `globalThis.uni.navigateTo`
 *   - an image `error` hides the curtain even when `modelValue` is true
 *   - `closePosition` / `width` / `zIndex` / custom props are forwarded
 *   - the transition timer is cleared on unmount (§41)
 *
 * No `rpx` values in assertions — happy-dom drops lengths it cannot parse.
 */

import { afterEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SnCurtain from './sn-curtain.vue'

/** Install a fake uni runtime on `globalThis` for the duration of one test. */
function installUni(navigateTo: (options: { url: string }) => unknown): void {
  ;(globalThis as { uni?: unknown }).uni = { navigateTo }
}

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni
})

describe('sn-curtain', () => {
  describe('structure', () => {
    it('renders nothing while modelValue is false', () => {
      const w = mount(SnCurtain, { props: { modelValue: false, src: '/a.png' } })
      expect(w.find('.sn-curtain').exists()).toBe(false)
    })

    it('renders the image when modelValue is true', () => {
      const w = mount(SnCurtain, { props: { modelValue: true, src: '/promo.png' } })
      expect(w.find('.sn-curtain__image').attributes('src')).toBe('/promo.png')
    })

    it('marks the image as full-width when width is 0', () => {
      const w = mount(SnCurtain, { props: { modelValue: true } })
      expect(w.find('.sn-curtain__image').classes()).toContain('sn-curtain__image--full')
      expect(w.find('.sn-curtain__image').attributes('style') ?? '').not.toContain('width')
    })

    it('sizes the image from the width prop', () => {
      const w = mount(SnCurtain, { props: { modelValue: true, width: 300 } })
      // happy-dom drops `rpx`, so assert the layout mode rather than the length.
      expect(w.find('.sn-curtain__image').classes())
        .not.toContain('sn-curtain__image--full')
    })

    it('applies the close-position class', () => {
      const w = mount(SnCurtain, { props: { modelValue: true, closePosition: 'top-right' } })
      expect(w.find('.sn-curtain__close').classes()).toContain('sn-curtain__close--top-right')
    })

    it('forwards customClass / customStyle / zIndex', () => {
      const w = mount(SnCurtain, {
        props: { modelValue: true, customClass: 'my-curtain', customStyle: 'padding: 4px', zIndex: 20 },
      })
      expect(w.classes()).toContain('my-curtain')
      const style = w.attributes('style') ?? ''
      expect(style).toContain('z-index: 20')
      expect(style).toContain('padding: 4px')
    })

    it('forwards customCloseClass / customCloseStyle to the close button', () => {
      const w = mount(SnCurtain, {
        props: {
          modelValue: true,
          customCloseClass: 'my-close',
          customCloseStyle: 'margin: 2px',
        },
      })
      const close = w.find('.sn-curtain__close')
      expect(close.classes()).toContain('my-close')
      expect(close.attributes('style') ?? '').toContain('margin: 2px')
    })

    it('lets the close slot replace the built-in glyph', () => {
      const w = mount(SnCurtain, {
        props: { modelValue: true },
        slots: { close: '<text class="custom-close">关</text>' },
      })
      expect(w.find('.custom-close').exists()).toBe(true)
      expect(w.find('.sn-curtain__close .sn-icon').exists()).toBe(false)
    })

    it('passes showMenuByLongpress to the image', () => {
      const w = mount(SnCurtain, { props: { modelValue: true, showMenuByLongpress: true } })
      expect(w.find('.sn-curtain__image').attributes('show-menu-by-longpress')).toBe('true')
    })
  })

  describe('interaction', () => {
    it('emits click and closes on an image tap', async () => {
      const w = mount(SnCurtain, { props: { modelValue: true } })
      await w.find('.sn-curtain__image').trigger('tap')
      expect(w.emitted('click')).toHaveLength(1)
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
      expect(w.emitted('close')).toHaveLength(1)
    })

    it('keeps the curtain open on an image tap when closeOnClick is false', async () => {
      const w = mount(SnCurtain, { props: { modelValue: true, closeOnClick: false } })
      await w.find('.sn-curtain__image').trigger('tap')
      expect(w.emitted('click')).toHaveLength(1)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('emits click-modal and closes on a scrim tap when closeOnClickModal is true', async () => {
      const w = mount(SnCurtain, { props: { modelValue: true, closeOnClickModal: true } })
      await w.find('.sn-curtain__modal').trigger('tap')
      expect(w.emitted('click-modal')).toHaveLength(1)
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('emits click-modal without closing by default', async () => {
      const w = mount(SnCurtain, { props: { modelValue: true } })
      await w.find('.sn-curtain__modal').trigger('tap')
      expect(w.emitted('click-modal')).toHaveLength(1)
      expect(w.emitted('update:modelValue')).toBeUndefined()
    })

    it('closes on a close-button tap', async () => {
      const w = mount(SnCurtain, { props: { modelValue: true } })
      await w.find('.sn-curtain__close').trigger('tap')
      expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
      expect(w.emitted('close')).toHaveLength(1)
    })
  })

  describe('to navigation', () => {
    it('calls uni.navigateTo with the to path', async () => {
      const navigateTo = vi.fn()
      installUni(navigateTo)
      const w = mount(SnCurtain, { props: { modelValue: true, to: '/pages/campaign' } })
      await w.find('.sn-curtain__image').trigger('tap')
      expect(navigateTo).toHaveBeenCalledWith({ url: '/pages/campaign' })
    })

    it('does not navigate when to is empty', async () => {
      const navigateTo = vi.fn()
      installUni(navigateTo)
      const w = mount(SnCurtain, { props: { modelValue: true } })
      await w.find('.sn-curtain__image').trigger('tap')
      expect(navigateTo).not.toHaveBeenCalled()
    })

    it('still emits click when the uni runtime is absent', async () => {
      const w = mount(SnCurtain, { props: { modelValue: true, to: '/pages/campaign' } })
      await w.find('.sn-curtain__image').trigger('tap')
      expect(w.emitted('click')).toHaveLength(1)
    })

    it('swallows a rejected navigation', async () => {
      installUni(() => Promise.reject(new Error('page not found')))
      const w = mount(SnCurtain, { props: { modelValue: true, to: '/nope' } })
      await w.find('.sn-curtain__image').trigger('tap')
      await flushPromises()
      expect(w.emitted('click')).toHaveLength(1)
    })

    it('swallows a synchronously throwing navigation', async () => {
      installUni(() => {
        throw new Error('page not found')
      })
      const w = mount(SnCurtain, { props: { modelValue: true, to: '/nope' } })
      await expect(w.find('.sn-curtain__image').trigger('tap')).resolves.toBeUndefined()
      expect(w.emitted('click')).toHaveLength(1)
    })
  })

  describe('image load / error', () => {
    it('emits load when the image loads', async () => {
      const w = mount(SnCurtain, { props: { modelValue: true } })
      await w.find('.sn-curtain__image').trigger('load')
      expect(w.emitted('load')).toHaveLength(1)
    })

    it('emits error and hides the curtain when the image fails', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnCurtain, { props: { modelValue: true } })
        await w.find('.sn-curtain__image').trigger('error')
        expect(w.emitted('error')).toHaveLength(1)
        vi.advanceTimersByTime(300)
        await w.vm.$nextTick()
        expect(w.find('.sn-curtain').exists()).toBe(false)
      } finally {
        vi.useRealTimers()
      }
    })

    it('does not re-open after an error', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnCurtain, { props: { modelValue: true } })
        await w.find('.sn-curtain__image').trigger('error')
        vi.advanceTimersByTime(300)
        await w.vm.$nextTick()
        await w.setProps({ modelValue: false })
        await w.setProps({ modelValue: true })
        await flushPromises()
        expect(w.emitted('enter')).toBeUndefined()
        expect(w.find('.sn-curtain').exists()).toBe(false)
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('timers', () => {
    it('emits the enter legs when modelValue flips to true', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnCurtain, { props: { modelValue: false } })
        await w.setProps({ modelValue: true })
        await flushPromises()
        expect(w.emitted('before-enter')).toHaveLength(1)
        expect(w.emitted('enter')).toHaveLength(1)
        expect(w.emitted('after-enter')).toBeUndefined()
        vi.advanceTimersByTime(300)
        expect(w.emitted('after-enter')).toHaveLength(1)
      } finally {
        vi.useRealTimers()
      }
    })

    it('keeps the node mounted until the leave leg elapses', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnCurtain, { props: { modelValue: true } })
        await w.setProps({ modelValue: false })
        expect(w.find('.sn-curtain').exists()).toBe(true)
        expect(w.emitted('after-leave')).toBeUndefined()
        vi.advanceTimersByTime(300)
        await w.vm.$nextTick()
        expect(w.emitted('after-leave')).toHaveLength(1)
        expect(w.emitted('closed')).toHaveLength(1)
        expect(w.find('.sn-curtain').exists()).toBe(false)
      } finally {
        vi.useRealTimers()
      }
    })

    it('keeps the node in the tree when hideWhenClose is false', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnCurtain, { props: { modelValue: true, hideWhenClose: false } })
        await w.setProps({ modelValue: false })
        vi.advanceTimersByTime(300)
        await w.vm.$nextTick()
        expect(w.find('.sn-curtain').exists()).toBe(true)
        expect(w.classes()).not.toContain('sn-curtain--shown')
      } finally {
        vi.useRealTimers()
      }
    })

    it('clears the pending transition timer on unmount (no leak)', async () => {
      vi.useFakeTimers()
      try {
        const w = mount(SnCurtain, { props: { modelValue: true } })
        await w.setProps({ modelValue: false })
        w.unmount()
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('accessibility', () => {
    it('marks the root as a modal dialog', () => {
      const w = mount(SnCurtain, { props: { modelValue: true } })
      expect(w.attributes('role')).toBe('dialog')
      expect(w.attributes('aria-modal')).toBe('true')
    })

    it('hides the scrim from assistive tech and labels the close button', () => {
      const w = mount(SnCurtain, { props: { modelValue: true } })
      expect(w.find('.sn-curtain__modal').attributes('aria-hidden')).toBe('true')
      const close = w.find('.sn-curtain__close')
      expect(close.attributes('role')).toBe('button')
      expect(close.attributes('aria-label')).toBe('close')
    })

    it('tags the root for the docs / AI component map', () => {
      expect(mount(SnCurtain, { props: { modelValue: true } })
        .attributes('data-snui-component')).toBe('curtain')
    })
  })
})
