/**
 * 描述列表 Descriptions 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const descriptionsDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '描述列表 Descriptions' },
  ],
  title: '描述列表 Descriptions',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '成组的 key/value 明细展示，网格布局，支持多列、跨列与描边。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/descriptions',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '描述列表 Descriptions.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Descriptions } from '@snui/vue-web';
</script>

<template>
  <Descriptions />
</template>`,
  },
  demos: [
    { name: 'descriptions-web-basic', title: '代码演示', blurb: '默认三列，label 在内容上方。' },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string',
        default: '—',
        desc: 'Title above the table; the `header` slot overrides it.',
      },
      {
        name: 'column',
        type: 'number',
        default: '3',
        desc: 'Total number of logical columns the grid is laid out with.',
      },
      {
        name: 'labelPlacement',
        type: "'left' | 'top'",
        default: "'top'",
        desc: 'Where labels sit relative to their content.',
      },
      {
        name: 'labelAlign',
        type: "'left' | 'right' | 'center'",
        default: "'left'",
        desc: 'Label text alignment (applies to the th cells).',
      },
      {
        name: 'separator',
        type: 'string',
        default: "':'",
        desc: 'Separator between inline label and content (`left` + no border).',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Font scale.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'false',
        desc: 'Draw the bordered grid (outlined cells + tinted label background).',
      },
      {
        name: 'labelClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to every rendered label cell / span.',
      },
      {
        name: 'labelStyle',
        type: 'string | CSSProperties',
        default: '—',
        desc: 'Style applied to every rendered label cell / span.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to every rendered content cell / span.',
      },
      {
        name: 'contentStyle',
        type: 'string | CSSProperties',
        default: '—',
        desc: 'Style applied to every rendered content cell / span.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '描述列表 Descriptions 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Descriptions } from '@snui/vue-web';",
    chipCopy: "import { Descriptions } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Descriptions', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'data-table', link: '/components/web/data-table' },
    next: { text: 'empty', link: '/components/web/empty' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
