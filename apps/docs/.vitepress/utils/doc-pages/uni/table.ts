/**
 * Table 表格（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-table.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tableDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '展示组件 Display' }, { text: 'Table 表格' }],
  title: 'Table 表格',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '横滚由 ' },
    { t: 'code', s: '<scroll-view scroll-x>' },
    { t: 'text', s: ' 承担；传 ' },
    { t: 'code', s: 'height' },
    { t: 'text', s: ' 打开纵向滚动，' },
    { t: 'code', s: 'fixed-header' },
    { t: 'text', s: ' 在滚动时固定表头。列通过 ' },
    { t: 'code', s: 'sn-table-column' },
    { t: 'text', s: ' 子组件声明，容器用 provide/inject 收集，因此**列顺序 = DOM 顺序**。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-table',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Table 表格.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Table } from '@snui/uni';
</script>

<template>
  <sn-table />
</template>`,
  },
  demos: [
    {
      name: 'table-mp-basic',
      title: '基础用法',
      blurb: '索引列 + 可排序表头 + 固定高度 / 固定表头 / 左固定列。',
    },
    {
      name: 'table-mp-cell',
      title: '单元格与空态',
      blurb: '两行省略、value 插槽渲染 sn-tag、内置空态。',
    },
    {
      name: 'table-mp-style',
      title: '边框、斑马纹与表头',
      blurb:
        'border / stripe 开关、index 配置对象、show-header 关闭，以及 customClass / customStyle。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'data', type: 'SnTableRow[]', default: '() => []', desc: 'Table rows.' },
      { name: 'border', type: 'boolean', default: 'true', desc: 'Draw cell borders.' },
      { name: 'stripe', type: 'boolean', default: 'true', desc: 'Zebra-stripe the body rows.' },
      {
        name: 'height',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Max height — a bare number is design px. Setting it turns on vertical scrolling.',
      },
      { name: 'showHeader', type: 'boolean', default: 'true', desc: 'Render the header row.' },
      {
        name: 'ellipsis',
        type: 'boolean',
        default: 'false',
        desc: 'Clamp cell text to two lines.',
      },
      {
        name: 'index',
        type: 'boolean | SnTableIndexConfig',
        default: 'false',
        desc: 'Show the index column; an object customises its label / width / align.',
      },
      {
        name: 'fixedHeader',
        type: 'boolean',
        default: 'true',
        desc: 'Pin the header row while the body scrolls vertically.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Table 表格 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Table } from '@snui/uni';",
    chipCopy: "import { Table } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-table', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-qr-code', link: '/components/uni/qr-code' },
    next: { text: 'sn-rich-text', link: '/components/uni/rich-text' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
