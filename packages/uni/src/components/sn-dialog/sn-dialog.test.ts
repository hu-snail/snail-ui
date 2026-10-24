/**
 * sn-dialog unit tests — uni-end modal dialog (wd-dialog parity, component form).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `type` decides the button set (alert hides cancel unless forced)
 *   - confirm / cancel / close emit the documented payloads
 *   - prompt mode validates through `inputPattern` / `inputValidate`
 *   - `beforeConfirm` can veto a confirm
 *   - `actions` replaces the button row; disabled rows are inert
 *   - `showClose` / `closeOnClickModal` route through `close`
 */

import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SnDialog from './sn-dialog.vue'

describe('sn-dialog', () => {
  it('renders nothing while modelValue is false', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: false } })
    expect(wrapper.find('.sn-dialog__body').exists()).toBe(false)
  })

  it('renders the title and message when open', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, title: '提示', msg: '确定继续吗？' },
    })
    expect(wrapper.find('.sn-dialog__title').text()).toBe('提示')
    expect(wrapper.find('.sn-dialog__msg').text()).toBe('确定继续吗？')
  })

  it('hides the cancel button for type="alert" and shows it for confirm', () => {
    const alert = mount(SnDialog, { props: { modelValue: true, type: 'alert' } })
    expect(alert.find('.sn-dialog__cancel').exists()).toBe(false)
    expect(alert.find('.sn-dialog__confirm').exists()).toBe(true)

    const confirm = mount(SnDialog, { props: { modelValue: true, type: 'confirm' } })
    expect(confirm.find('.sn-dialog__cancel').exists()).toBe(true)
  })

  it('lets showCancelButton override the type default', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'alert', showCancelButton: true },
    })
    expect(wrapper.find('.sn-dialog__cancel').exists()).toBe(true)
  })

  it('uses custom button labels', () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'confirm',
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
      },
    })
    expect(wrapper.find('.sn-dialog__confirm').text()).toBe('删除')
    expect(wrapper.find('.sn-dialog__cancel').text()).toBe('再想想')
  })

  it('emits confirm + update:modelValue + close on confirm', async () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', inputValue: 'abc' },
    })
    await wrapper.find('.sn-dialog__confirm').trigger('tap')
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: 'abc' }])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits cancel on cancel', async () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, type: 'confirm' } })
    await wrapper.find('.sn-dialog__cancel').trigger('tap')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('renders the close button only when showClose is set', async () => {
    const without = mount(SnDialog, { props: { modelValue: true } })
    expect(without.find('.sn-dialog__close').exists()).toBe(false)

    const withClose = mount(SnDialog, { props: { modelValue: true, showClose: true } })
    await withClose.find('.sn-dialog__close').trigger('tap')
    expect(withClose.emitted('close')).toHaveLength(1)
  })

  it('closes on scrim tap only when closeOnClickModal is true', async () => {
    const strict = mount(SnDialog, { props: { modelValue: true } })
    await strict.find('.sn-popup__modal').trigger('tap')
    expect(strict.emitted('close')).toBeUndefined()

    const loose = mount(SnDialog, { props: { modelValue: true, closeOnClickModal: true } })
    await loose.find('.sn-popup__modal').trigger('tap')
    expect(loose.emitted('close')).toHaveLength(1)
  })

  it('renders the prompt input in prompt mode and reports edits', async () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'prompt', inputValue: '初始' },
    })
    expect(wrapper.find('.sn-dialog__input').exists()).toBe(true)
    const inner = wrapper.findComponent({ name: 'SnInput' })
    inner.vm.$emit('update:modelValue', '改过')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:inputValue')?.[0]).toEqual(['改过'])
  })

  it('blocks confirm when the prompt value fails inputPattern', async () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        inputValue: 'abc',
        inputPattern: /^\d+$/,
        inputError: '只能输入数字',
        showErr: true,
      },
    })
    await wrapper.find('.sn-dialog__confirm').trigger('tap')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.find('.sn-dialog__error').text()).toBe('只能输入数字')
  })

  it('uses the message returned by inputValidate on failure', async () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        inputValue: 'abc',
        showErr: true,
        inputValidate: (value) => (String(value).length > 5 ? true : '太短了'),
      },
    })
    await wrapper.find('.sn-dialog__confirm').trigger('tap')
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.find('.sn-dialog__error').text()).toBe('太短了')
  })

  it('confirms when the prompt value passes validation', async () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'prompt', inputValue: '123', inputPattern: /^\d+$/ },
    })
    await wrapper.find('.sn-dialog__confirm').trigger('tap')
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: '123' }])
  })

  it('lets beforeConfirm veto the confirm', async () => {
    const beforeConfirm = vi.fn(() => false)
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', beforeConfirm },
    })
    await wrapper.find('.sn-dialog__confirm').trigger('tap')
    await flushPromises()
    expect(beforeConfirm).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('replaces the button row with custom actions and ignores disabled rows', async () => {
    const actions = [
      { name: '复制' },
      { name: '删除', disabled: true },
    ]
    const wrapper = mount(SnDialog, { props: { modelValue: true, actions } })
    expect(wrapper.findAll('.sn-dialog__action')).toHaveLength(2)
    expect(wrapper.find('.sn-dialog__confirm').exists()).toBe(false)

    await wrapper.findAll('.sn-dialog__action')[1]!.trigger('tap')
    expect(wrapper.emitted('select')).toBeUndefined()

    await wrapper.findAll('.sn-dialog__action')[0]!.trigger('tap')
    expect(wrapper.emitted('select')?.[0]).toEqual([{ item: actions[0], index: 0 }])
  })

  it('renders a status icon for the built-in icon names', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, icon: 'success' } })
    expect(wrapper.find('.sn-dialog__icon').exists()).toBe(true)
    expect(wrapper.find('.sn-dialog__icon svg').exists()).toBe(true)
  })

  it('does not render a status icon for an unknown icon name', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, icon: 'nope' } })
    expect(wrapper.find('.sn-dialog__icon').exists()).toBe(false)
  })

  it('forwards customClass to the popup root and customStyle to the panel', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, customClass: 'my-dialog', customStyle: 'margin: 8px' },
    })
    expect(wrapper.classes()).toContain('sn-dialog')
    expect(wrapper.classes()).toContain('my-dialog')
    expect(wrapper.find('.sn-popup__panel').attributes('style')).toContain('margin: 8px')
  })

  it('applies the action layout class', () => {
    const vertical = mount(SnDialog, {
      props: { modelValue: true, actionLayout: 'vertical', type: 'confirm' },
    })
    expect(vertical.find('.sn-dialog__actions').classes()).toContain('sn-dialog__actions--vertical')
  })
})
