import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnDialer from './sn-dialer.vue';

const prizes = [
  { id: 'a', name: '一等奖' },
  { id: 'b', name: '二等奖' },
  { id: 'c', name: '三等奖' },
  { id: 'thanks', name: '谢谢参与' },
];

describe('SnDialer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should emit click when the pointer is tapped', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes } });
    await wrapper.find('.sn-dialer__pointer').trigger('tap');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('should rotate to the target prize and emit done(index)', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes, duration: 3 } });
    (wrapper.vm as unknown as { run: (index: number) => void }).run(2);
    await wrapper.vm.$nextTick();
    // 3 秒过渡未结束时不得派发 done。
    vi.advanceTimersByTime(2999);
    expect(wrapper.emitted('done')).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('done')?.[0]).toEqual([2]);
  });

  it('should ignore run() while spinning', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes, duration: 3 } });
    const api = wrapper.vm as unknown as { run: (index: number) => void };
    api.run(0);
    api.run(1);
    vi.advanceTimersByTime(3000);
    expect(wrapper.emitted('done')).toHaveLength(1);
    expect(wrapper.emitted('done')?.[0]).toEqual([0]);
  });

  it('should render one rotated sector per prize', () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes } });
    expect(wrapper.findAll('.sn-dialer__wheel > view').length).toBe(prizes.length * 2);
  });
});

describe('SnDialer run() targeting', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should clamp an out-of-range index into the prize list', async () => {
    const high = mount(SnDialer, { props: { prizeList: prizes } });
    (high.vm as unknown as { run: (index: number) => void }).run(99);
    vi.advanceTimersByTime(3000);
    expect(high.emitted('done')?.[0]).toEqual([3]);

    const low = mount(SnDialer, { props: { prizeList: prizes } });
    (low.vm as unknown as { run: (index: number) => void }).run(-1);
    vi.advanceTimersByTime(3000);
    expect(low.emitted('done')?.[0]).toEqual([0]);
  });

  it('should round a fractional index to the nearest sector', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes } });
    (wrapper.vm as unknown as { run: (index: number) => void }).run(1.6);
    vi.advanceTimersByTime(3000);
    expect(wrapper.emitted('done')?.[0]).toEqual([2]);
  });

  it('should do nothing when the prize list is empty', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: [] } });
    (wrapper.vm as unknown as { run: (index: number) => void }).run(0);
    vi.advanceTimersByTime(10000);
    expect(wrapper.emitted('done')).toBeUndefined();
    expect(wrapper.findAll('.sn-dialer__wheel > view').length).toBe(0);
  });

  it('should render no sectors below the two-prize minimum', () => {
    const wrapper = mount(SnDialer, { props: { prizeList: [{ id: 'a', name: '唯一奖' }] } });
    expect(wrapper.findAll('.sn-dialer__wheel > view').length).toBe(0);
  });

  it('should land the pointer centered on the target sector (mod 360)', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes, turns: 5 } });
    (wrapper.vm as unknown as { run: (index: number) => void }).run(0);
    await wrapper.vm.$nextTick();
    const deg = readRotation(wrapper);
    // 指针在正上方：扇区 0 的中心对应 315deg（旋转坐标），且至少转满 turns 圈。
    expect(deg % 360).toBeCloseTo(315, 5);
    expect(deg).toBeGreaterThanOrEqual(5 * 360);
  });

  it('should honor fewer turns and land on another sector', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes, turns: 2 } });
    const api = wrapper.vm as unknown as { run: (index: number) => void };
    api.run(3);
    await wrapper.vm.$nextTick();
    const deg = readRotation(wrapper);
    expect(deg % 360).toBeCloseTo(45, 5);
    expect(deg).toBeGreaterThanOrEqual(2 * 360);
  });

  it('should emit done through the host handler and stay silent after unmount mid-spin', async () => {
    const onDone = vi.fn();
    const wrapper = mount(SnDialer, { props: { prizeList: prizes, onDone } });
    (wrapper.vm as unknown as { run: (index: number) => void }).run(1);
    vi.advanceTimersByTime(1000);
    wrapper.unmount();
    const callsAtUnmount = onDone.mock.calls.length;
    vi.advanceTimersByTime(5000);
    expect(onDone.mock.calls.length).toBe(callsAtUnmount);
  });
});

/** Parse the wheel rotation angle from the inline transform style. */
function readRotation(wrapper: { find: (sel: string) => { attributes: (a: string) => string | undefined } }): number {
  const style = wrapper.find('.sn-dialer__wheel').attributes('style') ?? '';
  const match = /rotate\((-?[\d.]+)deg\)/.exec(style);
  expect(match, 'wheel must carry a rotate() transform while spinning').not.toBeNull();
  return Number(match![1]);
}

