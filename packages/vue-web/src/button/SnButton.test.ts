/**
 * SnButton unit tests — web-end primary button (AUI-CORE-001 / AUI-WEB-001).
 *
 * Tests cover behavior, not implementation detail (AGENTS.md §46):
 *   - default slot renders
 *   - click emits event
 *   - click suppressed when disabled or loading
 *   - aria attributes set correctly
 *   - classes follow `sn-button--{variant}` / `sn-button--{size}` convention
 *   - `icon` / `iconName` props auto-render an embedded SnIcon
 *   - the `icon` slot overrides `icon` / `iconName` props
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import SnButton from './SnButton.vue'
import { clearSnIcons, registerSnIcons } from '../icon/sn-icon-registry'

describe('SnButton', () => {
  it('renders default slot content', () => {
    const wrapper = mount(SnButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(SnButton, { slots: { default: 'Go' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('suppresses click when disabled', async () => {
    const wrapper = mount(SnButton, {
      props: { disabled: true },
      slots: { default: 'Off' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('suppresses click when loading', async () => {
    const wrapper = mount(SnButton, {
      props: { loading: true },
      slots: { default: 'Wait' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('applies variant class', () => {
    const wrapper = mount(SnButton, {
      props: { type: 'primary' },
      slots: { default: 'P' },
    })
    expect(wrapper.classes()).toContain('sn-button--primary')
  })

  it('applies size class', () => {
    const wrapper = mount(SnButton, {
      props: { size: 'large' },
      slots: { default: 'L' },
    })
    expect(wrapper.classes()).toContain('sn-button--large')
  })

  it('renders block-level when block prop is true', () => {
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

  it('renders custom icon slot when provided', () => {
    const wrapper = mount(SnButton, {
      slots: {
        default: 'Submit',
        icon: '<i data-testid="icon">★</i>',
      },
    })
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })

  it('uses default spinner when loading and no loading slot', () => {
    const wrapper = mount(SnButton, {
      props: { loading: true },
      slots: { default: 'Wait' },
    })
    expect(wrapper.find('.sn-button__spinner').exists()).toBe(true)
  })

  it('exposes accessible role and aria-label', () => {
    const wrapper = mount(SnButton, {
      props: { ariaLabel: 'Submit form' },
      slots: { default: 'Submit' },
    })
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('aria-label')).toBe('Submit form')
  })

  describe('icon prop / iconName prop', () => {
    /** Stub icon component — no real SVG, just a `data-testid` marker. */
    const TestIcon = defineComponent({
      name: 'TestIcon',
      props: { size: { default: 16 } },
      render() {
        return h('svg', { 'data-testid': 'embedded-icon', 'data-size': String(this.size) })
      },
    })

    beforeEach(() => {
      clearSnIcons()
    })

    it('renders the icon component when `icon` prop is provided', () => {
      const wrapper = mount(SnButton, {
        props: { icon: TestIcon },
        slots: { default: 'With icon' },
      })
      expect(wrapper.find('[data-testid="embedded-icon"]').exists()).toBe(true)
    })

    it('resolves icon from registry when `iconName` prop is provided', () => {
      registerSnIcons({ TestIcon })
      const wrapper = mount(SnButton, {
        props: { iconName: 'TestIcon' },
        slots: { default: 'Named' },
      })
      expect(wrapper.find('[data-testid="embedded-icon"]').exists()).toBe(true)
    })

    it('falls through to loading spinner when `iconName` is unregistered', () => {
      const wrapper = mount(SnButton, {
        props: { iconName: 'Missing', loading: true },
        slots: { default: 'X' },
      })
      expect(wrapper.find('.sn-button__spinner').exists()).toBe(true)
    })

    it('forwards `iconSize` to the embedded SnIcon', () => {
      const wrapper = mount(SnButton, {
        props: { icon: TestIcon, iconSize: 20 },
        slots: { default: 'S' },
      })
      expect(wrapper.find('[data-size="20"]').exists()).toBe(true)
    })

    it('icon slot overrides icon / iconName props', () => {
      const wrapper = mount(SnButton, {
        props: { icon: TestIcon, iconName: 'TestIcon' },
        slots: {
          default: 'Slot wins',
          icon: '<i data-testid="slot-icon">★</i>',
        },
      })
      expect(wrapper.find('[data-testid="slot-icon"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="embedded-icon"]').exists()).toBe(false)
    })
  })
})
