/**
 * SnLoading tests — AUI-WEB-FB-006.
 *
 * Reference: naive-ui `n-spin`. These tests pin the observable contract and
 * the two behaviours that are easy to break unnoticed: `delay` must never
 * hold the spinner visible after hiding, and `spinning` must win over `show`.
 *
 * Harness notes:
 *   - `@vue/test-utils` stubs `<Transition>` by default, and a transition stub
 *     does not render its `v-if` child into the DOM. Wrapper-mode tests must
 *     disable the stub, otherwise the overlay assertion fails for the wrong
 *     reason.
 *   - SnLoading is a multi-root template (`v-if` / `v-else` at the top level),
 *     so `wrapper.attributes()` is empty and attribute fallthrough does not
 *     apply. Assertions target the `[data-snui-component]` anchor instead.
 *   - `delay` uses real timers; the delays used are 20–40ms to stay fast.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import SnLoading from './SnLoading.vue'
import SnLoadingSpinner from './SnLoadingSpinner.vue'

function mountLoading(options: Record<string, unknown> = {}) {
  return mount(SnLoading, {
    global: { stubs: { transition: false } },
    ...options,
  })
}

/** Root node carrying the `data-snui-component` hook (multi-root safe). */
function rootOf(wrapper: ReturnType<typeof mountLoading>) {
  return wrapper.find('[data-snui-component="SnLoading"]')
}

