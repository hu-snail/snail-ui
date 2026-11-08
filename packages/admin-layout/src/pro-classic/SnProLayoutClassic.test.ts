import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { SnMenuOption } from '@snui/vue-web';
import SnProLayoutClassic from './SnProLayoutClassic.vue';

const menus: SnMenuOption[] = [
  { key: 'home', label: '首页' },
  {
    key: 'system',
    label: '系统管理',
    children: [
      { key: 'user', label: '用户管理' },
      { key: 'role', label: '角色权限' },
    ],
  },
];

const user = { name: 'Mia', description: '管理员' };

const mountLayout = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(SnProLayoutClassic, {
    props: { menus, title: 'Admin', ...props },
    slots: { default: '<div class="page">content</div>', ...slots },
  });

const searchOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.findComponent({ name: 'SnProSearch' });
const noticeOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.findComponent({ name: 'SnProNotice' });
const userOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.findComponent({ name: 'SnProUser' });
const navMenuOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.find('.sn-pro-classic__nav').findComponent({ name: 'SnMenu' });

describe('SnProLayoutClassic · structure', () => {
  it('should render the sider (brand + menu) and the body (header + content)', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('.sn-pro-classic').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-classic__sider').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-classic__brand .sn-pro-logo').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-classic__nav').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-classic__header').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-classic__content .page').exists()).toBe(true);
  });

  it('should render the brand title and the vertical menu', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('.sn-pro-classic__brand .sn-pro-logo__title').text()).toBe('Admin');
    const menu = navMenuOf(wrapper);
    expect(menu.props('mode')).toBe('vertical');
    expect(menu.props('options')).toHaveLength(2);
  });

  it('should pin to the viewport by default and stay embeddable with fixed=false', () => {
    expect(mountLayout().find('.sn-pro-classic--fixed').exists()).toBe(true);
    expect(mountLayout({ fixed: false }).find('.sn-pro-classic--fixed').exists()).toBe(false);
  });

  it('should apply the configured sider widths as CSS variables', () => {
    const wrapper = mountLayout({ siderWidth: 260, siderCollapsedWidth: 64 });
    const style = wrapper.find('.sn-pro-classic__sider').attributes('style') ?? '';
    expect(style).toContain('--sn-pro-classic-sider-width: 260px');
    expect(style).toContain('--sn-pro-classic-sider-collapsed-width: 64px');
  });
});

