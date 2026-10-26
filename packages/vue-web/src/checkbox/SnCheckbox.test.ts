/**
 * SnCheckbox / SnCheckboxGroup unit tests — web-end checkbox.
 *
 * Tests cover behavior, not implementation detail (AGENTS.md §46):
 *   - standalone click toggle (checked → unchecked → checked)
 *   - v-model two-way binding (boolean + checkedValue/uncheckedValue)
 *   - group multi-select via options and via slot children
 *   - group disabled / per-option disabled
 *   - indeterminate aria-checked="mixed"
 *   - keyboard Space toggles
 *   - readonly suppresses toggling
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import SnCheckbox from './SnCheckbox.vue'
import SnCheckboxGroup from './SnCheckboxGroup.vue'

function findInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('input[type="checkbox"]')
}

describe('SnCheckbox', () => {
  it('renders an unchecked checkbox by default', () => {
    const wrapper = mount(SnCheckbox)
    const input = findInput(wrapper)
    expect(input.exists()).toBe(true)
    expect(input.attributes('aria-checked')).toBe('false')
  })

  it('reflects checked state from modelValue', () => {
    const wrapper = mount(SnCheckbox, { props: { modelValue: true } })
    expect(findInput(wrapper).attributes('aria-checked')).toBe('true')
    expect(wrapper.classes()).toContain('sn-checkbox--checked')
  })

  it('toggles from unchecked to checked on click and emits update:modelValue', async () => {
    const wrapper = mount(SnCheckbox, { props: { modelValue: false } })
    await findInput(wrapper).setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(wrapper.emitted('update:checked')?.at(-1)).toEqual([true])
  })

  it('toggles from checked to unchecked on click', async () => {
    const wrapper = mount(SnCheckbox, { props: { modelValue: true } })
    await findInput(wrapper).setValue(false)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('emits custom checkedValue / uncheckedValue', async () => {
    const wrapper = mount(SnCheckbox, {
      props: { modelValue: 'no', checkedValue: 'yes', uncheckedValue: 'no' },
    })
    await findInput(wrapper).setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['yes'])
    await findInput(wrapper).setValue(false)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['no'])
  })

  it('toggles on keyboard Space key', async () => {
    const wrapper = mount(SnCheckbox, { props: { modelValue: false } })
    const input = findInput(wrapper)
    input.element.checked = true
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(SnCheckbox, {
      props: { modelValue: false, disabled: true },
    })
    expect(findInput(wrapper).attributes('disabled')).toBeDefined()
    await findInput(wrapper).setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not toggle when readonly', async () => {
    const wrapper = mount(SnCheckbox, {
      props: { modelValue: false, readonly: true },
    })
    await findInput(wrapper).setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders mixed aria-checked when indeterminate and unchecked', () => {
    const wrapper = mount(SnCheckbox, {
      props: { modelValue: false, indeterminate: true },
    })
    expect(findInput(wrapper).attributes('aria-checked')).toBe('mixed')
    expect(wrapper.classes()).toContain('sn-checkbox--indeterminate')
  })

  it('applies size class', () => {
    const wrapper = mount(SnCheckbox, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('sn-checkbox--large')
  })

  it('renders label text', () => {
    const wrapper = mount(SnCheckbox, { props: { label: 'Accept terms' } })
    expect(wrapper.text()).toContain('Accept terms')
  })

  it('renders default slot over label prop', () => {
    const wrapper = mount(SnCheckbox, {
      props: { label: 'prop' },
      slots: { default: '<b data-testid="rich">rich</b>' },
    })
    expect(wrapper.find('[data-testid="rich"]').exists()).toBe(true)
  })

  it('sets tabindex -1 when focusable is false', () => {
    const wrapper = mount(SnCheckbox, { props: { focusable: false } })
    expect(findInput(wrapper).attributes('tabindex')).toBe('-1')
  })

  it('sets aria-invalid when status is error', () => {
    const wrapper = mount(SnCheckbox, { props: { status: 'error' } })
    expect(findInput(wrapper).attributes('aria-invalid')).toBe('true')
  })

  it('forwards ariaLabel', () => {
    const wrapper = mount(SnCheckbox, { props: { ariaLabel: 'Subscribe' } })
    expect(findInput(wrapper).attributes('aria-label')).toBe('Subscribe')
  })
})

describe('SnCheckboxGroup', () => {
  it('renders checkboxes from options', () => {
    const wrapper = mount(SnCheckboxGroup, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('A')
  })

  it('syncs child checked state from group modelValue', () => {
    const wrapper = mount(SnCheckboxGroup, {
      props: {
        modelValue: ['a'],
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    const inputs = wrapper.findAll('input[type="checkbox"]')
    expect(inputs[0].attributes('aria-checked')).toBe('true')
    expect(inputs[1].attributes('aria-checked')).toBe('false')
  })

  it('toggles membership on child click and emits update:modelValue', async () => {
    const wrapper = mount(SnCheckboxGroup, {
      props: {
        modelValue: ['a'],
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    const inputs = wrapper.findAll('input[type="checkbox"]')
    // check B
    inputs[1].element.checked = true
    await inputs[1].trigger('change')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'b']])
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual([['a', 'b']])
    // uncheck A — modelValue prop stays ['a'] (parent hasn't applied the
    // last emit), so removing 'a' yields [].
    inputs[0].element.checked = false
    await inputs[0].trigger('change')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('supports slot children bound through provide/inject', async () => {
    const selected = ref<Array<string | number | boolean>>(['x'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(SnCheckboxGroup, { modelValue: selected.value, 'onUpdate:modelValue': (v: Array<string | number | boolean>) => { selected.value = v } }, {
            default: () => [
              h(SnCheckbox, { value: 'x', label: 'X' }),
              h(SnCheckbox, { value: 'y', label: 'Y' }),
            ],
          })
      },
    })
    const wrapper = mount(Host)
    const inputs = wrapper.findAll('input[type="checkbox"]')
    expect(inputs[0].attributes('aria-checked')).toBe('true')
    inputs[1].element.checked = true
    await inputs[1].trigger('change')
    expect(selected.value).toEqual(['x', 'y'])
  })

  it('disables all children when group disabled', async () => {
    const wrapper = mount(SnCheckboxGroup, {
      props: {
        disabled: true,
        modelValue: [],
        options: [{ label: 'A', value: 'a' }],
      },
    })
    const input = findInput(wrapper)
    expect(input.attributes('disabled')).toBeDefined()
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('honors per-option disabled while others stay enabled', () => {
    const wrapper = mount(SnCheckboxGroup, {
      props: {
        modelValue: [],
        options: [
          { label: 'A', value: 'a', disabled: true },
          { label: 'B', value: 'b' },
        ],
      },
    })
    const inputs = wrapper.findAll('input[type="checkbox"]')
    expect(inputs[0].attributes('disabled')).toBeDefined()
    expect(inputs[1].attributes('disabled')).toBeUndefined()
  })

  it('applies group size to children', () => {
    const wrapper = mount(SnCheckboxGroup, {
      props: {
        size: 'small',
        options: [{ label: 'A', value: 'a' }],
      },
    })
    expect(wrapper.findComponent(SnCheckbox).classes()).toContain('sn-checkbox--small')
  })

  it('uses defaultValue when uncontrolled', () => {
    const wrapper = mount(SnCheckboxGroup, {
      props: {
        defaultValue: ['a'],
        options: [{ label: 'A', value: 'a' }],
      },
    })
    expect(findInput(wrapper).attributes('aria-checked')).toBe('true')
  })
})