describe('SnLoading', () => {
  describe('bare mode', () => {
    it('should render the built-in spinner by default', () => {
      const wrapper = mountLoading()

      expect(wrapper.findComponent(SnLoadingSpinner).exists()).toBe(true)
      expect(wrapper.find('[role="img"]').exists()).toBe(true)
    })

    it('should expose the loading aria label', () => {
      const wrapper = mountLoading()

      expect(rootOf(wrapper).attributes('aria-label')).toBe('loading')
    })

    it('should carry the data-snui-component hook', () => {
      const wrapper = mountLoading()

      expect(rootOf(wrapper).exists()).toBe(true)
    })

    it('should not render the overlay wrapper without a default slot', () => {
      const wrapper = mountLoading()

      expect(wrapper.find('.sn-loading__content').exists()).toBe(false)
    })
  })

  describe('size', () => {
    it('should map a size tier to its token variable', () => {
      const wrapper = mountLoading({ props: { size: 'large' } })

      expect(rootOf(wrapper).attributes('style')).toContain('--sn-web-spin-size-large')
    })

    it('should treat a numeric size as px', () => {
      const wrapper = mountLoading({ props: { size: 40 } })

      expect(rootOf(wrapper).attributes('style')).toContain('40px')
    })

    it('should default to the medium token', () => {
      const wrapper = mountLoading()

      expect(rootOf(wrapper).attributes('style')).toContain('--sn-web-spin-size-medium')
    })

    it('should thin the stroke as the spinner grows', () => {
      const large = mountLoading({ props: { size: 'large' } })
      const tiny = mountLoading({ props: { size: 'tiny' } })

      expect(Number(large.find('circle').attributes('stroke-width')))
        .toBeLessThan(Number(tiny.find('circle').attributes('stroke-width')))
    })

    it('should let strokeWidth override the size-derived value', () => {
      const wrapper = mountLoading({ props: { size: 'tiny', strokeWidth: 4 } })

      expect(wrapper.find('circle').attributes('stroke-width')).toBe('4')
    })
  })

  describe('description', () => {
    it('should render the description prop', () => {
      const wrapper = mountLoading({ props: { description: '加载中' } })

      expect(wrapper.find('.sn-loading__description').text()).toBe('加载中')
    })

    it('should render the description slot over the prop', () => {
      const wrapper = mountLoading({
        props: { description: 'prop value' },
        slots: { description: '<b>slot value</b>' },
      })

      expect(wrapper.find('.sn-loading__description').text()).toBe('slot value')
    })

    it('should omit the description element when neither is provided', () => {
      const wrapper = mountLoading()

      expect(wrapper.find('.sn-loading__description').exists()).toBe(false)
    })
  })

  describe('custom icon slot', () => {
    it('should render the icon slot instead of the built-in spinner', () => {
      const wrapper = mountLoading({ slots: { icon: '<i class="my-icon" />' } })

      expect(wrapper.find('.my-icon').exists()).toBe(true)
      expect(wrapper.findComponent(SnLoadingSpinner).exists()).toBe(false)
    })

    it('should rotate the custom icon by default', () => {
      const wrapper = mountLoading({ slots: { icon: '<i class="my-icon" />' } })

      expect(wrapper.find('.sn-loading__spinner').classes()).toContain(
        'sn-loading__spinner--rotate',
      )
    })

    it('should not rotate when rotate is false', () => {
      const wrapper = mountLoading({
        props: { rotate: false },
        slots: { icon: '<i class="my-icon" />' },
      })

      expect(wrapper.find('.sn-loading__spinner').classes()).not.toContain(
        'sn-loading__spinner--rotate',
      )
    })
  })

  describe('wrapper mode', () => {
    it('should render the default slot content', () => {
      const wrapper = mountLoading({ slots: { default: '<p class="body">内容</p>' } })

      expect(wrapper.find('.body').text()).toBe('内容')
    })

    it('should mark the wrapper as the positioning context', () => {
      const wrapper = mountLoading({ slots: { default: '<p>内容</p>' } })

      expect(rootOf(wrapper).classes()).toContain('sn-loading--wrapped')
    })

    it('should dim and disable the content while active', () => {
      const wrapper = mountLoading({
        props: { show: true },
        slots: { default: '<p>内容</p>' },
      })

      expect(wrapper.find('.sn-loading__content').classes()).toContain(
        'sn-loading__content--spinning',
      )
    })

    it('should leave the content interactive while hidden', () => {
      const wrapper = mountLoading({
        props: { show: false },
        slots: { default: '<p>内容</p>' },
      })

      expect(wrapper.find('.sn-loading__content').classes()).not.toContain(
        'sn-loading__content--spinning',
      )
    })

    it('should apply contentClass and contentStyle to the content element', () => {
      const wrapper = mountLoading({
        props: {
          contentClass: 'my-content',
          contentStyle: { padding: '8px' },
        },
        slots: { default: '<p>内容</p>' },
      })

      const content = wrapper.find('.sn-loading__content')
      expect(content.classes()).toContain('my-content')
      expect(content.attributes('style')).toContain('padding: 8px')
    })
  })

  describe('show', () => {
    it('should render the overlay when show is true', () => {
      const wrapper = mountLoading({
        props: { show: true },
        slots: { default: '<p>内容</p>' },
      })

      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(true)
    })

    it('should not render the overlay when show is false', () => {
      const wrapper = mountLoading({
        props: { show: false },
        slots: { default: '<p>内容</p>' },
      })

      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(false)
    })

    it('should react to show changing', async () => {
      // A real <Transition> needs a transitionend that happy-dom never fires,
      // so the leave node would stay mounted forever. Stub it here: this test
      // is about the v-if condition, not the animation.
      const wrapper = mount(SnLoading, {
        props: { show: false },
        slots: { default: '<p>内容</p>' },
      })

      await wrapper.setProps({ show: true })
      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(true)

      await wrapper.setProps({ show: false })
      await nextTick()
      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(false)
    })
  })

  describe('delay', () => {
    it('should defer the overlay by the given delay', async () => {
      const wrapper = mountLoading({
        props: { show: true, delay: 30 },
        slots: { default: '<p>内容</p>' },
      })

      // Still hidden: the delay has not elapsed.
      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(false)

      await new Promise((resolve) => setTimeout(resolve, 60))
      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(true)
    })

    it('should hide immediately, cancelling a pending delay', async () => {
      const wrapper = mountLoading({
        props: { show: true, delay: 40 },
        slots: { default: '<p>内容</p>' },
      })

      // Flip to hidden before the delay fires — the spinner must never appear.
      await wrapper.setProps({ show: false })
      await new Promise((resolve) => setTimeout(resolve, 60))

      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(false)
    })

    it('should render the overlay immediately when no delay is given', () => {
      const wrapper = mountLoading({
        props: { show: true },
        slots: { default: '<p>内容</p>' },
      })

      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(true)
    })
  })

  describe('spinning (deprecated)', () => {
    it('should warn that spinning is deprecated', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mountLoading({ props: { spinning: true } })

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('`spinning` is deprecated'),
      )
      warn.mockRestore()
    })

    it('should not warn when spinning is omitted', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mountLoading()

      expect(warn).not.toHaveBeenCalled()
      warn.mockRestore()
    })

    it('should win over show when both are supplied', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const wrapper = mountLoading({
        props: { show: false, spinning: true },
        slots: { default: '<p>内容</p>' },
      })

      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(true)
      warn.mockRestore()
    })

    it('should hide when spinning is false even if show is true', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const wrapper = mountLoading({
        props: { show: true, spinning: false },
        slots: { default: '<p>内容</p>' },
      })

      expect(wrapper.find('.sn-loading__overlay').exists()).toBe(false)
      warn.mockRestore()
    })
  })

  describe('cleanup', () => {
    it('should clear a pending delay timer on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
      const wrapper = mountLoading({ props: { show: true, delay: 1000 } })

      wrapper.unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      clearTimeoutSpy.mockRestore()
    })
  })
})
