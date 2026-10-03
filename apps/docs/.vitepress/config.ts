import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'AUI — AI-Native UI Framework',
  description: 'AUI framework documentation. Schema-first, framework-agnostic UI runtime.',
  cleanUrls: true,

  // Multi-end navigation. The "Platform" sidebar branches into web / uni so
  // each end gets its own props/event/a11y/capability docs (AGENTS.md #110).
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    }],
  ],

  themeConfig: {
    logo: { src: '/aui-mark.svg', alt: 'AUI' },
    siteTitle: 'AUI',

    nav: [
      { text: 'Guide', link: '/guide/web/intro' },
      { text: 'Components · Web', link: '/components/web/button' },
      { text: 'Components · uni-app', link: '/components/uni/button' },
      { text: 'Theme', link: '/theme/overview' },
      { text: 'GitHub', link: 'https://github.com/hu-snail/snail-ui' },
    ],

    sidebar: {
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
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hu-snail/snail-ui' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 hu-snail',
    },

    search: {
      provider: 'local',
    },
  },
});