import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnScratchcard from './sn-scratchcard.vue';

describe('SnScratchcard', () => {
  it('should render slot content under the cover', () => {
    const wrapper = mount(SnScratchcard, {
      slots: { default: '<view class="prize">恭喜中奖</view>' },
    });
    expect(wrapper.find('.prize').exists()).toBe(true);
  });

  it('should degrade to tap-to-reveal when no element canvas exists', async () => {
    const wrapper = mount(SnScratchcard, { props: { title: '刮一刮' } });
    await wrapper.vm.$nextTick();
    // happy-dom 的 canvas 无 2d 上下文 → 显式降级为点按揭示。
    expect(wrapper.find('.sn-scratchcard__cover').exists()).toBe(true);
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.find('.sn-scratchcard__cover--revealed').exists()).toBe(true);
  });

  it('should not re-emit open after already revealed', async () => {
    const wrapper = mount(SnScratchcard);
    await wrapper.vm.$nextTick();
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    expect(wrapper.emitted('open')).toHaveLength(1);
  });

  it('should re-hide the cover after reset()', async () => {
    const wrapper = mount(SnScratchcard);
    await wrapper.vm.$nextTick();
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    (wrapper.vm as unknown as { reset: () => void }).reset();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-scratchcard__cover--revealed').exists()).toBe(false);
  });
});
