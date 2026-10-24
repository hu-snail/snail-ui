/**
 * sn-textarea unit tests — uni-end multi-line input (AUI-MP-006).
 *
 * Behaviour only (AGENTS.md §46): every assertion checks what a consumer
 * can observe — emitted events, rendered attributes, class hooks. No rpx
 * numbers in assertions (happy-dom drops lengths it cannot parse).
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnTextarea from './sn-textarea.vue'

describe('sn-textarea', () => {
  describe('controlled value', () => {
    it('renders the modelValue in the native textarea', () => {
      const wrapper = mount(SnTextarea, { props: { modelValue: 'hello' } })
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('hello')
    })

    it('emits update:modelValue on input', async () => {
      const wrapper = mount(SnTextarea, { props: { modelValue: '' } })
      await wrapper.find('textarea').setValue('hi')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hi'])
    })

    it('emits input with the raw value and the native event', async () => {
      const wrapper = mount(SnTextarea, { props: { modelValue: '' } })
      await wrapper.find('textarea').setValue('abc')
      const payload = wrapper.emitted('input')?.at(-1)
      expect(payload?.[0]).toBe('abc')
      expect(payload?.[1]).toBeInstanceOf(Event)
    })

    it('emits change on the native change event', async () => {
      const wrapper = mount(SnTextarea, { props: { modelValue: '' } })
      await wrapper.find('textarea').setValue('committed')
      await wrapper.find('textarea').trigger('change')
      expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe('committed')
    })

    it('works uncontrolled — emits without a bound modelValue', async () => {
      const wrapper = mount(SnTextarea)
      await wrapper.find('textarea').setValue('typed')
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['typed'])
    })

    it('renders numeric modelValue as a string', () => {
      const wrapper = mount(SnTextarea, { props: { modelValue: 42 } })
      expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('42')
    })
  })

  describe('focus / blur', () => {
    it('emits focus and blur', async () => {
      const wrapper = mount(SnTextarea)
      await wrapper.find('textarea').trigger('focus')
      await wrapper.find('textarea').trigger('blur')
      expect(wrapper.emitted('focus')).toHaveLength(1)
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('emits confirm with the current value', async () => {
      const wrapper = mount(SnTextarea, { props: { modelValue: 'done' } })
      await wrapper.find('textarea').trigger('confirm')
      expect(wrapper.emitted('confirm')?.at(-1)).toEqual(['done'])
    })

    it('re-emits linechange and keyboardheightchange', async () => {
      const wrapper = mount(SnTextarea)
      await wrapper.find('textarea').trigger('linechange')
      await wrapper.find('textarea').trigger('keyboardheightchange')
      expect(wrapper.emitted('linechange')).toHaveLength(1)
      expect(wrapper.emitted('keyboardheightchange')).toHaveLength(1)
    })
  })

  describe('disabled / readonly', () => {
    it('applies the disabled attribute and class', () => {
      const wrapper = mount(SnTextarea, { props: { disabled: true } })
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('sn-textarea--disabled')
    })

    it('applies the readonly attribute and class', () => {
      const wrapper = mount(SnTextarea, { props: { readonly: true } })
      expect(wrapper.find('textarea').attributes('readonly')).toBeDefined()
      expect(wrapper.classes()).toContain('sn-textarea--readonly')
    })

    it('does not emit update:modelValue while disabled', async () => {
      const wrapper = mount(SnTextarea, { props: { disabled: true, modelValue: '' } })
      await wrapper.find('textarea').setValue('nope')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('does not emit update:modelValue while readonly', async () => {
      const wrapper = mount(SnTextarea, { props: { readonly: true, modelValue: '' } })
      await wrapper.find('textarea').setValue('nope')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('blocks clear while disabled', async () => {
      const wrapper = mount(SnTextarea, {
        props: { clearable: true, disabled: true, modelValue: 'x' },
      })
      expect(wrapper.find('.sn-textarea__clear').exists()).toBe(false)
    })

    it('sets aria-disabled / aria-readonly', () => {
      const wrapper = mount(SnTextarea, { props: { disabled: true, readonly: true } })
      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('aria-disabled')).toBe('true')
      expect(textarea.attributes('aria-readonly')).toBe('true')
    })
  })

  describe('placeholder', () => {
    it('defaults to wd-textarea placeholder text', () => {
      const wrapper = mount(SnTextarea)
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('请输入...')
    })

    it('forwards placeholderStyle and placeholderClass', () => {
      const wrapper = mount(SnTextarea, {
        props: { placeholderStyle: 'color: red;', placeholderClass: 'ph' },
      })
      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('placeholder-style')).toBe('color: red;')
      expect(textarea.attributes('placeholder-class')).toBe('ph')
      expect(textarea.classes()).toContain('ph')
    })
  })

  describe('maxlength / counter', () => {
    it('defaults maxlength to -1 (unlimited)', () => {
      const wrapper = mount(SnTextarea)
      expect(wrapper.find('textarea').attributes('maxlength')).toBe('-1')
    })

    it('forwards maxlength', () => {
      const wrapper = mount(SnTextarea, { props: { maxlength: 200 } })
      expect(wrapper.find('textarea').attributes('maxlength')).toBe('200')
    })

    it('shows the counter when showWordLimit and a limit are set', () => {
      const wrapper = mount(SnTextarea, {
        props: { showWordLimit: true, maxlength: 140, modelValue: 'hi' },
      })
      const count = wrapper.find('.sn-textarea__count')
      expect(count.exists()).toBe(true)
      expect(count.text()).toContain('2')
      expect(count.text()).toContain('140')
    })

    it('hides the counter when showWordLimit is set but maxlength is -1', () => {
      const wrapper = mount(SnTextarea, {
        props: { showWordLimit: true, modelValue: 'hi' },
      })
      expect(wrapper.find('.sn-textarea__count').exists()).toBe(false)
    })

    it('renders a custom counter slot', () => {
      const wrapper = mount(SnTextarea, {
        props: { showWordLimit: true, maxlength: 10, modelValue: 'abc' },
        slots: { count: '<view data-testid="count">custom</view>' },
      })
      expect(wrapper.find('[data-testid="count"]').exists()).toBe(true)
    })
  })

  describe('clearable', () => {
    it('renders the clear button when there is a value', () => {
      const wrapper = mount(SnTextarea, { props: { clearable: true, modelValue: 'x' } })
      expect(wrapper.find('.sn-textarea__clear').exists()).toBe(true)
    })

    it('hides the clear button when the value is empty', () => {
      const wrapper = mount(SnTextarea, { props: { clearable: true, modelValue: '' } })
      expect(wrapper.find('.sn-textarea__clear').exists()).toBe(false)
    })

    it('emits clear and resets the value when tapped', async () => {
      const wrapper = mount(SnTextarea, { props: { clearable: true, modelValue: 'abc' } })
      await wrapper.find('.sn-textarea__clear-btn').trigger('tap')
      expect(wrapper.emitted('clear')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    })

    it('only shows the clear button while focused with clearTrigger="focus"', async () => {
      const wrapper = mount(SnTextarea, {
        props: { clearable: true, clearTrigger: 'focus', modelValue: 'x' },
      })
      expect(wrapper.find('.sn-textarea__clear').exists()).toBe(false)
      await wrapper.find('textarea').trigger('focus')
      expect(wrapper.find('.sn-textarea__clear').exists()).toBe(true)
    })
  })

  describe('error state', () => {
    it('adds the error class and aria-invalid', () => {
      const wrapper = mount(SnTextarea, { props: { error: true } })
      expect(wrapper.classes()).toContain('sn-textarea--error')
      expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
    })

    it('omits aria-invalid when not in error', () => {
      const wrapper = mount(SnTextarea)
      expect(wrapper.find('textarea').attributes('aria-invalid')).toBeUndefined()
    })
  })

  describe('compact / autoHeight / prefix', () => {
    it('adds the compact class only when compact is true', () => {
      expect(mount(SnTextarea, { props: { compact: true } }).classes())
        .toContain('sn-textarea--compact')
      expect(mount(SnTextarea).classes()).not.toContain('sn-textarea--compact')
    })

    it('forwards auto-height and auto-focus to the native textarea', () => {
      const wrapper = mount(SnTextarea, { props: { autoHeight: true, autoFocus: true } })
      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('auto-height')).toBe('true')
      expect(textarea.attributes('auto-focus')).toBe('true')
      expect(wrapper.classes()).toContain('sn-textarea--auto-height')
    })

    it('renders the prefix slot', () => {
      const wrapper = mount(SnTextarea, {
        slots: { prefix: '<view data-testid="prefix">#</view>' },
      })
      expect(wrapper.find('[data-testid="prefix"]').exists()).toBe(true)
      expect(wrapper.classes()).toContain('sn-textarea--with-prefix')
    })

    it('renders a registry-resolved prefixIcon through SnIcon', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry')
      const { Edit } = await import('../sn-icon/sn-icon-set')
      registerSnIcons({ Edit })
      const wrapper = mount(SnTextarea, { props: { prefixIcon: 'Edit' } })
      expect(wrapper.find('.sn-textarea__prefix .sn-icon').exists()).toBe(true)
      clearSnIcons()
    })
  })

  describe('MP-only runtime attributes', () => {
    it('forwards the soft-keyboard hints', () => {
      const wrapper = mount(SnTextarea, {
        props: {
          confirmType: 'send',
          confirmHold: true,
          showConfirmBar: false,
          adjustPosition: false,
          disableDefaultPadding: true,
          holdKeyboard: true,
          ignoreCompositionEvent: false,
          enableNative: false,
          cursorSpacing: 20,
          fixed: true,
        },
      })
      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('confirm-type')).toBe('send')
      expect(textarea.attributes('confirm-hold')).toBe('true')
      expect(textarea.attributes('show-confirm-bar')).toBe('false')
      expect(textarea.attributes('adjust-position')).toBe('false')
      expect(textarea.attributes('disable-default-padding')).toBe('true')
      expect(textarea.attributes('hold-keyboard')).toBe('true')
      expect(textarea.attributes('ignore-composition-event')).toBe('false')
      expect(textarea.attributes('enable-native')).toBe('false')
      expect(textarea.attributes('cursor-spacing')).toBe('20')
      expect(textarea.attributes('fixed')).toBe('true')
    })

    it('forwards cursor / selection-* only when set', () => {
      const set = mount(SnTextarea, {
        props: { cursor: 2, selectionStart: 1, selectionEnd: 4 },
      })
      const textarea = set.find('textarea')
      expect(textarea.attributes('cursor')).toBe('2')
      expect(textarea.attributes('selection-start')).toBe('1')
      expect(textarea.attributes('selection-end')).toBe('4')

      const unset = mount(SnTextarea).find('textarea')
      expect(unset.attributes('cursor')).toBeUndefined()
      expect(unset.attributes('selection-start')).toBeUndefined()
      expect(unset.attributes('selection-end')).toBeUndefined()
    })

    it('forwards inputmode', () => {
      const wrapper = mount(SnTextarea, { props: { inputmode: 'numeric' } })
      expect(wrapper.find('textarea').attributes('inputmode')).toBe('numeric')
    })
  })

  describe('root forwarding', () => {
    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnTextarea, {
        props: { customClass: 'my-textarea', customStyle: 'margin: 8px;' },
      })
      expect(wrapper.classes()).toContain('my-textarea')
      expect(wrapper.attributes('style')).toContain('margin: 8px')
    })

    it('forwards customTextareaClass to the native element', () => {
      const wrapper = mount(SnTextarea, { props: { customTextareaClass: 'native-x' } })
      expect(wrapper.find('textarea').classes()).toContain('native-x')
    })

    it('emits click on the root', async () => {
      const wrapper = mount(SnTextarea)
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })
})
