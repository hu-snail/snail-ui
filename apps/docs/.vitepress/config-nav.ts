/**
 * Shared nav list for the docs site chrome (SnDocsNav + Layout.vue).
 *
 * Mirrors `config.ts` `themeConfig.nav`. Kept as a separate export so the
 * custom Layout / Sn* wrappers can consume the same source of truth without
 * importing the entire vitepress config (which would force vite config
 * resolution at runtime).
 *
 * If you change the order / labels here, also update config.ts themeConfig.nav
 * for vitepress's own internal pages (404, page navigation links, etc).
 */

export interface DocsNavItem { text: string; link: string }

export const nav: DocsNavItem[] = [
  { text: '指南', link: '/guide/web/intro' },
  { text: '组件 · Web', link: '/components/web/button' },
  { text: '组件 · uni-app', link: '/components/uni/button' },
  { text: '风格包', link: '/style-packs/overview' },
  { text: '主题', link: '/theme/overview' },
  { text: 'AI 生态', link: '/ai/overview' },
]