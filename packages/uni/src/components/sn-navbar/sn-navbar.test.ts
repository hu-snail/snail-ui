/**
 * sn-navbar unit tests — uni-end top navigation bar.
 *
 * Behaviour only (AGENTS.md §46): title / side text rendering, the tap →
 * emit contract, the disabled guards, the fixed + placeholder pair and the
 * accessibility roles. No rpx numbers in assertions — happy-dom discards
 * lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnNavbar from './sn-navbar.vue'

describe('sn-navbar', () => {
  describe('content', () => {
    it('renders the title prop', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } })
      expect(wrapper.find('.sn-navbar__title').text()).toBe('Home')
    })

    it('renders the title slot over the title prop', () => {
      const wrapper = mount(SnNavbar, {
        props: { title: 'Home' },
        slots: { title: '<text class="custom-title">Slot</text>' },
      })
      expect(wrapper.find('.custom-title').text()).toBe('Slot')
      expect(wrapper.find('.sn-navbar__title').exists()).toBe(false)
    })

    it('renders leftText on the left zone', () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } })
      expect(wrapper.find('.sn-navbar__left').text()).toBe('Back')
    })

    it('renders rightText on the right zone', () => {
      const wrapper = mount(SnNavbar, { props: { rightText: 'More' } })
      expect(wrapper.find('.sn-navbar__right').text()).toBe('More')
    })

    it('hides the left zone when nothing fills it', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } })
      expect(wrapper.find('.sn-navbar__left').exists()).toBe(false)
    })

    it('hides the right zone when nothing fills it', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } })
      expect(wrapper.find('.sn-navbar__right').exists()).toBe(false)
    })

    it('renders the back arrow when leftArrow is on', () => {
      const wrapper = mount(SnNavbar, { props: { leftArrow: true } })
      expect(wrapper.find('.sn-navbar__left .sn-navbar__arrow').exists()).toBe(true)
    })

    it('does not render the back arrow by default', () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } })
      expect(wrapper.find('.sn-navbar__arrow').exists()).toBe(false)
    })
  })

  describe('events', () => {
    it('emits click-left when the left zone is tapped', async () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } })
      await wrapper.find('.sn-navbar__left').trigger('tap')
      expect(wrapper.emitted('click-left')).toHaveLength(1)
    })

    it('emits back together with click-left when leftArrow is on', async () => {
      const wrapper = mount(SnNavbar, { props: { leftArrow: true } })
      await wrapper.find('.sn-navbar__left').trigger('tap')
      expect(wrapper.emitted('click-left')).toHaveLength(1)
      expect(wrapper.emitted('back')).toHaveLength(1)
    })

    it('does not emit back without the arrow', async () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } })
      await wrapper.find('.sn-navbar__left').trigger('tap')
      expect(wrapper.emitted('back')).toBeUndefined()
    })

    it('emits click-right when the right zone is tapped', async () => {
      const wrapper = mount(SnNavbar, { props: { rightText: 'More' } })
      await wrapper.find('.sn-navbar__right').trigger('tap')
      expect(wrapper.emitted('click-right')).toHaveLength(1)
    })

    it('does not emit click-left while leftDisabled', async () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back', leftDisabled: true } })
      await wrapper.find('.sn-navbar__left').trigger('tap')
      expect(wrapper.emitted('click-left')).toBeUndefined()
    })

    it('does not emit click-right while rightDisabled', async () => {
      const wrapper = mount(SnNavbar, { props: { rightText: 'More', rightDisabled: true } })
      await wrapper.find('.sn-navbar__right').trigger('tap')
      expect(wrapper.emitted('click-right')).toBeUndefined()
    })

    it('marks the disabled zones with aria-disabled', () => {
      const wrapper = mount(SnNavbar, {
        props: { leftText: 'Back', rightText: 'More', leftDisabled: true },
      })
      expect(wrapper.find('.sn-navbar__left').attributes('aria-disabled')).toBe('true')
      expect(wrapper.find('.sn-navbar__right').attributes('aria-disabled')).toBe('false')
    })

    it('emits back-home when the capsule is tapped', async () => {
      const wrapper = mount(SnNavbar, { slots: { capsule: '<text>cap</text>' } })
      await wrapper.find('.sn-navbar__capsule').trigger('tap')
      expect(wrapper.emitted('back-home')).toHaveLength(1)
    })

    it('suppresses the left zone when a capsule slot is present', () => {
      const wrapper = mount(SnNavbar, {
        props: { leftArrow: true },
        slots: { capsule: '<text>cap</text>' },
      })
      expect(wrapper.find('.sn-navbar__capsule').exists()).toBe(true)
      expect(wrapper.find('.sn-navbar__left').exists()).toBe(false)
    })
  })

  describe('layout', () => {
    it('adds the bordered class', () => {
      const wrapper = mount(SnNavbar, { props: { bordered: true } })
      expect(wrapper.find('.sn-navbar').classes()).toContain('sn-navbar--bordered')
    })

    it('adds the fixed class and writes z-index', () => {
      const wrapper = mount(SnNavbar, { props: { fixed: true, zIndex: 42 } })
      expect(wrapper.find('.sn-navbar').classes()).toContain('sn-navbar--fixed')
      expect(wrapper.find('.sn-navbar').attributes('style')).toContain('z-index: 42')
    })

    it('renders the placeholder only when fixed and placeholder are both on', () => {
      expect(mount(SnNavbar, { props: { fixed: true, placeholder: true } })
        .find('.sn-navbar__placeholder').exists()).toBe(true)
      expect(mount(SnNavbar, { props: { placeholder: true } })
        .find('.sn-navbar__placeholder').exists()).toBe(false)
      expect(mount(SnNavbar, { props: { fixed: true } })
        .find('.sn-navbar__placeholder').exists()).toBe(false)
    })

    it('marks the placeholder as decorative', () => {
      const wrapper = mount(SnNavbar, { props: { fixed: true, placeholder: true } })
      expect(wrapper.find('.sn-navbar__placeholder').attributes('aria-hidden')).toBe('true')
    })

    it('adds the safe-area class', () => {
      const wrapper = mount(SnNavbar, { props: { safeAreaInsetTop: true } })
      expect(wrapper.find('.sn-navbar').classes()).toContain('sn-navbar--safe-area')
    })

    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnNavbar, {
        props: { customClass: 'my-navbar', customStyle: 'margin: 4px;' },
      })
      expect(wrapper.find('.sn-navbar').classes()).toContain('my-navbar')
      expect(wrapper.find('.sn-navbar').attributes('style')).toContain('margin: 4px')
    })
  })

  describe('accessibility', () => {
    it('exposes role="navigation" on the root', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } })
      expect(wrapper.find('.sn-navbar').attributes('role')).toBe('navigation')
    })

    it('labels the root with the title', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } })
      expect(wrapper.find('.sn-navbar').attributes('aria-label')).toBe('Home')
    })

    it('marks the side zones as buttons', () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back', rightText: 'More' } })
      expect(wrapper.find('.sn-navbar__left').attributes('role')).toBe('button')
      expect(wrapper.find('.sn-navbar__right').attributes('role')).toBe('button')
    })
  })
})
