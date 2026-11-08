import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { SnMenuOption } from '@snui/vue-web';
import SnProUser from './SnProUser.vue';

const menus: SnMenuOption[] = [
  { key: 'profile', label: '个人中心' },
  { key: 'logout', label: '退出登录' },
];

const mountUser = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(SnProUser, {
    props: { name: 'Mia', description: '管理员', menus, ...props },
    slots,
  });

const dropdownOf = (wrapper: ReturnType<typeof mountUser>) =>
  wrapper.findComponent({ name: 'SnDropdown' });

describe('SnProUser', () => {
  it('should render the name, the description and the avatar letter', () => {
    const wrapper = mountUser();
    expect(wrapper.find('.sn-pro-user__name').text()).toBe('Mia');
    expect(wrapper.find('.sn-pro-user__desc').text()).toBe('管理员');
    expect(wrapper.find('.sn-avatar__text').text()).toBe('M');
  });

  it('should omit the description line when none is given', () => {
    const wrapper = mountUser({ description: '' });
    expect(wrapper.find('.sn-pro-user__desc').exists()).toBe(false);
  });

  it('should pass the avatar url through to SnAvatar', () => {
    const wrapper = mountUser({ avatar: 'https://example.com/a.png' });
    expect(wrapper.find('img.sn-avatar__img').attributes('src')).toBe('https://example.com/a.png');
  });

  it('should show only the avatar while collapsed', () => {
    const wrapper = mountUser({ collapsed: true });
    expect(wrapper.find('.sn-pro-user__meta').exists()).toBe(false);
    expect(wrapper.find('.sn-pro-user__trigger--collapsed').exists()).toBe(true);
    expect(wrapper.find('.sn-avatar__text').text()).toBe('M');
  });

  it('should label the trigger button', () => {
    const wrapper = mountUser({ menuLabel: '账户菜单' });
    const trigger = wrapper.find('.sn-pro-user__trigger');
    expect(trigger.attributes('aria-label')).toBe('账户菜单');
    expect(trigger.attributes('type')).toBe('button');
  });

  it('should map the menus into dropdown options', () => {
    const wrapper = mountUser();
    const options = dropdownOf(wrapper).props('options') as Array<{ key: string; label: string }>;
    expect(options.map((option) => option.key)).toEqual(['profile', 'logout']);
    expect(options[0]).toMatchObject({ label: '个人中心' });
  });

  it('should open the panel above the card by default and on click', () => {
    const wrapper = mountUser();
    const dropdown = dropdownOf(wrapper);
    expect(dropdown.props('placement')).toBe('top-start');
    expect(dropdown.props('trigger')).toBe('click');
  });

  it('should forward dropdown selections', async () => {
    const wrapper = mountUser();
    dropdownOf(wrapper).vm.$emit('select', 'logout', { key: 'logout', label: '退出登录' });
    await wrapper.vm.$nextTick();
    const [key, item] = wrapper.emitted('select')?.[0] ?? [];
    expect(key).toBe('logout');
    expect(item).toMatchObject({ key: 'logout' });
  });

  it('should replace the card content via the default slot', () => {
    const wrapper = mountUser({}, { default: '<div class="custom-card">me</div>' });
    expect(wrapper.find('.custom-card').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-user__name').exists()).toBe(false);
  });
});
