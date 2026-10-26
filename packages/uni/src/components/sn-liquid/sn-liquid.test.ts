import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnLiquid from './sn-liquid.vue';

describe('SnLiquid', () => {
  it('should render the rounded percent label', () => {
    const wrapper = mount(SnLiquid, { props: { percent: 50 } });
    expect(wrapper.find('.sn-liquid__text').text()).toBe('50%');
  });

  it('should clamp percent into 0-100', () => {
    const wrapper = mount(SnLiquid, { props: { percent: 240 } });
    expect(wrapper.find('.sn-liquid__text').text()).toBe('100%');
  });

  it('should emit update:current on mount and follow percent changes', async () => {
    const wrapper = mount(SnLiquid, { props: { percent: 0, duration: 0 } });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:current')?.at(-1)).toEqual([0]);
    await wrapper.setProps({ percent: 60 });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:current')?.at(-1)).toEqual([60]);
    expect(wrapper.find('.sn-liquid__text').text()).toBe('60%');
  });

  it('should expose the percent through aria-label', () => {
    const wrapper = mount(SnLiquid, { props: { percent: 42 } });
    expect(wrapper.attributes('aria-label')).toContain('42%');
  });
});

describe('SnLiquid clamping and static styling', () => {
  it('should clamp negative percents to 0', () => {
    const wrapper = mount(SnLiquid, { props: { percent: -20, duration: 0 } });
    expect(wrapper.find('.sn-liquid__text').text()).toBe('0%');
    expect(wrapper.attributes('aria-label')).toBe('进度 0%');
  });

  it('should apply size, radius and innerColor to the root box', () => {
    const wrapper = mount(SnLiquid, {
      props: { size: '80px', radius: '25%', innerColor: '#abcdef' },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('width: 80px');
    expect(style).toContain('height: 80px');
    expect(style).toContain('border-radius: 25%');
    expect(style).toContain('background-color: #abcdef');
  });

  it('should add the outline class and drop it by default', () => {
    expect(mount(SnLiquid).classes()).not.toContain('sn-liquid--outline');
    expect(mount(SnLiquid, { props: { outline: true } }).classes()).toContain(
      'sn-liquid--outline',
    );
  });

  it('should paint both waves with the waveColor and double the size for the wave geometry', () => {
    const wrapper = mount(SnLiquid, { props: { size: '80px', waveColor: '#123456' } });
    const front = wrapper.find('.sn-liquid__wave--front').attributes('style') ?? '';
    const back = wrapper.find('.sn-liquid__wave--back').attributes('style') ?? '';
    expect(front).toContain('background-color: #123456');
    expect(front).toContain('width: 160px');
    expect(back).toContain('background-color: #123456');
    expect(back).toContain('width: 160px');
  });

  it('should forward customClass and customStyle to the root', () => {
    const wrapper = mount(SnLiquid, {
      props: { customClass: 'my-liquid', customStyle: 'margin: 2px' },
    });
    expect(wrapper.classes()).toContain('my-liquid');
    expect(wrapper.attributes('style')).toContain('margin: 2px');
  });

  it('should let the default slot replace the percent label', () => {
    const wrapper = mount(SnLiquid, {
      props: { percent: 30 },
      slots: { default: '<text class="custom-label">已完成三成</text>' },
    });
    expect(wrapper.find('.sn-liquid__text').exists()).toBe(false);
    expect(wrapper.find('.custom-label').text()).toBe('已完成三成');
  });
});

describe('SnLiquid animated transition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should emit intermediate values and settle exactly on the target', async () => {
    const wrapper = mount(SnLiquid, { props: { percent: 0, duration: 300 } });
    await wrapper.setProps({ percent: 60 });
    vi.advanceTimersByTime(299);
    const midCount = wrapper.emitted('update:current')!.length;
    expect(midCount).toBeGreaterThan(1);
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('update:current')?.at(-1)).toEqual([60]);
    const settledCount = wrapper.emitted('update:current')!.length;
    vi.advanceTimersByTime(2000);
    expect(wrapper.emitted('update:current')).toHaveLength(settledCount);
  });

  it('should sync the label, aria-label and water height with the settled value', async () => {
    const wrapper = mount(SnLiquid, { props: { percent: 0, duration: 300 } });
    await wrapper.setProps({ percent: 75 });
    vi.advanceTimersByTime(400);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-liquid__text').text()).toBe('75%');
    expect(wrapper.attributes('aria-label')).toBe('进度 75%');
    expect(wrapper.find('.sn-liquid__water').attributes('style')).toContain('height: 75%');
  });

  it('should retarget mid-flight without leaving a stale ticker behind', async () => {
    const wrapper = mount(SnLiquid, { props: { percent: 0, duration: 300 } });
    await wrapper.setProps({ percent: 90 });
    vi.advanceTimersByTime(60);
    await wrapper.setProps({ percent: 30 });
    vi.advanceTimersByTime(5000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:current')?.at(-1)).toEqual([30]);
    expect(wrapper.find('.sn-liquid__text').text()).toBe('30%');
  });

  it('should stop ticking after unmount (no leaked interval, no further emits)', async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(SnLiquid, {
      props: { percent: 0, duration: 300, 'onUpdate:current': onUpdate },
    });
    await wrapper.setProps({ percent: 60 });
    vi.advanceTimersByTime(30);
    wrapper.unmount();
    const countAtUnmount = onUpdate.mock.calls.length;
    vi.advanceTimersByTime(5000);
    expect(onUpdate.mock.calls.length).toBe(countAtUnmount);
  });

  it('should jump instantly when duration is 0 on a later change too', async () => {
    const wrapper = mount(SnLiquid, { props: { percent: 0, duration: 0 } });
    await wrapper.setProps({ percent: 45 });
    expect(wrapper.emitted('update:current')?.at(-1)).toEqual([45]);
    vi.advanceTimersByTime(1000);
    expect(wrapper.emitted('update:current')?.at(-1)).toEqual([45]);
  });
});
