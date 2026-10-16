/**
 * SnRadio / SnRadioButton / SnRadioGroup unit tests (AUI-WEB-RADIO-001).
 *
 * Behavior tests (AGENTS.md §46): checked switching, group linkage,
 * disabled suppression, button form, keyboard behavior via native radio.
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnRadio from './SnRadio.vue'
import SnRadioButton from './SnRadioButton.vue'
import SnRadioGroup from './SnRadioGroup.vue'

describe('SnRadio', () => {
  it('renders a native radio input', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', label: 'A' },
    })
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
  })

  it('is checked when standalone modelValue equals checkedValue', () => {
    const checked = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a', label: 'A' },
    })
    expect(checked.find('input').element.checked).toBe(true)
    const unchecked = mount(SnRadio, {
      props: { checkedValue: 'b', modelValue: 'a', label: 'B' },
    })
    expect(unchecked.find('input').element.checked).toBe(false)
  })

  it('emits update:modelValue with checkedValue on change', async () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: null },
    })
    await wrapper.find('input').setValue('a')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.at(-1)).toEqual(['a'])
  })

  it('emits change and checked on activation', async () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: null },
    })
    await wrapper.find('input').setValue('a')
    expect(wrapper.emitted('checked')).toHaveLength(1)
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('applies disabled attribute and class', () => {
    const wrapper = mount(SnRadio, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('sn-radio--disabled')
  })

  it('applies readonly class', () => {
    const wrapper = mount(SnRadio, { props: { readonly: true } })
    expect(wrapper.classes()).toContain('sn-radio--readonly')
  })

  it('applies size class', () => {
    const wrapper = mount(SnRadio, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('sn-radio--large')
  })

  it('applies status class and aria-invalid for error', () => {
    const wrapper = mount(SnRadio, { props: { status: 'error' } })
    expect(wrapper.classes()).toContain('sn-radio--status-error')
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('forwards name attribute', () => {
    const wrapper = mount(SnRadio, { props: { name: 'gender' } })
    expect(wrapper.find('input').attributes('name')).toBe('gender')
  })

  it('forwards label prop text', () => {
    const wrapper = mount(SnRadio, { props: { label: 'Option A' } })
    expect(wrapper.find('.sn-radio__label').text()).toBe('Option A')
  })

  it('renders the label slot with checked scope', () => {
    const wrapper = mount(SnRadio, {
      props: { checkedValue: 'a', modelValue: 'a' },
      slots: { label: '<i data-testid="lbl">Custom</i>' },
    })
    expect(wrapper.find('[data-testid="lbl"]').exists()).toBe(true)
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('emits focus and blur', async () => {
    const wrapper = mount(SnRadio, {})
    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('supports number and boolean values', () => {
    const numeric = mount(SnRadio, {
      props: { checkedValue: 1, modelValue: 1 },
    })
    expect(numeric.find('input').element.checked).toBe(true)
    const bool = mount(SnRadio, {
      props: { checkedValue: true, modelValue: true },
    })
    expect(bool.find('input').element.checked).toBe(true)
  })
})

describe('SnRadioGroup', () => {
  it('renders child SnRadio components from options', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    const inputs = wrapper.findAll('input[type="radio"]')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].element.checked).toBe(true)
    expect(inputs[1].element.checked).toBe(false)
  })

  it('coerces plain-value options to label/value pairs', () => {
    const wrapper = mount(SnRadioGroup, {
      props: { modelValue: 'x', options: ['x', 'y'] },
    })
    expect(wrapper.findAll('.sn-radio__label')[0].text()).toBe('x')
    expect(wrapper.findAll('input[type="radio"]')[0].element.checked).toBe(true)
  })

  it('emits update:modelValue when a child radio is activated', async () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    await wrapper.findAll('input[type="radio"]')[1].setValue('b')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['b'])
  })

  it('renders slot children over options', () => {
    const wrapper = mount(SnRadioGroup, {
      props: { modelValue: 'a', options: [{ label: 'A', value: 'a' }] },
      slots: {
        default: '<SnRadio checked-value="z" label="Z" />',
      },
      global: { components: { SnRadio } },
    })
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(1)
    expect(wrapper.find('.sn-radio__label').text()).toBe('Z')
  })

  it('provides the shared name to children', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        name: 'fruit',
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    wrapper.findAll('input[type="radio"]').forEach((input) => {
      expect(input.attributes('name')).toBe('fruit')
    })
  })

  it('group disabled disables all children', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        disabled: true,
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    wrapper.findAll('input[type="radio"]').forEach((input) => {
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  it('group size drives child size classes', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        size: 'small',
        modelValue: 'a',
        options: [{ label: 'A', value: 'a' }],
      },
    })
    expect(wrapper.findComponent(SnRadio).classes()).toContain('sn-radio--small')
  })

  it('group status drives child status classes', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        status: 'warning',
        modelValue: 'a',
        options: [{ label: 'A', value: 'a' }],
      },
    })
    expect(wrapper.findComponent(SnRadio).classes()).toContain('sn-radio--status-warning')
  })

  it('renders button-form children when button=true', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        button: true,
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    expect(wrapper.findAll('.sn-radio-button')).toHaveLength(2)
    expect(wrapper.classes()).toContain('sn-radio-group--button')
  })

  it('sets role=radiogroup on the root', () => {
    const wrapper = mount(SnRadioGroup, { props: {} })
    expect(wrapper.attributes('role')).toBe('radiogroup')
  })

  it('per-child disabled overrides group default', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
        ],
      },
    })
    const inputs = wrapper.findAll('input[type="radio"]')
    expect(inputs[0].attributes('disabled')).toBeUndefined()
    expect(inputs[1].attributes('disabled')).toBeDefined()
  })
})

describe('SnRadioButton', () => {
  it('renders as a button-styled radio', () => {
    const wrapper = mount(SnRadioButton, {
      props: { checkedValue: 'a', label: 'A' },
    })
    expect(wrapper.classes()).toContain('sn-radio-button')
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
  })

  it('is checked when standalone modelValue equals checkedValue', () => {
    const wrapper = mount(SnRadioButton, {
      props: { checkedValue: 'a', modelValue: 'a' },
    })
    expect(wrapper.find('input').element.checked).toBe(true)
    expect(wrapper.classes()).toContain('sn-radio-button--checked')
  })

  it('syncs with the group on activation', async () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
      slots: {
        default: `
          <SnRadioButton checked-value="a" label="A" />
          <SnRadioButton checked-value="b" label="B" />
        `,
      },
      global: { components: { SnRadioButton } },
    })
    const inputs = wrapper.findAll('input[type="radio"]')
    expect(inputs[0].element.checked).toBe(true)
    await inputs[1].setValue('b')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
  })

  it('applies disabled state', () => {
    const wrapper = mount(SnRadioButton, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('sn-radio-button--disabled')
  })

  it('applies size class', () => {
    const wrapper = mount(SnRadioButton, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('sn-radio-button--large')
  })

  it('applies status class', () => {
    const wrapper = mount(SnRadioButton, { props: { status: 'error' } })
    expect(wrapper.classes()).toContain('sn-radio-button--status-error')
  })
})

describe('SnRadio keyboard behavior', () => {
  it('native inputs in a shared group accept keyboard-driven checked changes', async () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        name: 'kb',
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    const inputs = wrapper.findAll('input[type="radio"]')
    // jsdom does not implement arrow-key radio roving, but the native
    // change pathway (what arrows trigger) must sync the group.
    await inputs[1].setValue('b')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b'])
  })

  it('inputs share the same name inside a group (arrow-key prerequisite)', () => {
    const wrapper = mount(SnRadioGroup, {
      props: {
        name: 'kb',
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    const names = wrapper.findAll('input[type="radio"]').map((i) => i.attributes('name'))
    expect(names).toEqual(['kb', 'kb'])
  })
})
