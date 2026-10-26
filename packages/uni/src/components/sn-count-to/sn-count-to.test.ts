/**
 * sn-count-to unit tests — uni-end number roll-up (wd-count-to parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `startVal` / `endVal` / `decimals` / `separator` / `decimal` build the text
 *   - `prefix` / `suffix` wrap the number
 *   - `autoStart: false` freezes the value; the exposed `start` / `pause`
 *     / `reset` control the tween
 *   - `finish` fires at the end of the tween
 *   - `type` drives the color class; `color` lands as an inline style
 *   - the tween interval is cleared on unmount (§41)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnCountTo from './sn-count-to.vue';

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-count-to', () => {
  it('renders the start value before the tween runs', () => {
    const wrapper = mount(SnCountTo, {
      props: { startVal: 100, endVal: 2000, autoStart: false },
    });
    expect(wrapper.find('.sn-count-to__text').text()).toBe('100');
    expect(wrapper.attributes('role')).toBe('status');
  });

  it('formats thousands separators', () => {
    const wrapper = mount(SnCountTo, {
      props: { startVal: 1_234_567, endVal: 1_234_567, autoStart: false },
    });
    expect(wrapper.find('.sn-count-to__text').text()).toBe('1,234,567');
  });

  it('honours a custom separator', () => {
    const wrapper = mount(SnCountTo, {
      props: { startVal: 1_234_567, endVal: 1_234_567, separator: ' ', autoStart: false },
    });
    expect(wrapper.find('.sn-count-to__text').text()).toBe('1 234 567');
  });

  it('honours decimals and a custom decimal separator', () => {
    const wrapper = mount(SnCountTo, {
      props: { startVal: 12.3456, endVal: 12.3456, decimals: 2, autoStart: false },
    });
    expect(wrapper.find('.sn-count-to__text').text()).toBe('12.35');

    const comma = mount(SnCountTo, {
      props: {
        startVal: 12.3456,
        endVal: 12.3456,
        decimals: 2,
        decimal: ',',
        autoStart: false,
      },
    });
    expect(comma.find('.sn-count-to__text').text()).toBe('12,35');
  });

  it('wraps the number with prefix and suffix', () => {
    const wrapper = mount(SnCountTo, {
      props: { startVal: 50, endVal: 50, prefix: '¥', suffix: ' 元', autoStart: false },
    });
    expect(wrapper.find('.sn-count-to__text').text()).toBe('¥50 元');
    expect(wrapper.attributes('aria-label')).toBe('¥50 元');
  });

  it('reaches endVal and emits finish at the end of the tween', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountTo, {
      props: { startVal: 0, endVal: 100, duration: 100 },
    });
    vi.advanceTimersByTime(200);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('finish')).toHaveLength(1);
    expect(wrapper.find('.sn-count-to__text').text()).toBe('100');
  });

  it('jumps straight to endVal when duration is 0', () => {
    const wrapper = mount(SnCountTo, {
      props: { startVal: 0, endVal: 88, duration: 0 },
    });
    expect(wrapper.find('.sn-count-to__text').text()).toBe('88');
    expect(wrapper.emitted('finish')).toHaveLength(1);
  });

  it('does not animate when autoStart is false', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountTo, {
      props: { startVal: 0, endVal: 500, duration: 200, autoStart: false },
    });
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('finish')).toBeUndefined();
    expect(wrapper.find('.sn-count-to__text').text()).toBe('0');
  });

  it('starts and pauses through the exposed methods', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountTo, {
      props: { startVal: 0, endVal: 1000, duration: 1000, autoStart: false },
    });
    (wrapper.vm as unknown as { start: () => void }).start();
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    (wrapper.vm as unknown as { pause: () => void }).pause();
    const paused = wrapper.find('.sn-count-to__text').text();
    expect(paused).not.toBe('0');
    vi.advanceTimersByTime(2000);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-count-to__text').text()).toBe(paused);
    expect(wrapper.emitted('finish')).toBeUndefined();
  });

  it('resets to startVal through the exposed reset method', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountTo, {
      props: { startVal: 10, endVal: 1000, duration: 500 },
    });
    vi.advanceTimersByTime(100);
    (wrapper.vm as unknown as { reset: () => void }).reset();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-count-to__text').text()).toBe('10');
  });

  it('applies the type class and the color override', () => {
    const success = mount(SnCountTo, {
      props: { startVal: 1, endVal: 1, type: 'success', autoStart: false },
    });
    expect(success.classes()).toContain('sn-count-to--success');

    const colored = mount(SnCountTo, {
      props: {
        startVal: 1,
        endVal: 1,
        color: 'rebeccapurple',
        customClass: 'my-count-to',
        autoStart: false,
      },
    });
    expect(colored.classes()).toContain('my-count-to');
    expect(colored.attributes('style')).toContain('color: rebeccapurple');
  });

  it('forwards customStyle', () => {
    const wrapper = mount(SnCountTo, {
      props: { startVal: 1, endVal: 1, customStyle: 'margin: 8px', autoStart: false },
    });
    expect(wrapper.attributes('style')).toContain('margin: 8px');
  });

  it('clears the tween interval on unmount', () => {
    vi.useFakeTimers();
    const wrapper = mount(SnCountTo, {
      props: { startVal: 0, endVal: 1000, duration: 5000 },
    });
    wrapper.unmount();
    expect(() => vi.advanceTimersByTime(60_000)).not.toThrow();
  });

  describe('mounted event', () => {
    it('emits mounted exactly once after mount', () => {
      const wrapper = mount(SnCountTo, {
        props: { startVal: 0, endVal: 100, autoStart: false },
      });
      expect(wrapper.emitted('mounted')).toHaveLength(1);
    });
  });

  describe('finish semantics', () => {
    it('emits finish exactly once even when time advances far past the end', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnCountTo, {
        props: { startVal: 0, endVal: 100, duration: 100 },
      });
      vi.advanceTimersByTime(60_000);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('finish')).toHaveLength(1);
      expect(wrapper.find('.sn-count-to__text').text()).toBe('100');
    });

    it('emits finish immediately when startVal equals endVal', () => {
      const wrapper = mount(SnCountTo, {
        props: { startVal: 5, endVal: 5 },
      });
      expect(wrapper.emitted('finish')).toHaveLength(1);
      expect(wrapper.find('.sn-count-to__text').text()).toBe('5');
    });
  });

  describe('value boundaries', () => {
    it('animates down to a negative endVal and formats the grouping', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnCountTo, {
        props: { startVal: 0, endVal: -1000, duration: 100, useEasing: false },
      });
      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('finish')).toHaveLength(1);
      expect(wrapper.find('.sn-count-to__text').text()).toBe('-1,000');
    });

    it('clamps negative decimals to an integer display', () => {
      const wrapper = mount(SnCountTo, {
        props: { startVal: 12.3456, endVal: 12.3456, decimals: -2, autoStart: false },
      });
      expect(wrapper.find('.sn-count-to__text').text()).toBe('12');
    });
  });

  describe('tween curve', () => {
    it('runs ease-out ahead of the linear ramp at mid-flight', async () => {
      vi.useFakeTimers();
      const eased = mount(SnCountTo, {
        props: { startVal: 0, endVal: 100, duration: 100, useEasing: true, autoStart: false },
      });
      (eased.vm as unknown as { start: () => void }).start();
      vi.advanceTimersByTime(48); // 3 frames → progress 0.48
      await eased.vm.$nextTick();
      const easedValue = Number(eased.find('.sn-count-to__text').text());
      // ease-out cubic at 0.48 ≈ 0.859 → ~86; linear would sit at 48.
      expect(easedValue).toBeGreaterThan(60);

      const linear = mount(SnCountTo, {
        props: { startVal: 0, endVal: 100, duration: 100, useEasing: false, autoStart: false },
      });
      (linear.vm as unknown as { start: () => void }).start();
      vi.advanceTimersByTime(48);
      await linear.vm.$nextTick();
      expect(Number(linear.find('.sn-count-to__text').text())).toBe(48);
    });

    it('resumes from the paused value instead of restarting at startVal', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnCountTo, {
        props: { startVal: 0, endVal: 1000, duration: 1000, useEasing: false, autoStart: false },
      });
      const controls = wrapper.vm as unknown as {
        start: () => void;
        pause: () => void;
      };
      controls.start();
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();
      controls.pause();
      const paused = Number(wrapper.find('.sn-count-to__text').text());
      expect(paused).toBeGreaterThan(400);

      controls.start();
      vi.advanceTimersByTime(16);
      await wrapper.vm.$nextTick();
      const resumed = Number(wrapper.find('.sn-count-to__text').text());
      // A restart-from-startVal bug would drop the value back to ~16.
      expect(resumed).toBeGreaterThanOrEqual(paused);
    });
  });

  describe('value-change restart', () => {
    it('restarts from the new startVal when endVal changes mid-flight', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnCountTo, {
        props: { startVal: 0, endVal: 100, duration: 1000, useEasing: false },
      });
      vi.advanceTimersByTime(100);
      await wrapper.vm.$nextTick();
      await wrapper.setProps({ endVal: 200 });
      expect(wrapper.find('.sn-count-to__text').text()).toBe('0');

      vi.advanceTimersByTime(1500);
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.sn-count-to__text').text()).toBe('200');
      expect(wrapper.emitted('finish')).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('announces politely and marks the component tag', () => {
      const wrapper = mount(SnCountTo, {
        props: { startVal: 1, endVal: 1, autoStart: false },
      });
      expect(wrapper.attributes('aria-live')).toBe('polite');
      expect(wrapper.attributes('data-snui-component')).toBe('count-to');
    });
  });

  describe('unmount cleanup', () => {
    it('emits no further finish after unmount', () => {
      vi.useFakeTimers();
      const wrapper = mount(SnCountTo, {
        props: { startVal: 0, endVal: 1000, duration: 5000 },
      });
      wrapper.unmount();
      vi.advanceTimersByTime(60_000);
      expect(wrapper.emitted('finish')).toBeUndefined();
    });
  });
});
