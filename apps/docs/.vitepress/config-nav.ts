/**
 * Shared nav list for the docs site chrome (SnDocsNav + Layout.vue).
 *
 * Mirrors `config.ts` `themeConfig.nav`. Kept as a separate export so the
 * custom Layout / Sn* wrappers can consume the same source of truth without
 * importing the entire vitepress config (which would force vite config
 * resolution at runtime).
 *
 * `nav` is the zh (root locale) list; `enNav` is the `/en/` locale list.
 * The custom Layout picks one from the active route — see Layout.vue.
 *
 * If you change the order / labels here, also update config.ts themeConfig.nav
 * for vitepress's own internal pages (404, page navigation links, etc).
 */

export interface DocsNavItem {
  text: string;
  link: string;
  /**
   * 合并入口的额外 active 匹配前缀（en 前缀无关，匹配前会剥掉）。
   * 例：「组件」同时覆盖 /components/web 与 /components/uni。
   */
  match?: string[];
  /** 二级菜单：导航条上点击展开（如「生态」= AI 生态 + 生态插件）。 */
  children?: DocsNavItem[];
}

export const nav: DocsNavItem[] = [
  { text: '指南', link: '/guide/web/intro' },
  // 「组件」合并 Web / uni-app 两端入口（active 双前缀匹配）。
  { text: '组件', link: '/components/web/button', match: ['/components'] },
  // 「主题」直达主题编辑器（可视化调参 + Web / uni 双端实时预览）；
  // 风格包已并入主题（编辑器内置官方 pack 与品牌预设），不再单列。
  { text: '主题', link: '/theme/editor' },
  {
    // 「生态」= AI 生态 + 生态插件合并入口，导航条点击展开二级菜单。
    text: '生态',
    link: '/ai/overview',
    match: ['/ai', '/ecosystem'],
    children: [
      { text: 'AI 生态', link: '/ai/overview' },
      { text: '生态插件', link: '/ecosystem/overview' },
    ],
  },
  { text: 'Echarts 图表', link: '/echarts/overview' },
  { text: '模板', link: '/templates/overview' },
];

export const enNav: DocsNavItem[] = [
  { text: 'Guide', link: '/en/guide/web/intro' },
  { text: 'Components', link: '/en/components/web/button', match: ['/components'] },
  { text: 'Theme', link: '/en/theme/editor' },
  {
    text: 'Ecosystem',
    link: '/en/ai/overview',
    match: ['/ai', '/ecosystem'],
    children: [
      { text: 'AI Ecosystem', link: '/en/ai/overview' },
      { text: 'Ecosystem Plugins', link: '/en/ecosystem/overview' },
    ],
  },
  { text: 'ECharts', link: '/en/echarts/overview' },
  { text: 'Templates', link: '/en/templates/overview' },
];
