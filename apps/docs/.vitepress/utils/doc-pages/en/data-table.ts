/** DataTable · Web (Web) — English page data. Props from data-table SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dataTableDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'DataTable · Web' },
  ],
  title: 'DataTable · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Data table (n-data-table aligned). Columns-driven rendering with sorting,' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/data-table',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'DataTable · Web.vue',
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
    { name: 'data-table-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'data-table-web-empty', title: 'Empty', blurb: 'Empty' },
    { name: 'data-table-web-border', title: 'Border', blurb: 'Border' },
    { name: 'data-table-web-size', title: 'Size', blurb: 'Size' },
    { name: 'data-table-web-striped', title: 'Striped', blurb: 'Striped' },
    { name: 'data-table-web-loading', title: 'Loading', blurb: 'Loading' },
    { name: 'data-table-web-row-props', title: 'Row Props', blurb: 'Row Props' },
    {
      name: 'data-table-web-filter-and-sorter',
      title: 'Filter & Sorter',
      blurb: 'Filter & Sorter',
    },
    {
      name: 'data-table-web-custom-sorter',
      title: 'Remote-style Sorter',
      blurb: 'Remote-style Sorter',
    },
    {
      name: 'data-table-web-controlled-sorter',
      title: 'Controlled Sorter',
      blurb: 'Controlled Sorter',
    },
    {
      name: 'data-table-web-controlled-filter',
      title: 'Controlled Filter',
      blurb: 'Controlled Filter',
    },
    { name: 'data-table-web-select', title: 'Selection', blurb: 'Selection' },
    { name: 'data-table-web-select-single', title: 'Single Selection', blurb: 'Single Selection' },
    { name: 'data-table-web-expand', title: 'Expand', blurb: 'Expand' },
    { name: 'data-table-web-summary', title: 'Summary', blurb: 'Summary' },
    { name: 'data-table-web-fixed-header', title: 'Fixed Header', blurb: 'Fixed Header' },
    { name: 'data-table-web-fixed-header-column', title: 'Fixed Columns', blurb: 'Fixed Columns' },
    { name: 'data-table-web-render-header', title: 'Render Header', blurb: 'Render Header' },
    { name: 'data-table-web-render-cell', title: 'Render Cell', blurb: 'Render Cell' },
    {
      name: 'data-table-web-custom-style',
      title: 'Custom Column Style',
      blurb: 'Custom Column Style',
    },
    { name: 'data-table-web-ellipsis', title: 'Ellipsis', blurb: 'Ellipsis' },
    { name: 'data-table-web-scroll-x', title: 'Scroll X', blurb: 'Scroll X' },
    {
      name: 'data-table-web-controlled-page',
      title: 'Controlled Pagination',
      blurb: 'Controlled Pagination',
    },
  ],
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
        name: 'rowKey',
        type: '((row: DataTableRowData) => DataTableRowKey)',
        default: '—',
        desc: 'Derives the row key from a row; mirrors n-data-table `row-key`.',
      },
      {
        name: 'rowProps',
        type: '((row: DataTableRowData, index: number) => HTMLAttributes)',
        default: '—',
        desc: 'Returns extra `tr` attributes per row; mirrors n-data-table `row-props`.',
      },
      {
        name: 'rowClassName',
        type: 'string | ((row: DataTableRowData, index: number) => string)',
        default: '—',
        desc: 'Static or per-row `tr` class; mirrors n-data-table `row-class-name`.',
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
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnDataTable.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:checkedRowKeys',
        payload:
          "(DataTableRowKey[], DataTableRowData[], { row: DataTableRowData | undefined; action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' })",
        desc: 'Fired on check changes with the next keys, matching rows and action meta.',
      },
      {
        name: 'update:expandedRowKeys',
        payload: '(DataTableRowKey[])',
        desc: 'Fired with the complete next key array when expanded rows change.',
      },
      {
        name: 'update:filters',
        payload: '(DataTableFilterState, DataTableBaseColumn)',
        desc: 'Fired on filter commit with the next filter state and the column.',
      },
      {
        name: 'update:sorter',
        payload: '(DataTableSortState | DataTableSortState[] | null)',
        desc: 'Fired when a sortable header is clicked, with the next sort state.',
      },
      {
        name: 'update:page',
        payload: '(number)',
        desc: 'Fired with the clamped page number when pagination changes.',
      },
      {
        name: 'update:pageSize',
        payload: '(number)',
        desc: 'Fired with the next page size when the page-size selector changes.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnDataTable.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'empty', props: '—', desc: 'Replaces the default empty state.' }],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'DataTable · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DataTable } from '@snui/vue-web';",
    chipCopy: "import { DataTable } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'DataTable', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'comment', link: '/en/components/web/comment' },
    next: { text: 'descriptions', link: '/en/components/web/descriptions' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
