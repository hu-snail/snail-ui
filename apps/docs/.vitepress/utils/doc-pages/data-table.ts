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
    { name: 'data-table-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'data-table-web-empty', title: '空态（empty）', blurb: '空态（empty）' },
    {
      name: 'data-table-web-border',
      title: '边框形态（border / single-line / single-column）',
      blurb: '边框形态（border / single-line / single-column）',
    },
    { name: 'data-table-web-size', title: '尺寸（size）', blurb: '尺寸（size）' },
    { name: 'data-table-web-striped', title: '斑马纹（striped）', blurb: '斑马纹（striped）' },
    { name: 'data-table-web-loading', title: '加载中（loading）', blurb: '加载中（loading）' },
    {
      name: 'data-table-web-row-props',
      title: '行属性（row-props / row-class-name）',
      blurb: '行属性（row-props / row-class-name）',
    },
    { name: 'data-table-web-filter-and-sorter', title: '排序（sorter）', blurb: '排序（sorter）' },
    {
      name: 'data-table-web-custom-sorter',
      title: '自定义排序图标行为（sorter: true）',
      blurb: '自定义排序图标行为（sorter: true）',
    },
    {
      name: 'data-table-web-controlled-sorter',
      title: '受控排序（sortOrder）',
      blurb: '受控排序（sortOrder）',
    },
    {
      name: 'data-table-web-controlled-filter',
      title: '受控筛选（filterOptionValues）',
      blurb: '受控筛选（filterOptionValues）',
    },
    { name: 'data-table-web-select', title: '行选择（selection）', blurb: '行选择（selection）' },
    {
      name: 'data-table-web-select-single',
      title: '单选（multiple: false）',
      blurb: '单选（multiple: false）',
    },
    { name: 'data-table-web-expand', title: '展开行（expand）', blurb: '展开行（expand）' },
    { name: 'data-table-web-summary', title: '总结栏（summary）', blurb: '总结栏（summary）' },
    {
      name: 'data-table-web-fixed-header',
      title: '固定表头（max-height）',
      blurb: '固定表头（max-height）',
    },
    {
      name: 'data-table-web-fixed-header-column',
      title: '固定列（fixed）',
      blurb: '固定列（fixed）',
    },
    {
      name: 'data-table-web-render-header',
      title: '自定义标题渲染（title render）',
      blurb: '自定义标题渲染（title render）',
    },
    {
      name: 'data-table-web-render-cell',
      title: '自定义单元格渲染（render）',
      blurb: '自定义单元格渲染（render）',
    },
    {
      name: 'data-table-web-custom-style',
      title: '列类名（className）',
      blurb: '列类名（className）',
    },
    {
      name: 'data-table-web-ellipsis',
      title: '文本省略（ellipsis）',
      blurb: '文本省略（ellipsis）',
    },
    {
      name: 'data-table-web-scroll-x',
      title: '横向滚动（scroll-x）',
      blurb: '横向滚动（scroll-x）',
    },
    {
      name: 'data-table-web-controlled-page',
      title: '受控分页（pagination）',
      blurb: '受控分页（pagination）',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'columns',
        type: 'DataTableColumns',
        default: '() => []',
        desc: '列定义（基础列 / selection / expand / index），类型见下方 Column 说明',
      },
      { name: 'data', type: 'DataTableRowData[]', default: '() => []', desc: '行数据' },
      {
        name: 'rowKey',
        type: '((row: DataTableRowData) => DataTableRowKey)',
        default: '—',
        desc: '由行数据推导行键的函数，对应 n-data-table 的 `row-key`。',
      },
      {
        name: 'rowProps',
        type: '((row: DataTableRowData, index: number) => HTMLAttributes)',
        default: '—',
        desc: '按行返回额外 `tr` 属性的函数，对应 n-data-table 的 `row-props`。',
      },
      {
        name: 'rowClassName',
        type: 'string | ((row: DataTableRowData, index: number) => string)',
        default: '—',
        desc: '静态或按行计算的 `tr` class，对应 n-data-table 的 `row-class-name`。',
      },
      { name: 'striped', type: 'boolean', default: 'false', desc: '斑马条纹' },
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
        desc: '是否显示外框边框',
      },
      {
        name: 'bottomBordered',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: '最后一行下边框（`bordered` 时不生效）；未设置视为 `true`。对应 ``bottom-bordered``。',
      },
      {
        name: 'singleLine',
        type: 'boolean',
        default: 'true',
        desc: '隐藏列分隔线。对应 n-data-table 的 `single-line`。',
      },
      {
        name: 'singleColumn',
        type: 'boolean',
        default: 'false',
        desc: '隐藏行分隔线。对应 n-data-table 的 `single-column`。',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: '显示加载态（遮罩 + spinner，阻断勾选/分页）',
      },
      {
        name: 'scrollX',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '内层表格最小宽度，超出后横向滚动。对应 ``scroll-x``。',
      },
      {
        name: 'maxHeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '滚动容器的最大高度，超出后表头吸附。对应 ``max-height``。',
      },
      {
        name: 'summary',
        type: 'DataTableCreateSummary | undefined',
        default: 'undefined',
        desc: '—',
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
        desc: '选中行 key（`v-model:checked-row-keys`）。对应 ``checked-row-keys``。',
      },
      {
        name: 'defaultCheckedRowKeys',
        type: 'DataTableRowKey[]',
        default: '() => []',
        desc: '非受控模式下的初始选中 key。对应 ``default-checked-row-keys``。',
      },
      {
        name: 'expandedRowKeys',
        type: 'DataTableRowKey[] | undefined',
        default: 'undefined',
        desc: '展开行 key（`v-model:expanded-row-keys`）。对应 ``expanded-row-keys``。',
      },
      {
        name: 'defaultExpandedRowKeys',
        type: 'DataTableRowKey[]',
        default: '() => []',
        desc: '非受控模式下的初始展开 key。对应 ``default-expanded-row-keys``。',
      },
      {
        name: 'pagination',
        type: 'DataTablePagination | false',
        default: 'false',
        desc: '分页配置；传 `false` 关闭分页。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnDataTable.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:checkedRowKeys',
        payload:
          "(DataTableRowKey[], DataTableRowData[], { row: DataTableRowData | undefined; action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' })",
        desc: '勾选变化时派发新的键、对应行数据与动作元信息。',
      },
      {
        name: 'update:expandedRowKeys',
        payload: '(DataTableRowKey[])',
        desc: '展开行集合变化时派发完整的键数组。',
      },
      {
        name: 'update:filters',
        payload: '(DataTableFilterState, DataTableBaseColumn)',
        desc: '列筛选提交时派发新的筛选状态与对应列定义。',
      },
      {
        name: 'update:sorter',
        payload: '(DataTableSortState | DataTableSortState[] | null)',
        desc: '点击可排序表头时派发新的排序状态。',
      },
      { name: 'update:page', payload: '(number)', desc: '翻页时派发已裁剪到合法范围内的页码。' },
      { name: 'update:pageSize', payload: '(number)', desc: '每页条数变化时派发新的 pageSize。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnDataTable.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'empty', props: '—', desc: '替换默认的无数据空状态。' }],
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
