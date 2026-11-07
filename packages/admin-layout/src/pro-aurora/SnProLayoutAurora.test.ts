import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { SnMenuOption } from '@snui/vue-web';
import SnProLayoutAurora from './SnProLayoutAurora.vue';

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
const noticeItems = [{ key: 'n1', label: '部署完成' }];

const mountLayout = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(SnProLayoutAurora, {
    props: { menus, title: 'Admin', ...props },
    slots: { default: '<div class="page">content</div>', ...slots },
  });

const railMenuOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.find('.sn-pro-aurora__rail-menu').findComponent({ name: 'SnMenu' });
const navMenuOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.find('.sn-pro-aurora__nav').findComponent({ name: 'SnMenu' });
const searchOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.findComponent({ name: 'SnProSearch' });
const noticeOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.findComponent({ name: 'SnProNotice' });
const userOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.findComponent({ name: 'SnProUser' });
const themeButtonOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.find('[aria-label="切换亮暗模式"]');
const localeButtonOf = (wrapper: ReturnType<typeof mountLayout>) =>
  wrapper.find('.sn-pro-aurora__locale');

describe('SnProLayoutAurora · structure', () => {
  it('should render the top bar, the floating rail and the content area', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('.sn-pro-aurora').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__bg').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__header').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__brand .sn-pro-logo').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__rail').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__content .page').exists()).toBe(true);
  });

  it('should render the brand title through SnProLogo', () => {
    expect(mountLayout().find('.sn-pro-aurora__brand .sn-pro-logo__title').text()).toBe('Admin');
  });

  it('should pin to the viewport by default and stay embeddable with fixed=false', () => {
    expect(mountLayout().find('.sn-pro-aurora--fixed').exists()).toBe(true);
    expect(mountLayout({ fixed: false }).find('.sn-pro-aurora--fixed').exists()).toBe(false);
  });

  it('should apply the configured geometry as CSS variables', () => {
    const style = mountLayout({ railWidth: 72, headerHeight: 56 }).find('.sn-pro-aurora').attributes('style') ?? '';
    expect(style).toContain('--sn-pro-aurora-rail-width: 72px');
    expect(style).toContain('--sn-pro-aurora-header-height: 56px');
  });
});

describe('SnProLayoutAurora · rail (一级菜单图标)', () => {
  it('should render the icon rail as a collapsed vertical menu of the top level only', () => {
    const menu = railMenuOf(mountLayout({ activeKey: 'user' }));
    expect(menu.props('mode')).toBe('vertical');
    expect(menu.props('collapsed')).toBe(true);
    // Children stripped: the second level lives in the header, not in a flyout.
    expect(menu.props('options')).toEqual([
      { key: 'home', label: '首页' },
      { key: 'system', label: '系统管理' },
    ]);
  });

  it('should mark the active top-level entry even when a child is selected', () => {
    expect(railMenuOf(mountLayout({ activeKey: 'user' })).props('value')).toBe('system');
    expect(railMenuOf(mountLayout({ activeKey: 'home' })).props('value')).toBe('home');
  });

  it('should forward a rail selection to the host', async () => {
    const wrapper = mountLayout();
    railMenuOf(wrapper).vm.$emit('select', 'system', menus[1]);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('select')?.[0]).toEqual(['system', menus[1]]);
  });

  it('should replace the rail menu via the rail-menu slot', () => {
    const wrapper = mountLayout({}, { 'rail-menu': '<div class="custom-rail">rail</div>' });
    expect(wrapper.find('.custom-rail').exists()).toBe(true);
    // Only the rail's own menu is replaced; the header nav keeps its SnMenu.
    expect(wrapper.find('.sn-pro-aurora__rail-menu').findComponent({ name: 'SnMenu' }).exists()).toBe(false);
  });
});

describe('SnProLayoutAurora · header nav (顶部胶囊导航)', () => {
  it('should render every top-level entry as the horizontal nav', () => {
    const menu = navMenuOf(mountLayout({ activeKey: 'role' }));
    expect(menu.props('mode')).toBe('horizontal');
    // The pills are the app's modules, so the top level (children stripped).
    expect(menu.props('options')).toEqual([
      { key: 'home', label: '首页' },
      { key: 'system', label: '系统管理' },
    ]);
    // The nav highlights the active *top-level* entry.
    expect(menu.props('value')).toBe('system');
  });

  it('should forward a nav selection to the host', async () => {
    const wrapper = mountLayout({ activeKey: 'home' });
    navMenuOf(wrapper).vm.$emit('select', 'system', menus[1]);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('select')?.[0]).toEqual(['system', menus[1]]);
  });

  it('should hide the nav when there are no menus', () => {
    expect(mountLayout({ menus: [] }).find('.sn-pro-aurora__nav').exists()).toBe(false);
  });

  it('should replace the nav via the modules slot', () => {
    const wrapper = mountLayout({ activeKey: 'user' }, { modules: '<nav class="custom-tabs">tabs</nav>' });
    expect(wrapper.find('.custom-tabs').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__menu').exists()).toBe(false);
  });
});

