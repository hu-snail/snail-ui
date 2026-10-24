/**
 * sn-loading unit tests — uni-end loading indicator (wd-loading parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - the four spinner types render their own structure
 *   - `direction` / `inheritColor` drive the class surface
 *   - `size` / `color` land as inline styles on the root
 *   - `text` and the default slot both feed the label region
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnLoading from './sn-loading.vue'

describe('sn-loading', () => {
  it('renders the circular spinner by default', () => {
    const wrapper = mount(SnLoading)
    expect(wrapper.classes()).toContain('sn-loading')
    expect(wrapper.classes()).toContain('sn-loading--circular')
    expect(wrapper.find('.sn-loading__circular').exists()).toBe(true)
  })

  it('renders 8 bars for type="spinner"', () => {
    const wrapper = mount(SnLoading, { props: { type: 'spinner' } })
    expect(wrapper.classes()).toContain('sn-loading--spinner')
    expect(wrapper.findAll('.sn-loading__spinner-bar')).toHaveLength(8)
  })

  it('renders 3 dots for type="dots"', () => {
    const wrapper = mount(SnLoading, { props: { type: 'dots' } })
    expect(wrapper.classes()).toContain('sn-loading--dots')
    expect(wrapper.findAll('.sn-loading__dot')).toHaveLength(3)
  })

  it('renders 5 wave bars for type="wave"', () => {
    const wrapper = mount(SnLoading, { props: { type: 'wave' } })
    expect(wrapper.classes()).toContain('sn-loading--wave')
    expect(wrapper.findAll('.sn-loading__wave-bar')).toHaveLength(5)
  })

  it('defaults to the vertical direction and switches to horizontal', () => {
    const vertical = mount(SnLoading)
    expect(vertical.classes()).toContain('sn-loading--vertical')

    const horizontal = mount(SnLoading, { props: { direction: 'horizontal' } })
    expect(horizontal.classes()).toContain('sn-loading--horizontal')
  })

  it('adds the inheritColor class only when asked', () => {
    const plain = mount(SnLoading)
    expect(plain.classes()).not.toContain('sn-loading--inherit-color')

    const inherit = mount(SnLoading, { props: { inheritColor: true } })
    expect(inherit.classes()).toContain('sn-loading--inherit-color')
  })

  it('forwards a string size verbatim (numeric values become rpx, which happy-dom drops)', () => {
    // `size: 48` maps to `font-size: 48rpx`; happy-dom cannot parse rpx and
    // discards the declaration, so the observable assertion uses a unit the
    // test environment keeps (same rationale as CONTRIBUTING §3).
    const stringy = mount(SnLoading, { props: { size: '3em' } })
    expect(stringy.attributes('style')).toContain('3em')

    const pixels = mount(SnLoading, { props: { size: '24px' } })
    expect(pixels.attributes('style')).toContain('font-size: 24px')
  })

  it('forwards color as an inline color style', () => {
    const wrapper = mount(SnLoading, { props: { color: 'rebeccapurple' } })
    expect(wrapper.attributes('style')).toContain('rebeccapurple')
  })

  it('renders the text prop and lets the default slot override it', () => {
    const withProp = mount(SnLoading, { props: { text: '加载中' } })
    expect(withProp.find('.sn-loading__text').text()).toBe('加载中')

    const withSlot = mount(SnLoading, {
      props: { text: '加载中' },
      slots: { default: '正在提交' },
    })
    expect(withSlot.find('.sn-loading__text').text()).toBe('正在提交')
  })

  it('omits the text region when neither text nor slot is provided', () => {
    const wrapper = mount(SnLoading)
    expect(wrapper.find('.sn-loading__text').exists()).toBe(false)
  })

  it('applies customClass, customStyle and customSpinnerClass', () => {
    const wrapper = mount(SnLoading, {
      // `8px`, not `8rpx`: happy-dom drops CSS lengths it cannot parse.
      props: {
        customClass: 'my-loading',
        customStyle: 'margin: 8px',
        customSpinnerClass: 'my-spinner',
      },
    })
    expect(wrapper.classes()).toContain('my-loading')
    expect(wrapper.attributes('style')).toContain('margin: 8px')
    expect(wrapper.find('.sn-loading__spinner').classes()).toContain('my-spinner')
  })

  it('exposes a polite live region with a busy state', () => {
    const wrapper = mount(SnLoading)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })
})
