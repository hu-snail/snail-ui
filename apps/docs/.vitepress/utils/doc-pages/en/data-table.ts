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
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
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
    { name: 'data-table-web-basic', title: 'Basic', blurb: 'columns + data + render cell.' },
    { name: 'data-table-web-empty', title: 'Empty', blurb: 'Default empty state + empty slot.' },
    {
      name: 'data-table-web-border',
      title: 'Border',
      blurb: 'bordered / single-line / single-column / bottom-bordered.',
    },
    { name: 'data-table-web-size', title: 'Size', blurb: 'small / medium / large.' },
    { name: 'data-table-web-striped', title: 'Striped', blurb: 'Zebra stripes on odd page rows.' },
    {
      name: 'data-table-web-loading',
      title: 'Loading',
      blurb: 'Loading mask + inline SVG spinner.',
    },
    {
      name: 'data-table-web-row-props',
      title: 'Row Props',
      blurb: 'rowProps events + rowClassName styling.',
    },
    {
      name: 'data-table-web-filter-and-sorter',
      title: 'Filter & Sorter',
      blurb: 'Uncontrolled sorter + filter (defaultSortOrder / sorter / filter).',
    },
    {
      name: 'data-table-web-select',
      title: 'Selection',
      blurb: 'Multi-select + disabled rows + check-all / indeterminate.',
    },
    {
      name: 'data-table-web-expand',
      title: 'Expand',
      blurb: 'type: expand + renderExpand + default-expanded-row-keys.',
    },
    { name: 'data-table-web-summary', title: 'Summary', blurb: 'summary returns value + colSpan.' },
    {
      name: 'data-table-web-fixed-header',
      title: 'Fixed Header',
      blurb: 'max-height scroll container + sticky header.',
    },
    {
      name: 'data-table-web-fixed-header-column',
      title: 'Fixed Columns',
      blurb: 'scroll-x + fixed left/right sticky columns.',
    },
    {
      name: 'data-table-web-render-header',
      title: 'Render Header',
      blurb: 'title as a render function.',
    },
    { name: 'data-table-web-render-cell', title: 'Render Cell', blurb: 'render returning VNodes.' },
    {
      name: 'data-table-web-custom-style',
      title: 'Custom Column Style',
      blurb: 'column.className cell styling.',
    },
    {
      name: 'data-table-web-ellipsis',
      title: 'Ellipsis',
      blurb: 'ellipsis + native title fallback.',
    },
    {
      name: 'data-table-web-scroll-x',
      title: 'Scroll X',
      blurb: 'scroll-x sets the content min-width.',
    },
    {
      name: 'data-table-web-controlled-page',
      title: 'Controlled Pagination',
      blurb: 'page / page-size controlled + size picker.',
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
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