describe('SnProLayoutAurora · background presets', () => {
  it('should default to the gradient preset with the token accent pair', () => {
    const wrapper = mountLayout();
    expect(wrapper.find('.sn-pro-aurora--bg-gradient').exists()).toBe(true);
    const style = wrapper.find('.sn-pro-aurora').attributes('style') ?? '';
    expect(style).toContain('--sn-pro-aurora-glow-1: var(--sn-web-color-action-primary)');
    expect(style).toContain('--sn-pro-aurora-glow-2: var(--sn-web-color-feedback-info)');
  });

  it('should render the solid preset with no extra variables', () => {
    const wrapper = mountLayout({ background: 'solid' });
    expect(wrapper.find('.sn-pro-aurora--bg-solid').exists()).toBe(true);
    const style = wrapper.find('.sn-pro-aurora').attributes('style') ?? '';
    expect(style).not.toContain('--sn-pro-aurora-glow-1');
    expect(style).not.toContain('--sn-pro-aurora-bg-image');
  });

  it('should render the image preset with the css url variable', () => {
    const wrapper = mountLayout({ background: 'image', backgroundImage: '/bg/aurora.png' });
    expect(wrapper.find('.sn-pro-aurora--bg-image').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora').attributes('style')).toContain(
      '--sn-pro-aurora-bg-image: url("/bg/aurora.png")',
    );
  });

  it('should render the mesh preset with four glows', () => {
    const style =
      mountLayout({ background: 'mesh' }).find('.sn-pro-aurora').attributes('style') ?? '';
    for (const index of [1, 2, 3, 4]) {
      expect(style).toContain(`--sn-pro-aurora-glow-${index}:`);
    }
  });

  it('should use the host palette when given', () => {
    const style =
      mountLayout({ background: 'mesh', backgroundColors: ['#0af', '#f0a'] })
        .find('.sn-pro-aurora')
        .attributes('style') ?? '';
    expect(style).toContain('--sn-pro-aurora-glow-1: #0af');
    expect(style).toContain('--sn-pro-aurora-glow-2: #f0a');
  });

  it('should paint the background inside the layout, behind the floating layers', () => {
    const wrapper = mountLayout();
    const root = wrapper.find('.sn-pro-aurora');

    // The painter is the layout's own first child: the background belongs to the
    // shell, it is not a page the shell is dropped onto.
    expect(root.element.firstElementChild?.className).toContain('sn-pro-aurora__bg');

    // Content is a separate layer — the header (transparent) and the body
    // (floating rail + panel) both sit ABOVE the painter, so the preset stays
    // visible around and behind them instead of being covered by an opaque page.
    const app = root.find('.sn-pro-aurora__app');
    expect(app.exists()).toBe(true);
    expect(app.element.parentElement).toBe(root.element);
  });

  it('should keep the content area transparent so modules read as separate cards', () => {
    const wrapper = mountLayout({ pageTitle: '工作台' }, { default: '<section class="module" />' });

    // 内容区是透明的滚动容器，不是一整块白面板：标题带与内容模块各自是浮层，
    // 它们之间露出布局背景 —— 这正是「模块有边界」的判据。
    expect(wrapper.find('.sn-pro-aurora__main').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__title-band').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__content').exists()).toBe(true);

    // 模块进的是 content 槽位（和标题带同级），不是被塞进标题带里。
    const content = wrapper.find('.sn-pro-aurora__content');
    expect(content.find('.module').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__title-band .module').exists()).toBe(false);
  });
});

