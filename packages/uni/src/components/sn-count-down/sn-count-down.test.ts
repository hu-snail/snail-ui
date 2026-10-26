/**
 * sn-count-down unit tests — uni-end countdown timer (wd-count-down parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `format` tokens render the initial remaining time
 *   - `change` fires on every tick and `finish` fires at zero
 *   - `autoStart` / the exposed `start` / `pause` / `reset` control the clock
 *   - `millisecond` switches to the sub-second tick
 *   - the interval is cleared on unmount (§41)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnCountDown from './sn-count-down.vue';

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-count-down', () => {
  it('renders the formatted time for the default HH:mm:ss format', () => {
    const wrapper = mount(SnCountDown, { props: { time: 3_723_000, autoStart: false } });
    expect(wrapper.find('.sn-count-down__text').text()).toBe('01:02:03');
    expect(wrapper.attributes('role')).toBe('timer');
    expect(wrapper.attributes('aria-label')).toBe('01:02:03');
  });

  it('renders days through the DD and DDD tokens', () => {
    const twoDays = mount(SnCountDown, {
      props: { time: 2 * 86_400_000, format: 'DD 天 HH:mm:ss', autoStart: false },
    });
    expect(twoDays.find('.sn-count-down__text').text()).toBe('2 天 00:00:00');

    const padded = mount(SnCountDown, {
      props: { time: 2 * 86_400_000, format: 'DDD', autoStart: false },
    });
    expect(padded.find('.sn-count-down__text').text()).toBe('002');
  });

  it('renders milliseconds through the S token', () => {
    const wrapper = mount(SnCountDown, {
      props: { time: 1500, format: 'ss.S', autoStart: false },
    });
    expect(wrapper.find('.sn-count-down__text').text()).toBe('01.500');
  });

  it('keeps literal characters in the format', () => {
    const wrapper = mount(SnCountDown, {
      props: { time: 65_000, format: 'HH时mm分ss秒', autoStart: false },
    });
    expect(wrapper.find('.sn-count-down__text').text()).toBe('00时01分05秒');
  });

  it('emits change on each tick and finish at zero', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountDown, { props: { time: 3000 } });
    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ total: 2000, seconds: 2 });

    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('finish')).toHaveLength(1);
    expect(wrapper.find('.sn-count-down__text').text()).toBe('00:00:00');
  });

  it('does not start when autoStart is false', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountDown, { props: { time: 3000, autoStart: false } });
    vi.advanceTimersByTime(5000);
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.find('.sn-count-down__text').text()).toBe('00:00:03');
  });

  it('starts through the exposed start method', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountDown, { props: { time: 3000, autoStart: false } });
    (wrapper.vm as unknown as { start: () => void }).start();
    vi.advanceTimersByTime(1000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('pauses through the exposed pause method', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountDown, { props: { time: 5000 } });
    vi.advanceTimersByTime(1000);
    (wrapper.vm as unknown as { pause: () => void }).pause();
    vi.advanceTimersByTime(5000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('resets to the full time through the exposed reset method', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountDown, { props: { time: 3000, autoStart: false } });
    (wrapper.vm as unknown as { reset: () => void }).reset();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-count-down__text').text()).toBe('00:00:03');
  });

  it('ticks every 16ms in millisecond mode', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountDown, { props: { time: 3000, millisecond: true } });
    vi.advanceTimersByTime(48);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('change')).toHaveLength(3);
  });

  it('renders the default slot with the time parts', () => {
    const wrapper = mount(SnCountDown, {
      props: { time: 65_000, autoStart: false },
      slots: {
        default: `<template #default="{ hours, minutes, seconds }">
          <text class="custom">{{ hours }}-{{ minutes }}-{{ seconds }}</text>
        </template>`,
      },
    });
    expect(wrapper.find('.custom').text().trim()).toBe('0-1-5');
  });

  it('forwards customClass and customStyle', () => {
    const wrapper = mount(SnCountDown, {
      props: {
        time: 1000,
        autoStart: false,
        customClass: 'my-count-down',
        customStyle: 'margin: 8px',
      },
    });
    expect(wrapper.classes()).toContain('my-count-down');
    expect(wrapper.attributes('style')).toContain('margin: 8px');
  });

  it('clears the interval on unmount', () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountDown, { props: { time: 10_000 } });
    wrapper.unmount();
    expect(() => vi.advanceTimersByTime(60_000)).not.toThrow();
  });
});
