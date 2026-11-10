/** Pagination · Web (Web) — English page data. Props from pagination SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const paginationDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Pagination · Web' },
  ],
  title: 'Pagination · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The pagination bar splits long lists and table results into pages and owns' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/pagination',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Pagination · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Pagination } from '@snui/vue-web';
</script>

<template>
  <Pagination />
</template>`,
  },
  demos: [
    { name: 'pagination-web-basic', title: 'Basic', blurb: 'Basic' },
    {
      name: 'pagination-web-jumper',
      title: 'Quick jumper and page size',
      blurb: 'Quick jumper and page size',
    },
    {
      name: 'pagination-web-pagesize',
      title: 'Page-size options and item-count coupling',
      blurb: 'Page-size options and item-count coupling',
    },
    {
      name: 'pagination-web-picker-simple',
      title: 'Ellipsis collapsing, simple mode and the label slot',
      blurb: 'Ellipsis collapsing, simple mode and the label slot',
    },
    {
      name: 'pagination-web-disabled',
      title: 'Ellipsis collapsing and disabled state',
      blurb: 'Ellipsis collapsing and disabled state',
    },
    {
      name: 'pagination-web-quick-switch',
      title: 'Quick switch (ellipsis jump)',
      blurb: 'Quick switch (ellipsis jump)',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'page',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Current page (controlled). When undefined the component is uncontrolled. Mirrors n-pagination `page`.',
      },
      {
        name: 'itemCount',
        type: 'number',
        default: '0',
        desc: 'Total item count used to derive the page count. Mirrors n-pagination `itemCount`.',
      },
      {
        name: 'pageSize',
        type: 'number | null | undefined',
        default: 'undefined',
        desc: 'Page size (controlled). `undefined` / `null` falls back to internal state. Mirrors n-pagination `pageSize`.',
      },
      {
        name: 'defaultPage',
        type: 'number',
        default: '1',
        desc: 'Initial page for uncontrolled mode. Mirrors n-pagination `defaultPage`.',
      },
      {
        name: 'defaultPageSize',
        type: 'number',
        default: '10',
        desc: 'Initial page size for uncontrolled mode. Mirrors n-pagination `defaultPageSize`.',
      },
      {
        name: 'pageCount',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit page count — takes precedence over itemCount / pageSize. Mirrors n-pagination `pageCount`.',
      },
      {
        name: 'pageSizes',
        type: 'PaginationPageSize[]',
        default: '() => [10',
        desc: 'Options for the size picker; plain numbers render as `N / 页`. Mirrors n-pagination `pageSizes`.',
      },
      {
        name: 'showQuickJumper',
        type: 'boolean',
        default: 'false',
        desc: 'Render the quick page-jumper input. Mirrors n-pagination `showQuickJumper`.',
      },
      {
        name: 'showSizePicker',
        type: 'boolean',
        default: 'false',
        desc: 'Render the page-size picker. Mirrors n-pagination `showSizePicker`.',
      },
      {
        name: 'pageSlot',
        type: 'number',
        default: '9',
        desc: 'Maximum number of page buttons rendered before collapsing into first / last / neighborhood + ellipsis. Mirrors n-pagination `pageSlot`. Default 9.',
      },
      {
        name: 'showTotal',
        type: 'boolean',
        default: 'false',
        desc: 'Show the `共 N 条` total. Mirrors n-pagination `showTotal`.',
      },
      {
        name: 'simple',
        type: 'boolean',
        default: 'false',
        desc: 'Compact mode: prev / page input / page count / next only. Mirrors n-pagination `simple`.',
      },
      {
        name: 'quickSwitch',
        type: 'boolean',
        default: 'true',
        desc: 'Quick switch (快速切换): clicking an `…` ellipsis opens a small panel listing the pages hidden in that gap — one click jumps there. On by default; set `false` to keep the ellipsis a static marker.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable every control. Mirrors n-pagination `disabled`.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnPagination.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:page',
        payload: '(page: number)',
        desc: 'Fired when a page is committed (button click or jumper).',
      },
      {
        name: 'update:pageSize',
        payload: '(pageSize: number)',
        desc: 'Fired when the page size is committed via the size picker.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnPagination.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'prev', props: '—', desc: 'Custom arrow content for the prev button.' },
      { name: 'next', props: '—', desc: 'Custom arrow content for the next button.' },
      { name: 'prefix', props: '—', desc: 'Content rendered before the pager.' },
      { name: 'suffix', props: '—', desc: 'Content rendered after the pager.' },
      {
        name: 'label',
        props: '{ page: number }',
        desc: 'Custom page-number label; scope is `{ page }`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Pagination · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Pagination } from '@snui/vue-web';",
    chipCopy: "import { Pagination } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Pagination', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'float-button', link: '/en/components/web/float-button' },
    next: { text: 'page-header', link: '/en/components/web/page-header' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
