/**
 * SnSwitch unit tests — web-end switch (naive-ui n-switch parity).
 *
 * Tests cover behavior, not implementation detail (AGENTS.md §46):
 *   - click toggles + v-model two-way binding
 *   - update:modelValue / change events
 *   - checkedValue / uncheckedValue custom payloads (string / number)
 *   - aria-checked role="switch" + keyboard activation (Enter / Space)
 *   - disabled / readonly / loading block toggling
 *   - checked / unchecked / loading-icon slots
 *   - railStyle callback merges style onto the rail
 *   - size class convention
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnSwitch from './SnSwitch.vue'

describe('SnSwitch', () => {
  it('renders a role="switch" element unchecked by default', () => {
    const wrapper = mount(SnSwitch)
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it('reflects checked state in aria-checked', () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: true } })
    expect(wrapper.attributes('aria-checked')).toBe('true')
    expect(wrapper.classes()).toContain('sn-switch--checked')
  })

  it('toggles and emits update:modelValue on click', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('toggles from checked to unchecked', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('emits change with the new value', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('change')).toEqual([[true]])
  })

  it('works with v-model two-way binding', async () => {
    const wrapper = mount(SnSwitch, {
      props: { modelValue: false, 'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v }) },
    })
    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-checked')).toBe('true')
    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it('uses custom checkedValue / uncheckedValue payloads', async () => {
    const wrapper = mount(SnSwitch, {
      props: { modelValue: 'off', checkedValue: 'on', uncheckedValue: 'off' },
    })
    expect(wrapper.attributes('aria-checked')).toBe('false')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['on'])
    expect(wrapper.emitted('change')).toEqual([['on']])
  })

  it('supports number payloads', async () => {
    const wrapper = mount(SnSwitch, {
      props: { modelValue: 0, checkedValue: 1, uncheckedValue: 0 },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1])
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: false, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('does not toggle when readonly', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: false, readonly: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-readonly')).toBe('true')
  })

  it('does not toggle and shows spinner when loading', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: false, loading: true } })
    expect(wrapper.find('.sn-switch__loading').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('toggles on Enter key', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: false } })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('toggles on Space key', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: false } })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('does not toggle on other keys', async () => {
    const wrapper = mount(SnSwitch, { props: { modelValue: false } })
    await wrapper.trigger('keydown', { key: 'a' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies size class', () => {
    const small = mount(SnSwitch, { props: { size: 'small' } })
    expect(small.classes()).toContain('sn-switch--small')
    const large = mount(SnSwitch, { props: { size: 'large' } })
    expect(large.classes()).toContain('sn-switch--large')
  })

  it('renders checked slot content only when checked', () => {
    const on = mount(SnSwitch, {
      props: { modelValue: true },
      slots: { checked: '<span data-testid="on">ON</span>' },
    })
    expect(on.find('[data-testid="on"]').exists()).toBe(true)

    const off = mount(SnSwitch, {
      props: { modelValue: false },
      slots: { checked: '<span data-testid="on">ON</span>' },
    })
    expect(off.find('[data-testid="on"]').exists()).toBe(false)
  })

  it('renders unchecked slot content only when unchecked', () => {
    const off = mount(SnSwitch, {
      props: { modelValue: false },
      slots: { unchecked: '<span data-testid="off">OFF</span>' },
    })
    expect(off.find('[data-testid="off"]').exists()).toBe(true)

    const on = mount(SnSwitch, {
      props: { modelValue: true },
      slots: { unchecked: '<span data-testid="off">OFF</span>' },
    })
    expect(on.find('[data-testid="off"]').exists()).toBe(false)
  })

  it('renders custom loading-icon slot', () => {
    const wrapper = mount(SnSwitch, {
      props: { loading: true },
      slots: { 'loading-icon': '<i data-testid="spinner"></i>' },
    })
    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true)
  })

  it('applies railStyle callback to the rail', async () => {
    const railStyle = (info: { checked: boolean }) =>
      info.checked ? { background: 'green' } : { background: 'red' }
    const wrapper = mount(SnSwitch, {
      props: { modelValue: false, railStyle },
    })
    const rail = wrapper.find('.sn-switch__rail')
    expect(rail.attributes('style')).toContain('background: red')

    await wrapper.setProps({ modelValue: true })
    expect(rail.attributes('style')).toContain('background: green')
  })

  it('forwards ariaLabel', () => {
    const wrapper = mount(SnSwitch, { props: { ariaLabel: 'Dark mode' } })
    expect(wrapper.attributes('aria-label')).toBe('Dark mode')
  })

  it('forwards customClass to the root', () => {
    const wrapper = mount(SnSwitch, { props: { customClass: 'my-switch' } })
    expect(wrapper.classes()).toContain('my-switch')
  })
})
