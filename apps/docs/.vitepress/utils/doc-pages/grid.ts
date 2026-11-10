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
    { name: 'grid-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'grid-web-responsive', title: '响应式布局', blurb: '响应式布局' },
    { name: 'grid-web-collapsed', title: '折叠收起', blurb: '折叠收起' },
    { name: 'grid-web-gap', title: '间距控制', blurb: '间距控制' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'cols', type: 'number | string | ResponsiveCols', default: '24', desc: '`24`' },
      { name: 'xGap', type: 'number | string', default: '0', desc: '`0`' },
      { name: 'yGap', type: 'number | string', default: '0', desc: '`0`' },
      { name: 'itemResponsive', type: 'boolean', default: 'false', desc: '启用子节点 resize 监听' },
      { name: 'itemStyle', type: 'string | Record<string, string>', default: '—', desc: '—' },
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        desc: '折叠模式：仅显示前 `collapsedRows` 行 + suffix',
      },
      {
        name: 'collapsedRows',
        type: 'number',
        default: '1',
        desc: '`collapsed: true` 时显示的行数',
      },
      {
        name: 'suffix',
        type: 'boolean',
        default: 'false',
        desc: '`suffix: true` 时附加到 grid 末尾（用于「+N more」展开按钮）',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnGrid.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '直接子节点成为网格项。' },
      { name: 'suffix', props: '—', desc: '后缀插槽，追加在网格项之后（如“显示更多”按钮）。' },
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
