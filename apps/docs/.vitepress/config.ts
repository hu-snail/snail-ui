import { defineConfig } from 'vitepress'

/**
 * VitePress config — bilingual (zh default + en) + multi-end (Web + uni-app).
 *
 * Per ADR-0001 + ADR-0002:
 *   AUI is an AI-Native component library with Style Pack + AI Layer.
 *   Docs describe real components and Style Packs.
 */

const nav = [
  { text: '指南', link: '/guide/web/intro' },
  { text: '组件 · Web', link: '/components/web/button' },
  { text: '组件 · uni-app', link: '/components/uni/button' },
  { text: '风格包', link: '/style-packs/overview' },
  { text: '主题', link: '/theme/overview' },
  { text: 'AI 生态', link: '/ai/overview' },
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
        { text: '架构', link: '/guide/web/architecture' },
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
        { text: 'Divider 分割线', link: '/components/web/divider' },
      ],
    },
  ],
  '/components/uni/': [
    {
      text: 'uni-app 组件',
      items: [
        { text: 'Button 按钮', link: '/components/uni/button' },
        { text: 'Divider 分割线', link: '/components/uni/divider' },
      ],
    },
  ],
  '/theme/': [
    {
      text: '主题与 Token',
      items: [
        { text: 'Token 总览', link: '/theme/overview' },
        { text: 'Theme（颜色）', link: '/theme/theme' },
        { text: 'Style（形状）', link: '/theme/style' },
        { text: 'Density（密度）', link: '/theme/density' },
        { text: 'Token 级联', link: '/theme/cascade' },
      ],
    },
  ],
  '/style-packs/': [
    {
      text: '风格包',
      items: [
        { text: '风格包总览', link: '/style-packs/overview' },
        { text: 'iOS 风格', link: '/style-packs/ios' },
        { text: '自定义风格包', link: '/style-packs/custom' },
      ],
    },
  ],
  '/ai/': [
    {
      text: 'AI 生态',
      items: [
        { text: 'AI 生态总览', link: '/ai/overview' },
        { text: 'Skill 文件', link: '/ai/skill' },
        { text: 'MCP Server', link: '/ai/mcp' },
        { text: '高保真原型', link: '/ai/prototype' },
      ],
    },
  ],
}

const enNav = [
  { text: 'Guide', link: '/en/guide/web/intro' },
  { text: 'Components · Web', link: '/en/components/web/button' },
  { text: 'Components · uni-app', link: '/en/components/uni/button' },
  { text: 'Style Packs', link: '/en/style-packs/overview' },
  { text: 'Theme', link: '/en/theme/overview' },
  { text: 'AI Ecosystem', link: '/en/ai/overview' },
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
        { text: 'Architecture', link: '/en/guide/web/architecture' },
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
        { text: 'Divider', link: '/en/components/web/divider' },
      ],
    },
  ],
  '/en/components/uni/': [
    {
      text: 'uni-app components',
      items: [
        { text: 'Button', link: '/en/components/uni/button' },
        { text: 'Divider', link: '/en/components/uni/divider' },
      ],
    },
  ],
  '/en/theme/': [
    {
      text: 'Theme & Tokens',
      items: [
        { text: 'Tokens overview', link: '/en/theme/overview' },
        { text: 'Theme (color)', link: '/en/theme/theme' },
        { text: 'Style (shape)', link: '/en/theme/style' },
        { text: 'Density (size)', link: '/en/theme/density' },
        { text: 'Token cascade', link: '/en/theme/cascade' },
      ],
    },
  ],
  '/en/style-packs/': [
    {
      text: 'Style Packs',
      items: [
        { text: 'Overview', link: '/en/style-packs/overview' },
        { text: 'iOS Style', link: '/en/style-packs/ios' },
        { text: 'Custom Style Pack', link: '/en/style-packs/custom' },
      ],
    },
  ],
  '/en/ai/': [
    {
      text: 'AI Ecosystem',
      items: [
        { text: 'Overview', link: '/en/ai/overview' },
        { text: 'Skill file', link: '/en/ai/skill' },
        { text: 'MCP Server', link: '/en/ai/mcp' },
        { text: 'Hi-fi prototype', link: '/en/ai/prototype' },
      ],
    },
  ],
}

export default defineConfig({
  title: 'snail-aui — AI-Native UI 框架生态',
  description: 'Vue 3 + uni-app 多端 AI-Native UI 框架生态。Component First / Token First / Style Pack First / AI Native。',
  ignoreDeadLinks: true,

  vite: {
    build: { target: 'es2022' },
    ssr: {
      noExternal: [
        '@snui/vue-web',
        '@snui/uni',
        '@snui/tokens',
        '@snui/style-packs',
        '@snui/ai',
      ],
    },
    // Per-component demo.vue imports these workspace packages dynamically.
    // Without explicit optimizeDeps entries, vite serves them on first request
    // which can race with vitepress SSR — resulting in 'demo failed to load'
    // on the client. Forcing them into optimizeDeps pre-bundles the imports.
    // Note: @snui/ai is server-only (uses node:fs / node:url) — kept out of
    // client optimize list. It's only used by MCP Server (future AUI-AI-004).
    optimizeDeps: {
      include: [
        '@snui/vue-web',
        '@snui/uni',
        '@snui/tokens',
        '@snui/style-packs',
        'vue',
      ],
    },
  },

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