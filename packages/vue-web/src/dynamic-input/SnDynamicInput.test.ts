/**
 * SnDynamicInput unit tests — web-end dynamic row input (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): initial render, per-row edit sync back
 * to the array, insert / remove, min / max button hiding, scoped slot,
 * disabled, readonly.
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'
import SnDynamicInput from './SnDynamicInput.vue'

/** One row value — mirrors the component's public contract. */
type RowValue = string | number | Record<string, unknown> | null

/** Mount with plain props (assert on emitted payloads). */
function mountInput(props: Record<string, unknown> = {}) {
  return mount(SnDynamicInput, { props })
}

/**
 * Mount with a live v-model so multi-step flows accumulate (the component
 * is controlled — modelValue must sync back for inserts / removes to build
 * on each other). The outer wrapper owns the DOM; `value` is the live ref.
 */
function mountVModel(initial: RowValue[], props: Record<string, unknown> = {}) {
  const value = ref<RowValue[]>(initial)
  const wrapper = mount({
    setup() {
      return () =>
        h(SnDynamicInput, {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (v: RowValue[]) => { value.value = v },
        })
    },
  })
  return { wrapper, value }
}

/** Row input elements (built-in preset rows). */
function rowInputs(wrapper: { findAll: (selector: string) => Array<{ element: HTMLInputElement }> }) {
  return wrapper.findAll('.sn-dynamic-input__input')
}

