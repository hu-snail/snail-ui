/**
 * sn-fab unit tests — uni-end floating action button (wd-fab parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `active` drives the menu visibility and the trigger rotation class
 *   - a tap toggles through `update:active`, or emits `click` when
 *     `expandable` is false
 *   - `disabled` blocks both
 *   - `type` / `position` / `direction` drive the class surface
 *   - `gap` plus the per-side `top` / `right` / `bottom` / `left` overrides land
 *     as inline px offsets
 *   - the default trigger icon swaps between plus and close
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnFab from './sn-fab.vue'

describe('sn-fab', () => {
  it('renders the trigger with the default plus icon', () => {
    const wrapper = mount(SnFab)
    expect(wrapper.find('.sn-fab__trigger').exists()).toBe(true)
    expect(wrapper.find('.sn-fab__trigger svg').exists()).toBe(true)
    expect(wrapper.find('.sn-fab__trigger').attributes('role')).toBe('button')
    expect(wrapper.find('.sn-fab__trigger').attributes('aria-expanded')).toBe('false')
  })

  it('hides the menu until active', () => {
    const closed = mount(SnFab, { slots: { default: '<view class="item">a</view>' } })
    expect(closed.find('.sn-fab__menu').classes()).not.toContain('sn-fab__menu--open')
    expect(closed.find('.sn-fab__menu').attributes('aria-hidden')).toBe('true')

    const open = mount(SnFab, {
      props: { active: true },
      slots: { default: '<view class="item">a</view>' },
    })
    expect(open.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--open')
    expect(open.find('.sn-fab__menu').attributes('aria-hidden')).toBe('false')
    expect(open.classes()).toContain('sn-fab--active')
  })

  it('toggles through update:active on tap', async () => {
    const wrapper = mount(SnFab, { props: { active: false } })
    await wrapper.find('.sn-fab__trigger').trigger('tap')
    expect(wrapper.emitted('update:active')?.[0]).toEqual([true])

    const open = mount(SnFab, { props: { active: true } })
    await open.find('.sn-fab__trigger').trigger('tap')
    expect(open.emitted('update:active')?.[0]).toEqual([false])
  })

  it('emits click instead of toggling when expandable is false', async () => {
    const wrapper = mount(SnFab, { props: { expandable: false } })
    await wrapper.find('.sn-fab__trigger').trigger('tap')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.emitted('update:active')).toBeUndefined()
  })

  it('ignores taps while disabled', async () => {
    const wrapper = mount(SnFab, { props: { disabled: true } })
    await wrapper.find('.sn-fab__trigger').trigger('tap')
    expect(wrapper.emitted('update:active')).toBeUndefined()
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.classes()).toContain('sn-fab--disabled')
    expect(wrapper.find('.sn-fab__trigger').attributes('aria-disabled')).toBe('true')
  })

  it('applies the type class to the trigger', () => {
    const wrapper = mount(SnFab, { props: { type: 'danger' } })
    expect(wrapper.find('.sn-fab__trigger').classes()).toContain('sn-fab__trigger--danger')
  })

  it('applies the position and direction classes', () => {
    const wrapper = mount(SnFab, { props: { position: 'left-top', direction: 'bottom' } })
    expect(wrapper.classes()).toContain('sn-fab--left-top')
    expect(wrapper.classes()).toContain('sn-fab--bottom')
    expect(wrapper.find('.sn-fab__menu').classes()).toContain('sn-fab__menu--bottom')
  })

  it('places the trigger with the default gap', () => {
    const wrapper = mount(SnFab)
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('right: 16px')
    expect(style).toContain('bottom: 16px')
  })

  it('lets the gap prop move every edge', () => {
    const wrapper = mount(SnFab, {
      props: { position: 'left-top', gap: { top: 24, left: 32 } },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('top: 24px')
    expect(style).toContain('left: 32px')
  })

  it('lets the per-side props override the gap', () => {
    const wrapper = mount(SnFab, {
      props: { gap: { right: 16, bottom: 16 }, right: 40, bottom: 8 },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('right: 40px')
    expect(style).toContain('bottom: 8px')
  })

  it('centres a side-anchored preset vertically', () => {
    const wrapper = mount(SnFab, { props: { position: 'right-center' } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('top: 50%')
    expect(style).toContain('translateY(-50%)')
    expect(style).toContain('right: 16px')
  })

  it('centres a top-anchored preset horizontally', () => {
    const wrapper = mount(SnFab, { props: { position: 'top-center' } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('top: 16px')
    expect(style).toContain('translateX(-50%)')
  })

  it('uses the custom trigger slot', () => {
    const wrapper = mount(SnFab, {
      slots: { trigger: '<text class="custom-trigger">+</text>' },
    })
    expect(wrapper.find('.custom-trigger').text()).toBe('+')
  })

  it('applies zIndex, customClass and customStyle', () => {
    const wrapper = mount(SnFab, {
      props: { zIndex: 300, customClass: 'my-fab', customStyle: 'margin: 8px' },
    })
    expect(wrapper.attributes('style')).toContain('z-index: 300')
    expect(wrapper.attributes('style')).toContain('margin: 8px')
    expect(wrapper.classes()).toContain('my-fab')
  })

  it('does not offset the trigger when draggable is off', async () => {
    const wrapper = mount(SnFab)
    await wrapper.find('.sn-fab__trigger').trigger('touchstart', {
      touches: [{ clientX: 10, clientY: 10 }],
    })
    await wrapper.find('.sn-fab__trigger').trigger('touchmove', {
      touches: [{ clientX: 60, clientY: 60 }],
    })
    expect(wrapper.attributes('style')).not.toContain('translate(50px')
  })

  it('offsets the trigger by the drag delta when draggable', async () => {
    const wrapper = mount(SnFab, { props: { draggable: true } })
    await wrapper.find('.sn-fab__trigger').trigger('touchstart', {
      touches: [{ clientX: 10, clientY: 10 }],
    })
    await wrapper.find('.sn-fab__trigger').trigger('touchmove', {
      touches: [{ clientX: 60, clientY: 40 }],
    })
    expect(wrapper.attributes('style')).toContain('translate(50px, 30px)')
  })
})
