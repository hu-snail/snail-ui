import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnProLogo from './SnProLogo.vue';

describe('SnProLogo', () => {
  it('should render mark tile and title by default', () => {
    const wrapper = mount(SnProLogo, { props: { title: 'Admin' } });
    expect(wrapper.find('.sn-pro-logo__mark').text()).toBe('S');
    expect(wrapper.find('.sn-pro-logo__title').text()).toBe('Admin');
  });

  it('should render the image mark when logo url is given', () => {
    const wrapper = mount(SnProLogo, {
      props: { logo: 'https://example.com/x.png', title: 'Admin' },
    });
    expect(wrapper.find('img.sn-pro-logo__img').attributes('src')).toBe(
      'https://example.com/x.png',
    );
    expect(wrapper.find('.sn-pro-logo__mark').exists()).toBe(false);
  });

  it('should hide the title while collapsed', () => {
    const wrapper = mount(SnProLogo, { props: { title: 'Admin', collapsed: true } });
    expect(wrapper.find('.sn-pro-logo__title').exists()).toBe(false);
    expect(wrapper.find('.sn-pro-logo__mark').exists()).toBe(true);
  });

  it('should use the custom mark letter', () => {
    const wrapper = mount(SnProLogo, { props: { mark: 'A' } });
    expect(wrapper.find('.sn-pro-logo__mark').text()).toBe('A');
  });

  it('should replace the whole brand content via default slot', () => {
    const wrapper = mount(SnProLogo, {
      slots: { default: '<div class="custom-brand">brand</div>' },
    });
    expect(wrapper.find('.custom-brand').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-logo__mark').exists()).toBe(false);
  });

  it('should replace only the mark via icon slot keeping the title', () => {
    const wrapper = mount(SnProLogo, {
      props: { title: 'Admin' },
      slots: { icon: '<i class="custom-icon"/>' },
    });
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-logo__mark').exists()).toBe(false);
    expect(wrapper.find('.sn-pro-logo__title').text()).toBe('Admin');
  });
});
