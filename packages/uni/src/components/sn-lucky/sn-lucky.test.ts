import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnLucky from './sn-lucky.vue';

const prizes = [
  { name: '一等奖' },
  { name: '二等奖' },
  { name: '三等奖' },
  { name: '四等奖' },
  { name: '五等奖' },
  { name: '六等奖' },
  { name: '七等奖' },
  { name: '谢谢参与' },
];

describe('SnLucky', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render 8 perimeter cells and the center button for a 3x3 grid', () => {
    const wrapper = mount(SnLucky, { props: { prizes } });
    expect(wrapper.findAll('.sn-lucky__cell').length).toBe(8);
    expect(wrapper.find('.sn-lucky__button').exists()).toBe(true);
    expect(wrapper.text()).toContain('立即抽奖');
  });

  it('should emit start on play and end(index) after stop settles', async () => {
    const wrapper = mount(SnLucky, { props: { prizes, speed: 20 } });
    const api = wrapper.vm as unknown as { play: () => void; stop: (index: number) => void };
    api.play();
    expect(wrapper.emitted('start')).toHaveLength(1);
    api.stop(4);
    // 减速行走至多两圈（16 步 × 渐增延迟），给足假时间。
    vi.advanceTimersByTime(60000);
    const ended = wrapper.emitted('end');
    expect(ended).toHaveLength(1);
    expect(ended?.[0]).toEqual([4]);
  });

  it('should ignore stop() before play()', () => {
    const wrapper = mount(SnLucky, { props: { prizes } });
    (wrapper.vm as unknown as { stop: (index: number) => void }).stop(0);
    expect(wrapper.emitted('end')).toBeUndefined();
  });

  it('should highlight exactly one cell while playing', async () => {
    const wrapper = mount(SnLucky, { props: { prizes, speed: 20 } });
    const api = wrapper.vm as unknown as { play: () => void };
    api.play();
    vi.advanceTimersByTime(20);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-lucky__cell--active').length).toBe(1);
  });
});
