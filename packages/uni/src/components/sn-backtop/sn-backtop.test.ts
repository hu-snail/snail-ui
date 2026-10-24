/**
 * sn-backtop unit tests — uni-end back-to-top button.
 *
 * Behaviour only (AGENTS.md §46): the scrollTop threshold, the tap → emit /
 * pageScrollTo contract, the shape variants and the accessibility wiring. No
 * rpx numbers in assertions — happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SnBacktop from './sn-backtop.vue'

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni
})

describe('sn-backtop', () => {
  describe('visibility', () => {
    it('is hidden below the threshold', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 100, top: 300 } })
      expect(wrapper.classes()).not.toContain('sn-backtop--visible')
      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })

    it('is visible at the threshold', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 300, top: 300 } })
      expect(wrapper.classes()).toContain('sn-backtop--visible')
      expect(wrapper.attributes('aria-hidden')).toBe('false')
    })

    it('is visible past the threshold', () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 900, top: 300 } })
      expect(wrapper.classes()).toContain('sn-backtop--visible')
    })

    it('uses a 300px default threshold', () => {
      expect(mount(SnBacktop, { props: { scrollTop: 299 } }).classes())
        .not.toContain('sn-backtop--visible')
      expect(mount(SnBacktop, { props: { scrollTop: 300 } }).classes())
        .toContain('sn-backtop--visible')
    })

    it('does not emit a tap while hidden', async () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 0 } })
      await wrapper.trigger('tap')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('tap', () => {
    it('emits click when visible', async () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } })
      await wrapper.trigger('tap')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('calls the host pageScrollTo when present', async () => {
      const pageScrollTo = vi.fn()
      ;(globalThis as { uni?: unknown }).uni = { pageScrollTo }
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500, duration: 250 } })
      await wrapper.trigger('tap')
      expect(pageScrollTo).toHaveBeenCalledWith({ scrollTop: 0, duration: 250 })
    })

    it('does not throw when the host has no pageScrollTo', async () => {
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } })
      await wrapper.trigger('tap')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('survives a host that rejects pageScrollTo', async () => {
      ;(globalThis as { uni?: unknown }).uni = {
        pageScrollTo: () => {
          throw new Error('unsupported')
        },
      }
      const wrapper = mount(SnBacktop, { props: { scrollTop: 500 } })
      await wrapper.trigger('tap')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  describe('appearance', () => {
    it('defaults to the circle shape', () => {
      expect(mount(SnBacktop).classes()).toContain('sn-backtop--circle')
    })

    it('applies the square shape', () => {
      expect(mount(SnBacktop, { props: { shape: 'square' } }).classes())
        .toContain('sn-backtop--square')
    })

    it('writes bottom / right / z-index inline as px', () => {
      const wrapper = mount(SnBacktop, { props: { bottom: 60, right: 24, zIndex: 99 } })
      const style = wrapper.attributes('style')
      expect(style).toContain('bottom: 60px')
      expect(style).toContain('right: 24px')
      expect(style).toContain('z-index: 99')
    })

    it('renders the text label', () => {
      const wrapper = mount(SnBacktop, { props: { text: 'Top' } })
      expect(wrapper.find('.sn-backtop__text').text()).toBe('Top')
    })

    it('renders the default arrow icon', () => {
      expect(mount(SnBacktop).find('.sn-backtop__icon').exists()).toBe(true)
    })

    it('applies iconStyle on top of the upward rotation', () => {
      const wrapper = mount(SnBacktop, { props: { iconStyle: 'color: rgb(1, 2, 3)' } })
      const style = wrapper.find('.sn-backtop__icon').attributes('style')
      expect(style).toContain('rotate(-90deg)')
      expect(style).toContain('color: rgb(1, 2, 3)')
    })

    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnBacktop, {
        props: { customClass: 'my-backtop', customStyle: 'margin: 4px;' },
      })
      expect(wrapper.classes()).toContain('my-backtop')
      expect(wrapper.attributes('style')).toContain('margin: 4px')
    })
  })

  describe('slots / accessibility', () => {
    it('renders the default slot instead of the built-in content', () => {
      const wrapper = mount(SnBacktop, { slots: { default: '<text class="custom">Up</text>' } })
      expect(wrapper.find('.custom').text()).toBe('Up')
      expect(wrapper.find('.sn-backtop__icon').exists()).toBe(false)
    })

    it('exposes role="button" and a default aria-label', () => {
      const wrapper = mount(SnBacktop)
      expect(wrapper.attributes('role')).toBe('button')
      expect(wrapper.attributes('aria-label')).toBe('Back to top')
    })

    it('uses the text prop as the accessible name', () => {
      expect(mount(SnBacktop, { props: { text: '顶部' } }).attributes('aria-label')).toBe('顶部')
    })
  })
})
