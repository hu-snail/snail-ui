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

  it('should announce itself as a status region', () => {
    const wrapper = mount(SnTyping);
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('aria-label')).toBe('typing');
  });

  it('should render a single dot for dotCount 0 or negative (minimum clamp)', () => {
    expect(mount(SnTyping, { props: { dotCount: 0 } }).findAll('.sn-typing__dot').length).toBe(1);
    expect(mount(SnTyping, { props: { dotCount: -2 } }).findAll('.sn-typing__dot').length).toBe(1);
  });

  it('should render five dots at the upper clamp', () => {
    const wrapper = mount(SnTyping, { props: { dotCount: 5 } });
    expect(wrapper.findAll('.sn-typing__dot').length).toBe(5);
    expect(wrapper.find('.sn-typing__dot--5').exists()).toBe(true);
  });

  it('should give every dot the active color', () => {
    const wrapper = mount(SnTyping, { props: { activeDotColor: '#00ff00' } });
    for (const dot of wrapper.findAll('.sn-typing__dot')) {
      expect(dot.attributes('style')).toContain('background-color: #00ff00');
    }
  });

  it('should forward speed as the pulse duration on every dot', () => {
    const wrapper = mount(SnTyping, { props: { speed: 500 } });
    for (const dot of wrapper.findAll('.sn-typing__dot')) {
      expect(dot.attributes('style')).toContain('animation-duration: 500ms');
    }
  });

  it('should delay the last dot by (count - 1) / 3 of the period', () => {
    const wrapper = mount(SnTyping, { props: { speed: 300 } });
    expect(wrapper.find('.sn-typing__dot--3').attributes('style')).toContain(
      'animation-delay: 200ms',
    );
  });

  it('should forward customClass and customStyle to the root', () => {
    const wrapper = mount(SnTyping, {
      props: { customClass: 'my-typing', customStyle: 'padding: 2px' },
    });
    expect(wrapper.classes()).toContain('my-typing');
    expect(wrapper.attributes('style')).toContain('padding: 2px');
  });

  it('should render custom text through the text prop', () => {
    const wrapper = mount(SnTyping, { props: { text: '对方正在输入' } });
    expect(wrapper.find('.sn-typing__text').text()).toBe('对方正在输入');
  });
});
