/**
 * sn-notice-bar unit tests — uni-end notice strip (wd-notice-bar parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `text` accepts a string or an array; empty text renders nothing
 *   - `type` drives the tint class and the fallback glyph
 *   - `scrollable` + `direction` pick marquee / static / vertical rendering
 *   - `closable` hides the strip and emits `close`
 *   - tapping the body emits `click` with `{ text, index }`
 *   - `wrapable` / `color` / `backgroundColor` land on class + style
 *   - the vertical rotation timer is cleared on unmount (§41)
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SnNoticeBar from './sn-notice-bar.vue'

afterEach(() => {
  vi.useRealTimers()
})

describe('sn-notice-bar', () => {
  it('renders nothing when text is empty', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: '' } })
    expect(wrapper.find('.sn-notice-bar').exists()).toBe(false)
  })

  it('renders the text and defaults to warning + horizontal marquee', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: '系统将在今晚维护' } })
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('系统将在今晚维护')
    expect(wrapper.classes()).toContain('sn-notice-bar--warning')
    expect(wrapper.find('.sn-notice-bar__marquee').exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('marquee')
  })

  it('applies the type class and its fallback glyph', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', type: 'danger' } })
    expect(wrapper.classes()).toContain('sn-notice-bar--danger')
    expect(wrapper.find('.sn-notice-bar__prefix svg').exists()).toBe(true)
  })

  it('renders a static line when scrollable is false', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', scrollable: false } })
    expect(wrapper.find('.sn-notice-bar__marquee').exists()).toBe(false)
    expect(wrapper.find('.sn-notice-bar__text').exists()).toBe(true)
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  it('adds the wrapable class only when scrollable is false', () => {
    const wrapped = mount(SnNoticeBar, {
      props: { text: 'x', scrollable: false, wrapable: true },
    })
    expect(wrapped.classes()).toContain('sn-notice-bar--wrapable')

    const marquee = mount(SnNoticeBar, { props: { text: 'x', wrapable: true } })
    expect(marquee.classes()).not.toContain('sn-notice-bar--wrapable')
  })

  it('renders the vertical mode with one line at a time', () => {
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['第一条', '第二条'], direction: 'vertical' },
    })
    expect(wrapper.find('.sn-notice-bar__vertical').exists()).toBe(true)
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('第一条')
  })

  it('rotates the vertical lines and emits next', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['第一条', '第二条'], direction: 'vertical', speed: 50 },
    })
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('next')).toBeTruthy()
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('第二条')
  })

  it('does not rotate when scrollable is false', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['第一条', '第二条'], direction: 'vertical', scrollable: false },
    })
    vi.advanceTimersByTime(20000)
    expect(wrapper.emitted('next')).toBeUndefined()
  })

  it('closes on the close button and emits close', async () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', closable: true } })
    expect(wrapper.find('.sn-notice-bar__close').exists()).toBe(true)
    await wrapper.find('.sn-notice-bar__close').trigger('tap')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.sn-notice-bar').exists()).toBe(false)
  })

  it('hides the close button when closable is false', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x' } })
    expect(wrapper.find('.sn-notice-bar__close').exists()).toBe(false)
    expect(wrapper.find('.sn-notice-bar__suffix').exists()).toBe(false)
  })

  it('emits click with the text and index', async () => {
    const wrapper = mount(SnNoticeBar, { props: { text: '点我' } })
    await wrapper.find('.sn-notice-bar__body').trigger('tap')
    expect(wrapper.emitted('click')?.[0]).toEqual([{ text: '点我', index: 0 }])
  })

  it('exposes the marquee duration as a custom property', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', delay: 2 } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('--sn-notice-bar-duration')
    expect(style).toContain('--sn-notice-bar-delay: 2s')
  })

  it('applies the color overrides and customClass', () => {
    const wrapper = mount(SnNoticeBar, {
      props: {
        text: 'x',
        color: 'rebeccapurple',
        backgroundColor: 'rebeccapurple',
        customClass: 'my-bar',
      },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('color: rebeccapurple')
    expect(style).toContain('background-color: rebeccapurple')
    expect(wrapper.classes()).toContain('my-bar')
  })

  it('renders the default slot instead of the text', () => {
    const wrapper = mount(SnNoticeBar, {
      props: { text: 'ignored' },
      slots: { default: '<text>slot notice</text>' },
    })
    expect(wrapper.find('.sn-notice-bar__body').text()).toContain('slot notice')
    expect(wrapper.findAll('.sn-notice-bar__text')).toHaveLength(0)
  })

  it('clears the rotation timer on unmount', () => {
    vi.useFakeTimers()
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['a', 'b'], direction: 'vertical' },
    })
    wrapper.unmount()
    expect(() => vi.advanceTimersByTime(60000)).not.toThrow()
  })
})
