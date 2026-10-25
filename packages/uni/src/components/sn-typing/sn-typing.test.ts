import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnTyping from './sn-typing.vue';

describe('SnTyping', () => {
  it('should render the text and three dots by default', () => {
    const wrapper = mount(SnTyping);
    expect(wrapper.find('.sn-typing__text').text()).toBe('输入中');
    expect(wrapper.findAll('.sn-typing__dot').length).toBe(3);
  });

  it('should render dots only when text is empty', () => {
    const wrapper = mount(SnTyping, { props: { text: '' } });
    expect(wrapper.find('.sn-typing__text').exists()).toBe(false);
    expect(wrapper.findAll('.sn-typing__dot').length).toBe(3);
  });

  it('should clamp dotCount into 1-5', () => {
    const wrapper = mount(SnTyping, { props: { dotCount: 99 } });
    expect(wrapper.findAll('.sn-typing__dot').length).toBe(5);
  });

  it('should stagger dot delays by index', () => {
    const wrapper = mount(SnTyping, { props: { speed: 300 } });
    const first = wrapper.find('.sn-typing__dot--1');
    const second = wrapper.find('.sn-typing__dot--2');
    expect(first.attributes('style')).toContain('animation-delay: 0ms');
    expect(second.attributes('style')).toContain('animation-delay: 100ms');
  });
});
