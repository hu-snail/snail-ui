/**
 * sn-progress unit tests — uni-end progress bar (wd-progress parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `percentage` clamps to 0–100 and drives the fill width
 *   - `hideText` removes the label; `percentPosition` moves it inside / outside
 *   - `status` wins over `color`; `color` accepts a string, a gradient list and
 *     `{ color, percentage }` thresholds
 *   - `duration` scales the width transition (ms per 1%)
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnProgress from './sn-progress.vue';

describe('sn-progress', () => {
  it('renders a progressbar with the percentage as aria-valuenow', () => {
    const wrapper = mount(SnProgress, { props: { percentage: 42 } });
    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.attributes('aria-valuenow')).toBe('42');
    expect(wrapper.attributes('aria-valuemin')).toBe('0');
    expect(wrapper.attributes('aria-valuemax')).toBe('100');
  });

  it('clamps percentages outside the 0–100 range', () => {
    const over = mount(SnProgress, { props: { percentage: 160 } });
    expect(over.attributes('aria-valuenow')).toBe('100');
    expect(over.find('.sn-progress__fill').attributes('style')).toContain('width: 100%');

    const under = mount(SnProgress, { props: { percentage: -20 } });
    expect(under.attributes('aria-valuenow')).toBe('0');
    expect(under.find('.sn-progress__fill').attributes('style')).toContain('width: 0%');
  });

  it('shows the rounded percentage label by default (outer, right)', () => {
    const wrapper = mount(SnProgress, { props: { percentage: 42.6 } });
    expect(wrapper.find('.sn-progress__label--outer').text()).toBe('43%');
    expect(wrapper.classes()).toContain('sn-progress--label-outer');
    expect(wrapper.classes()).toContain('sn-progress--align-right');
  });

  it('hides the label when hideText is true', () => {
    const wrapper = mount(SnProgress, { props: { percentage: 30, hideText: true } });
    expect(wrapper.find('.sn-progress__label').exists()).toBe(false);
    expect(wrapper.classes()).toContain('sn-progress--hide-text');
  });

  it('moves the label inside the fill for percentPosition.type="inner"', () => {
    const wrapper = mount(SnProgress, {
      props: { percentage: 55, percentPosition: { type: 'inner', align: 'center' } },
    });
    expect(wrapper.find('.sn-progress__label--inner').exists()).toBe(true);
    expect(wrapper.find('.sn-progress__label--outer').exists()).toBe(false);
    expect(wrapper.classes()).toContain('sn-progress--label-inner');
    expect(wrapper.classes()).toContain('sn-progress--align-center');
  });

  it('falls back to the default percent-position when the object is partial', () => {
    const wrapper = mount(SnProgress, { props: { percentage: 10, percentPosition: {} } });
    expect(wrapper.find('.sn-progress__label--outer').exists()).toBe(true);
    expect(wrapper.classes()).toContain('sn-progress--align-right');
  });

  it('applies the status color token and lets it win over color', () => {
    const wrapper = mount(SnProgress, {
      props: { percentage: 50, status: 'warning', color: 'rebeccapurple' },
    });
    const style = wrapper.find('.sn-progress__fill').attributes('style') ?? '';
    expect(style).toContain('var(--sn-mp-color-feedback-warning)');
    expect(style).not.toContain('rebeccapurple');
  });

  it('accepts a plain string color', () => {
    const wrapper = mount(SnProgress, { props: { percentage: 50, color: 'rebeccapurple' } });
    expect(wrapper.find('.sn-progress__fill').attributes('style')).toContain('rebeccapurple');
  });

  it('accepts a gradient stop list', () => {
    const wrapper = mount(SnProgress, {
      props: { percentage: 50, color: ['#111111', '#222222'] },
    });
    const style = wrapper.find('.sn-progress__fill').attributes('style') ?? '';
    expect(style).toContain('linear-gradient');
    expect(style).toContain('#111111');
  });

  it('picks the highest reached threshold color', () => {
    const color = [
      { color: 'rebeccapurple', percentage: 0 },
      { color: 'darkorange', percentage: 50 },
      { color: 'seagreen', percentage: 90 },
    ];
    const mid = mount(SnProgress, { props: { percentage: 60, color } });
    expect(mid.find('.sn-progress__fill').attributes('style')).toContain('darkorange');

    const high = mount(SnProgress, { props: { percentage: 95, color } });
    expect(high.find('.sn-progress__fill').attributes('style')).toContain('seagreen');
  });

  it('scales the transition duration by percentage × duration', () => {
    const wrapper = mount(SnProgress, { props: { percentage: 40, duration: 10 } });
    expect(wrapper.find('.sn-progress__fill').attributes('style')).toContain(
      'transition-duration: 400ms',
    );
  });

  it('adds the zero class when percentage is 0', () => {
    const zero = mount(SnProgress, { props: { percentage: 0 } });
    expect(zero.classes()).toContain('sn-progress--zero');

    const some = mount(SnProgress, { props: { percentage: 1 } });
    expect(some.classes()).not.toContain('sn-progress--zero');
  });

  it('forwards customClass and customStyle to the root', () => {
    const wrapper = mount(SnProgress, {
      // `8px`, not `8rpx`: happy-dom drops CSS lengths it cannot parse.
      props: { percentage: 20, customClass: 'my-progress', customStyle: 'margin: 8px' },
    });
    expect(wrapper.classes()).toContain('my-progress');
    expect(wrapper.attributes('style')).toContain('margin: 8px');
  });
});
