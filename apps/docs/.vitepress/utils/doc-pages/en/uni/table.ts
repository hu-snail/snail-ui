/** Table · uni-app (uni-app) — English page data. Props from sn-table.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tableDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'Table · uni-app' },
  ],
  title: 'Table · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Horizontal scrolling is a ' },
    { t: 'code', s: '<scroll-view scroll-x>' },
    { t: 'text', s: '; pass ' },
    { t: 'code', s: 'height' },
    { t: 'text', s: ' to turn on vertical scrolling and ' },
    { t: 'code', s: 'fixed-header' },
    { t: 'text', s: ' to pin the header while it scrolls. Columns are declared as ' },
    { t: 'code', s: 'sn-table-column' },
    { t: 'text', s: ' children and collected by the container through provide/inject, so ' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-table',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Table · uni-app.vue',
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
      title: 'Basic usage',
      blurb: 'Index column, sortable header, fixed height / pinned header / left-pinned column.',
    },
    {
      name: 'table-mp-cell',
      title: 'Cells and empty state',
      blurb: 'Two-line ellipsis, a value slot rendering sn-tag, and the built-in empty row.',
    },
    {
      name: 'table-mp-style',
      title: 'Borders, stripes and the header',
      blurb:
        'The border / stripe switches, an index config object, show-header off, and customClass / customStyle.',
    },
  ],
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Table · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Table } from '@snui/uni';",
    chipCopy: "import { Table } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-table', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-qr-code', link: '/en/components/uni/qr-code' },
    next: { text: 'sn-rich-text', link: '/en/components/uni/rich-text' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
