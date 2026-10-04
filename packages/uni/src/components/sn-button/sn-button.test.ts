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

  /* ── wot-ui `wd-button` 1:1 parity ────────────────────────────────────── */

  it('applies variant-base by default', () => {
    const wrapper = mount(SnButton, { slots: { default: 'X' } })
    expect(wrapper.classes()).toContain('sn-button--variant-base')
  })

  it('honors variant=plain for transparent look', () => {
    const wrapper = mount(SnButton, {
      props: { variant: 'plain', type: 'primary' },
      slots: { default: 'P' },
    })
    expect(wrapper.classes()).toContain('sn-button--variant-plain')
  })

  it('honors variant=soft for tinted background', () => {
    const wrapper = mount(SnButton, {
      props: { variant: 'soft', type: 'primary' },
      slots: { default: 'S' },
    })
    expect(wrapper.classes()).toContain('sn-button--variant-soft')
  })

  it('honors variant=dashed for dashed border', () => {
    const wrapper = mount(SnButton, {
      props: { variant: 'dashed' },
      slots: { default: 'D' },
    })
    expect(wrapper.classes()).toContain('sn-button--variant-dashed')
  })

  it('honors variant=text for plain text button', () => {
    const wrapper = mount(SnButton, {
      props: { variant: 'text' },
      slots: { default: 'T' },
    })
    expect(wrapper.classes()).toContain('sn-button--variant-text')
  })

  it('honors variant=subtle for light-gray background', () => {
    const wrapper = mount(SnButton, {
      props: { variant: 'subtle' },
      slots: { default: 'S' },
    })
    expect(wrapper.classes()).toContain('sn-button--variant-subtle')
  })

  it('honors cell=hover modifier', () => {
    const wrapper = mount(SnButton, {
      props: { cell: 'hover' },
      slots: { default: 'C' },
    })
    expect(wrapper.classes()).toContain('sn-button--cell-hover')
  })

  it('honors plain boolean prop', () => {
    const wrapper = mount(SnButton, {
      props: { plain: true },
      slots: { default: 'P' },
    })
    expect(wrapper.classes()).toContain('sn-button--plain')
  })

  it('forwards open-type attribute', () => {
    const wrapper = mount(SnButton, {
      props: { openType: 'share' },
      slots: { default: 'Share' },
    })
    expect(wrapper.attributes('open-type')).toBe('share')
  })

  it('forwards form-type attribute when set', () => {
    const wrapper = mount(SnButton, {
      props: { formType: 'submit' },
      slots: { default: 'Submit' },
    })
    expect(wrapper.attributes('form-type')).toBe('submit')
  })

  it('forwards hover-class / hover-start-time / hover-stay-time', () => {
    const wrapper = mount(SnButton, {
      props: { hoverClass: 'custom-press', hoverStartTime: 50, hoverStayTime: 600 },
      slots: { default: 'H' },
    })
    expect(wrapper.attributes('hover-class')).toBe('custom-press')
    expect(wrapper.attributes('hover-start-time')).toBe('50')
    expect(wrapper.attributes('hover-stay-time')).toBe('600')
  })

  it('applies inline bgColor / color when provided', () => {
    const wrapper = mount(SnButton, {
      props: { bgColor: '#abcdef', color: '#123456' },
      slots: { default: 'C' },
    })
    expect(wrapper.attributes('style')).toContain('background-color: #abcdef')
    expect(wrapper.attributes('style')).toContain('color: #123456')
  })

  it('applies loadingColor to spinner style', () => {
    const wrapper = mount(SnButton, {
      props: { loading: true, loadingColor: '#abcdef' },
      slots: { default: 'L' },
    })
    expect(wrapper.find('.sn-button__spinner').attributes('style')).toContain('#abcdef')
  })

  it('forwards customClass to the root', () => {
    const wrapper = mount(SnButton, {
      props: { customClass: 'my-cta' },
      slots: { default: 'X' },
    })
    expect(wrapper.classes()).toContain('my-cta')
  })

  it('forwards ariaLabel', () => {
    const wrapper = mount(SnButton, {
      props: { ariaLabel: 'Submit form' },
      slots: { default: 'X' },
    })
    expect(wrapper.attributes('aria-label')).toBe('Submit form')
  })
})
