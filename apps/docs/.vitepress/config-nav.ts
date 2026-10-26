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
}

export const nav: DocsNavItem[] = [
  { text: '指南', link: '/guide/web/intro' },
  { text: '组件 · Web', link: '/components/web/button' },
  { text: '组件 · uni-app', link: '/components/uni/button' },
  { text: '风格包', link: '/style-packs/overview' },
  { text: '主题', link: '/theme/overview' },
  { text: 'AI 生态', link: '/ai/overview' },
  { text: '模板', link: '/templates/overview' },
];

export const enNav: DocsNavItem[] = [
  { text: 'Guide', link: '/en/guide/web/intro' },
  { text: 'Components · Web', link: '/en/components/web/button' },
  { text: 'Components · uni-app', link: '/en/components/uni/button' },
  { text: 'Style Packs', link: '/en/style-packs/overview' },
  { text: 'Theme', link: '/en/theme/overview' },
  { text: 'AI Ecosystem', link: '/en/ai/overview' },
  { text: 'Templates', link: '/en/templates/overview' },
];
