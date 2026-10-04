/**
 * sn-button unit tests — uni-end primary button (AUI-CORE-001 / AUI-UNI-001).
 *
 * Tests run under vitest + happy-dom (not a real uni-app runtime; we're
 * verifying pure Vue SFC behavior). Platform-specific behaviors (touch,
 * safe-area) are documented but not unit-tested here.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SnButton from './sn-button.vue'
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry'
import type { IconData } from '../sn-icon/sn-icon.vue'

describe('sn-button', () => {
  it('renders default slot content', () => {
    const wrapper = mount(SnButton, { slots: { default: 'Tap me' } })
    expect(wrapper.text()).toContain('Tap me')
  })

  it('emits click event when tapped', async () => {
    const wrapper = mount(SnButton, { slots: { default: 'Go' } })
    await wrapper.trigger('tap')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('suppresses tap when disabled', async () => {
    const wrapper = mount(SnButton, {
      props: { disabled: true },
      slots: { default: 'Off' },
    })
    await wrapper.trigger('tap')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(SnButton, {
      props: { loading: true },
      slots: { default: 'Wait' },
    })
    expect(wrapper.find('.sn-button__spinner').exists()).toBe(true)
  })

  it('applies variant class', () => {
    const wrapper = mount(SnButton, {
      props: { type: 'danger' },
      slots: { default: 'D' },
    })
    expect(wrapper.classes()).toContain('sn-button--danger')
  })

  it('applies size class', () => {
    const wrapper = mount(SnButton, {
      props: { size: 'large' },
      slots: { default: 'L' },
    })
    expect(wrapper.classes()).toContain('sn-button--large')
  })

  it('exposes block-level when block prop is true', () => {
    const wrapper = mount(SnButton, {
      props: { block: true },
      slots: { default: 'B' },
    })
    expect(wrapper.classes()).toContain('sn-button--block')
  })

  it('uses pill shape when round prop is true', () => {
    const wrapper = mount(SnButton, {
      props: { round: true },
      slots: { default: 'R' },
    })
    expect(wrapper.classes()).toContain('sn-button--round')
  })

  it('exposes accessible aria attributes', () => {
    const wrapper = mount(SnButton, {
      props: { disabled: true },
      slots: { default: 'X' },
    })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  describe('iconData / iconName props', () => {
    const TestIcon: IconData = Object.freeze({
      viewBox: '0 0 24 24',
      paths: ['M1 1 L23 23'],
    })

    beforeEach(() => {
      clearSnIcons()
    })

    it('renders the embedded icon when `iconData` prop is provided', () => {
      const wrapper = mount(SnButton, {
        props: { iconData: TestIcon },
        slots: { default: 'With icon' },
      })
      // The embedded sn-icon is rendered via the inner <view class="sn-icon">.
      expect(wrapper.find('.sn-icon').exists()).toBe(true)
    })

    it('resolves icon from registry when `iconName` prop is provided', () => {
      registerSnIcons({ TestIcon })
      const wrapper = mount(SnButton, {
        props: { iconName: 'TestIcon' },
        slots: { default: 'Named' },
      })
      expect(wrapper.find('.sn-icon').exists()).toBe(true)
    })

    it('falls through to loading spinner when `iconName` is unregistered', () => {
      const wrapper = mount(SnButton, {
        props: { iconName: 'Missing', loading: true },
        slots: { default: 'X' },
      })
      expect(wrapper.find('.sn-icon').exists()).toBe(false)
      expect(wrapper.find('.sn-button__spinner').exists()).toBe(true)
    })

    it('icon slot overrides iconData / iconName props', () => {
      const wrapper = mount(SnButton, {
        props: { iconData: TestIcon, iconName: 'TestIcon' },
        slots: {
          default: 'Slot wins',
          icon: '<view data-testid="slot-icon">★</view>',
        },
      })
      expect(wrapper.find('[data-testid="slot-icon"]').exists()).toBe(true)
    })
  })
})
