/**
 * DataTable 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dataTableDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'DataTable' }],
  title: 'DataTable',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '数据表格。columns 驱动渲染，支持排序、筛选、行选择（多选/单选）、展开行、序号列、总结栏、fixed 列、横向滚动 + 吸顶表头、loading / 空态与内置简化分页。只需展示静态表格请用 [Table](./table)。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/data-table',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'DataTable.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DataTable } from '@snui/vue-web';
</script>

<template>
  <DataTable />
</template>`,
  },
  demos: [
    { name: 'data-table-web-basic', title: '基础用法', blurb: 'columns + data + render 单元格。' },
    { name: 'data-table-web-empty', title: '空态（empty）', blurb: '默认空态 + empty 插槽。' },
    {
      name: 'data-table-web-border',
      title: '边框形态（border / single-line / single-column）',
      blurb: 'bordered / single-line / single-column / bottom-bordered 组合。',
    },
    { name: 'data-table-web-size', title: '尺寸（size）', blurb: 'small / medium / large。' },
    { name: 'data-table-web-striped', title: '斑马纹（striped）', blurb: '奇数页行条纹。' },
    {
      name: 'data-table-web-loading',
      title: '加载中（loading）',
      blurb: 'loading 遮罩 + 内联 SVG spinner。',
    },
    {
      name: 'data-table-web-row-props',
      title: '行属性（row-props / row-class-name）',
      blurb: 'rowProps 绑定事件、rowClassName 按行数据上色。',
    },
    {
      name: 'data-table-web-filter-and-sorter',
      title: '排序（sorter）',
      blurb: '非受控排序 + 筛选联动（defaultSortOrder / sorter / filter）。',
    },
    {
      name: 'data-table-web-controlled-filter',
      title: '筛选（filter）',
      blurb: 'filterOptionValues 受控 + update:filters。',
    },
    {
      name: 'data-table-web-select',
      title: '行选择（selection）',
      blurb: '多选 + disabled 行 + check-all / 半选。',
    },
    {
      name: 'data-table-web-expand',
      title: '展开行（expand）',
      blurb: 'type: expand + renderExpand + default-expanded-row-keys。',
    },
    {
      name: 'data-table-web-summary',
      title: '总结栏（summary）',
      blurb: 'summary 返回 value + colSpan。',
    },
    {
      name: 'data-table-web-fixed-header',
      title: '固定表头（max-height）',
      blurb: 'max-height 滚动容器 + 吸顶表头。',
    },
    {
      name: 'data-table-web-fixed-header-column',
      title: '固定列（fixed）',
      blurb: 'scroll-x + fixed left/right sticky 列。',
    },
    {
      name: 'data-table-web-render-header',
      title: '自定义标题渲染（title render）',
      blurb: 'title 传入渲染函数。',
    },
    {
      name: 'data-table-web-render-cell',
      title: '自定义单元格渲染（render）',
      blurb: 'render 返回 VNode。',
    },
    {
      name: 'data-table-web-custom-style',
      title: '列类名（className）',
      blurb: 'column.className 自定义列样式。',
    },
    {
      name: 'data-table-web-ellipsis',
      title: '文本省略（ellipsis）',
      blurb: 'ellipsis + 原生 title 兜底。',
    },
    {
      name: 'data-table-web-scroll-x',
      title: '横向滚动（scroll-x）',
      blurb: 'scroll-x 设定内容最小宽度。',
    },
    {
      name: 'data-table-web-controlled-page',
      title: '受控分页（pagination）',
      blurb: 'page / page-size 受控 + 尺寸选择器。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'columns',
        type: 'DataTableColumns',
        default: '() => []',
        desc: 'Column definitions. Mirrors n-data-table `columns`.',
      },
      {
        name: 'data',
        type: 'DataTableRowData[]',
        default: '() => []',
        desc: 'Row data records. Mirrors n-data-table `data`.',
      },
      {
        name: 'striped',
        type: 'boolean',
        default: 'false',
        desc: 'Zebra stripes on odd page rows. Mirrors n-data-table `striped`.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Table scale. Mirrors n-data-table `size`.',
      },
      {
        name: 'bordered',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Outer frame border; undefined = true. Mirrors n-data-table `bordered`.',
      },
      {
        name: 'bottomBordered',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Last-row bottom border (no effect while bordered); undefined = true. Mirrors `bottom-bordered`.',
      },
      {
        name: 'singleLine',
        type: 'boolean',
        default: 'true',
        desc: 'Hide column separators. Mirrors n-data-table `single-line`.',
      },
      {
        name: 'singleColumn',
        type: 'boolean',
        default: 'false',
        desc: 'Hide row separators. Mirrors n-data-table `single-column`.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Dim the body and show the centered spinner. Mirrors `loading`.',
      },
      {
        name: 'scrollX',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Inner table min-width -> horizontal scroll. Mirrors `scroll-x`.',
      },
      {
        name: 'maxHeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Scroll container max-height -> sticky header. Mirrors `max-height`.',
      },
      {
        name: 'summary',
        type: 'DataTableCreateSummary | undefined',
        default: 'undefined',
        desc: 'Summary rows factory over the current page data. Mirrors `summary`.',
      },
      {
        name: 'summaryPlacement',
        type: "'top' | 'bottom'",
        default: "'bottom'",
        desc: 'Render summary above or below the body. Mirrors `summary-placement`.',
      },
      {
        name: 'checkedRowKeys',
        type: 'DataTableRowKey[] | undefined',
        default: 'undefined',
        desc: 'Checked keys (v-model:checked-row-keys). Mirrors `checked-row-keys`.',
      },
      {
        name: 'defaultCheckedRowKeys',
        type: 'DataTableRowKey[]',
        default: '() => []',
        desc: 'Uncontrolled initial checked keys. Mirrors `default-checked-row-keys`.',
      },
      {
        name: 'expandedRowKeys',
        type: 'DataTableRowKey[] | undefined',
        default: 'undefined',
        desc: 'Expanded keys (v-model:expanded-row-keys). Mirrors `expanded-row-keys`.',
      },
      {
        name: 'defaultExpandedRowKeys',
        type: 'DataTableRowKey[]',
        default: '() => []',
        desc: 'Uncontrolled initial expanded keys. Mirrors `default-expanded-row-keys`.',
      },
      {
        name: 'pagination',
        type: 'DataTablePagination | false',
        default: 'false',
        desc: 'false disables pagination; object renders the simplified bar. Mirrors `pagination`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'DataTable 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { DataTable } from '@snui/vue-web';",
    chipCopy: "import { DataTable } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'DataTable', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'comment', link: '/components/web/comment' },
    next: { text: 'descriptions', link: '/components/web/descriptions' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
