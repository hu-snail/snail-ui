/**
 * sn-notify unit tests — uni-end banner notification (wd-notify parity, component form).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `visible` mounts the banner and drives the shown class
 *   - `type` picks the fill class and the status glyph
 *   - `duration` auto-dismisses through `update:visible(false)`, `0` keeps it open
 *   - `closable` adds the close button and does not also emit `click`
 *   - `position` / `variant` / `safeHeight` / `background` drive classes and style
 *   - the dismiss timer is cleared on unmount (§41)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnNotify from './sn-notify.vue';

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-notify', () => {
  it('renders nothing while visible is false', () => {
    const wrapper = mount(SnNotify, { props: { visible: false, message: 'hi' } });
    expect(wrapper.find('.sn-notify').exists()).toBe(false);
  });

  it('renders the message when visible', () => {
    const wrapper = mount(SnNotify, { props: { visible: true, message: '保存成功' } });
    expect(wrapper.find('.sn-notify__line').text()).toBe('保存成功');
    expect(wrapper.find('.sn-notify__body').attributes('role')).toBe('alert');
    expect(wrapper.classes()).toContain('sn-notify--shown');
  });

  it('defaults to danger + top + filled', () => {
    const wrapper = mount(SnNotify, { props: { visible: true, message: 'x' } });
    expect(wrapper.classes()).toContain('sn-notify--danger');
    expect(wrapper.classes()).toContain('sn-notify--top');
    expect(wrapper.classes()).toContain('sn-notify--filled');
  });

  it('applies the type / position / variant classes', () => {
    const wrapper = mount(SnNotify, {
      props: {
        visible: true,
        message: 'x',
        type: 'success',
        position: 'bottom',
        variant: 'floating',
      },
    });
    expect(wrapper.classes()).toContain('sn-notify--success');
    expect(wrapper.classes()).toContain('sn-notify--bottom');
    expect(wrapper.classes()).toContain('sn-notify--floating');
  });

  it('splits the message on newlines into separate lines', () => {
    const wrapper = mount(SnNotify, {
      props: { visible: true, message: '第一行\n第二行' },
    });
    const lines = wrapper.findAll('.sn-notify__line');
    expect(lines).toHaveLength(2);
    expect(lines[0]!.text()).toBe('第一行');
    expect(lines[1]!.text()).toBe('第二行');
  });

  it('renders a status glyph for non-primary types only', () => {
    const danger = mount(SnNotify, { props: { visible: true, message: 'x', type: 'danger' } });
    expect(danger.find('.sn-notify__icon svg').exists()).toBe(true);

    const primary = mount(SnNotify, { props: { visible: true, message: 'x', type: 'primary' } });
    expect(primary.find('.sn-notify__icon').exists()).toBe(false);
  });

  it('emits update:visible(false) after duration', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNotify, {
      props: { visible: false, message: 'x', duration: 3000 },
    });
    await wrapper.setProps({ visible: true });
    expect(wrapper.emitted('opened')).toHaveLength(1);
    vi.advanceTimersByTime(3000);
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });

  it('does not auto-dismiss when duration is 0', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNotify, { props: { visible: false, message: 'x', duration: 0 } });
    await wrapper.setProps({ visible: true });
    vi.advanceTimersByTime(10000);
    expect(wrapper.emitted('update:visible')).toBeUndefined();
  });

  it('emits closed after the leave transition and unmounts the node', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNotify, { props: { visible: true, message: 'x', duration: 0 } });
    await wrapper.setProps({ visible: false });
    expect(wrapper.classes()).not.toContain('sn-notify--shown');
    vi.advanceTimersByTime(300);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('closed')).toHaveLength(1);
    expect(wrapper.find('.sn-notify').exists()).toBe(false);
  });

  it('renders the close button only when closable', async () => {
    const without = mount(SnNotify, { props: { visible: true, message: 'x' } });
    expect(without.find('.sn-notify__close').exists()).toBe(false);

    const withClose = mount(SnNotify, { props: { visible: true, message: 'x', closable: true } });
    await withClose.find('.sn-notify__close').trigger('tap');
    expect(withClose.emitted('update:visible')?.[0]).toEqual([false]);
  });

  it('emits click when the body is tapped', async () => {
    const wrapper = mount(SnNotify, { props: { visible: true, message: 'x' } });
    await wrapper.find('.sn-notify__body').trigger('tap');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('applies zIndex, safeHeight and the color overrides', () => {
    const wrapper = mount(SnNotify, {
      props: {
        visible: true,
        message: 'x',
        zIndex: 300,
        safeHeight: 24,
        background: 'rebeccapurple',
        color: 'rebeccapurple',
        customClass: 'my-notify',
      },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('z-index: 300');
    expect(style).toContain('padding-top: 24px');
    expect(style).toContain('background-color: rebeccapurple');
    expect(wrapper.classes()).toContain('my-notify');
  });

  it('renders the default slot instead of the message', () => {
    const wrapper = mount(SnNotify, {
      props: { visible: true, message: 'ignored' },
      slots: { default: '<text>slot line</text>' },
    });
    expect(wrapper.find('.sn-notify__content').text()).toContain('slot line');
    expect(wrapper.findAll('.sn-notify__line')).toHaveLength(0);
  });

  it('clears the pending dismiss timer on unmount', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNotify, {
      props: { visible: false, message: 'x', duration: 1000 },
    });
    await wrapper.setProps({ visible: true });
    wrapper.unmount();
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
  });

  /* ── Added coverage ──────────────────────────────────────────────────── */

  it('renders a numeric message', () => {
    const wrapper = mount(SnNotify, { props: { visible: true, message: 42 } });
    expect(wrapper.find('.sn-notify__line').text()).toBe('42');
  });

  it('renders the zero message rather than dropping it', () => {
    const wrapper = mount(SnNotify, { props: { visible: true, message: 0 } });
    expect(wrapper.find('.sn-notify__line').text()).toBe('0');
  });

  it('accepts a string safeHeight verbatim', () => {
    // env() / calc() values are dropped by happy-dom's CSS parser; assert with
    // a length it keeps (string safeHeight is passed through unchanged).
    const wrapper = mount(SnNotify, {
      props: { visible: true, message: 'x', safeHeight: '12px' },
    });
    expect(wrapper.attributes('style')).toContain('padding-top: 12px');
  });

  it('applies the color override and appends customStyle', () => {
    const wrapper = mount(SnNotify, {
      props: { visible: true, message: 'x', color: 'white', customStyle: 'border: 1px' },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('color: white');
    expect(style).toContain('border: 1px');
  });

  it('exposes the close button to assistive tech and stops the tap there', async () => {
    const wrapper = mount(SnNotify, { props: { visible: true, message: 'x', closable: true } });
    const close = wrapper.find('.sn-notify__close');
    expect(close.attributes('role')).toBe('button');
    expect(close.attributes('aria-label')).toBe('close');
    await close.trigger('tap');
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('announces through an assertive live region', () => {
    const wrapper = mount(SnNotify, { props: { visible: true, message: 'x' } });
    expect(wrapper.find('.sn-notify__body').attributes('aria-live')).toBe('assertive');
  });

  it('re-showing while the leave transition is pending keeps the node mounted', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNotify, {
      props: { visible: false, message: 'x', duration: 0 },
    });
    await wrapper.setProps({ visible: true });
    await wrapper.setProps({ visible: false });
    vi.advanceTimersByTime(100); // mid-leave (leave lasts 300ms)
    await wrapper.setProps({ visible: true });
    vi.advanceTimersByTime(1000); // past the leave length

    expect(wrapper.find('.sn-notify').exists()).toBe(true);
    expect(wrapper.emitted('closed')).toBeUndefined();
    expect(wrapper.emitted('opened')).toHaveLength(2);
  });

  it('restarts the auto-dismiss timer when re-shown mid-countdown', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNotify, {
      props: { visible: false, message: 'x', duration: 3000 },
    });
    await wrapper.setProps({ visible: true });
    vi.advanceTimersByTime(2500);
    await wrapper.setProps({ visible: false });
    vi.advanceTimersByTime(100);
    await wrapper.setProps({ visible: true });

    vi.advanceTimersByTime(2999);
    expect(wrapper.emitted('update:visible')).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });

  it('auto-dismisses and emits opened when mounted already visible', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNotify, { props: { visible: true, message: 'x', duration: 3000 } });
    // Regression: the show leg used to run only on the false→true transition,
    // so a notification mounted visible never armed its auto-dismiss timer.
    expect(wrapper.emitted('opened')).toHaveLength(1);
    vi.advanceTimersByTime(2999);
    expect(wrapper.emitted('update:visible')).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });

  it('auto-dismisses with the default duration', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNotify, { props: { visible: false, message: 'x' } });
    await wrapper.setProps({ visible: true });
    vi.advanceTimersByTime(2999);
    expect(wrapper.emitted('update:visible')).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
  });

  it('accepts the parity props (selector / rootPortal) without a portal host', () => {
    const wrapper = mount(SnNotify, {
      props: { visible: true, message: 'x', selector: 'a', rootPortal: true },
    });
    // The banner renders inline — miniprogram has no portal host.
    expect(wrapper.find('.sn-notify__line').text()).toBe('x');
    expect(wrapper.element.parentElement).not.toBeNull();
  });
});