describe('SnProLayoutAurora · light/dark toggle (深色浅色切换)', () => {
  it('should start light, then emit and flip to dark, then back', async () => {
    const wrapper = mountLayout();
    expect(themeButtonOf(wrapper).html()).toContain('lucide-moon');

    await themeButtonOf(wrapper).trigger('click');
    expect(wrapper.emitted('update:mode')).toEqual([['dark']]);
    expect(themeButtonOf(wrapper).html()).toContain('lucide-sun');

    await themeButtonOf(wrapper).trigger('click');
    expect(wrapper.emitted('update:mode')).toEqual([['dark'], ['light']]);
  });

  it('should stay controlled when the mode prop is provided', async () => {
    const wrapper = mountLayout({ mode: 'dark' });
    expect(wrapper.find('[aria-label="切换亮暗模式"]').html()).toContain('lucide-sun');
    await wrapper.find('[aria-label="切换亮暗模式"]').trigger('click');
    expect(wrapper.emitted('update:mode')?.[0]).toEqual(['light']);
    // Controlled: the DOM keeps following the prop, not the click.
    expect(wrapper.find('[aria-label="切换亮暗模式"]').html()).toContain('lucide-sun');
  });

  it('should hide the toggle and label it for assistive tech', () => {
    expect(mountLayout({ showThemeToggle: false }).find('[aria-label="切换亮暗模式"]').exists()).toBe(false);
    expect(mountLayout({ themeToggleLabel: 'Dark mode' }).find('[aria-label="Dark mode"]').exists()).toBe(true);
  });

  it('should replace the toggle via the theme-toggle slot', () => {
    const wrapper = mountLayout({}, { 'theme-toggle': '<button class="custom-theme">T</button>' });
    expect(wrapper.find('.custom-theme').exists()).toBe(true);
    expect(wrapper.find('[aria-label="切换亮暗模式"]').exists()).toBe(false);
  });
});

describe('SnProLayoutAurora · zh/en switch (中英文切换)', () => {
  it('should show the other locale and emit on click', async () => {
    const wrapper = mountLayout();
    expect(localeButtonOf(wrapper).text()).toBe('EN');

    await localeButtonOf(wrapper).trigger('click');
    expect(wrapper.emitted('update:locale')).toEqual([['en']]);
    expect(localeButtonOf(wrapper).text()).toBe('中');
  });

  it('should stay controlled when the locale prop is provided', async () => {
    const wrapper = mountLayout({ locale: 'en' });
    expect(localeButtonOf(wrapper).text()).toBe('中');
    await localeButtonOf(wrapper).trigger('click');
    expect(wrapper.emitted('update:locale')?.[0]).toEqual(['zh']);
    expect(localeButtonOf(wrapper).text()).toBe('中');
  });

  it('should accept host glyphs and hide on demand', () => {
    expect(mountLayout({ localeLabels: { en: 'EN-US' } }).find('.sn-pro-aurora__locale').text()).toBe('EN-US');
    expect(mountLayout({ showLocale: false }).find('.sn-pro-aurora__locale').exists()).toBe(false);
  });

  it('should replace the switch via the locale slot', () => {
    const wrapper = mountLayout({}, { locale: '<button class="custom-locale">L</button>' });
    expect(wrapper.find('.custom-locale').exists()).toBe(true);
    expect(wrapper.find('.sn-pro-aurora__locale').exists()).toBe(false);
  });
});

describe('SnProLayoutAurora · title-band search area', () => {
  it('should render the menu search in the title band and forward its selection', async () => {
    const wrapper = mountLayout({ pageTitle: '工作台' });
    const search = searchOf(wrapper);
    expect(search.exists()).toBe(true);
    expect(search.props('menus')).toEqual(menus);

    search.vm.$emit('select', 'role', { key: 'role', label: '角色权限' });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('search-select')?.[0]).toEqual(['role', { key: 'role', label: '角色权限' }]);
  });

  it('should hide the search box when showSearch is false', () => {
    expect(
      mountLayout({ pageTitle: '工作台', showSearch: false }).findComponent({ name: 'SnProSearch' }).exists(),
    ).toBe(false);
  });

  it('should replace the search area via the search slot', () => {
    const wrapper = mountLayout({ pageTitle: '工作台' }, { search: '<div class="custom-search">s</div>' });
    expect(wrapper.find('.custom-search').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SnProSearch' }).exists()).toBe(false);
  });
});

describe('SnProLayoutAurora · notice area', () => {
  it('should render the bell and forward select / read-all', async () => {
    const wrapper = mountLayout({ noticeCount: 3, noticeItems });
    const notice = noticeOf(wrapper);
    expect(notice.exists()).toBe(true);
    expect(notice.props('count')).toBe(3);
    expect(notice.props('items')).toEqual(noticeItems);

    notice.vm.$emit('select', 'n1', noticeItems[0]);
    notice.vm.$emit('read-all');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('notice-select')?.[0]).toEqual(['n1', noticeItems[0]]);
    expect(wrapper.emitted('notice-read-all')).toHaveLength(1);
  });

  it('should forward the badge cap and hide on demand', () => {
    expect(noticeOf(mountLayout({ noticeCount: 500, noticeMax: 9 })).props('max')).toBe(9);
    expect(mountLayout({ showNotice: false }).findComponent({ name: 'SnProNotice' }).exists()).toBe(false);
  });

  it('should replace the notice area via the notice slot', () => {
    const wrapper = mountLayout({}, { notice: '<div class="custom-notice">n</div>' });
    expect(wrapper.find('.custom-notice').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SnProNotice' }).exists()).toBe(false);
  });
});