describe('SnProLayoutClassic · breadcrumb + title', () => {
  it('should derive the breadcrumb from the active menu path', () => {
    const wrapper = mountLayout({ activeKey: 'user' });
    expect(wrapper.findAll('.sn-breadcrumb-item__link').map((i) => i.text())).toEqual([
      '系统管理',
      '用户管理',
    ]);
  });

  it('should prefer the explicit breadcrumb prop', () => {
    const wrapper = mountLayout({ activeKey: 'user', breadcrumb: ['A', 'B'] });
    expect(wrapper.findAll('.sn-breadcrumb-item__link').map((i) => i.text())).toEqual(['A', 'B']);
  });

  it('should hide the breadcrumb when nothing is derivable', () => {
    const wrapper = mountLayout({ activeKey: null });
    expect(wrapper.find('.sn-pro-classic__crumb').exists()).toBe(false);
  });

  it('should render the module heading in a title band', () => {
    const wrapper = mountLayout({ pageTitle: '用户管理' });
    expect(wrapper.find('.sn-pro-classic__title-band').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-classic__heading').text()).toBe('用户管理');
  });

  it('should drop the title band when no heading is provided', () => {
    expect(mountLayout().find('.sn-pro-classic__title-band').exists()).toBe(false);
  });

  it('should replace the heading via the title slot', () => {
    const wrapper = mountLayout({}, { title: '<h2 class="custom-title">自定义</h2>' });
    expect(wrapper.find('.sn-pro-classic__title-band .custom-title').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-classic__heading').exists()).toBe(false);
  });
});

describe('SnProLayoutClassic · collapse', () => {
  it('should toggle uncontrolled and emit update:collapsed', async () => {
    const wrapper = mountLayout();
    await wrapper.find('.sn-pro-classic__toggle').trigger('click');
    expect(wrapper.emitted('update:collapsed')?.[0]?.[0]).toBe(true);
    expect(wrapper.find('.sn-pro-classic--collapsed').exists()).toBe(true);
  });

  it('should stay controlled when the collapsed prop is provided', async () => {
    const wrapper = mountLayout({ collapsed: true });
    expect(wrapper.find('.sn-pro-classic--collapsed').exists()).toBe(true);
    await wrapper.find('.sn-pro-classic__toggle').trigger('click');
    expect(wrapper.emitted('update:collapsed')?.[0]?.[0]).toBe(false);
    // Controlled: the prop decides the DOM until the parent updates it.
    expect(wrapper.find('.sn-pro-classic--collapsed').exists()).toBe(true);
  });

  it('should hide the collapse toggle when showCollapse is false', () => {
    expect(mountLayout({ showCollapse: false }).find('.sn-pro-classic__toggle').exists()).toBe(
      false,
    );
  });

  it('should label the collapse toggle', () => {
    const wrapper = mountLayout({ collapseLabel: '收起导航' });
    expect(wrapper.find('.sn-pro-classic__toggle').attributes('aria-label')).toBe('收起导航');
  });

  it('should fold the user card with the sider', () => {
    const expanded = mountLayout({ user });
    expect(userOf(expanded).props('collapsed')).toBe(false);
    expect(userOf(mountLayout({ user, collapsed: true })).props('collapsed')).toBe(true);
  });
});

describe('SnProLayoutClassic · search area', () => {
  it('should render the menu search box and forward its selection', async () => {
    const wrapper = mountLayout();
    const search = searchOf(wrapper);
    expect(search.props('menus')).toHaveLength(2);

    search.vm.$emit('select', 'role', { key: 'role', label: '角色权限' });
    await wrapper.vm.$nextTick();
    const [key, item] = wrapper.emitted('search-select')?.[0] ?? [];
    expect(key).toBe('role');
    expect(item).toMatchObject({ key: 'role' });
  });

  it('should hide the search box when showSearch is false', () => {
    expect(mountLayout({ showSearch: false }).findComponent({ name: 'SnProSearch' }).exists()).toBe(
      false,
    );
  });

  it('should replace the search area via the search slot', () => {
    const wrapper = mountLayout({}, { search: '<div class="custom-search"/>' });
    expect(wrapper.find('.sn-pro-classic__actions .custom-search').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SnProSearch' }).exists()).toBe(false);
  });
});

describe('SnProLayoutClassic · notice area', () => {
  const noticeItems = [{ key: 'n1', label: '构建完成' }];

  it('should render the bell and forward select / read-all', async () => {
    const wrapper = mountLayout({ noticeCount: 2, noticeItems });
    const notice = noticeOf(wrapper);
    expect(notice.props('count')).toBe(2);
    expect(notice.props('items')).toEqual(noticeItems);

    notice.vm.$emit('select', 'n1', noticeItems[0]);
    notice.vm.$emit('read-all');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('notice-select')?.[0]?.[0]).toBe('n1');
    expect(wrapper.emitted('notice-read-all')).toHaveLength(1);
  });

  it('should hide the bell when showNotice is false', () => {
    expect(mountLayout({ showNotice: false }).findComponent({ name: 'SnProNotice' }).exists()).toBe(
      false,
    );
  });

  it('should replace the notice area via the notice slot', () => {
    const wrapper = mountLayout({}, { notice: '<div class="custom-notice"/>' });
    expect(wrapper.find('.sn-pro-classic__actions .custom-notice').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SnProNotice' }).exists()).toBe(false);
  });
});

describe('SnProLayoutClassic · sidebar footer + actions', () => {
  it('should render the user card when a profile is given and forward its menu', async () => {
    const wrapper = mountLayout({ user, userMenus: [{ key: 'logout', label: '退出登录' }] });
    const card = userOf(wrapper);
    expect(card.props('name')).toBe('Mia');
    expect(card.props('menus')).toHaveLength(1);

    card.vm.$emit('select', 'logout', { key: 'logout' });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('user-select')?.[0]?.[0]).toBe('logout');
  });

  it('should omit the sidebar footer without a profile or slot', () => {
    expect(mountLayout().find('.sn-pro-classic__foot').exists()).toBe(false);
  });

  it('should replace the user card via the user slot', () => {
    const wrapper = mountLayout({}, { user: '<div class="custom-user"/>' });
    expect(wrapper.find('.sn-pro-classic__foot .custom-user').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SnProUser' }).exists()).toBe(false);
  });

  it('should render the actions slot after search and notice', () => {
    const wrapper = mountLayout({}, { actions: '<button class="act">EN</button>' });
    const actions = wrapper.find('.sn-pro-classic__actions');
    expect(actions.find('.act').exists()).toBe(true);
    expect(actions.findComponent({ name: 'SnProSearch' }).exists()).toBe(true);
    expect(actions.findComponent({ name: 'SnProNotice' }).exists()).toBe(true);
  });

  it('should render the footer slot', () => {
    const wrapper = mountLayout({}, { footer: '<div class="ft">©</div>' });
    expect(wrapper.find('.sn-pro-classic__footer .ft').exists()).toBe(true);
  });
});

describe('SnProLayoutClassic · menu events', () => {
  it('should forward the sidebar menu selection to the host', async () => {
    const wrapper = mountLayout();
    navMenuOf(wrapper).vm.$emit('select', 'home', menus[0]);
    await wrapper.vm.$nextTick();
    const [key, item] = wrapper.emitted('select')?.[0] ?? [];
    expect(key).toBe('home');
    expect(item).toMatchObject({ key: 'home' });
  });
});
