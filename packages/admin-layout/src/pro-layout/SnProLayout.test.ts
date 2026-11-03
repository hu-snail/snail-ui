import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnProLayout from './SnProLayout.vue';

const menus = [
  { key: 'home', label: '首页' },
  {
    key: 'system',
    label: '系统管理',
    children: [
      { key: 'user', label: '用户' },
      { key: 'role', label: '角色' },
    ],
  },
];

const mountLayout = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(SnProLayout, {
    props: { menus, ...props },
    slots: { default: '<div class="page">content</div>', ...slots },
  });

describe('SnProLayout · side (default)', () => {
  it('should render sider + header + content in the default side mode', () => {
    const wrapper = mountLayout({ title: 'Admin' });
    expect(wrapper.find('.sn-pro-layout--side').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-sider').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-header__toggle').exists()).toBe(true);
    expect(wrapper.find('.page').exists()).toBe(true);
  });

  it('should derive the breadcrumb from the active menu path', () => {
    const wrapper = mountLayout({ activeKey: 'user' });
    const items = wrapper.findAll('.sn-breadcrumb-item__link');
    expect(items.map((i) => i.text())).toEqual(['系统管理', '用户']);
  });

  it('should prefer the explicit breadcrumb prop over the derived path', () => {
    const wrapper = mountLayout({ activeKey: 'user', breadcrumb: ['A', 'B'] });
    const items = wrapper.findAll('.sn-breadcrumb-item__link');
    expect(items.map((i) => i.text())).toEqual(['A', 'B']);
  });

  it('should toggle collapse uncontrolled and emit update:collapsed', async () => {
    const wrapper = mountLayout();
    await wrapper.find('.sn-pro-header__toggle').trigger('click');
    expect(wrapper.emitted('update:collapsed')?.[0]?.[0]).toBe(true);
    expect(wrapper.find('.sn-pro-sider--collapsed').exists()).toBe(true);
  });

  it('should stay controlled when the collapsed prop is provided', async () => {
    const wrapper = mountLayout({ collapsed: true });
    expect(wrapper.find('.sn-pro-sider--collapsed').exists()).toBe(true);
    await wrapper.find('.sn-pro-header__toggle').trigger('click');
    expect(wrapper.emitted('update:collapsed')?.[0]?.[0]).toBe(false);
    // Controlled: the prop decides the DOM until the parent updates it.
    expect(wrapper.find('.sn-pro-sider--collapsed').exists()).toBe(true);
  });

  it('should forward select from the sider menu', async () => {
    const wrapper = mountLayout();
    const siderMenu = wrapper.findComponent({ name: 'SnProSider' }).findComponent({ name: 'SnMenu' });
    siderMenu.vm.$emit('select', 'home', menus[0]!);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('home');
  });

  it('should render the actions and footer slots', () => {
    const wrapper = mountLayout({}, { actions: '<button class="act">u</button>', footer: '<div class="ft">©</div>' });
    expect(wrapper.find('.sn-pro-header__actions .act').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-layout__footer .ft').exists()).toBe(true);
  });
});

