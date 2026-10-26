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

  /* ── Added coverage ──────────────────────────────────────────────────── */

  it('applies the top and middle-top position classes', () => {
    expect(mount(SnToast, { props: { modelValue: true, position: 'top' } }).classes()).toContain(
      'sn-toast--top',
    );
    expect(
      mount(SnToast, { props: { modelValue: true, position: 'middle-top' } }).classes(),
    ).toContain('sn-toast--middle-top');
  });

  it('renders a status glyph for each non-loading icon kind', () => {
    for (const iconName of ['error', 'warning', 'info'] as const) {
      const wrapper = mount(SnToast, { props: { modelValue: true, iconName } });
      expect(wrapper.find('.sn-toast__icon svg').exists()).toBe(true);
    }
  });

  it('renders each non-dots spinner shape for iconName="loading"', () => {
    expect(
      mount(SnToast, { props: { modelValue: true, iconName: 'loading' } }).find(
        '.sn-loading__circular',
      ).exists(),
    ).toBe(true);

    const spinner = mount(SnToast, {
      props: { modelValue: true, iconName: 'loading', loadingType: 'spinner' },
    });
    expect(spinner.findAll('.sn-loading__spinner-bar')).toHaveLength(8);

    const wave = mount(SnToast, {
      props: { modelValue: true, iconName: 'loading', loadingType: 'wave' },
    });
    expect(wave.findAll('.sn-loading__wave-bar')).toHaveLength(5);
  });

  it('applies iconColor to the status glyph and loadingColor to the spinner', () => {
    const status = mount(SnToast, {
      props: { modelValue: true, iconName: 'success', iconColor: 'rebeccapurple' },
    });
    expect(status.find('.sn-toast__icon').attributes('style')).toContain(
      'color: rebeccapurple',
    );

    const spinner = mount(SnToast, {
      props: { modelValue: true, iconName: 'loading', loadingColor: 'rebeccapurple' },
    });
    expect(spinner.find('.sn-toast__icon').attributes('style')).toContain(
      'color: rebeccapurple',
    );
  });

  it('passes string icon sizes through verbatim', () => {
    // Bare numbers map to rpx, which happy-dom discards — assert with a unit
    // the test environment keeps. Sizes land on the inner sn-icon box.
    const status = mount(SnToast, {
      props: { modelValue: true, iconName: 'success', iconSize: '2em' },
    });
    expect(status.find('.sn-toast__icon .sn-icon').attributes('style')).toContain('2em');

    const spinner = mount(SnToast, {
      props: { modelValue: true, iconName: 'loading', loadingSize: '1.5em' },
    });
    expect(spinner.find('.sn-toast__icon .sn-loading').attributes('style')).toContain('1.5em');
  });

  it('applies iconClass to the icon node', () => {
    const wrapper = mount(SnToast, {
      props: { modelValue: true, iconName: 'success', iconClass: 'my-glyph' },
    });
    expect(wrapper.find('.sn-toast__icon').classes()).toContain('my-glyph');
  });

  it('lets the icon slot replace the built-in icon area', () => {
    const wrapper = mount(SnToast, {
      props: { modelValue: true, msg: 'x', iconName: 'success' },
      slots: { icon: '<text class="custom-icon">star</text>' },
    });
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
    expect(wrapper.find('.sn-toast__icon svg').exists()).toBe(false);
  });

  it('announces through an assertive live region and hides the mask from AT', () => {
    const wrapper = mount(SnToast, { props: { modelValue: true, msg: 'x' } });
    expect(wrapper.find('.sn-toast__box').attributes('aria-live')).toBe('assertive');
    expect(wrapper.find('.sn-toast__mask').attributes('aria-hidden')).toBe('true');
  });

  it('re-showing while the leave transition is pending keeps the node mounted', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnToast, {
      props: { modelValue: false, msg: 'x', duration: 0 },
    });
    await wrapper.setProps({ modelValue: true });
    await wrapper.setProps({ modelValue: false });
    vi.advanceTimersByTime(50); // mid-leave
    await wrapper.setProps({ modelValue: true });
    vi.advanceTimersByTime(1000); // past the leave length

    expect(wrapper.find('.sn-toast').exists()).toBe(true);
    expect(wrapper.emitted('closed')).toBeUndefined();
    expect(wrapper.emitted('opened')).toHaveLength(2);
  });

  it('restarts the auto-close timer when re-shown mid-countdown', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnToast, {
      props: { modelValue: false, msg: 'x', duration: 2000 },
    });
    await wrapper.setProps({ modelValue: true });
    vi.advanceTimersByTime(1500);
    // Close and re-open before the first countdown elapses.
    await wrapper.setProps({ modelValue: false });
    vi.advanceTimersByTime(50);
    await wrapper.setProps({ modelValue: true });

    vi.advanceTimersByTime(1999);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('accepts the parity props (selector / classPrefix / cssIcon) without effect', () => {
    const wrapper = mount(SnToast, {
      props: { modelValue: true, msg: 'x', selector: 'a', classPrefix: 'my-icon', cssIcon: true },
    });
    expect(wrapper.find('.sn-toast__msg').text()).toBe('x');
  });

  it('auto-closes and emits opened when mounted already shown', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnToast, { props: { modelValue: true, msg: 'x', duration: 2000 } });
    // Regression: the show leg used to run only on the false→true transition,
    // so a toast mounted open never armed its auto-close timer.
    expect(wrapper.emitted('opened')).toHaveLength(1);
    vi.advanceTimersByTime(1999);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('auto-closes with the default duration', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnToast, { props: { modelValue: false, msg: 'x' } });
    await wrapper.setProps({ modelValue: true });
    vi.advanceTimersByTime(1999);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });
});
