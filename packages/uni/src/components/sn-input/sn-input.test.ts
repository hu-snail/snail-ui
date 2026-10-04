/**
 * sn-input unit tests — uni-end text input (AUI-MP-003).
 *
 * Same coverage as SnInput.test.ts (AUI-WEB-003) — these two must stay
 * symmetric across ends.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnInput from './sn-input.vue'

describe('sn-input', () => {
  it('renders a text input by default', () => {
    const wrapper = mount(SnInput, { props: { modelValue: '' } })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(SnInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('hi')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hi'])
  })

  it('coerces numeric input to number', async () => {
    const wrapper = mount(SnInput, {
      props: { type: 'number', modelValue: 0 },
    })
    await wrapper.find('input').setValue('42')
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
      props: { ariaLabel: 'Phone' },
    })
    expect(wrapper.find('input').attributes('aria-label')).toBe('Phone')
  })

  it('renders clear button when clearable and value is non-empty', () => {
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
    // uni-end uses `@tap` (the cross-end tap event); happy-dom translates
    // it to a click event at the runtime layer, so either works in practice.
    await wrapper.find('.sn-input__clear-btn').trigger('tap')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('renders textarea when type is textarea', () => {
    const wrapper = mount(SnInput, { props: { type: 'textarea', rows: 5 } })
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('textarea').attributes('rows')).toBe('5')
  })

  it('forwards placeholder', () => {
    const wrapper = mount(SnInput, {
      props: { placeholder: 'Enter phone' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter phone')
  })

  it('forwards maxlength and minlength', () => {
    const wrapper = mount(SnInput, {
      props: { maxlength: 11, minlength: 6 },
    })
    const input = wrapper.find('input')
    expect(input.attributes('maxlength')).toBe('11')
    expect(input.attributes('minlength')).toBe('6')
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
      props: { showCount: true, maxlength: 140, modelValue: 'hi' },
    })
    expect(wrapper.find('.sn-input__count').text()).toContain('140')
  })

  it('renders prefix slot', () => {
    const wrapper = mount(SnInput, {
      props: { modelValue: '' },
      slots: { prefix: '<view data-testid="prefix">@</view>' },
    })
    expect(wrapper.find('[data-testid="prefix"]').exists()).toBe(true)
  })

  it('renders suffix slot', () => {
    const wrapper = mount(SnInput, {
      props: { modelValue: '' },
      slots: { suffix: '<view data-testid="suffix">@x.com</view>' },
    })
    expect(wrapper.find('[data-testid="suffix"]').exists()).toBe(true)
  })

  it('forwards type attribute', () => {
    const wrapper = mount(SnInput, { props: { type: 'tel' } })
    expect(wrapper.find('input').attributes('type')).toBe('tel')
  })

  it('reflects the warning status class', () => {
    const wrapper = mount(SnInput, { props: { status: 'warning' } })
    expect(wrapper.classes()).toContain('sn-input--status-warning')
  })

  it('forwards min/max/step on number inputs', () => {
    const wrapper = mount(SnInput, {
      props: { type: 'number', min: 0, max: 99, step: 1 },
    })
    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBe('99')
    expect(input.attributes('step')).toBe('1')
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

  it('switches to bg-transparent', () => {
    const wrapper = mount(SnInput, { props: { bg: 'transparent' } })
    expect(wrapper.classes()).toContain('sn-input--bg-transparent')
  })

  it('switches to bg-soft', () => {
    const wrapper = mount(SnInput, { props: { bg: 'soft' } })
    expect(wrapper.classes()).toContain('sn-input--bg-soft')
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