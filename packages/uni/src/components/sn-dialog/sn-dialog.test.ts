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

import { describe, it, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import SnDialog from './sn-dialog.vue';
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry';
import { Search } from '../sn-icon/sn-icon-set';

describe('sn-dialog', () => {
  it('renders nothing while modelValue is false', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: false } });
    expect(wrapper.find('.sn-dialog__body').exists()).toBe(false);
  });

  it('renders the title and message when open', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, title: '提示', msg: '确定继续吗？' },
    });
    expect(wrapper.find('.sn-dialog__title').text()).toBe('提示');
    expect(wrapper.find('.sn-dialog__msg').text()).toBe('确定继续吗？');
  });

  it('hides the cancel button for type="alert" and shows it for confirm', () => {
    const alert = mount(SnDialog, { props: { modelValue: true, type: 'alert' } });
    expect(alert.find('.sn-dialog__cancel').exists()).toBe(false);
    expect(alert.find('.sn-dialog__confirm').exists()).toBe(true);

    const confirm = mount(SnDialog, { props: { modelValue: true, type: 'confirm' } });
    expect(confirm.find('.sn-dialog__cancel').exists()).toBe(true);
  });

  it('lets showCancelButton override the type default', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'alert', showCancelButton: true },
    });
    expect(wrapper.find('.sn-dialog__cancel').exists()).toBe(true);
  });

  it('uses custom button labels', () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'confirm',
        confirmButtonText: '删除',
        cancelButtonText: '再想想',
      },
    });
    expect(wrapper.find('.sn-dialog__confirm').text()).toBe('删除');
    expect(wrapper.find('.sn-dialog__cancel').text()).toBe('再想想');
  });

  it('emits confirm + update:modelValue + close on confirm', async () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', inputValue: 'abc' },
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: 'abc' }]);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('emits cancel on cancel', async () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, type: 'confirm' } });
    await wrapper.find('.sn-dialog__cancel').trigger('tap');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('renders the close button only when showClose is set', async () => {
    const without = mount(SnDialog, { props: { modelValue: true } });
    expect(without.find('.sn-dialog__close').exists()).toBe(false);

    const withClose = mount(SnDialog, { props: { modelValue: true, showClose: true } });
    await withClose.find('.sn-dialog__close').trigger('tap');
    expect(withClose.emitted('close')).toHaveLength(1);
  });

  it('closes on scrim tap only when closeOnClickModal is true', async () => {
    const strict = mount(SnDialog, { props: { modelValue: true } });
    await strict.find('.sn-popup__modal').trigger('tap');
    expect(strict.emitted('close')).toBeUndefined();

    const loose = mount(SnDialog, { props: { modelValue: true, closeOnClickModal: true } });
    await loose.find('.sn-popup__modal').trigger('tap');
    expect(loose.emitted('close')).toHaveLength(1);
  });

  it('renders the prompt input in prompt mode and reports edits', async () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'prompt', inputValue: '初始' },
    });
    expect(wrapper.find('.sn-dialog__input').exists()).toBe(true);
    const inner = wrapper.findComponent({ name: 'SnInput' });
    inner.vm.$emit('update:modelValue', '改过');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:inputValue')?.[0]).toEqual(['改过']);
  });

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
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.emitted('confirm')).toBeUndefined();
    expect(wrapper.find('.sn-dialog__error').text()).toBe('只能输入数字');
  });

  it('uses the message returned by inputValidate on failure', async () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        inputValue: 'abc',
        showErr: true,
        inputValidate: (value) => (String(value).length > 5 ? true : '太短了'),
      },
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.emitted('confirm')).toBeUndefined();
    expect(wrapper.find('.sn-dialog__error').text()).toBe('太短了');
  });

  it('confirms when the prompt value passes validation', async () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'prompt', inputValue: '123', inputPattern: /^\d+$/ },
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: '123' }]);
  });

  it('lets beforeConfirm veto the confirm', async () => {
    const beforeConfirm = vi.fn(() => false);
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', beforeConfirm },
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    await flushPromises();
    expect(beforeConfirm).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('confirm')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('replaces the button row with custom actions and ignores disabled rows', async () => {
    const actions = [{ name: '复制' }, { name: '删除', disabled: true }];
    const wrapper = mount(SnDialog, { props: { modelValue: true, actions } });
    expect(wrapper.findAll('.sn-dialog__action')).toHaveLength(2);
    expect(wrapper.find('.sn-dialog__confirm').exists()).toBe(false);

    await wrapper.findAll('.sn-dialog__action')[1]!.trigger('tap');
    expect(wrapper.emitted('select')).toBeUndefined();

    await wrapper.findAll('.sn-dialog__action')[0]!.trigger('tap');
    expect(wrapper.emitted('select')?.[0]).toEqual([{ item: actions[0], index: 0 }]);
  });

  it('renders a status icon for the built-in icon names', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, icon: 'success' } });
    expect(wrapper.find('.sn-dialog__icon').exists()).toBe(true);
    expect(wrapper.find('.sn-dialog__icon svg').exists()).toBe(true);
  });

  it('does not render a status icon for an unknown icon name', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, icon: 'nope' } });
    expect(wrapper.find('.sn-dialog__icon').exists()).toBe(false);
  });

  it('forwards customClass to the popup root and customStyle to the panel', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, customClass: 'my-dialog', customStyle: 'margin: 8px' },
    });
    expect(wrapper.classes()).toContain('sn-dialog');
    expect(wrapper.classes()).toContain('my-dialog');
    expect(wrapper.find('.sn-popup__panel').attributes('style')).toContain('margin: 8px');
  });

  it('applies the action layout class', () => {
    const vertical = mount(SnDialog, {
      props: { modelValue: true, actionLayout: 'vertical', type: 'confirm' },
    });
    expect(vertical.find('.sn-dialog__actions').classes()).toContain(
      'sn-dialog__actions--vertical',
    );
  });

  it('renders the header slot above the body content', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, title: '提示' },
      slots: { header: '<text class="slot-header">自定义头部</text>' },
    });
    expect(wrapper.find('.slot-header').exists()).toBe(true);
  });

  it('renders headerImage as a full-width image', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, headerImage: 'https://example.com/banner.png' },
    });
    const image = wrapper.find('.sn-dialog__header-image');
    expect(image.exists()).toBe(true);
    expect(image.attributes('src')).toBe('https://example.com/banner.png');
  });

  it('lets the image slot provide a custom image area', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, headerImage: 'https://example.com/banner.png' },
      slots: { image: '<text class="slot-image">自定义图</text>' },
    });
    expect(wrapper.find('.slot-image').exists()).toBe(true);
    expect(wrapper.find('.sn-dialog__header-image').exists()).toBe(true);
  });

  it('lets the title slot replace the icon + title block', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, icon: 'success', title: '标题' },
      slots: {
        title: `<template #title="params">
          <text class="slot-title">{{ params.title }}</text>
        </template>`,
      },
    });
    expect(wrapper.find('.slot-title').text()).toBe('标题');
    // The fallback SnIcon is replaced by the slot content.
    expect(wrapper.find('.sn-dialog__icon svg').exists()).toBe(false);
  });

  it('exposes msg / type / input state through the default slot props', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'prompt', msg: '请填写', inputValue: '草稿' },
      slots: {
        default: `<template #default="params">
          <text class="slot-body">{{ params.msg }}|{{ params.type }}|{{ params.inputValue }}</text>
        </template>`,
      },
    });
    expect(wrapper.find('.slot-body').text()).toBe('请填写|prompt|草稿');
    // The built-in msg and prompt field are replaced by the slot.
    expect(wrapper.find('.sn-dialog__msg').exists()).toBe(false);
    expect(wrapper.find('.sn-dialog__field').exists()).toBe(false);
  });

  it('routes the actions slot confirm / cancel / close calls through the dialog', async () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm' },
      slots: {
        actions: `<template #actions="params">
          <text class="slot-cancel" @tap="params.cancel()">取消</text>
          <text class="slot-confirm" @tap="params.confirm()">确认</text>
          <text class="slot-close" @tap="params.close()">关闭</text>
        </template>`,
      },
    });
    await wrapper.find('.slot-cancel').trigger('tap');
    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

    await wrapper.find('.slot-confirm').trigger('tap');
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: '' }]);

    await wrapper.find('.slot-close').trigger('tap');
    // Every close path (cancel, confirm, close) also emits `close` — 3 taps.
    expect(wrapper.emitted('close')).toHaveLength(3);
    // The default button row is replaced.
    expect(wrapper.find('.sn-dialog__confirm').exists()).toBe(false);
  });

  it('applies the text theme to the action row and buttons', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', theme: 'text' },
    });
    expect(wrapper.find('.sn-dialog__actions').classes()).toContain('sn-dialog__actions--text');
    const buttons = wrapper.findAllComponents({ name: 'SnButton' });
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button.props('variant')).toBe('text');
    }
  });

  it('uses confirmButtonProps string as the confirm label', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', confirmButtonProps: '好的' },
    });
    expect(wrapper.find('.sn-dialog__confirm').text()).toBe('好的');
  });

  it('spreads cancelButtonProps object attrs onto the cancel button', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', cancelButtonProps: { disabled: true } },
    });
    const buttons = wrapper.findAllComponents({ name: 'SnButton' });
    const cancel = buttons.find((button) => button.classes().includes('sn-dialog__cancel'));
    expect(cancel).toBeDefined();
    expect(cancel!.props('disabled')).toBe(true);
  });

  it('hides the confirm button when confirmButtonProps is null', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'alert', confirmButtonProps: null },
    });
    expect(wrapper.find('.sn-dialog__confirm').exists()).toBe(false);
  });

  it('hides the cancel button when cancelButtonProps is null even for confirm type', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', cancelButtonProps: null },
    });
    expect(wrapper.find('.sn-dialog__cancel').exists()).toBe(false);
    expect(wrapper.find('.sn-dialog__confirm').exists()).toBe(true);
  });

  it('renders a textarea in prompt mode when textareaProps is populated', async () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        inputValue: '多行内容',
        textareaProps: { placeholder: '请描述问题' },
      },
    });
    const textarea = wrapper.findComponent({ name: 'SnTextarea' });
    expect(textarea.exists()).toBe(true);
    expect(textarea.props('placeholder')).toBe('请描述问题');
    expect(wrapper.findComponent({ name: 'SnInput' }).exists()).toBe(false);

    textarea.vm.$emit('update:modelValue', '改好了');
    await wrapper.vm.$nextTick();
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: '改好了' }]);
  });

  it('forwards inputProps onto the prompt input', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'prompt', inputProps: { placeholder: '请输入姓名' } },
    });
    expect(wrapper.findComponent({ name: 'SnInput' }).props('placeholder')).toBe('请输入姓名');
  });

  it('falls back to inputError when inputValidate returns false', async () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        inputValue: 'abc',
        showErr: true,
        inputError: '校验未通过',
        inputValidate: () => false,
      },
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.emitted('confirm')).toBeUndefined();
    expect(wrapper.find('.sn-dialog__error').text()).toBe('校验未通过');
  });

  it('confirms when inputValidate returns true', async () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        inputValue: 'ok值',
        inputValidate: () => true,
      },
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: 'ok值' }]);
  });

  it('clears a stale validation message as soon as the prompt is edited', async () => {
    const wrapper = mount(SnDialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        inputValue: 'abc',
        inputPattern: /^\d+$/,
        inputError: '只能输入数字',
        showErr: true,
      },
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.find('.sn-dialog__error').exists()).toBe(true);

    wrapper.findComponent({ name: 'SnInput' }).vm.$emit('update:modelValue', '123');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-dialog__error').exists()).toBe(false);
  });

  it('syncs a new inputValue prop into the confirm payload', async () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'prompt', inputValue: '旧值' },
    });
    await wrapper.setProps({ inputValue: '新值' });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: '新值' }]);
  });

  it('serialises confirm taps while an async beforeConfirm is pending, then recovers', async () => {
    let resolveGuard: (value: boolean) => void = () => {};
    const beforeConfirm = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveGuard = resolve;
        }),
    );
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', beforeConfirm },
    });
    const confirm = wrapper.find('.sn-dialog__confirm');

    await confirm.trigger('tap');
    await flushPromises();
    // A second tap inside the pending window is ignored (double-submit guard).
    await confirm.trigger('tap');
    await flushPromises();
    expect(beforeConfirm).toHaveBeenCalledTimes(1);

    resolveGuard(false);
    await flushPromises();
    expect(wrapper.emitted('confirm')).toBeUndefined();

    // The guard released the lock, so the next confirm goes through.
    await confirm.trigger('tap');
    await flushPromises();
    expect(beforeConfirm).toHaveBeenCalledTimes(2);
    resolveGuard(true);
    await flushPromises();
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: '' }]);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('confirms after an async beforeConfirm resolves true', async () => {
    const beforeConfirm = vi.fn(async () => true);
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', beforeConfirm },
    });
    await wrapper.find('.sn-dialog__confirm').trigger('tap');
    await flushPromises();
    expect(wrapper.emitted('confirm')?.[0]).toEqual([{ action: 'confirm', inputValue: '' }]);
  });

  it('forwards zIndex to the popup root', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, zIndex: 123 } });
    expect(wrapper.attributes('style') ?? '').toContain('z-index: 123');
  });

  it('labels the close button for assistive tech', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, showClose: true } });
    const close = wrapper.find('.sn-dialog__close');
    expect(close.attributes('role')).toBe('button');
    expect(close.attributes('aria-label')).toBe('close');
  });

  it('marks enabled custom action rows as buttons that are not disabled', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, actions: [{ name: '红', color: 'red' }, { name: '蓝' }] },
    });
    const rows = wrapper.findAll('.sn-dialog__action');
    expect(rows[0]!.attributes('role')).toBe('button');
    expect(rows[0]!.attributes('aria-disabled')).toBe('false');
    expect(rows[0]!.attributes('style') ?? '').toContain('color: red');
    expect(rows[1]!.attributes('style') ?? '').not.toContain('color:');
  });

  it('accepts the selector and rootPortal parity props without breaking the render', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, selector: 'my-dialog', rootPortal: true },
    });
    expect(wrapper.find('.sn-dialog__body').exists()).toBe(true);
  });

  it('colors the status icon block through iconColor', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, icon: 'success', iconColor: 'red' },
    });
    expect(wrapper.find('.sn-dialog__icon').attributes('style') ?? '').toContain('color: red');
  });

  it('forwards iconProps onto the status icon', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, icon: 'success', iconProps: { size: 24 } },
    });
    // No close button in this mount, so the status icon is the only SnIcon.
    const icon = wrapper.findComponent({ name: 'SnIcon' });
    expect(icon.exists()).toBe(true);
    expect(icon.props('size')).toBe(24);
  });

  it('resolves a registered icon name before the built-in feedback table', () => {
    registerSnIcons({ Search });
    const wrapper = mount(SnDialog, { props: { modelValue: true, icon: 'Search' } });
    expect(wrapper.find('.sn-dialog__icon svg').exists()).toBe(true);
    clearSnIcons();
  });

  it('uses cancelButtonProps string as the cancel label', () => {
    const wrapper = mount(SnDialog, {
      props: { modelValue: true, type: 'confirm', cancelButtonProps: '再想想' },
    });
    expect(wrapper.find('.sn-dialog__cancel').text()).toBe('再想想');
  });

  it('forwards lazyRender to the popup layer', () => {
    const wrapper = mount(SnDialog, { props: { modelValue: true, lazyRender: false } });
    expect(wrapper.findComponent({ name: 'SnPopup' }).props('lazyRender')).toBe(false);
  });
});
