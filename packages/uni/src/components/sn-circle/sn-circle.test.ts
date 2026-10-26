/**
 * sn-circle unit tests — uni-end circular progress ring (wd-circle parity).
 *
 * Untestable in happy-dom: the actual ring visuals (conic-gradient sweep,
 * radial-gradient band mask, scaleX flip) — happy-dom has no paint pipeline,
 * so the sweep/color/duration custom properties they consume are asserted on
 * the inline styles instead.
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `modelValue` clamps to 0–100 and lands on `aria-valuenow`
 *   - the centre text defaults to the rounded percentage and `text` overrides it
 *   - `size` / `strokeWidth` accept numbers (rpx) and strings (verbatim)
 *   - `color` accepts a solid string and a `{ offset: color }` gradient map
 *   - `layerColor` / `fill` land as inline styles; `fill` gates the disc node
 *   - `speed` maps to a transition duration; `clockwise` drives the class
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnCircle from './sn-circle.vue';

describe('sn-circle', () => {
  it('renders a progressbar with the clamped value', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 42 } });
    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.attributes('aria-valuenow')).toBe('42');
    expect(wrapper.attributes('aria-valuemin')).toBe('0');
    expect(wrapper.attributes('aria-valuemax')).toBe('100');
  });

  it('clamps values outside the 0–100 range', () => {
    const over = mount(SnCircle, { props: { modelValue: 180 } });
    expect(over.attributes('aria-valuenow')).toBe('100');

    const under = mount(SnCircle, { props: { modelValue: -30 } });
    expect(under.attributes('aria-valuenow')).toBe('0');
  });

  it('shows the rounded percentage as the centre text by default', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 42.6 } });
    expect(wrapper.find('.sn-circle__text').text()).toBe('43%');
  });

  it('lets `text` override the centre text', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 50, text: '完成' } });
    expect(wrapper.find('.sn-circle__text').text()).toBe('完成');
    expect(wrapper.attributes('aria-label')).toBe('完成');
  });

  it('accepts the default slot for custom centre content', () => {
    const wrapper = mount(SnCircle, {
      props: { modelValue: 10 },
      slots: { default: '<text>slot centre</text>' },
    });
    expect(wrapper.find('.sn-circle__text').text()).toContain('slot centre');
  });

  it('exposes size and strokeWidth as custom properties', () => {
    const wrapper = mount(SnCircle, { props: { size: 200, strokeWidth: 24 } });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('--sn-circle-size: 200rpx');
    expect(style).toContain('--sn-circle-width: 24rpx');
  });

  it('passes a string size through verbatim', () => {
    const wrapper = mount(SnCircle, { props: { size: '10em' } });
    expect(wrapper.attributes('style')).toContain('--sn-circle-size: 10em');
  });

  it('passes a string size through verbatim', () => {
    const wrapper = mount(SnCircle, { props: { size: '10em' } });
    expect(wrapper.attributes('style')).toContain('--sn-circle-size: 10em');
  });

  it('uses the primary token for the default sweep', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 25 } });
    const style = wrapper.find('.sn-circle__arc').attributes('style') ?? '';
    expect(style).toContain('--sn-circle-color: var(--sn-mp-color-action-primary)');
    expect(style).toContain('--sn-circle-sweep: 90deg');
  });

  it('accepts a solid color string', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 50, color: 'rebeccapurple' } });
    expect(wrapper.find('.sn-circle__arc').attributes('style')).toContain(
      '--sn-circle-color: rebeccapurple',
    );
  });

  it('accepts a gradient map', () => {
    const wrapper = mount(SnCircle, {
      props: { modelValue: 50, color: { '0%': 'rebeccapurple', '100%': 'darkorange' } },
    });
    const style = wrapper.find('.sn-circle__arc').attributes('style') ?? '';
    expect(style).toContain('rebeccapurple 0%');
    expect(style).toContain('darkorange 100%');
    expect(wrapper.classes()).toContain('sn-circle--gradient');
  });

  it('applies layerColor to the track', () => {
    const wrapper = mount(SnCircle, { props: { layerColor: 'rebeccapurple' } });
    expect(wrapper.find('.sn-circle__track').attributes('style')).toContain(
      '--sn-circle-layer: rebeccapurple',
    );
  });

  it('renders the inner disc only when fill is set', () => {
    const hollow = mount(SnCircle, { props: { modelValue: 40 } });
    expect(hollow.find('.sn-circle__fill').exists()).toBe(false);

    const filled = mount(SnCircle, { props: { modelValue: 40, fill: 'rebeccapurple' } });
    expect(filled.find('.sn-circle__fill').attributes('style')).toContain(
      'background-color: rebeccapurple',
    );
  });

  it('maps speed to a transition duration and 0 to none', () => {
    const slow = mount(SnCircle, { props: { modelValue: 50, speed: 25 } });
    expect(slow.attributes('style')).toContain('--sn-circle-duration: 2000ms');
    expect(slow.classes()).toContain('sn-circle--animated');

    const still = mount(SnCircle, { props: { modelValue: 50, speed: 0 } });
    expect(still.attributes('style')).toContain('--sn-circle-duration: 0ms');
    expect(still.classes()).not.toContain('sn-circle--animated');
  });

  it('adds the counter-clockwise class when clockwise is false', () => {
    const counter = mount(SnCircle, { props: { clockwise: false } });
    expect(counter.classes()).toContain('sn-circle--counter-clockwise');

    const normal = mount(SnCircle, {});
    expect(normal.classes()).not.toContain('sn-circle--counter-clockwise');
  });

  it('forwards customClass and customStyle', () => {
    const wrapper = mount(SnCircle, {
      props: { customClass: 'my-circle', customStyle: 'margin: 8px' },
    });
    expect(wrapper.classes()).toContain('my-circle');
    expect(wrapper.attributes('style')).toContain('margin: 8px');
  });

  it('marks the root with the component tag', () => {
    const wrapper = mount(SnCircle, {});
    expect(wrapper.attributes('data-snui-component')).toBe('circle');
  });

  it('keeps decorative layers out of the accessibility tree', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 40, fill: 'rebeccapurple' } });
    expect(wrapper.find('.sn-circle__track').attributes('aria-hidden')).toBe('true');
    expect(wrapper.find('.sn-circle__arc').attributes('aria-hidden')).toBe('true');
    expect(wrapper.find('.sn-circle__fill').attributes('aria-hidden')).toBe('true');
  });

  it('exposes the default centre text through aria-label', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 42.6 } });
    expect(wrapper.attributes('aria-label')).toBe('43%');
  });

  it('clamps a NaN value to 0', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: Number.NaN } });
    expect(wrapper.attributes('aria-valuenow')).toBe('0');
    expect(wrapper.find('.sn-circle__arc').attributes('style')).toContain('--sn-circle-sweep: 0deg');
  });

  it('updates the sweep reactively when modelValue changes', async () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 0 } });
    expect(wrapper.find('.sn-circle__arc').attributes('style')).toContain('--sn-circle-sweep: 0deg');
    await wrapper.setProps({ modelValue: 50 });
    expect(wrapper.attributes('aria-valuenow')).toBe('50');
    expect(wrapper.find('.sn-circle__arc').attributes('style')).toContain('--sn-circle-sweep: 180deg');
    expect(wrapper.find('.sn-circle__text').text()).toBe('50%');
  });

  it('treats a negative speed as no animation', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 50, speed: -5 } });
    expect(wrapper.attributes('style')).toContain('--sn-circle-duration: 0ms');
    expect(wrapper.classes()).not.toContain('sn-circle--animated');
  });

  it('accepts stroke-linecap for API parity without changing the sweep', () => {
    const cap = mount(SnCircle, { props: { modelValue: 25, strokeLinecap: 'square' } });
    expect(cap.classes()).not.toContain('sn-circle--line-cap-square');
    expect(cap.find('.sn-circle__arc').attributes('style')).toContain('--sn-circle-sweep: 90deg');
  });

  it('falls back to the solid sweep for an empty gradient map', () => {
    const wrapper = mount(SnCircle, { props: { modelValue: 25, color: {} } });
    expect(wrapper.classes()).not.toContain('sn-circle--gradient');
    expect(wrapper.find('.sn-circle__arc').attributes('style')).toContain(
      '--sn-circle-color: var(--sn-mp-color-action-primary)',
    );
  });

  it('appends a percent sign to numeric gradient offsets', () => {
    const wrapper = mount(SnCircle, {
      props: { modelValue: 25, color: { '0': 'rebeccapurple', '50%': 'darkorange' } },
    });
    const style = wrapper.find('.sn-circle__arc').attributes('style') ?? '';
    expect(style).toContain('rebeccapurple 0%');
    expect(style).toContain('darkorange 50%');
  });

  it('passes a string strokeWidth through verbatim', () => {
    const wrapper = mount(SnCircle, { props: { strokeWidth: '6px' } });
    expect(wrapper.attributes('style')).toContain('--sn-circle-width: 6px');
  });
});
