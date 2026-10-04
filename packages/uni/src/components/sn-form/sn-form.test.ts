/**
 * sn-form / sn-form-item unit tests — uni-end form (AUI-MP-004).
 *
 * Mirror of packages/vue-web/src/form/SnForm.test.ts. Same coverage.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import SnForm from './sn-form.vue'
import SnFormItem from './sn-form-item.vue'
import SnInput from '../sn-input/sn-input.vue'
import SnButton from '../sn-button/sn-button.vue'
import type { FormRule } from './sn-form-types'

const App = defineComponent({
  props: ['model', 'rules', 'required'],
  setup(props) {
    const formRef = ref<InstanceType<typeof SnForm> | null>(null)
    return () =>
      h(SnForm, {
        ref: formRef,
        model: props.model,
        rules: props.rules,
      }, {
        default: () => [
          h(SnFormItem, { prop: 'email', label: 'Email', required: props.required }, {
            default: () => h(SnInput, { modelValue: props.model.email, 'onUpdate:modelValue': (v: string) => { props.model.email = v } }),
          }),
          h(SnFormItem, { prop: 'password', label: 'Password' }, {
            default: () => h(SnInput, { modelValue: props.model.password, 'onUpdate:modelValue': (v: string) => { props.model.password = v } }),
          }),
          h(SnButton, {}, { default: () => 'Submit' }),
        ],
      })
  },
})

describe('sn-form', () => {
  it('renders the slot content', () => {
    const model = reactive({ email: '', password: '' })
    const wrapper = mount(App, { props: { model, rules: {} } })
    expect(wrapper.find('.sn-form').exists()).toBe(true)
    expect(wrapper.findAll('.sn-form-item')).toHaveLength(2)
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
    const result = await wrapper.findComponent(SnForm).vm.validate()
    expect(result).toBe(true)
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
    wrapper.findComponent(SnForm).vm.resetFields()
    expect(model.email).toBe('init@x.com')
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
    expect(model.email).toBe('')
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

  it('shows required asterisk on FormItem', () => {
    const model = reactive({ email: '', password: '' })
    const wrapper = mount(App, { props: { model, rules: {}, required: true } })
    expect(wrapper.find('.sn-form-item__required').exists()).toBe(true)
  })
})