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

describe('SnLucky grid geometry', () => {
  it('should render the prizes along the perimeter in clockwise order', () => {
    const wrapper = mount(SnLucky, { props: { prizes } });
    const rows = wrapper.findAll('.sn-lucky__row');
    const topNames = rows[0]!.findAll('.sn-lucky__name').map((n) => n.text());
    const bottomNames = rows[1]!.findAll('.sn-lucky__name').map((n) => n.text());
    // 顶行从左到右是周长序 0-2；底行从左到右是周长序 4-6（行走方向向左）。
    expect(topNames).toEqual(['一等奖', '二等奖', '三等奖']);
    expect(bottomNames).toEqual(['五等奖', '六等奖', '七等奖']);
  });

  it('should render placeholder names when prizes do not fill the perimeter', () => {
    const wrapper = mount(SnLucky, { props: { prizes: prizes.slice(0, 3) } });
    const names = wrapper.findAll('.sn-lucky__name').map((n) => n.text());
    expect(names).toHaveLength(8);
    expect(names.slice(0, 3)).toEqual(['一等奖', '二等奖', '三等奖']);
    expect(names.slice(3).every((name) => name === '')).toBe(true);
  });

  it('should clamp rows and cols to the 3x3 minimum', () => {
    const wrapper = mount(SnLucky, { props: { prizes, rows: 1, cols: 1 } });
    expect(wrapper.findAll('.sn-lucky__cell').length).toBe(8);
  });

  it('should grow the perimeter for a 4x3 grid (10 cells)', () => {
    const wrapper = mount(SnLucky, { props: { prizes, rows: 4, cols: 3 } });
    expect(wrapper.findAll('.sn-lucky__cell').length).toBe(10);
  });

  it('should forward cellHeight as the --sn-lucky-cell variable (regression: the prop was accepted but never bound)', () => {
    const wrapper = mount(SnLucky, { props: { prizes, cellHeight: '44px' } });
    expect(wrapper.attributes('style')).toContain('--sn-lucky-cell: 44px');
  });

  it('should forward gutter as the grid gap and padding', () => {
    const wrapper = mount(SnLucky, { props: { prizes, gutter: '8px' } });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('gap: 8px');
    expect(style).toContain('padding: 8px');
  });

  it('should render the prize image inside the cell', () => {
    const wrapper = mount(SnLucky, {
      props: {
        prizes: [{ name: '实物奖', img: 'https://example.com/prize.png' }, ...prizes.slice(1)],
      },
    });
    expect(wrapper.find('image').attributes('src')).toBe('https://example.com/prize.png');
  });

  it('should forward customClass and customStyle to the root', () => {
    const wrapper = mount(SnLucky, {
      props: { prizes, customClass: 'my-lucky', customStyle: 'margin: 4px' },
    });
    expect(wrapper.classes()).toContain('my-lucky');
    expect(wrapper.attributes('style')).toContain('margin: 4px');
  });
});

