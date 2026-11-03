import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnProHeader from './SnProHeader.vue';

const menus = [
  { key: 'home', label: '首页' },
  { key: 'system', label: '系统', children: [{ key: 'user', label: '用户' }] },
];

describe('SnProHeader', () => {
  it('should render the collapse toggle by default and emit toggle-collapse', async () => {
    const wrapper = mount(SnProHeader, {});
    await wrapper.find('.sn-pro-header__toggle').trigger('click');
    expect(wrapper.emitted('toggle-collapse')).toHaveLength(1);
  });

  it('should hide the toggle when showCollapse is false', () => {
    const wrapper = mount(SnProHeader, { props: { showCollapse: false } });
    expect(wrapper.find('.sn-pro-header__toggle').exists()).toBe(false);
  });

  it('should render breadcrumb items when no menus are given', () => {
    const wrapper = mount(SnProHeader, { props: { breadcrumb: ['系统', '用户'] } });
    const items = wrapper.findAll('.sn-breadcrumb-item__link');
    expect(items.map((i) => i.text())).toEqual(['系统', '用户']);
  });

  it('should render the horizontal menu when menus are given and drop the breadcrumb', () => {
    const wrapper = mount(SnProHeader, { props: { menus, breadcrumb: ['系统'] } });
    const menu = wrapper.findComponent({ name: 'SnMenu' });
    expect(menu.exists()).toBe(true);
    expect(menu.props('mode')).toBe('horizontal');
    expect(wrapper.find('.sn-breadcrumb-item__link').exists()).toBe(false);
  });

  it('should forward select from the horizontal menu', async () => {
    const wrapper = mount(SnProHeader, { props: { menus } });
    wrapper.findComponent({ name: 'SnMenu' }).vm.$emit('select', 'home', menus[0]!);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('home');
  });

  it('should render the brand area only when showBrand is set', () => {
    const without = mount(SnProHeader, { props: { title: 'Admin' } });
    expect(without.find('.sn-pro-logo__title').exists()).toBe(false);
    const withBrand = mount(SnProHeader, { props: { showBrand: true, title: 'Admin' } });
    expect(withBrand.find('.sn-pro-logo__title').text()).toBe('Admin');
  });

  it('should render actions through the default slot', () => {
    const wrapper = mount(SnProHeader, { slots: { default: '<button class="act">ok</button>' } });
    expect(wrapper.find('.sn-pro-header__actions .act').exists()).toBe(true);
  });

  it('should prefer the center slot over breadcrumb', () => {
    const wrapper = mount(SnProHeader, {
      props: { breadcrumb: ['系统'] },
      slots: { center: '<div class="custom-center">x</div>' },
    });
    expect(wrapper.find('.custom-center').exists()).toBe(true);
    expect(wrapper.find('.sn-breadcrumb-item__link').exists()).toBe(false);
  });
});
