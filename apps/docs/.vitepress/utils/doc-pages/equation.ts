/**
 * Equation 公式 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const equationDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Equation 公式' },
  ],
  title: 'Equation 公式',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'LaTeX 数学公式渲染。内置 KaTeX，开箱即用，支持 displayMode / 自定义宏 / 替换渲染器。',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/equation',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Equation 公式.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Equation } from '@snui/vue-web';
</script>

<template>
  <Equation />
</template>`,
  },
  demos: [
    { name: 'equation-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'equation-web-katex-options', title: '使用 katex 配置', blurb: '使用 katex 配置' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'string',
        default: "''",
        desc: 'LaTeX expression string. Mirrors n-equation `value`.',
      },
      {
        name: 'katex',
        type: 'SnEquationKatex | undefined',
        default: 'undefined',
        desc: '自定义 KaTeX 渲染器；默认使用内置 katex',
      },
      {
        name: 'katexOptions',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: '透传给 `renderToString` 的选项（如 `displayMode` / `macros` / `fleqn`），`throwOnError` 默认 `false`',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Equation 公式 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Equation } from '@snui/vue-web';",
    chipCopy: "import { Equation } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Equation', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'empty', link: '/components/web/empty' },
    next: { text: 'image', link: '/components/web/image' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
