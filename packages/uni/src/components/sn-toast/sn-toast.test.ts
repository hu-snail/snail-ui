/**
 * sn-toast unit tests — uni-end transient message (wd-toast parity, component form).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `modelValue` mounts / unmounts the node and drives the visible state
 *   - `duration` auto-closes through `update:modelValue(false)`, `0` keeps it open
 *   - `iconName` picks a status glyph or the spinner; `direction` / `position`
 *     drive the class surface
 *   - `cover` renders the blocking scrim
 *   - the auto-close timer is cleared on unmount (§41)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnToast from './sn-toast.vue';

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-toast', () => {
  it('renders nothing while modelValue is false', () => {
    const wrapper = mount(SnToast, { props: { modelValue: false, msg: 'hi' } });
    expect(wrapper.find('.sn-toast').exists()).toBe(false);
  });

  it('renders the message when shown', () => {
    const wrapper = mount(SnToast, { props: { modelValue: true, msg: '保存成功' } });
    expect(wrapper.find('.sn-toast__msg').text()).toBe('保存成功');
    expect(wrapper.find('.sn-toast__box').attributes('role')).toBe('alert');
  });

  it('defaults to the middle position and horizontal direction', () => {
    const wrapper = mount(SnToast, { props: { modelValue: true, msg: 'x' } });
    expect(wrapper.classes()).toContain('sn-toast--middle');
    expect(wrapper.find('.sn-toast__box').classes()).toContain('sn-toast__box--horizontal');
  });

  it('applies the position and direction classes', () => {
    const wrapper = mount(SnToast, {
      props: { modelValue: true, msg: 'x', position: 'bottom', direction: 'vertical' },
    });
    expect(wrapper.classes()).toContain('sn-toast--bottom');
    expect(wrapper.find('.sn-toast__box').classes()).toContain('sn-toast__box--vertical');
  });

  it('renders a status glyph for iconName="success"', () => {
    const wrapper = mount(SnToast, {
      props: { modelValue: true, msg: 'ok', iconName: 'success' },
    });
    expect(wrapper.find('.sn-toast__icon svg').exists()).toBe(true);
  });

  it('renders no icon when iconName is empty', () => {
    const wrapper = mount(SnToast, { props: { modelValue: true, msg: 'x' } });
    expect(wrapper.find('.sn-toast__icon').exists()).toBe(false);
  });

  it('renders the spinner for iconName="loading"', () => {
    const wrapper = mount(SnToast, {
      props: { modelValue: true, msg: '加载中', iconName: 'loading', loadingType: 'dots' },
    });
    expect(wrapper.find('.sn-toast__icon').exists()).toBe(true);
    expect(wrapper.findAll('.sn-loading__dot')).toHaveLength(3);
  });

  it('emits update:modelValue(false) after duration', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnToast, {
      props: { modelValue: false, msg: 'x', duration: 2000 },
    });
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.emitted('opened')).toHaveLength(1);
    vi.advanceTimersByTime(2000);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('does not auto-close when duration is 0', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnToast, { props: { modelValue: false, msg: 'x', duration: 0 } });
    await wrapper.setProps({ modelValue: true });
    vi.advanceTimersByTime(10000);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('emits closed after the leave transition', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnToast, { props: { modelValue: true, msg: 'x', duration: 0 } });
    await wrapper.setProps({ modelValue: false });
    expect(wrapper.find('.sn-toast').exists()).toBe(true);
    vi.advanceTimersByTime(200);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('closed')).toHaveLength(1);
    expect(wrapper.find('.sn-toast').exists()).toBe(false);
  });

  it('renders the blocking scrim only when cover is set', () => {
    const plain = mount(SnToast, { props: { modelValue: true, msg: 'x' } });
    expect(plain.classes()).not.toContain('sn-toast--cover');

    const cover = mount(SnToast, { props: { modelValue: true, msg: 'x', cover: true } });
    expect(cover.classes()).toContain('sn-toast--cover');
  });

  it('emits click when the box is tapped', async () => {
    const wrapper = mount(SnToast, { props: { modelValue: true, msg: 'x' } });
    await wrapper.find('.sn-toast__box').trigger('tap');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('renders the default slot instead of msg', () => {
    const wrapper = mount(SnToast, {
      props: { modelValue: true, msg: 'ignored' },
      slots: { default: '<text>slot text</text>' },
    });
    expect(wrapper.find('.sn-toast__msg').text()).toContain('slot text');
  });

  it('applies zIndex and customClass / customStyle', () => {
    const wrapper = mount(SnToast, {
      props: {
        modelValue: true,
        msg: 'x',
        zIndex: 300,
        customClass: 'my-toast',
        customStyle: 'margin: 8px',
      },
    });
    expect(wrapper.attributes('style')).toContain('z-index: 300');
    expect(wrapper.classes()).toContain('my-toast');
    expect(wrapper.find('.sn-toast__box').attributes('style')).toContain('margin: 8px');
  });

  it('clears the pending auto-close timer on unmount', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnToast, {
      props: { modelValue: false, msg: 'x', duration: 1000 },
    });
    await wrapper.setProps({ modelValue: true });
    wrapper.unmount();
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
  });
});