describe('SnProLayout · top', () => {
  it('should drop the sider and host the horizontal menu in the header', () => {
    const wrapper = mountLayout({ layout: 'top', title: 'Admin' });
    expect(wrapper.find('.sn-pro-layout--top').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-sider').exists()).toBe(false);
    const menu = wrapper.findComponent({ name: 'SnProHeader' }).findComponent({ name: 'SnMenu' });
    expect(menu.props('mode')).toBe('horizontal');
    expect(wrapper.find('.sn-pro-header__toggle').exists()).toBe(false);
  });

  it('should show the brand in the header', () => {
    const wrapper = mountLayout({ layout: 'top', title: 'Admin' });
    expect(wrapper.find('.sn-pro-header .sn-pro-logo__title').text()).toBe('Admin');
  });
});

describe('SnProLayout · mix', () => {
  it('should show the active top item children in a brandless sider', () => {
    const wrapper = mountLayout({ layout: 'mix', activeKey: 'user' });
    const siders = wrapper.findAll('.sn-pro-sider');
    expect(siders).toHaveLength(1);
    expect(siders[0]!.find('.sn-pro-sider__brand').exists()).toBe(false);
    const siderMenu = siders[0]!.findComponent({ name: 'SnMenu' });
    expect(siderMenu.props('options').map((o: { key: string }) => o.key)).toEqual(['user', 'role']);
  });

  it('should hide the sider when the active top item has no children', () => {
    const wrapper = mountLayout({ layout: 'mix', activeKey: 'home' });
    expect(wrapper.find('.sn-pro-layout__row .sn-pro-sider').exists()).toBe(false);
  });

  it('should keep the full tree in the horizontal header menu', () => {
    const wrapper = mountLayout({ layout: 'mix', activeKey: 'user' });
    const headerMenu = wrapper.findComponent({ name: 'SnProHeader' }).findComponent({ name: 'SnMenu' });
    expect(headerMenu.props('options')).toHaveLength(2);
  });
});

describe('SnProLayout · dual', () => {
  it('should render an icon rail (top level, no children) plus the secondary column', () => {
    const wrapper = mountLayout({ layout: 'dual', activeKey: 'user' });
    const siders = wrapper.findAllComponents({ name: 'SnProSider' });
    expect(siders).toHaveLength(2);
    const railMenu = siders[0]!.findComponent({ name: 'SnMenu' });
    const railOptions = railMenu.props('options') as Array<{ key: string; children?: unknown }>;
    expect(railOptions.map((o) => o.key)).toEqual(['home', 'system']);
    expect(railOptions.some((o) => o.children !== undefined)).toBe(false);
    expect(siders[0]!.props('activeKey')).toBe('system');
    expect(
      siders[1]!
        .findComponent({ name: 'SnMenu' })
        .props('options')
        .map((o: { key: string }) => o.key),
    ).toEqual(['user', 'role']);
  });

  it('should collapse the secondary column from the strip toggle', async () => {
    const wrapper = mountLayout({ layout: 'dual', activeKey: 'user' });
    await wrapper.find('.sn-pro-layout__strip-toggle').trigger('click');
    expect(wrapper.emitted('update:collapsed')?.[0]?.[0]).toBe(true);
    expect(wrapper.findAllComponents({ name: 'SnProSider' })[1]!.classes()).toContain(
      'sn-pro-sider--collapsed',
    );
  });

  it('should hide the strip toggle when the secondary column is gone', () => {
    const wrapper = mountLayout({ layout: 'dual', activeKey: 'home' });
    expect(wrapper.find('.sn-pro-layout__strip-toggle').exists()).toBe(false);
  });
});

describe('SnProLayout · shell props', () => {
  it('should pin to the viewport by default and stay embeddable with fixed=false', () => {
    expect(mountLayout().find('.sn-pro-layout--fixed').exists()).toBe(true);
    expect(mountLayout({ fixed: false }).find('.sn-pro-layout--fixed').exists()).toBe(false);
  });

  it('should apply the inverted surface to siders when invertedSider is set', () => {
    const wrapper = mountLayout({ invertedSider: true });
    expect(wrapper.find('.sn-pro-sider--inverted').exists()).toBe(true);
  });

  it('should hide the strip in top mode when no breadcrumb is derivable', () => {
    const wrapper = mountLayout({ layout: 'top', activeKey: null });
    expect(wrapper.find('.sn-pro-layout__strip').exists()).toBe(false);
  });
});

describe('SnProLayout · settings + tabs', () => {
  const tabs = [
    { key: 'home', label: '首页', closable: false },
    { key: 'user', label: '用户' },
  ];

  it('should hide the settings gear and drawer by default', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('.sn-pro-header__gear').exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'SnProSettings' }).props('show')).toBe(false);
  });

  it('should open the settings drawer from the header gear', async () => {
    const wrapper = mountLayout({ showSettings: true, settingsLabel: '偏好' });
    await wrapper.find('.sn-pro-header__gear').trigger('click');
    const settings = wrapper.findComponent({ name: 'SnProSettings' });
    expect(settings.props('show')).toBe(true);
    expect(settings.props('tabType')).toBeUndefined(); // tab section hidden while tabs are off
  });

  it('should open the settings drawer from the strip gear in dual (no header)', async () => {
    // activeKey under a top group → the secondary column exists → strip shows
    const wrapper = mountLayout({ layout: 'dual', activeKey: 'user', showSettings: true, settingsLabel: '偏好' });
    expect(wrapper.find('.sn-pro-header__gear').exists()).toBe(false);
    await wrapper.find('.sn-pro-layout__strip-gear').trigger('click');
    expect(wrapper.findComponent({ name: 'SnProSettings' }).props('show')).toBe(true);
  });

  it('should keep the strip gear reachable in dual even without toggle or breadcrumb', async () => {
    // no collapsible column + no breadcrumb → the strip would hide; showSettings keeps it
    const wrapper = mountLayout({ layout: 'dual', showCollapse: false, breadcrumb: [], showSettings: true });
    await wrapper.find('.sn-pro-layout__strip-gear').trigger('click');
    expect(wrapper.findComponent({ name: 'SnProSettings' }).props('show')).toBe(true);
  });

  it('should render the host actions slot in the dual strip (gear beside it)', async () => {
    const wrapper = mountLayout(
      { layout: 'dual', showSettings: true, showCollapse: false, breadcrumb: [] },
      { actions: '<button class="lang-switch">EN</button>' },
    );
    const actions = wrapper.find('.sn-pro-layout__strip-actions');
    expect(actions.exists()).toBe(true);
    expect(actions.find('.lang-switch').exists()).toBe(true);
    expect(actions.find('.sn-pro-layout__strip-gear').exists()).toBe(true);
  });

  it('should render the tab bar and forward select/close events when showTabs is set', async () => {
    const wrapper = mountLayout({ showTabs: true, tabs, activeKey: 'user' });
    const tabbar = wrapper.findComponent({ name: 'SnProTabbar' });
    expect(tabbar.exists()).toBe(true);
    expect(tabbar.props('tabs')).toEqual(tabs);
    expect(tabbar.props('type')).toBe('chrome');
    tabbar.vm.$emit('update:activeKey', 'home');
    tabbar.vm.$emit('close', 'user');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('tab-select')?.[0]?.[0]).toBe('home');
    expect(wrapper.emitted('tab-close')?.[0]?.[0]).toBe('user');
  });

  it('should forward theme preferences to the settings panel', () => {
    const wrapper = mountLayout({
      showSettings: true,
      showTabs: true,
      mode: 'dark',
      primaryId: 'blue',
      primaryColors: [{ id: 'blue', color: '#1677ff' }],
      tabType: 'card',
    });
    const settings = wrapper.findComponent({ name: 'SnProSettings' });
    expect(settings.props('mode')).toBe('dark');
    expect(settings.props('primaryId')).toBe('blue');
    expect(settings.props('tabType')).toBe('card');
  });

  it('should emit preference updates from the settings panel', async () => {
    const wrapper = mountLayout({ showSettings: true });
    const settings = wrapper.findComponent({ name: 'SnProSettings' });
    settings.vm.$emit('update:layout', 'top');
    settings.vm.$emit('update:mode', 'dark');
    settings.vm.$emit('update:primaryId', 'violet');
    settings.vm.$emit('update:tabType', 'bar');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('update:layout')?.[0]?.[0]).toBe('top');
    expect(wrapper.emitted('update:mode')?.[0]?.[0]).toBe('dark');
    expect(wrapper.emitted('update:primaryId')?.[0]?.[0]).toBe('violet');
    expect(wrapper.emitted('update:tabType')?.[0]?.[0]).toBe('bar');
  });
});
