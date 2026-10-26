import { describe, expect, it } from 'vitest';
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
