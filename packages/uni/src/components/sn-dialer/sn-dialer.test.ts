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