describe('SnLucky play / stop flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should ignore a second play() while already cycling', () => {
    const wrapper = mount(SnLucky, { props: { prizes } });
    const api = wrapper.vm as unknown as { play: () => void };
    api.play();
    api.play();
    expect(wrapper.emitted('start')).toHaveLength(1);
  });

  it('should emit start when the button is tapped and not again while playing', async () => {
    const wrapper = mount(SnLucky, { props: { prizes } });
    await wrapper.find('.sn-lucky__button').trigger('tap');
    expect(wrapper.emitted('start')).toHaveLength(1);
    await wrapper.find('.sn-lucky__button').trigger('tap');
    expect(wrapper.emitted('start')).toHaveLength(1);
  });

  it('should switch the button label while playing and flip the hover state', async () => {
    const wrapper = mount(SnLucky, { props: { prizes } });
    const button = wrapper.find('.sn-lucky__button');
    expect(button.text()).toContain('立即抽奖');
    expect(button.attributes('hover-class')).toBe('sn-lucky__button--down');
    (wrapper.vm as unknown as { play: () => void }).play();
    await wrapper.vm.$nextTick();
    expect(button.text()).toContain('抽奖中');
    expect(button.attributes('hover-class')).toBe('none');
  });

  it('should clamp the stop index into the perimeter', async () => {
    const wrapper = mount(SnLucky, { props: { prizes, speed: 20 } });
    const api = wrapper.vm as unknown as { play: () => void; stop: (index: number) => void };
    api.play();
    api.stop(99);
    vi.advanceTimersByTime(60000);
    expect(wrapper.emitted('end')?.[0]).toEqual([7]);
  });

  it('should settle on the requested prize after the deceleration walk', async () => {
    const wrapper = mount(SnLucky, { props: { prizes, speed: 20 } });
    const api = wrapper.vm as unknown as { play: () => void; stop: (index: number) => void };
    api.play();
    vi.advanceTimersByTime(60);
    api.stop(4);
    vi.advanceTimersByTime(60000);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('end')?.[0]).toEqual([4]);
    // 落定后唯一高亮格停在目标奖品上，且使用其激活色。
    const active = wrapper.find('.sn-lucky__cell--active');
    expect(active.exists()).toBe(true);
  });

  it('should keep the highlight cycling between play and stop', async () => {
    const wrapper = mount(SnLucky, { props: { prizes, speed: 16 } });
    const api = wrapper.vm as unknown as { play: () => void };
    api.play();
    vi.advanceTimersByTime(16);
    await wrapper.vm.$nextTick();
    const firstActive = wrapper.find('.sn-lucky__cell--active');
    vi.advanceTimersByTime(16);
    await wrapper.vm.$nextTick();
    const secondActive = wrapper.find('.sn-lucky__cell--active');
    // 步进推进：高亮移动到了下一个周长格。
    expect(firstActive.element).not.toBe(secondActive.element);
  });

  it('should light the active cell with the prize color when provided', async () => {
    const wrapper = mount(SnLucky, {
      props: {
        prizes: [{ name: '一等奖' }, { name: '二等奖', color: '#ff8800' }, ...prizes.slice(2)],
        speed: 20,
      },
    });
    (wrapper.vm as unknown as { play: () => void }).play();
    // 第一拍 → 周长序 1（二等奖）。
    vi.advanceTimersByTime(20);
    await wrapper.vm.$nextTick();
    const active = wrapper.find('.sn-lucky__cell--active');
    expect(active.attributes('style')).toContain('background-color: #ff8800');
  });

  it('should clear all timers on unmount mid-cycle (no end, no errors)', () => {
    const onEnd = vi.fn();
    const wrapper = mount(SnLucky, { props: { prizes, speed: 20, onEnd } });
    (wrapper.vm as unknown as { play: () => void }).play();
    wrapper.unmount();
    vi.advanceTimersByTime(60000);
    expect(onEnd).not.toHaveBeenCalled();
  });

  it('should clear the deceleration chain on unmount mid-walk', () => {
    const onEnd = vi.fn();
    const wrapper = mount(SnLucky, { props: { prizes, speed: 20, onEnd } });
    const api = wrapper.vm as unknown as { play: () => void; stop: (index: number) => void };
    api.play();
    api.stop(4);
    wrapper.unmount();
    vi.advanceTimersByTime(60000);
    expect(onEnd).not.toHaveBeenCalled();
  });

  it('should clamp very small speed values to the 16ms minimum step interval', async () => {
    const wrapper = mount(SnLucky, { props: { prizes, speed: 1 } });
    (wrapper.vm as unknown as { play: () => void }).play();
    // 15ms < 16ms：第一步尚未发生，没有格子被点亮。
    vi.advanceTimersByTime(15);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-lucky__cell--active').length).toBe(0);
    // 到 16ms 恰好走完第一步。
    vi.advanceTimersByTime(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.sn-lucky__cell--active').length).toBe(1);
  });
});

describe('SnLucky slots', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the prize slot with item, index and isActive', async () => {
    const wrapper = mount(SnLucky, {
      props: { prizes, speed: 20 },
      slots: {
        prize: `<template #prize="params">
          <text class="slot-cell" :class="{ on: params.isActive }">{{ params.item?.name }}@{{ params.index }}</text>
        </template>`,
      },
    });
    const cells = wrapper.findAll('.slot-cell');
    expect(cells).toHaveLength(8);
    expect(cells[0]?.text()).toBe('一等奖@0');
    (wrapper.vm as unknown as { play: () => void }).play();
    vi.advanceTimersByTime(20);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.slot-cell.on').length).toBe(1);
  });

  it('should render the prize slot placeholder for empty perimeter cells', () => {
    const wrapper = mount(SnLucky, {
      props: { prizes: prizes.slice(0, 2) },
      slots: {
        prize: `<template #prize="params">
          <text class="slot-cell">{{ params.item ? params.item.name : '空' }}@{{ params.index }}</text>
        </template>`,
      },
    });
    const cells = wrapper.findAll('.slot-cell');
    expect(cells[0]?.text()).toBe('一等奖@0');
    expect(cells[2]?.text()).toBe('空@2');
  });

  it('should pass isPlaying to the button slot', async () => {
    const wrapper = mount(SnLucky, {
      props: { prizes },
      slots: {
        button: `<template #button="params">
          <text class="slot-button">{{ params.isPlaying ? '转动中' : '开始' }}</text>
        </template>`,
      },
    });
    expect(wrapper.find('.slot-button').text()).toBe('开始');
    (wrapper.vm as unknown as { play: () => void }).play();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.slot-button').text()).toBe('转动中');
    // 自定义按钮替换默认文案。
    expect(wrapper.find('.sn-lucky__button-text').exists()).toBe(false);
  });
});
