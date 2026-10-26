/**
 * sn-notice-bar unit tests — uni-end notice strip (wd-notice-bar parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `text` accepts a string or an array; empty text renders nothing
 *   - `type` drives the tint class and the fallback glyph
 *   - `scrollable` + `direction` pick marquee / static / vertical rendering
 *   - `closable` hides the strip and emits `close`
 *   - tapping the body emits `click` with `{ text, index }`
 *   - `wrapable` / `color` / `backgroundColor` land on class + style
 *   - the vertical rotation timer is cleared on unmount (§41)
 *
 * Untestable in happy-dom: the horizontal marquee itself — happy-dom does not
 * run CSS keyframe animations, so the actual scroll position / visual motion
 * cannot be observed; the cycle is asserted through the `--sn-notice-bar-*`
 * custom properties that drive it.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnNoticeBar from './sn-notice-bar.vue';
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry';

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-notice-bar', () => {
  it('renders nothing when text is empty', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: '' } });
    expect(wrapper.find('.sn-notice-bar').exists()).toBe(false);
  });

  it('renders the text and defaults to warning + horizontal marquee', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: '系统将在今晚维护' } });
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('系统将在今晚维护');
    expect(wrapper.classes()).toContain('sn-notice-bar--warning');
    expect(wrapper.find('.sn-notice-bar__marquee').exists()).toBe(true);
    expect(wrapper.attributes('role')).toBe('marquee');
  });

  it('applies the type class and its fallback glyph', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', type: 'danger' } });
    expect(wrapper.classes()).toContain('sn-notice-bar--danger');
    expect(wrapper.find('.sn-notice-bar__prefix svg').exists()).toBe(true);
  });

  it('renders a static line when scrollable is false', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', scrollable: false } });
    expect(wrapper.find('.sn-notice-bar__marquee').exists()).toBe(false);
    expect(wrapper.find('.sn-notice-bar__text').exists()).toBe(true);
    expect(wrapper.attributes('aria-live')).toBe('polite');
  });

  it('adds the wrapable class only when scrollable is false', () => {
    const wrapped = mount(SnNoticeBar, {
      props: { text: 'x', scrollable: false, wrapable: true },
    });
    expect(wrapped.classes()).toContain('sn-notice-bar--wrapable');

    const marquee = mount(SnNoticeBar, { props: { text: 'x', wrapable: true } });
    expect(marquee.classes()).not.toContain('sn-notice-bar--wrapable');
  });

  it('renders the vertical mode with one line at a time', () => {
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['第一条', '第二条'], direction: 'vertical' },
    });
    expect(wrapper.find('.sn-notice-bar__vertical').exists()).toBe(true);
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('第一条');
  });

  it('rotates the vertical lines and emits next', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['第一条', '第二条'], direction: 'vertical', speed: 50 },
    });
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('next')).toBeTruthy();
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('第二条');
  });

  it('does not rotate when scrollable is false', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['第一条', '第二条'], direction: 'vertical', scrollable: false },
    });
    vi.advanceTimersByTime(20000);
    expect(wrapper.emitted('next')).toBeUndefined();
  });

  it('closes on the close button and emits close', async () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', closable: true } });
    expect(wrapper.find('.sn-notice-bar__close').exists()).toBe(true);
    await wrapper.find('.sn-notice-bar__close').trigger('tap');
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.find('.sn-notice-bar').exists()).toBe(false);
  });

  it('hides the close button when closable is false', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x' } });
    expect(wrapper.find('.sn-notice-bar__close').exists()).toBe(false);
    expect(wrapper.find('.sn-notice-bar__suffix').exists()).toBe(false);
  });

  it('emits click with the text and index', async () => {
    const wrapper = mount(SnNoticeBar, { props: { text: '点我' } });
    await wrapper.find('.sn-notice-bar__body').trigger('tap');
    expect(wrapper.emitted('click')?.[0]).toEqual([{ text: '点我', index: 0 }]);
  });

  it('exposes the marquee duration as a custom property', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', delay: 2 } });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('--sn-notice-bar-duration');
    expect(style).toContain('--sn-notice-bar-delay: 2s');
  });

  it('applies the color overrides and customClass', () => {
    const wrapper = mount(SnNoticeBar, {
      props: {
        text: 'x',
        color: 'rebeccapurple',
        backgroundColor: 'rebeccapurple',
        customClass: 'my-bar',
      },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('color: rebeccapurple');
    expect(style).toContain('background-color: rebeccapurple');
    expect(wrapper.classes()).toContain('my-bar');
  });

  it('renders the default slot instead of the text', () => {
    const wrapper = mount(SnNoticeBar, {
      props: { text: 'ignored' },
      slots: { default: '<text>slot notice</text>' },
    });
    expect(wrapper.find('.sn-notice-bar__body').text()).toContain('slot notice');
    expect(wrapper.findAll('.sn-notice-bar__text')).toHaveLength(0);
  });

  it('clears the rotation timer on unmount', () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['a', 'b'], direction: 'vertical' },
    });
    wrapper.unmount();
    expect(() => vi.advanceTimersByTime(60000)).not.toThrow();
  });

  /* ── Added coverage ──────────────────────────────────────────────────── */

  it('keeps the marquee silent to assistive tech but polite when static', () => {
    expect(mount(SnNoticeBar, { props: { text: 'x' } }).attributes('aria-live')).toBe('off');
    expect(
      mount(SnNoticeBar, { props: { text: 'x', scrollable: false } }).attributes('aria-live'),
    ).toBe('polite');
  });

  it('resolves the prefix prop through the icon registry', () => {
    registerSnIcons({ StarNotice: { viewBox: '0 0 24 24', paths: ['M12 2l3 7'] } });
    try {
      const wrapper = mount(SnNoticeBar, { props: { text: 'x', prefix: 'StarNotice' } });
      expect(wrapper.find('.sn-notice-bar__prefix svg').exists()).toBe(true);
    } finally {
      clearSnIcons();
    }
  });

  it('falls back to the type glyph when the prefix name is not registered', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', prefix: 'NoSuchIcon' } });
    expect(wrapper.find('.sn-notice-bar__prefix svg').exists()).toBe(true);
  });

  it('lets the prefix slot replace the leading glyph', () => {
    const wrapper = mount(SnNoticeBar, {
      props: { text: 'x' },
      slots: { prefix: '<text class="custom-prefix">P</text>' },
    });
    expect(wrapper.find('.custom-prefix').exists()).toBe(true);
    expect(wrapper.find('.sn-notice-bar__prefix svg').exists()).toBe(false);
  });

  it('renders the suffix slot even without closable', () => {
    const wrapper = mount(SnNoticeBar, {
      props: { text: 'x' },
      slots: { suffix: '<text class="custom-suffix">S</text>' },
    });
    expect(wrapper.find('.sn-notice-bar__suffix').exists()).toBe(true);
    expect(wrapper.find('.custom-suffix').exists()).toBe(true);
  });

  it('lets the suffix slot replace the built-in close button', () => {
    const wrapper = mount(SnNoticeBar, {
      props: { text: 'x', closable: true },
      slots: { suffix: '<text class="custom-suffix">更多</text>' },
    });
    expect(wrapper.find('.custom-suffix').exists()).toBe(true);
    expect(wrapper.find('.sn-notice-bar__close').exists()).toBe(false);
  });

  it('emits the rotated line index through next', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['一', '二', '三'], direction: 'vertical', speed: 50 },
    });
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('next')?.[0]).toEqual([1]);
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('next')?.[1]).toEqual([2]);
    // Wraps back to the first line.
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('next')?.[2]).toEqual([0]);
  });

  it('emits the active line text and index on a vertical tap', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['一', '二'], direction: 'vertical', speed: 50 },
    });
    await wrapper.find('.sn-notice-bar__body').trigger('tap');
    expect(wrapper.emitted('click')?.[0]).toEqual([{ text: '一', index: 0 }]);
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    await wrapper.find('.sn-notice-bar__body').trigger('tap');
    expect(wrapper.emitted('click')?.[1]).toEqual([{ text: '二', index: 1 }]);
  });

  it('does not rotate a single-line vertical bar', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['only'], direction: 'vertical' },
    });
    vi.advanceTimersByTime(20000);
    expect(wrapper.emitted('next')).toBeUndefined();
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('only');
  });

  it('scales the marquee duration from speed and text length', () => {
    const slow = mount(SnNoticeBar, {
      props: { text: 'x'.repeat(100), speed: 50 },
    });
    expect(slow.attributes('style')).toContain('--sn-notice-bar-duration: 26.6s');

    const fast = mount(SnNoticeBar, {
      props: { text: 'x'.repeat(100), speed: 100 },
    });
    expect(fast.attributes('style')).toContain('--sn-notice-bar-duration: 13.3s');
  });

  it('falls back to the default speed when speed is not positive', () => {
    const wrapper = mount(SnNoticeBar, {
      props: { text: 'x'.repeat(100), speed: 0 },
    });
    expect(wrapper.attributes('style')).toContain('--sn-notice-bar-duration: 26.6s');
  });

  it('clamps a negative delay to zero', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', delay: -3 } });
    expect(wrapper.attributes('style')).toContain('--sn-notice-bar-delay: 0s');
  });

  it('appends customStyle to the root', () => {
    const wrapper = mount(SnNoticeBar, { props: { text: 'x', customStyle: 'border: 1px' } });
    expect(wrapper.attributes('style')).toContain('border: 1px');
  });

  it('re-opens when the text changes after a close', async () => {
    const wrapper = mount(SnNoticeBar, { props: { text: '旧通知', closable: true } });
    await wrapper.find('.sn-notice-bar__close').trigger('tap');
    expect(wrapper.find('.sn-notice-bar').exists()).toBe(false);

    await wrapper.setProps({ text: '新通知' });
    expect(wrapper.find('.sn-notice-bar').exists()).toBe(true);
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('新通知');
  });

  it('resets the vertical rotation to the first line when the text changes', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnNoticeBar, {
      props: { text: ['一', '二'], direction: 'vertical', speed: 50 },
    });
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('二');

    await wrapper.setProps({ text: ['甲', '乙', '丙'] });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-notice-bar__text').text()).toBe('甲');
  });
});
