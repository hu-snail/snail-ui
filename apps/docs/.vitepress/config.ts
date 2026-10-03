import { defineConfig } from 'vitepress'

/**
 * VitePress config — bilingual (zh default + en) + multi-end (Web + uni-app).
 *
 * Per ADR-0001: AUI is a traditional AI-friendly component library.
 * Docs describe real components, not schema-driven runtimes.
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
]

const sidebar = {
  '/guide/': [
    {
      text: '快速开始',
      items: [
        { text: '介绍', link: '/guide/web/intro' },
        { text: 'Web 快速开始', link: '/guide/web/quick-start' },
        { text: 'uni-app 快速开始', link: '/guide/uni/quick-start' },
      ],
    },
  ],
  '/components/web/': [
    {
      text: 'Web 组件',
      items: [
        { text: 'Button 按钮', link: '/components/web/button' },
      ],
    },
  ],
  '/components/uni/': [
    {
      text: 'uni-app 组件',
      items: [
        { text: 'Button 按钮', link: '/components/uni/button' },
      ],
    },
  ],
  '/theme/': [
    {
      text: '主题与 Token',
      items: [
        { text: 'Token 总览', link: '/theme/overview' },
      ],
    },
  ],
}

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
]

const enSidebar = {
  '/en/guide/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/en/guide/web/intro' },
        { text: 'Web Quick Start', link: '/en/guide/web/quick-start' },
        { text: 'uni-app Quick Start', link: '/en/guide/uni/quick-start' },
      ],
    },
  ],
  '/en/components/web/': [
    {
      text: 'Web components',
      items: [
        { text: 'Button', link: '/en/components/web/button' },
      ],
    },
  ],
  '/en/components/uni/': [
    {
      text: 'uni-app components',
      items: [
        { text: 'Button', link: '/en/components/uni/button' },
      ],
    },
  ],
  '/en/theme/': [
    {
      text: 'Theme & Tokens',
      items: [
        { text: 'Tokens overview', link: '/en/theme/overview' },
      ],
    },
  ],
}

export default defineConfig({
  title: 'AUI — AI-Friendly UI Component Library',
  description: 'Vue 3 + uni-app multi-end UI component library. Web API inspired by naive-ui, uni-app API inspired by wot-ui. Token-driven themes, real component rendering in docs.',

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
})
