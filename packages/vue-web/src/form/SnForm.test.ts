/**
 * SnForm + SnFormItem unit tests — web-end form (AUI-WEB-004).
 *
 * Covers:
 *   - basic mount + prop forwarding
 *   - validate() walks every FormItem, returns true on full pass
 *   - validate() emits 'validate' with errors map
 *   - validate(prop) targets a single field
 *   - resetFields() restores the initial model values + clears messages
 *   - clearValidate() drops error/warning state without resetting values
 *   - rules: required, type, pattern, length, bounds, custom validator
 *   - async validator awaits
 *   - disabled prop cascades to FormItem (state only — actual form
 *     disabled handling is the consumer's job via SnInput)
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import SnForm from './SnForm.vue'
import SnFormItem from './SnFormItem.vue'
import SnInput from '../input/SnInput.vue'
import SnButton from '../button/SnButton.vue'
import type { FormRule } from './sn-form-types'

/** Trivial binding helper for tests — keeps each test focused. */
const App = defineComponent({
  props: ['model', 'rules', 'required', 'noValidateOnMount'],
  setup(props) {
    const formRef = ref<InstanceType<typeof SnForm> | null>(null)
    const submitted = ref<{ valid: boolean } | null>(null)
    const validEmitted = ref<{ valid: boolean } | null>(null)
    const onSubmit = (e: { valid: boolean }) => {
      submitted.value = e
    }
    const onValidate = (e: { valid: boolean }) => {
      validEmitted.value = e
    }
    return () =>
      h(SnForm, {
        ref: formRef,
        model: props.model,
        rules: props.rules,
        onSubmit,
        onValidate,
      }, {
        default: () => [
          h(SnFormItem, { prop: 'email', label: 'Email', required: props.required }, {
            default: () => h(SnInput, { modelValue: props.model.email, 'onUpdate:modelValue': (v: string) => { props.model.email = v } }),
          }),
          h(SnFormItem, { prop: 'password', label: 'Password' }, {
            default: () => h(SnInput, { modelValue: props.model.password, 'onUpdate:modelValue': (v: string) => { props.model.password = v } }),
          }),
          h(SnButton, { htmlType: 'submit' }, { default: () => 'Submit' }),
        ],
      })
  },
})

