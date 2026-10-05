import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import type { Options as MiniSearchOptions } from 'minisearch'
import { rpxTransform } from './utils/rpx-transform'

/**
 * VitePress config — bilingual (zh default + en) + multi-end (Web + uni-app).
 *
 * Per ADR-0001 + ADR-0002:
 *   AUI is an AI-Native component library with Style Pack + AI Layer.
 *   Docs describe real components and Style Packs.
 *
 * Local search (VitePress built-in minisearch) is configured below to
 * support Chinese content: we slice CJK characters into per-character
 * tokens + sliding bigrams so substring searches like '按钮' or '分割'
 * hit pages whose content contains those characters. ASCII words are
 * tokenized on whitespace + punctuation.
 */

const nav = [
  { text: '指南', link: '/guide/web/intro' },
  { text: '组件 · Web', link: '/components/web/button' },
  { text: '组件 · uni-app', link: '/components/uni/button' },
  { text: '风格包', link: '/style-packs/overview' },
  { text: '主题', link: '/theme/overview' },
  { text: 'AI 生态', link: '/ai/overview' },
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
  // Component categories — one entry per category. Each entry maps to one
  // or more component pages. Order matters (left-to-right in sidebar).
  // Categories with empty `items` are hidden from sidebar (VitePress collapses
  // empty sections). Add the first component page link to a category to make
  // it appear.
  //
  // Per Spec-02 v1.1 + WBS v3.1, the planned category taxonomy is:
  //   基础组件 / 表单组件 / 数据展示 / 导航组件 / 反馈组件 / 其他 / AI 组件
  // Currently shipped: Button + Divider (Basic) + ConfigProvider (Other).
  '/components/web/': [
    {
      text: 'Basic 基础组件',
      items: [
        { text: 'Button 按钮', link: '/components/web/button' },
        { text: 'Divider 分割线', link: '/components/web/divider' },
        { text: 'Icon 图标', link: '/components/web/icon' },
      ],
    },
    {
      text: 'Form 表单组件',
      items: [
        { text: 'Input 输入框', link: '/components/web/input' },
        { text: 'Form 表单', link: '/components/web/form' },
      ],
    },
    // Other 其他 — empty until ConfigProvider page ships.
    // Data Display 数据展示 — empty until SnCard / SnTag / SnBadge ship.
    // Navigation 导航组件 — empty until SnMenu / SnTabs / SnBreadcrumb ship.
    // Feedback 反馈组件 — empty until SnAlert / SnToast / SnModal ship.
    // AI 组件 — empty until SnippetPanel / StylePreview / RenderShot ship.
  ],
  '/components/uni/': [
    {
      text: 'Basic 基础组件',
      items: [
        { text: 'sn-button 按钮', link: '/components/uni/button' },
        { text: 'sn-divider 分割线', link: '/components/uni/divider' },
        { text: 'sn-icon 图标', link: '/components/uni/icon' },
      ],
    },
    {
      text: 'Form 表单组件',
      items: [
        { text: 'sn-input 输入框', link: '/components/uni/input' },
        { text: 'sn-form 表单', link: '/components/uni/form' },
      ],
    },
    // Other 其他 — empty until ConfigProvider page ships.
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
  // Mirror of zh sidebar (per AUI-DOCS-002 + AUI-DOCS-013). Categories
  // hidden when empty.
  '/en/components/web/': [
    {
      text: 'Basic',
      items: [
        { text: 'Button', link: '/en/components/web/button' },
        { text: 'Divider', link: '/en/components/web/divider' },
        { text: 'Icon', link: '/en/components/web/icon' },
      ],
    },
    {
      text: 'Form',
      items: [
        { text: 'Input', link: '/en/components/web/input' },
        { text: 'Form', link: '/en/components/web/form' },
      ],
    },
    // Other — empty until ConfigProvider page ships.
  ],
  '/en/components/uni/': [
    {
      text: 'Basic',
      items: [
        { text: 'sn-button', link: '/en/components/uni/button' },
        { text: 'sn-divider', link: '/en/components/uni/divider' },
        { text: 'sn-icon', link: '/en/components/uni/icon' },
      ],
    },
    {
      text: 'Form',
      items: [
        { text: 'sn-input', link: '/en/components/uni/input' },
        { text: 'sn-form', link: '/en/components/uni/form' },
      ],
    },
    // Other — empty until ConfigProvider page ships.
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

  themeConfig: {
    // Per VitePress 1.6+: local search provider is read from
    // `site.themeConfig.search`, not from root-level `search`. When defined
    // here, the build-time constant `__VP_LOCAL_SEARCH__` becomes true and
    // VPNavBarSearch renders the LocalSearchBox + search-button.
    // Both locales (root + en) inherit this block (resolveSiteDataByRoute
    // merges root themeConfig into each locale's).
    //
    // Translations layout (see VPLocalSearchBox.vue:120):
    //   options.translations — default UI strings (used as fallback and by
    //                          the root locale)
    //   options.locales[<localeKey>].translations — per-locale overrides
    //
    // The root locale uses options.translations directly; the en locale
    // overrides via options.locales.en.translations.
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            backButtonTitle: '返回',
            footer: {
              selectText: '选择',
              navigateText: '导航',
              closeText: '关闭',
            },
          },
        },
        locales: {
          en: {
            translations: {
              button: {
                buttonText: 'Search docs',
                buttonAriaLabel: 'Search docs',
              },
              modal: {
                noResultsText: 'No results',
                resetButtonTitle: 'Clear query',
                backButtonTitle: 'Back',
                footer: {
                  selectText: 'select',
                  navigateText: 'navigate',
                  closeText: 'close',
                },
              },
            },
          },
        },
        miniSearch: {
          tokenize: ((text: string): string[] => {
            const lowered = text.toLowerCase()
            const tokens: string[] = []
            for (const word of lowered.split(/[\s\u2000-\u206f\u2e00-\u2e7f\\'!"#$%&()*+,\-./:;<=>?@[\]^`{|}~]+/g)) {
              if (word) tokens.push(word)
            }
            const chars = [...lowered]
            for (let i = 0; i < chars.length; i++) {
              const ch = chars[i] ?? ''
              if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(ch)) {
                tokens.push(ch)
                const next = chars[i + 1] ?? ''
                if (/[\u4e00-\u9fff]/.test(next)) {
                  tokens.push(ch + next)
                }
              }
            }
            return tokens
          }) as MiniSearchOptions['tokenize'],
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 1 },
          } as MiniSearchOptions['searchOptions'],
        },
      },
    },
  },

  vite: {
    build: { target: 'es2022' },
    plugins: [
      // Convert uni-app `rpx` units → `px` so uni-end component styles
      // (SnButton / SnDivider) render correctly in the browser preview.
      // See ./utils/rpx-transform.ts for rationale + scope.
      rpxTransform(),
    ],
    resolve: {
      // Per AUI-DOCS-016: when SnButton / SnDivider in uni-side use `<view>`
      // (uni-app cross-end element) in the template, the dist build loses the
      // `data-v-xxx` scope-id attribute on the rendered element because
      // vite lib-mode SFC compilation doesn't emit `withScopeId(scopeId, fn)`
      // wrapping. Without the data-v-xxx attribute the scoped CSS selectors
      // (`<hash>[data-v-...]`) never match and the demo renders unstyled.
      //
      // Workaround: docs-side demos import directly from `packages/uni/src/...`
      // so vite + @vitejs/plugin-vue recompile the SFC per-request and
      // correctly inject the scopeId attribute. The dist build is still the
      // canonical artifact; this alias only affects docs demos.
      alias: {
        '@snui/uni-src': fileURLToPath(new URL('../../../packages/uni/src', import.meta.url)),
        '@snui/vue-web-src': fileURLToPath(new URL('../../../packages/vue-web/src', import.meta.url)),
      },
    },
    ssr: {
      noExternal: [
        '@snui/vue-web',
        '@snui/uni',
        '@snui/tokens',
        '@snui/style-packs',
        '@snui/ai',
      ],
    },
    // Pre-bundle only `@snui/tokens` + `@snui/style-packs` (pure JS, safe to
    // inline). `@snui/vue-web` + `@snui/uni` are built with vite + @vue/
    // compiler-sfc (see packages/*/vite.config.js) and do NOT need vite
    // optimizeDeps pre-bundling — vite-plugin-vue compiles the .vue SFCs at
    // request time, which is what `@vue/compiler-sfc` does (transforms
    // `defineOptions` / `defineProps` / `withDefaults` / `defineEmits` /
    // `defineSlots` macros into runtime calls before the browser receives
    // the JS). The browser is the source of truth that proves the dist is
    // usable.
    optimizeDeps: {
      include: [
        '@snui/tokens',
        '@snui/style-packs',
        'lucide-vue-next',
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
      label: '中文 / EN',
      lang: 'zh-CN',
      themeConfig: {
        nav,
        sidebar,
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 hu-snail',
        },
      },
    },
    en: {
      label: '中文 / EN',
      lang: 'en-US',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 hu-snail',
        },
      },
    },
  },

  /**
   * (Removed) Root-level `search` block.
   *
   * In VitePress <1.6 this lived at root level, but the 1.6 local-search
   * plugin reads `site.themeConfig.search.provider` (see
   * `node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:40427` and
   * `:44943`). With `search` at root, `__VP_LOCAL_SEARCH__` evaluates to
   * false at build time, the VPNavBarSearch template removes the LocalSearchBox
   * branch, and the navbar renders only logo + nav + theme-toggle — no search
   * button at all (verified against the live dev server).
   *
   * The same provider config has been added to `themeConfig.search` above
   * so both root and en locales inherit a working search.
   */
})