/**
 * SnInput unit tests — web-end text input (AUI-WEB-003).
 *
 * Tests cover behavior, not implementation detail (AGENTS.md §46):
 *   - v-model two-way binding (text + number)
 *   - input / change / focus / blur events
 *   - clearable button clears value
 *   - status drives aria-invalid
 *   - size class follows `sn-input--{size}` convention
 *   - disabled / readonly suppress interaction
 *   - textarea renders when type="textarea"
 *   - slots render (prefix / suffix / clear-icon / count)
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnInput from './SnInput.vue'

describe('SnInput', () => {
  it('renders a text input by default', () => {
    const wrapper = mount(SnInput, { props: { modelValue: '' } })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(SnInput, { props: { modelValue: '' } })
    const input = wrapper.find('input')
    await input.setValue('hi')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hi'])
  })

  it('coerces numeric input to number', async () => {
    const wrapper = mount(SnInput, {
      props: { type: 'number', modelValue: 0 },
    })
    const input = wrapper.find('input')
    await input.setValue('42')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([42])
  })

  it('emits input event on every keystroke', async () => {
    const wrapper = mount(SnInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('a')
    await wrapper.find('input').setValue('ab')
    expect(wrapper.emitted('input')).toHaveLength(2)
  })

  it('emits change event on commit', async () => {
    const wrapper = mount(SnInput, { props: { modelValue: '' } })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('emits focus and blur events', async () => {
    const wrapper = mount(SnInput, { props: { modelValue: '' } })
    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('applies size class', () => {
    const wrapper = mount(SnInput, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('sn-input--large')
  })

  it('applies disabled attribute and class', () => {
    const wrapper = mount(SnInput, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('sn-input--disabled')
  })

  it('applies readonly attribute and class', () => {
    const wrapper = mount(SnInput, { props: { readonly: true } })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
    expect(wrapper.classes()).toContain('sn-input--readonly')
  })

  it('sets aria-invalid when status is error', () => {
    const wrapper = mount(SnInput, { props: { status: 'error' } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('omits aria-invalid when status is default', () => {
    const wrapper = mount(SnInput, { props: { status: 'default' } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('sets aria-required when required prop is true', () => {
    const wrapper = mount(SnInput, { props: { required: true } })
    expect(wrapper.find('input').attributes('aria-required')).toBe('true')
  })

  it('forwards ariaLabel', () => {
    const wrapper = mount(SnInput, {
      props: { ariaLabel: 'Email address' },
    })
    expect(wrapper.find('input').attributes('aria-label')).toBe('Email address')
  })

  it('renders clear button when clearable and value is non-empty', async () => {
    const wrapper = mount(SnInput, {
      props: { clearable: true, modelValue: 'x' },
    })
    expect(wrapper.find('.sn-input__clear').exists()).toBe(true)
  })

  it('hides clear button when value is empty', () => {
    const wrapper = mount(SnInput, {
      props: { clearable: true, modelValue: '' },
    })
    expect(wrapper.find('.sn-input__clear').exists()).toBe(false)
  })

  it('hides clear button when disabled', () => {
    const wrapper = mount(SnInput, {
      props: { clearable: true, disabled: true, modelValue: 'x' },
    })
    expect(wrapper.find('.sn-input__clear').exists()).toBe(false)
  })

  it('emits clear and clears modelValue when clear button is clicked', async () => {
    const wrapper = mount(SnInput, {
      props: { clearable: true, modelValue: 'abc' },
    })
    await wrapper.find('.sn-input__clear-btn').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('renders textarea when type is textarea', () => {
    const wrapper = mount(SnInput, { props: { type: 'textarea', rows: 4 } })
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('textarea').attributes('rows')).toBe('4')
  })

  it('forwards placeholder', () => {
    const wrapper = mount(SnInput, {
      props: { placeholder: 'Enter email' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter email')
  })

  it('forwards maxlength and minlength', () => {
    const wrapper = mount(SnInput, {
      props: { maxlength: 10, minlength: 2 },
    })
    const input = wrapper.find('input')
    expect(input.attributes('maxlength')).toBe('10')
    expect(input.attributes('minlength')).toBe('2')
  })

  it('renders count when showCount is true', () => {
    const wrapper = mount(SnInput, {
      props: { showCount: true, modelValue: 'hi' },
    })
    expect(wrapper.find('.sn-input__count').exists()).toBe(true)
    expect(wrapper.find('.sn-input__count').text()).toContain('2')
  })

  it('renders count with max when maxlength is provided', () => {
    const wrapper = mount(SnInput, {
      props: { showCount: true, maxlength: 10, modelValue: 'hi' },
    })
    expect(wrapper.find('.sn-input__count').text()).toContain('2')
    expect(wrapper.find('.sn-input__count').text()).toContain('10')
  })

  it('renders prefix slot', () => {
    const wrapper = mount(SnInput, {
      props: { modelValue: '' },
      slots: { prefix: '<i data-testid="prefix">@</i>' },
    })
    expect(wrapper.find('[data-testid="prefix"]').exists()).toBe(true)
  })

  it('renders suffix slot', () => {
    const wrapper = mount(SnInput, {
      props: { modelValue: '' },
      slots: { suffix: '<i data-testid="suffix">.com</i>' },
    })
    expect(wrapper.find('[data-testid="suffix"]').exists()).toBe(true)
  })

  it('renders custom clear-icon slot', () => {
    const wrapper = mount(SnInput, {
      props: { clearable: true, modelValue: 'x' },
      slots: { 'clear-icon': '<i data-testid="custom-clear">⌫</i>' },
    })
    expect(wrapper.find('[data-testid="custom-clear"]').exists()).toBe(true)
  })

  it('forwards type attribute', () => {
    const wrapper = mount(SnInput, { props: { type: 'email' } })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('forwards min/max/step on number inputs', () => {
    const wrapper = mount(SnInput, {
      props: { type: 'number', min: 0, max: 100, step: 5 },
    })
    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBe('100')
    expect(input.attributes('step')).toBe('5')
  })

  it('reflects the warning status class', () => {
    const wrapper = mount(SnInput, { props: { status: 'warning' } })
    expect(wrapper.classes()).toContain('sn-input--status-warning')
  })

  it('applies bordered class by default', () => {
    const wrapper = mount(SnInput, { props: {} })
    expect(wrapper.classes()).toContain('sn-input--bordered')
    expect(wrapper.classes()).not.toContain('sn-input--borderless')
  })

  it('toggles borderless when bordered is false', () => {
    const wrapper = mount(SnInput, { props: { bordered: false } })
    expect(wrapper.classes()).toContain('sn-input--borderless')
    expect(wrapper.classes()).not.toContain('sn-input--bordered')
  })

  it('applies bg-surface by default', () => {
    const wrapper = mount(SnInput, { props: {} })
    expect(wrapper.classes()).toContain('sn-input--bg-surface')
  })

  it('switches to bg-transparent', () => {
    const wrapper = mount(SnInput, { props: { bg: 'transparent' } })
    expect(wrapper.classes()).toContain('sn-input--bg-transparent')
  })

  it('switches to bg-soft', () => {
    const wrapper = mount(SnInput, { props: { bg: 'soft' } })
    expect(wrapper.classes()).toContain('sn-input--bg-soft')
  })

  it('applies radius-default by default', () => {
    const wrapper = mount(SnInput, { props: {} })
    expect(wrapper.classes()).toContain('sn-input--radius-default')
  })

  it('switches to radius-pill', () => {
    const wrapper = mount(SnInput, { props: { radius: 'pill' } })
    expect(wrapper.classes()).toContain('sn-input--radius-pill')
  })

  it('switches to radius-square', () => {
    const wrapper = mount(SnInput, { props: { radius: 'square' } })
    expect(wrapper.classes()).toContain('sn-input--radius-square')
  })
})