describe('SnDynamicInput', () => {
  describe('initial render', () => {
    it('renders one input row per primitive item', () => {
      const wrapper = mountInput({ modelValue: ['a', 'b', 'c'] })
      expect(rowInputs(wrapper)).toHaveLength(3)
      expect((rowInputs(wrapper)[0].element as HTMLInputElement).value).toBe('a')
      expect((rowInputs(wrapper)[2].element as HTMLInputElement).value).toBe('c')
    })

    it('renders number rows with their values', () => {
      const wrapper = mountInput({ modelValue: [1, 2] })
      expect((rowInputs(wrapper)[0].element as HTMLInputElement).value).toBe('1')
      expect((rowInputs(wrapper)[1].element as HTMLInputElement).value).toBe('2')
    })

    it('shows the empty-state create button when the array is empty', () => {
      const wrapper = mountInput({ modelValue: [] })
      expect(wrapper.find('.sn-dynamic-input__create').exists()).toBe(true)
      expect(rowInputs(wrapper)).toHaveLength(0)
    })

    it('shows no empty-state create button when rows exist', () => {
      const wrapper = mountInput({ modelValue: ['x'] })
      expect(wrapper.find('.sn-dynamic-input__create').exists()).toBe(false)
    })

    it('applies size and status classes', () => {
      const wrapper = mountInput({ modelValue: ['x'], size: 'large', status: 'error' })
      expect(wrapper.classes()).toContain('sn-dynamic-input--large')
      expect(wrapper.classes()).toContain('sn-dynamic-input--status-error')
    })
  })

  describe('per-row edit sync', () => {
    it('emits the whole new array when a row is edited', async () => {
      const wrapper = mountInput({ modelValue: ['a', 'b'] })
      await rowInputs(wrapper)[1].setValue('beta')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'beta']])
    })

    it('keeps the numeric type when editing a number row', async () => {
      const { wrapper, value } = mountVModel([1, 2])
      await rowInputs(wrapper)[0].setValue('42')
      expect(value.value).toEqual([42, 2])
    })

    it('commits the raw string when a number row is emptied', async () => {
      const { wrapper, value } = mountVModel([7])
      await rowInputs(wrapper)[0].setValue('')
      expect(value.value).toEqual([''])
    })
  })

  describe('insert', () => {
    it('appends a preset row after the clicked row', async () => {
      const wrapper = mountInput({ modelValue: ['a'], preset: () => '' })
      await wrapper.find('.sn-dynamic-input__btn--insert').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', '']])
    })

    it('creates a row from the empty-state button', async () => {
      const { wrapper, value } = mountVModel([], { preset: () => '' })
      await wrapper.find('.sn-dynamic-input__create').trigger('click')
      expect(value.value).toEqual([''])
      expect(wrapper.find('.sn-dynamic-input__create').exists()).toBe(false)
      expect(rowInputs(wrapper)).toHaveLength(1)
    })

    it('defaults the new row to null (naive-ui semantics) when no preset is given', async () => {
      const wrapper = mountInput({ modelValue: [] })
      await wrapper.find('.sn-dynamic-input__create').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[null]])
    })

    it('runs onCreate after preset to refine the created row', async () => {
      const wrapper = mountInput({
        modelValue: ['a'],
        preset: () => '',
        onCreate: (v: string, index: number) => `${v}row-${index}`,
      })
      await wrapper.find('.sn-dynamic-input__btn--insert').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'row-1']])
    })

    it('inserts mid-array after the clicked row', async () => {
      const { wrapper, value } = mountVModel(['a', 'c'], { preset: () => 'b' })
      await wrapper.findAll('.sn-dynamic-input__btn--insert')[0].trigger('click')
      expect(value.value).toEqual(['a', 'b', 'c'])
    })

    it('hides the insert button at max and refuses to grow beyond it', async () => {
      const wrapper = mountInput({ modelValue: ['a', 'b'], max: 2 })
      expect(wrapper.find('.sn-dynamic-input__btn--insert').exists()).toBe(false)

      const empty = mountInput({ modelValue: [], max: 0 })
      expect(empty.find('.sn-dynamic-input__create').attributes('disabled')).toBeDefined()
      await empty.find('.sn-dynamic-input__create').trigger('click')
      expect(empty.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('remove', () => {
    it('removes the clicked row and emits the new array', async () => {
      const wrapper = mountInput({ modelValue: ['a', 'b', 'c'] })
      await wrapper.findAll('.sn-dynamic-input__btn--remove')[1].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a', 'c']])
    })

    it('hides the remove button at min', () => {
      const wrapper = mountInput({ modelValue: ['a'], min: 1 })
      expect(wrapper.find('.sn-dynamic-input__btn--remove').exists()).toBe(false)
    })

    it('hides the remove button when the row count equals min', () => {
      const wrapper = mountInput({ modelValue: ['a', 'b'], min: 2 })
      expect(wrapper.find('.sn-dynamic-input__btn--remove').exists()).toBe(false)
    })

    it('shows both buttons between the bounds', () => {
      const wrapper = mountInput({ modelValue: ['a', 'b'], min: 1, max: 3 })
      expect(wrapper.find('.sn-dynamic-input__btn--remove').exists()).toBe(true)
      expect(wrapper.find('.sn-dynamic-input__btn--insert').exists()).toBe(true)
    })

    it('flows from max back down via repeated removes', async () => {
      const { wrapper, value } = mountVModel(['a', 'b'], { max: 2, min: 1 })
      await wrapper.findAll('.sn-dynamic-input__btn--remove')[0].trigger('click')
      expect(value.value).toEqual(['b'])
      expect(wrapper.find('.sn-dynamic-input__btn--remove').exists()).toBe(false)
      expect(wrapper.find('.sn-dynamic-input__btn--insert').exists()).toBe(true)
    })
  })

  describe('slot rendering', () => {
    it('renders the default slot instead of built-in inputs for object rows', () => {
      const wrapper = mount(SnDynamicInput, {
        props: { modelValue: [{ name: 'x' }, { name: 'y' }] },
        slots: {
          default: '<input class="slot-row" :value="value.name" />',
        },
      })
      expect(rowInputs(wrapper)).toHaveLength(0)
      expect(wrapper.findAll('.slot-row')).toHaveLength(2)
      expect((wrapper.findAll('.slot-row')[1].element as HTMLInputElement).value).toBe('y')
    })

    it('passes scoped value and index to the slot', () => {
      const wrapper = mount(SnDynamicInput, {
        props: { modelValue: ['a', 'b'] },
        slots: {
          default: '<p class="slot-row">{{ index }}:{{ value }}</p>',
        },
      })
      const rows = wrapper.findAll('.slot-row')
      expect(rows[0].text()).toBe('0:a')
      expect(rows[1].text()).toBe('1:b')
    })

    it('still renders row action buttons alongside slot content', async () => {
      const value = ref<RowValue[]>([{ n: 1 }])
      const host = mount({
        setup() {
          return () =>
            h(SnDynamicInput, {
              modelValue: value.value,
              preset: () => null,
              'onUpdate:modelValue': (v: RowValue[]) => { value.value = v },
            }, {
              default: ({ value: row, index }: { value: { n: number } | null, index: number }) =>
                h('span', { class: 'slot-row' }, `r${index}-${row === null ? 'null' : row.n}`),
            })
        },
      })
      await host.find('.sn-dynamic-input__btn--insert').trigger('click')
      expect(value.value).toEqual([{ n: 1 }, null])
      expect(host.findAll('.slot-row')).toHaveLength(2)
    })
  })

  describe('disabled', () => {
    it('disables the row inputs', () => {
      const wrapper = mountInput({ modelValue: ['a'], disabled: true })
      expect(rowInputs(wrapper)[0].attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('sn-dynamic-input--disabled')
    })

    it('disables the action buttons and blocks remove / insert', async () => {
      const wrapper = mountInput({ modelValue: ['a'], disabled: true })
      const removeBtn = wrapper.find('.sn-dynamic-input__btn--remove')
      const insertBtn = wrapper.find('.sn-dynamic-input__btn--insert')
      expect((removeBtn.element as HTMLButtonElement).disabled).toBe(true)
      expect((insertBtn.element as HTMLButtonElement).disabled).toBe(true)
      await removeBtn.trigger('click')
      await insertBtn.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('disables the empty-state create button', () => {
      const wrapper = mountInput({ modelValue: [], disabled: true })
      expect((wrapper.find('.sn-dynamic-input__create').element as HTMLButtonElement).disabled).toBe(true)
    })
  })

  describe('readonly', () => {
    it('sets readonly on the row inputs', () => {
      const wrapper = mountInput({ modelValue: ['a'], readonly: true })
      expect(rowInputs(wrapper)[0].attributes('readonly')).toBeDefined()
      expect(wrapper.classes()).toContain('sn-dynamic-input--readonly')
    })

    it('hides the structural action buttons', () => {
      const wrapper = mountInput({ modelValue: ['a', 'b'], readonly: true })
      expect(wrapper.find('.sn-dynamic-input__actions').exists()).toBe(false)
    })

    it('does not emit on typing into a readonly row', async () => {
      const wrapper = mountInput({ modelValue: ['a'], readonly: true })
      await rowInputs(wrapper)[0].setValue('z')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })
})
