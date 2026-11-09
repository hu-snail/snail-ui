/**
 * Highlight 高亮文本 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const highlightDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Highlight 高亮文本' },
  ],
  title: 'Highlight 高亮文本',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '在纯文本中命中关键词并以高亮元素包裹，常用于搜索结果与关键词强调。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/highlight',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Highlight 高亮文本.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Highlight } from '@snui/vue-web';
</script>

<template>
  <Highlight />
</template>`,
  },
  demos: [
    { name: 'highlight-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'highlight-web-style', title: '自定义样式', blurb: '自定义样式' },
    { name: 'highlight-web-case-sensitive', title: '区分大小写', blurb: '区分大小写' },
    { name: 'highlight-web-component', title: '自定义高亮元素', blurb: '自定义高亮元素' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'text',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Full text to render. Mirrors n-highlight `text`.',
      },
      {
        name: 'patterns',
        type: 'string[]',
        default: '() => []',
        desc: 'Substrings to highlight; matched fragments render inside `highlight-tag`. Mirrors n-highlight `patterns`.',
      },
      {
        name: 'highlightTag',
        type: 'string',
        default: "'mark'",
        desc: 'HTML element used for matched fragments. Mirrors n-highlight `highlight-tag`.',
      },
      {
        name: 'caseSensitive',
        type: 'boolean',
        default: 'false',
        desc: 'Case-sensitive matching. Mirrors n-highlight `case-sensitive`.',
      },
      {
        name: 'autoEscape',
        type: 'boolean',
        default: 'true',
        desc: 'Escape regex metacharacters in `patterns` so they match literally. Mirrors n-highlight `auto-escape`.',
      },
      {
        name: 'highlightClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Extra class merged onto matched fragments. Mirrors n-highlight `highlight-class`.',
      },
      {
        name: 'highlightStyle',
        type: 'CSSProperties | string | undefined',
        default: 'undefined',
        desc: 'Inline style (object or string) merged onto matched fragments. Mirrors n-highlight `highlight-style`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Highlight 高亮文本 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Highlight } from '@snui/vue-web';",
    chipCopy: "import { Highlight } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Highlight', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'infinite-scroll', link: '/components/web/infinite-scroll' },
    next: { text: 'heatmap', link: '/components/web/heatmap' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
