import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnProSider from './SnProSider.vue';

const menus = [
  { key: 'home', label: '首页' },
  { key: 'system', label: '系统', children: [{ key: 'user', label: '用户' }] },
];

describe('SnProSider', () => {
  it('should render brand area and vertical menu', () => {
    const wrapper = mount(SnProSider, { props: { menus, title: 'Admin' } });
    expect(wrapper.find('.sn-pro-logo__title').text()).toBe('Admin');
    expect(wrapper.find('.sn-menu').exists()).toBe(true);
  });

  it('should forward select from the menu', async () => {
    const wrapper = mount(SnProSider, { props: { menus } });
    const menu = wrapper.findComponent({ name: 'SnMenu' });
    menu.vm.$emit('select', 'home', menus[0]!);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('home');
  });

  it('should reflect collapsed state on the root and the menu', () => {
    const wrapper = mount(SnProSider, { props: { menus, collapsed: true } });
    expect(wrapper.find('.sn-pro-sider--collapsed').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SnMenu' }).props('collapsed')).toBe(true);
  });

  it('should apply the inverted dark surface class and forward inverted to the menu', () => {
    const wrapper = mount(SnProSider, { props: { menus, inverted: true } });
    expect(wrapper.find('.sn-pro-sider--inverted').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SnMenu' }).props('inverted')).toBe(true);
  });

  it('should hide the brand when showBrand is false', () => {
    const wrapper = mount(SnProSider, { props: { menus, showBrand: false, title: 'Admin' } });
    expect(wrapper.find('.sn-pro-sider__brand').exists()).toBe(false);
  });

  it('should forward expanded keys to the menu when provided', () => {
    const wrapper = mount(SnProSider, { props: { menus, expandedKeys: ['system'] } });
    expect(wrapper.findComponent({ name: 'SnMenu' }).props('expandedKeys')).toEqual(['system']);
  });

  it('should forward update:expandedKeys from the menu', async () => {
    const wrapper = mount(SnProSider, { props: { menus, expandedKeys: [] } });
    const menu = wrapper.findComponent({ name: 'SnMenu' });
    menu.vm.$emit('update:expandedKeys', ['system']);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:expandedKeys')?.[0]?.[0]).toEqual(['system']);
  });
});
