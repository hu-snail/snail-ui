/**
 * Table 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const tableDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Table' }],
  title: 'Table',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '简单表格。你写 ' },
    { t: 'code', s: 'thead/tbody/tr/th/td' },
    { t: 'text', s: '，组件负责外层 ' },
    { t: 'code', s: '<table>' },
    {
      t: 'text',
      s: ' 容器、合并边框网格、表头底色与斑马纹。需要排序/筛选/选择请用 [DataTable](./data-table)。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/table',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Table.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Table } from '@snui/vue-web';
</script>

<template>
  <Table />
</template>`,
  },
  demos: [
    { name: 'table-web-basic', title: '基础用法', blurb: '默认合并边框 + 表头底色。' },
    {
      name: 'table-web-bordered',
      title: '边框（bordered / bottom-bordered）',
      blurb: '外框边框；bordered 为 true 时 bottom-bordered 无效。',
    },
    {
      name: 'table-web-size',
      title: '尺寸（size）',
      blurb: 'small / medium / large（padding 6/12/12px）。',
    },
    {
      name: 'table-web-single-column',
      title: '单列边框（single-column）',
      blurb: '只保留行分割线。',
    },
    {
      name: 'table-web-single-line',
      title: '列分割线（single-line）',
      blurb: 'single-line 默认 true；设为 false 恢复列分割线。',
    },
    { name: 'table-web-striped', title: '斑马纹（striped）', blurb: '偶数行条纹底色。' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'bordered', type: 'boolean', default: 'true', desc: '是否显示外框边框' },
      {
        name: 'bottomBordered',
        type: 'boolean',
        default: 'true',
        desc: '保留最后一行的下边框（`bordered` 时忽略）。对应 n-table 的 `bottom-bordered`。',
      },
      {
        name: 'singleColumn',
        type: 'boolean',
        default: 'false',
        desc: '去掉行分隔线（单元格下边框）。对应 n-table 的 `single-column`。',
      },
      {
        name: 'singleLine',
        type: 'boolean',
        default: 'true',
        desc: '去掉列分隔线（单元格右边框）。对应 n-table 的 `single-line`。',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Table scale. Mirrors n-table `size`.',
      },
      { name: 'striped', type: 'boolean', default: 'false', desc: '是否使用斑马线条纹' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnTable.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: '默认插槽：由使用方编写完整表格结构（thead / tbody / tr / th / td）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Table 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Table } from '@snui/vue-web';",
    chipCopy: "import { Table } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Table', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'statistic', link: '/components/web/statistic' },
    next: { text: 'thing', link: '/components/web/thing' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
