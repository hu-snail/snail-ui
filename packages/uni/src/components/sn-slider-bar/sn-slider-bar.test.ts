/**
 * sn-slider-bar unit tests (uni end).
 *
 * Behaviour-focused (AGENTS.md §46): value normalisation, snapping, range
 * semantics, level labels, caption formats and the two colour states. Layout
 * is CSS-only on this end, so geometry is asserted through the emitted style
 * strings rather than computed boxes.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSliderBar from './sn-slider-bar.vue';

/** Style strings come back space-separated; compare without spaces. */
function styleOf(
  w: { find: (sel: string) => { attributes: (n: string) => string | undefined } },
  sel: string,
): string {
  return (w.find(sel).attributes('style') ?? '').replace(/\s+/g, '');
}

/** uni mesh shim — the SFC calls createSelectorQuery on mount. */
function stubUni(): void {
  (globalThis as unknown as { uni: unknown }).uni = {
    createSelectorQuery: () => ({
      in: () => ({
        select: () => ({
          boundingClientRect: (cb: (rect: { width: number; height: number }) => void) => {
            cb({ width: 300, height: 200 });
            return { exec: () => undefined };
          },
        }),
      }),
    }),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('sn-slider-bar (uni)', () => {
  it('renders one knob and the capsule surface', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
    expect(wrapper.classes()).toContain('sn-slider-bar');
    expect(wrapper.classes()).toContain('sn-slider-bar--bar');
    expect(wrapper.findAll('.sn-slider-bar__knob')).toHaveLength(1);
    expect(wrapper.find('.sn-slider-bar__track').exists()).toBe(true);
  });

  it('paints the fill from the origin in single mode', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 40 } });
    const style = styleOf(wrapper, '.sn-slider-bar__fill');
    expect(style).toContain('left:0%');
    expect(style).toContain('width:40%');
  });

  it('paints the fill BETWEEN the knobs in range mode', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: [20, 60], range: true },
    });
    const style = styleOf(wrapper, '.sn-slider-bar__fill');
    // themed band starts at the low knob, not at the origin
    expect(style).toContain('left:20%');
    expect(style).toContain('width:40%');
    expect(wrapper.findAll('.sn-slider-bar__knob')).toHaveLength(2);
  });

  it('hides the fill at value 0', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 0 } });
    expect(wrapper.classes()).toContain('sn-slider-bar--empty');
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('opacity:0');
  });

  it('reads percent / value captions', () => {
    stubUni();
    const pct = mount(SnSliderBar, { props: { modelValue: 40, showValue: true } });
    expect(pct.find('.sn-slider-bar__value').text()).toBe('40%');
    const raw = mount(SnSliderBar, {
      props: { modelValue: 40, showValue: true, format: 'value', valueSuffix: ' ms' },
    });
    expect(raw.find('.sn-slider-bar__value').text()).toBe('40 ms');
  });

  it('shows the nearest level label', () => {
    stubUni();
    const levels = [
      { value: 0, label: '关闭' },
      { value: 50, label: '中' },
      { value: 100, label: '最大' },
    ];
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 55, levels, showValue: true },
    });
    expect(wrapper.find('.sn-slider-bar__value').text()).toBe('中');
    expect(wrapper.findAll('.sn-slider-bar__level-mark')).toHaveLength(3);
  });

  it('marks the active level tick', () => {
    stubUni();
    const levels = [
      { value: 0, label: 'a' },
      { value: 100, label: 'b' },
    ];
    const wrapper = mount(SnSliderBar, { props: { modelValue: 100, levels } });
    expect(wrapper.findAll('.sn-slider-bar__level-mark--on')).toHaveLength(1);
  });

  it('switches the in-track text colour between the filled and empty states', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 40, label: '音量', innerColor: '#fff', innerColorEmpty: '#888' },
    });
    const cls = wrapper.classes().join(' ');
    expect(cls).not.toContain('sn-slider-bar--empty');
    const style = (wrapper.attributes('style') ?? '').replace(/\s+/g, '');
    expect(style).toContain('--sn-bar-inner-color:#fff');
    expect(style).toContain('--sn-bar-inner-color-empty:#888');
  });

  it('renders the aurora gradient and star field', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 60, theme: 'aurora', sparkles: 5 },
    });
    expect(wrapper.classes()).toContain('sn-slider-bar--aurora');
    expect(wrapper.classes()).toContain('sn-slider-bar--animated');
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('linear-gradient');
    expect(wrapper.findAll('.sn-slider-bar__star')).toHaveLength(5);
  });

  it('drops the animation with animated=false', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 60, theme: 'aurora', animated: false },
    });
    expect(wrapper.classes()).not.toContain('sn-slider-bar--animated');
    expect(wrapper.findAll('.sn-slider-bar__star')).toHaveLength(0);
  });

  it('maps size tiers onto the thickness variable', () => {
    stubUni();
    const small = mount(SnSliderBar, { props: { modelValue: 10, size: 'small' } });
    expect((small.attributes('style') ?? '').replace(/\s+/g, '')).toContain(
      '--sn-bar-thickness:56rpx',
    );
    const large = mount(SnSliderBar, { props: { modelValue: 10, size: 'large' } });
    expect((large.attributes('style') ?? '').replace(/\s+/g, '')).toContain(
      '--sn-bar-thickness:104rpx',
    );
  });

  it('accepts an explicit height', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 10, barHeight: 240 } });
    expect((wrapper.attributes('style') ?? '').replace(/\s+/g, '')).toContain(
      '--sn-bar-height:240rpx',
    );
  });

  it('renders the column variant with the read-out', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 60, variant: 'column', showValue: true },
    });
    expect(wrapper.classes()).toContain('sn-slider-bar--column');
    expect(wrapper.find('.sn-slider-bar__value').exists()).toBe(true);
    expect(styleOf(wrapper, '.sn-slider-bar__fill')).toContain('bottom:0%');
  });

  it('renders head / tail slots', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, {
      props: { modelValue: 10 },
      slots: { start: '<i class="probe-start" />', end: '<i class="probe-end" />' },
    });
    expect(wrapper.find('.probe-start').exists()).toBe(true);
    expect(wrapper.find('.probe-end').exists()).toBe(true);
  });

  it('respects disabled', () => {
    stubUni();
    const wrapper = mount(SnSliderBar, { props: { modelValue: 10, disabled: true } });
    expect(wrapper.classes()).toContain('sn-slider-bar--disabled');
  });
});
