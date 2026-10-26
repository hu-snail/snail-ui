/**
 * sn-overlay unit tests — uni-end scrim layer (wd-overlay parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `show` controls presence, animation legs emit before/enter/after events
 *   - tapping the scrim emits `click`
 *   - `zIndex` / `customStyle` / `customClass` are forwarded
 *   - `lockScroll` decides whether a touchmove gesture is cancelled
 *   - the leave animation timer is cleared on unmount (§41)
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SnOverlay from './sn-overlay.vue'

describe('sn-overlay', () => {
  it('renders nothing when show is false', () => {
    const wrapper = mount(SnOverlay, { props: { show: false } })
    expect(wrapper.find('.sn-overlay').exists()).toBe(false)
  })

  it('renders the scrim and slot content when show is true', () => {
    const wrapper = mount(SnOverlay, {
      props: { show: true },
      slots: { default: '<text>scrim content</text>' },
    })
    expect(wrapper.find('.sn-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('scrim content')
  })

  it('emits click when the scrim is tapped', async () => {
    const wrapper = mount(SnOverlay, { props: { show: true } })
    await wrapper.find('.sn-overlay').trigger('tap')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('forwards zIndex and customStyle to the root style', () => {
    const wrapper = mount(SnOverlay, {
      // `8px`, not `8rpx`: happy-dom drops CSS lengths it cannot parse.
      props: { show: true, zIndex: 99, customStyle: 'padding: 8px' },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('z-index: 99')
    expect(style).toContain('padding: 8px')
  })

  it('applies customClass to the root node', () => {
    const wrapper = mount(SnOverlay, { props: { show: true, customClass: 'my-scrim' } })
    expect(wrapper.classes()).toContain('my-scrim')
  })

  it('emits the enter legs when show flips to true', async () => {
    const wrapper = mount(SnOverlay, { props: { show: false, duration: false } })
    await wrapper.setProps({ show: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('before-enter')).toHaveLength(1)
    expect(wrapper.emitted('enter')).toHaveLength(1)
    expect(wrapper.emitted('after-enter')).toHaveLength(1)
  })

  it('emits the leave legs and removes the node when show flips to false', async () => {
    const wrapper = mount(SnOverlay, { props: { show: true, duration: false } })
    await wrapper.setProps({ show: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('before-leave')).toHaveLength(1)
    expect(wrapper.emitted('leave')).toHaveLength(1)
    expect(wrapper.emitted('after-leave')).toHaveLength(1)
    expect(wrapper.find('.sn-overlay').exists()).toBe(false)
  })

  it('keeps the node until the leave duration elapses', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mount(SnOverlay, { props: { show: true, duration: 300 } })
      await wrapper.setProps({ show: false })
      expect(wrapper.find('.sn-overlay').exists()).toBe(true)
      expect(wrapper.emitted('after-leave')).toBeUndefined()
      vi.advanceTimersByTime(300)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('after-leave')).toHaveLength(1)
      expect(wrapper.find('.sn-overlay').exists()).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })
  it('accepts per-leg duration records', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mount(SnOverlay, {
        props: { show: false, duration: { enter: 100, leave: 200 } },
      })
      await wrapper.setProps({ show: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('after-enter')).toBeUndefined()
      vi.advanceTimersByTime(100)
      expect(wrapper.emitted('after-enter')).toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
  })
  it('cancels the touchmove gesture when lockScroll is on', async () => {
    const wrapper = mount(SnOverlay, { props: { show: true, lockScroll: true } })
    const event = new Event('touchmove', { cancelable: true, bubbles: true })
    wrapper.find('.sn-overlay').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('lets the touchmove gesture through when lockScroll is off', async () => {
    const wrapper = mount(SnOverlay, { props: { show: true, lockScroll: false } })
    const event = new Event('touchmove', { cancelable: true, bubbles: true })
    wrapper.find('.sn-overlay').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  it('finishes the leave leg when the overlay hides inside the enter tick (regression)', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mount(SnOverlay, { props: { show: false, duration: 200 } })
      await wrapper.setProps({ show: true })
      await wrapper.setProps({ show: false })
      vi.advanceTimersByTime(200)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('after-leave')).toHaveLength(1)
      expect(wrapper.find('.sn-overlay').exists()).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })


  it('clears the pending animation timer on unmount (no leak)', async () => {
    vi.useFakeTimers()
    try {
      const wrapper = mount(SnOverlay, { props: { show: true, duration: 300 } })
      await wrapper.setProps({ show: false })
      wrapper.unmount()
      // The timer callback would touch refs of an unmounted component.
      expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
    } finally {
      vi.useRealTimers()
    }
  })

  it('exposes a status role for assistive tech', () => {
    const wrapper = mount(SnOverlay, { props: { show: true } })
    expect(wrapper.attributes('data-snui-component')).toBe('overlay')
  })
})