describe('SnDialer pointer and spin state', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not emit click while spinning, and recover after settle', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes } });
    (wrapper.vm as unknown as { run: (index: number) => void }).run(0);
    await wrapper.find('.sn-dialer__pointer').trigger('tap');
    expect(wrapper.emitted('click')).toBeUndefined();
    vi.advanceTimersByTime(3000);
    await wrapper.find('.sn-dialer__pointer').trigger('tap');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('should reflect the pressed state through hover-class and freeze it while spinning', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes } });
    const pointer = wrapper.find('.sn-dialer__pointer');
    expect(pointer.attributes('hover-class')).toBe('sn-dialer__pointer--down');
    (wrapper.vm as unknown as { run: (index: number) => void }).run(0);
    await wrapper.vm.$nextTick();
    expect(pointer.attributes('hover-class')).toBe('none');
    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();
    expect(pointer.attributes('hover-class')).toBe('sn-dialer__pointer--down');
  });

  it('should carry the transition duration from the duration prop', () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes, duration: 2 } });
    expect(wrapper.find('.sn-dialer__wheel').attributes('style')).toContain(
      'transition: transform 2s',
    );
  });

  it('should settle a zero-duration spin on the minimum timer', async () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes, duration: 0 } });
    (wrapper.vm as unknown as { run: (index: number) => void }).run(0);
    vi.advanceTimersByTime(99);
    expect(wrapper.emitted('done')).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted('done')?.[0]).toEqual([0]);
  });
});

describe('SnDialer slots and styling', () => {
  it('should render prize content from the prize slot with item and index', () => {
    const wrapper = mount(SnDialer, {
      props: { prizeList: prizes },
      slots: {
        prize: `<template #prize="params">
          <text class="pz">{{ params.item.name }}#{{ params.index }}</text>
        </template>`,
      },
    });
    const cells = wrapper.findAll('.pz');
    expect(cells).toHaveLength(4);
    expect(cells[0]?.text()).toBe('一等奖#0');
    expect(cells[3]?.text()).toBe('谢谢参与#3');
    // The default name/image rendering is replaced.
    expect(wrapper.find('.sn-dialer__prize-name').exists()).toBe(false);
  });

  it('should render the prize image with its source', () => {
    const wrapper = mount(SnDialer, {
      props: {
        prizeList: [
          { id: 'a', name: '实物奖', img: 'https://example.com/prize.png' },
          { id: 'b', name: '谢谢参与' },
        ],
      },
    });
    expect(wrapper.find('image').attributes('src')).toBe('https://example.com/prize.png');
  });

  it('should let the pointer slot replace the default GO button', () => {
    const wrapper = mount(SnDialer, {
      props: { prizeList: prizes },
      slots: { pointer: '<text class="my-pointer">START</text>' },
    });
    expect(wrapper.find('.sn-dialer__pointer-text').exists()).toBe(false);
    expect(wrapper.find('.my-pointer').text()).toBe('START');
  });

  it('should give the winning-prize color precedence over the alternating palette', () => {
    const wrapper = mount(SnDialer, {
      props: {
        prizeList: [
          { id: 'a', name: '一等奖' },
          { id: 'b', name: '二等奖', color: '#ff0000' },
        ],
      },
    });
    const sectors = wrapper.findAll('.sn-dialer__wheel > view').slice(0, 2);
    expect(sectors[0]?.attributes('style')).toContain('background-color: #FFF0A3');
    expect(sectors[1]?.attributes('style')).toContain('background-color: #ff0000');
  });

  it('should alternate the palette across more prizes than colors', () => {
    const wrapper = mount(SnDialer, {
      props: {
        prizeList: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
        ],
        prizeBgColors: ['#111111', '#222222', '#333333'],
      },
    });
    const sectors = wrapper.findAll('.sn-dialer__wheel > view').slice(0, 3);
    expect(sectors[0]?.attributes('style')).toContain('background-color: #111111');
    expect(sectors[1]?.attributes('style')).toContain('background-color: #222222');
    expect(sectors[2]?.attributes('style')).toContain('background-color: #333333');

    const four = mount(SnDialer, {
      props: {
        prizeList: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
          { id: 'c', name: 'C' },
          { id: 'd', name: 'D' },
        ],
        prizeBgColors: ['#111111', '#222222', '#333333'],
      },
    });
    const fourth = four.findAll('.sn-dialer__wheel > view')[3];
    expect(fourth?.attributes('style')).toContain('background-color: #111111');
  });

  it('should style the default prize names with fontSize and color', () => {
    const wrapper = mount(SnDialer, {
      props: { prizeList: prizes, fontSize: '10px', color: '#00ff00' },
    });
    const style = wrapper.find('.sn-dialer__prize-name').attributes('style') ?? '';
    expect(style).toContain('font-size: 10px');
    expect(style).toContain('color: #00ff00');
  });

  it('should size the wheel and color the border from the props', () => {
    const wrapper = mount(SnDialer, {
      props: { prizeList: prizes, size: '300px', borderColor: '#112233' },
    });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('width: 300px');
    expect(style).toContain('height: 300px');
    expect(style).toContain('border-color: #112233');
  });

  it('should forward customClass and customStyle to the root', () => {
    const wrapper = mount(SnDialer, {
      props: { prizeList: prizes, customClass: 'my-dialer', customStyle: 'margin: 4px' },
    });
    expect(wrapper.classes()).toContain('my-dialer');
    expect(wrapper.attributes('style')).toContain('margin: 4px');
  });

  it('should expose the dialer as an image region', () => {
    const wrapper = mount(SnDialer, { props: { prizeList: prizes } });
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('dialer');
  });
});
