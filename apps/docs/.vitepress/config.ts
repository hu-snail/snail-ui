import { defineConfig } from 'vitepress';

/**
 * VitePress config — bilingual (zh default + en) + multi-end (Web + uni-app).
 *
 * Locale structure:
 *   - Root paths default to Simplified Chinese (matches appLocale: zh)
 *   - `/en/...` paths mirror the English translation
 *   - The language switcher in the top nav is auto-rendered from the
 *     `locales` config when both are present
 *
 * Per AGENTS.md #110, every component page must be updated in both languages.
 */

const nav = [
  { text: '指南', link: '/guide/web/intro' },
  { text: '组件 · Web', link: '/components/web/button' },
  { text: '组件 · uni-app', link: '/components/uni/button' },
  { text: '主题', link: '/theme/overview' },
  {
    text: 'English',
    items: [
      { text: '简体中文', link: '/' },
      { text: 'English', link: '/en/' },
    ],
  },
  { text: 'GitHub', link: 'https://github.com/hu-snail/snail-ui' },
];

const sidebar = {
  '/guide/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/guide/web/intro' },
        { text: 'Installation', link: '/guide/web/installation' },
        { text: 'Quick start (Web)', link: '/guide/web/quick-start' },
        { text: 'Quick start (uni-app)', link: '/guide/uni/quick-start' },
        { text: 'Architecture', link: '/guide/web/architecture' },
      ],
    },
  ],
  '/components/web/': [
    {
      text: 'Web (Vue 3)',
      items: [
        { text: 'Button', link: '/components/web/button' },
        { text: 'Input', link: '/components/web/input' },
        { text: 'Form', link: '/components/web/form' },
        { text: 'Card', link: '/components/web/card' },
      ],
    },
  ],
  '/components/uni/': [
    {
      text: 'uni-app',
      items: [
        { text: 'Button', link: '/components/uni/button' },
      ],
    },
  ],
  '/theme/': [
    {
      text: 'Theme / Style / Density',
      items: [
        { text: 'Overview', link: '/theme/overview' },
        { text: 'Theme (Light / Dark)', link: '/theme/theme' },
        { text: 'Style (Modern / Glass)', link: '/theme/style' },
        { text: 'Density (Compact / Comfortable)', link: '/theme/density' },
        { text: 'Token cascade', link: '/theme/cascade' },
      ],
    },
  ],
};

const enNav = [
  { text: 'Guide', link: '/en/guide/web/intro' },
  { text: 'Components · Web', link: '/en/components/web/button' },
  { text: 'Components · uni-app', link: '/en/components/uni/button' },
  { text: 'Theme', link: '/en/theme/overview' },
  {
    text: '简体中文',
    items: [
      { text: '简体中文', link: '/' },
      { text: 'English', link: '/en/' },
    ],
  },
  { text: 'GitHub', link: 'https://github.com/hu-snail/snail-ui' },
];

const enSidebar = {
  '/en/guide/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/en/guide/web/intro' },
        { text: 'Installation', link: '/en/guide/web/installation' },
        { text: 'Quick start (Web)', link: '/en/guide/web/quick-start' },
        { text: 'Quick start (uni-app)', link: '/en/guide/uni/quick-start' },
        { text: 'Architecture', link: '/en/guide/web/architecture' },
      ],
    },
  ],
  '/en/components/web/': [
    {
      text: 'Web (Vue 3)',
      items: [
        { text: 'Button', link: '/en/components/web/button' },
        { text: 'Input', link: '/en/components/web/input' },
        { text: 'Form', link: '/en/components/web/form' },
        { text: 'Card', link: '/en/components/web/card' },
      ],
    },
  ],
  '/en/components/uni/': [
    {
      text: 'uni-app',
      items: [
        { text: 'Button', link: '/en/components/uni/button' },
      ],
    },
  ],
  '/en/theme/': [
    {
      text: 'Theme / Style / Density',
      items: [
        { text: 'Overview', link: '/en/theme/overview' },
        { text: 'Theme (Light / Dark)', link: '/en/theme/theme' },
        { text: 'Style (Modern / Glass)', link: '/en/theme/style' },
        { text: 'Density (Compact / Comfortable)', link: '/en/theme/density' },
        { text: 'Token cascade', link: '/en/theme/cascade' },
      ],
    },
  ],
};

export default defineConfig({
  title: 'AUI — AI-Native UI Framework',
  description: 'AUI framework documentation. Schema-first, framework-agnostic UI runtime.',
  cleanUrls: true,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        logo: { src: '/aui-mark.svg', alt: 'AUI' },
        siteTitle: 'AUI',
        nav,
        sidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/hu-snail/snail-ui' }],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 hu-snail',
        },
        search: { provider: 'local' },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        logo: { src: '/aui-mark.svg', alt: 'AUI' },
        siteTitle: 'AUI',
        nav: enNav,
        sidebar: enSidebar,
        socialLinks: [{ icon: 'github', link: 'https://github.com/hu-snail/snail-ui' }],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 hu-snail',
        },
        search: { provider: 'local' },
      },
    },
  },
});