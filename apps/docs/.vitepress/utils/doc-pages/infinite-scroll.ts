/**
 * Infinite Scroll 无限滚动 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const infiniteScrollDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Infinite Scroll 无限滚动' },
  ],
  title: 'Infinite Scroll 无限滚动',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '滚动容器在接近底部时自动触发加载回调，内置加载中转圈与防重复触发。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/infinite-scroll',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Infinite Scroll 无限滚动.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { InfiniteScroll } from '@snui/vue-web';
</script>

<template>
  <InfiniteScroll />
</template>`,
  },
  demos: [
    {
      name: 'infinite-scroll-web-basic',
      title: '代码演示',
      blurb: 'height 240px + distance 10，触底追加内容。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'distance',
        type: 'number',
        default: '0',
        desc: 'Bottom-distance threshold in px that triggers `load`. Mirrors n-infinite-scroll `distance`.',
      },
      {
        name: 'scrollbarProps',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Extra attributes for the internal scroll container (the reference applies them to its Scrollbar). Mirrors n-infinite-scroll `scrollbar-props`.',
      },
      {
        name: 'showLoading',
        type: 'boolean',
        default: 'true',
        desc: 'Render an inline-SVG spinner at the bottom while `load` is pending (addition — the reference ships no loading UI).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Infinite Scroll 无限滚动 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { InfiniteScroll } from '@snui/vue-web';",
    chipCopy: "import { InfiniteScroll } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'InfiniteScroll', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tree', link: '/components/web/tree' },
    next: { text: 'highlight', link: '/components/web/highlight' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
