/**
 * Grid 网格 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const gridDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '布局组件 Layout' }, { text: 'Grid 网格' }],
  title: 'Grid 网格',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnGrid' },
    { t: 'text', s: ' 是 ' },
    { t: 'code', s: '@snui/vue-web' },
    { t: 'text', s: '（PC 桌面端）的 CSS Grid 容器。基于 ' },
    { t: 'code', s: 'display:grid' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'grid-template-columns:repeat(N,minmax(0,1fr))' },
    { t: 'text', s: '，适合等宽多列排版（卡片墙、特性区、表单字段等）。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/grid',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Grid 网格.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Grid } from '@snui/vue-web';
</script>

<template>
  <Grid />
</template>`,
  },
  demos: [
    { name: 'grid-web-basic', title: '实时预览', blurb: '实时预览' },
    { name: 'grid-web-responsive', title: '实时预览', blurb: '实时预览' },
    { name: 'grid-web-collapsed', title: '实时预览', blurb: '实时预览' },
    { name: 'grid-web-gap', title: '实时预览', blurb: '实时预览' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'cols',
        type: 'number | string | ResponsiveCols',
        default: '24',
        desc: 'Number of grid columns. Default 24 (matches n-grid). Can also be a ResponsiveCols object keyed by breakpoint suffix.',
      },
      {
        name: 'xGap',
        type: 'number | string',
        default: '0',
        desc: 'Horizontal gap between columns (px). Default 0.',
      },
      {
        name: 'yGap',
        type: 'number | string',
        default: '0',
        desc: 'Vertical gap between rows (px). Default 0.',
      },
      {
        name: 'itemResponsive',
        type: 'boolean',
        default: 'false',
        desc: 'Whether children should adapt their layout to the container width. Mirrors n-grid `itemResponsive` (forces the grid to subscribe to resize events). Default false.',
      },
      {
        name: 'itemStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to each direct child. Mirrors n-grid `itemStyle`.',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        desc: 'Whether to render the grid in collapsed mode (show "+N more" overflow). Mirrors n-grid `collapsed`. Default false.',
      },
      {
        name: 'collapsedRows',
        type: 'number',
        default: '1',
        desc: 'Number of rows to show when collapsed. Default 1. Mirrors n-grid `collapsedRows`.',
      },
      {
        name: 'suffix',
        type: 'boolean',
        default: 'false',
        desc: 'Optional render function for the suffix slot (rendered after children, typically used to anchor "X more" expand affordance).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Grid 网格 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Grid } from '@snui/vue-web';",
    chipCopy: "import { Grid } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Grid', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'card', link: '/components/web/card' },
    next: { text: 'collapse', link: '/components/web/collapse' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