describe('SnProLayoutAurora · profile area', () => {
  it('should render the profile with a downward placement and forward its menu', async () => {
    const wrapper = mountLayout({ user, userMenus: [{ key: 'logout', label: '退出' }] });
    const profile = userOf(wrapper);
    expect(profile.exists()).toBe(true);
    expect(profile.props('name')).toBe('Mia');
    expect(profile.props('placement')).toBe('bottom-end');

    profile.vm.$emit('select', 'logout', { key: 'logout' });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('user-select')?.[0]).toEqual(['logout', { key: 'logout' }]);
  });

  it('should omit the profile without a payload and honour showUser', () => {
    expect(mountLayout().findComponent({ name: 'SnProUser' }).exists()).toBe(false);
    expect(mountLayout({ user, showUser: false }).findComponent({ name: 'SnProUser' }).exists()).toBe(false);
  });

  it('should replace the profile via the user slot', () => {
    const wrapper = mountLayout({}, { user: '<div class="custom-user">u</div>' });
    expect(wrapper.find('.custom-user').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'SnProUser' }).exists()).toBe(false);
  });
});

describe('SnProLayoutAurora · rail footer (退出登录 / 帮助说明)', () => {
  it('should emit logout and help from the rail buttons', async () => {
    const wrapper = mountLayout();
    await wrapper.find('[aria-label="退出登录"]').trigger('click');
    await wrapper.find('[aria-label="帮助说明"]').trigger('click');
    expect(wrapper.emitted('logout')).toHaveLength(1);
    expect(wrapper.emitted('help')).toHaveLength(1);
  });

  it('should drop the rail footer when both built-ins are off', () => {
    expect(
      mountLayout({ showLogout: false, showHelp: false }).find('.sn-pro-aurora__rail-foot').exists(),
    ).toBe(false);
  });

  it('should replace each footer button via its own slot', () => {
    const wrapper = mountLayout({}, { logout: '<button class="custom-logout">out</button>' });
    expect(wrapper.find('.custom-logout').exists()).toBe(true);
    expect(wrapper.find('[aria-label="退出登录"]').exists()).toBe(false);
    expect(wrapper.find('[aria-label="帮助说明"]').exists()).toBe(true);
  });
});

describe('SnProLayoutAurora · title-band actions + content slots', () => {
  it('should render the actions slot at the end of the title-band controls', () => {
    const wrapper = mountLayout(
      { pageTitle: '工作台' },
      { actions: '<button class="custom-action">extra</button>' },
    );
    const actions = wrapper.find('.sn-pro-aurora__title-actions');
    expect(actions.find('.custom-action').exists()).toBe(true);
    expect(actions.element.lastElementChild?.className).toBe('custom-action');
  });

  it('should render the header-actions slot at the end of the top bar', () => {
    const wrapper = mountLayout({}, { 'header-actions': '<span class="custom-header-action">h</span>' });
    const tools = wrapper.find('.sn-pro-aurora__tools');
    expect(tools.find('.custom-header-action').exists()).toBe(true);
    expect(tools.element.lastElementChild?.className).toBe('custom-header-action');
  });

  it('should render and replace the page subtitle', () => {
    expect(
      mountLayout({ pageTitle: 'A', pageSubtitle: 'B' }).find('.sn-pro-aurora__subtitle').text(),
    ).toBe('B');
    expect(
      mountLayout({ pageSubtitle: 'B' }, { subtitle: '<p class="custom-sub">S</p>' })
        .find('.custom-sub')
        .exists(),
    ).toBe(true);
  });

  it('should emit filter when the title-band filter button is pressed', async () => {
    const wrapper = mountLayout({ pageTitle: '工作台' });
    await wrapper.find('[aria-label="筛选"]').trigger('click');
    expect(wrapper.emitted('filter')).toHaveLength(1);
    expect(
      mountLayout({ pageTitle: '工作台', showFilter: false }).find('[aria-label="筛选"]').exists(),
    ).toBe(false);
  });

  it('should render and replace the module heading', () => {
    expect(mountLayout({ pageTitle: '用户管理' }).find('.sn-pro-aurora__heading').text()).toBe('用户管理');
    expect(mountLayout().find('.sn-pro-aurora__title-band').exists()).toBe(false);
    expect(
      mountLayout({ pageTitle: '用户管理' }, { title: '<h2 class="custom-title">T</h2>' })
        .find('.custom-title')
        .exists(),
    ).toBe(true);
  });

  it('should render the footer slot only when provided', () => {
    expect(mountLayout().find('.sn-pro-aurora__footer').exists()).toBe(false);
    expect(
      mountLayout({}, { footer: '<span class="footnote">©</span>' }).find('.sn-pro-aurora__footer .footnote').exists(),
    ).toBe(true);
  });
});
