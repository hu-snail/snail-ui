/**
 * 瀑布流 Waterfall 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const waterfallDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '布局组件 Layout' },
    { text: '瀑布流 Waterfall' },
  ],
  title: '瀑布流 Waterfall',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '面向图片 / 信息流的 masonry 容器：' },
    { t: 'code', s: 'default' },
    { t: 'text', s: ' 槽里的每个直接子节点都会被包进一个' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/waterfall',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '瀑布流 Waterfall.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Waterfall } from '@snui/vue-web';
</script>

<template>
  <Waterfall />
</template>`,
  },
  demos: [
    {
      name: 'waterfall-web-basic',
      title: '代码演示',
      blurb: '默认 3 列；v-for 数据驱动，高度参差不齐。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'columns',
        type: 'number',
        default: '3',
        desc: 'Logical column count (integer ≥ 1). Used as-is, or as the initial guess in `minColumnWidth` (responsive) mode, and ignored when `masonry` is off.',
      },
      {
        name: 'minColumnWidth',
        type: 'number | string',
        default: '—',
        desc: 'Minimum column width. When set the column count follows the measured container width (responsive mode) and `columns` only serves as the pre-measurement guess.',
      },
      {
        name: 'columnGap',
        type: 'number | string',
        default: '16',
        desc: 'Gap between columns (number → px).',
      },
      {
        name: 'rowGap',
        type: 'number | string',
        default: '16',
        desc: "Gap between items (number → px); applied as the columns' `row-gap`.",
      },
      {
        name: 'masonry',
        type: 'boolean',
        default: 'true',
        desc: 'Convenience "off" switch: `false` renders a plain vertical stack (single column, no multi-column layout).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '瀑布流 Waterfall 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Waterfall } from '@snui/vue-web';",
    chipCopy: "import { Waterfall } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Waterfall', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'split', link: '/components/web/split' },
    next: { text: 'menu', link: '/components/web/menu' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