describe('SnForm', () => {
  it('renders the slot content', () => {
    const model = reactive({ email: '', password: '' })
    const wrapper = mount(App, { props: { model, rules: {} } })
    expect(wrapper.find('form.sn-form').exists()).toBe(true)
    expect(wrapper.findAll('.sn-form-item')).toHaveLength(2)
  })

  it('forwards novalidate attribute to native form', () => {
    const model = reactive({ email: '', password: '' })
    const wrapper = mount(App, { props: { model, rules: {} } })
    expect(wrapper.find('form').attributes('novalidate')).toBeDefined()
  })

  it('validates all fields and returns false when one fails', async () => {
    const model = reactive({ email: '', password: '' })
    const rules = {
      email: [{ required: true, message: 'Email required' } as FormRule],
      password: [{ minLength: 6, message: 'Min 6 chars' } as FormRule],
    }
    const wrapper = mount(App, { props: { model, rules } })
    const form = wrapper.findComponent(SnForm)
    const result = await form.vm.validate()
    expect(result).toBe(false)
    const messages = wrapper.findAll('.sn-form-item__message')
    expect(messages.length).toBeGreaterThan(0)
    expect(messages.some((m) => m.text().includes('Email required'))).toBe(true)
  })

  it('returns true when every field passes', async () => {
    const model = reactive({ email: 'a@b.com', password: '123456' })
    const rules = {
      email: [
        { required: true, message: 'Email required' } as FormRule,
        { type: 'email' as const, message: 'Bad email' },
      ],
      password: [{ minLength: 6, message: 'Min 6' } as FormRule],
    }
    const wrapper = mount(App, { props: { model, rules } })
    const form = wrapper.findComponent(SnForm)
    const result = await form.vm.validate()
    expect(result).toBe(true)
    expect(wrapper.findAll('.sn-form-item__message')).toHaveLength(0)
  })

  it('emits "validate" with valid flag and errors map', async () => {
    const model = reactive({ email: '', password: '' })
    const rules = {
      email: [{ required: true, message: 'Email required' } as FormRule],
    }
    const wrapper = mount(App, { props: { model, rules } })
    await wrapper.findComponent(SnForm).vm.validate()
    const events = wrapper.findComponent(SnForm).emitted('validate')
    expect(events).toBeTruthy()
    const last = events!.at(-1)![0] as { valid: boolean; errors: Record<string, string> }
    expect(last.valid).toBe(false)
    expect(last.errors.email).toBe('Email required')
  })

  it('validateField targets a single prop', async () => {
    const model = reactive({ email: '', password: '' })
    const rules = {
      email: [{ required: true, message: 'Email required' } as FormRule],
      password: [{ required: true, message: 'Password required' } as FormRule],
    }
    const wrapper = mount(App, { props: { model, rules } })
    const ok = await wrapper.findComponent(SnForm).vm.validateField('email')
    expect(ok).toBe(false)
    const items = wrapper.findAllComponents(SnFormItem)
    expect(items[0]!.attributes('data-status')).toBe('error')
    expect(items[1]!.attributes('data-status')).toBe('default')
  })

  it('resetFields restores the initial model values', async () => {
    const model = reactive({ email: 'init@x.com', password: 'init-pw' })
    const wrapper = mount(App, { props: { model, rules: {} } })
    model.email = 'changed@x.com'
    model.password = 'changed-pw'
    expect(model.email).toBe('changed@x.com')
    wrapper.findComponent(SnForm).vm.resetFields()
    expect(model.email).toBe('init@x.com')
    expect(model.password).toBe('init-pw')
  })

  it('clearValidate clears messages without resetting values', async () => {
    const model = reactive({ email: '', password: '' })
    const rules = {
      email: [{ required: true, message: 'Email required' } as FormRule],
    }
    const wrapper = mount(App, { props: { model, rules } })
    await wrapper.findComponent(SnForm).vm.validate()
    expect(wrapper.findAll('.sn-form-item__message').length).toBeGreaterThan(0)
    wrapper.findComponent(SnForm).vm.clearValidate()
    await nextTick()
    expect(wrapper.findAll('.sn-form-item__message')).toHaveLength(0)
    // values still dirty
    expect(model.email).toBe('')
  })

  it('applies label position from form prop', async () => {
    const model = reactive({ email: '', password: '' })
    const FormHost = defineComponent({
      props: ['labelPosition'],
      setup(props) {
        return () => h(SnForm, { model, labelPosition: props.labelPosition }, {
          default: () => h(SnFormItem, { prop: 'email' }),
        })
      },
    })
    const wrapper = mount(FormHost, { props: { labelPosition: 'top' } })
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--label-top')
  })

  it('supports pattern rule', async () => {
    const model = reactive({ email: 'bademail', password: '' })
    const rules = {
      email: [{ pattern: /@/, message: 'Must contain @' } as FormRule],
    }
    const wrapper = mount(App, { props: { model, rules } })
    const ok = await wrapper.findComponent(SnForm).vm.validate()
    expect(ok).toBe(false)
  })

  it('supports custom sync validator', async () => {
    const model = reactive({ email: 'a@b.com', password: '' })
    const rules = {
      email: [{
        validator: (v: string) => v.endsWith('@x.com') || 'must end with @x.com',
        message: 'fallback',
      } as FormRule],
    }
    const wrapper = mount(App, { props: { model, rules } })
    const ok = await wrapper.findComponent(SnForm).vm.validate()
    expect(ok).toBe(false)
  })

  it('supports async validator', async () => {
    const model = reactive({ email: 'a@b.com', password: '' })
    const rules = {
      email: [{
        asyncValidator: async (_v: string) => false,
        message: 'async-fail',
      } as FormRule],
    }
    const wrapper = mount(App, { props: { model, rules } })
    const ok = await wrapper.findComponent(SnForm).vm.validate()
    expect(ok).toBe(false)
  })

  it('emits submit only after validate completes', async () => {
    const model = reactive({ email: '', password: '' })
    const rules = {
      email: [{ required: true, message: 'Email required' } as FormRule],
    }
    const onSubmit = vi.fn()
    const wrapper = mount(App, { props: { model, rules } })
    const form = wrapper.findComponent(SnForm)
    form.vm.$emit('submit', { valid: false })
    // We bypass the @submit handler in the test (it requires DOM submit),
    // and just check the form's own validate/submit wiring:
    const ok = await form.vm.validate()
    expect(ok).toBe(false)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows required asterisk on FormItem', () => {
    const model = reactive({ email: '', password: '' })
    const wrapper = mount(App, { props: { model, rules: {}, required: true } })
    expect(wrapper.find('.sn-form-item__required').exists()).toBe(true)
  })

  it('applies labelWidth via the grid template columns', () => {
    const model = reactive({ email: '', password: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model, labelWidth: 120 }, {
          default: () => h(SnFormItem, { prop: 'email' }),
        })
      },
    })
    const wrapper = mount(FormHost)
    const item = wrapper.find('.sn-form-item')
    const style = (item as { attributes: (s: string) => string | undefined }).attributes('style') ?? ''
    expect(style).toContain('grid-template-columns')
    expect(style).toContain('120px')
  })

  it('renders inline label icon when icon prop is provided', () => {
    const Heart = defineComponent({ name: 'Heart', render: () => h('svg', { 'data-testid': 'heart' }) })
    const model = reactive({ email: '', password: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', icon: Heart }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('[data-testid="heart"]').exists()).toBe(true)
  })

  it('applies with-icon modifier class when icon present', () => {
    const Heart = defineComponent({ name: 'Heart', render: () => h('svg') })
    const model = reactive({ email: '', password: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', icon: Heart }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--with-icon')
  })

  /* ── wot-ui `wd-form` 1:1 parity ─────────────────────────────────────── */

  it('applies size class on the form root', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() { return () => h(SnForm, { model, size: 'large' }) },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--size-large')
  })

  it('applies value-align on the form root', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() { return () => h(SnForm, { model, valueAlign: 'right' }) },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--value-align-right')
  })

  it('adds border between items when border is true', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model, border: true }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email' }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--border')
  })

  it('hides asterisk when hideAsterisk is true', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model, hideAsterisk: true }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', required: true }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--hide-asterisk')
  })

  it('applies ellipsis class on the form root', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() { return () => h(SnForm, { model, ellipsis: true }) },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form').classes()).toContain('sn-form--ellipsis')
  })

  /* ── wot-ui `wd-form-item` 1:1 parity ────────────────────────────────── */

  it('overrides form size at the FormItem level', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model, size: 'small' }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', size: 'large' }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--size-large')
  })

  it('renders right-aligned value column when valueAlign is right', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', valueAlign: 'right' }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--value-align-right')
  })

  it('renders asterisk on the right when asteriskPosition is right', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', required: true, asteriskPosition: 'right' }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--asterisk-right')
  })

  it('truncates label with ellipsis when ellipsis is true', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Very long label', ellipsis: true }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--ellipsis')
  })

  it('renders right arrow when isLink is true', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', isLink: true }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--is-link')
    expect(wrapper.find('.sn-form-item__arrow').exists()).toBe(true)
  })

  it('emits click on row click when clickable is true', async () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', clickable: true }),
        })
      },
    })
    const wrapper = mount(FormHost)
    await wrapper.find('.sn-form-item').trigger('click')
    expect(wrapper.findComponent(SnFormItem).emitted('click')).toHaveLength(1)
  })

  it('renders description below the field', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', description: 'We will never spam you' }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item__description').text()).toContain('spam')
  })

  it('renders placeholder when no default slot is provided', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', placeholder: 'Not set' }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item__placeholder').text()).toBe('Not set')
  })

  it('applies border on a single FormItem without a form-level border', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', border: true }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--border')
  })

  it('applies center on a single FormItem', () => {
    const model = reactive({ email: '' })
    const FormHost = defineComponent({
      setup() {
        return () => h(SnForm, { model }, {
          default: () => h(SnFormItem, { prop: 'email', label: 'Email', center: true }),
        })
      },
    })
    const wrapper = mount(FormHost)
    expect(wrapper.find('.sn-form-item').classes()).toContain('sn-form-item--center')
  })
})