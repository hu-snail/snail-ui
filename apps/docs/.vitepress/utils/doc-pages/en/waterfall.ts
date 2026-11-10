/** Waterfall · Web (Web) — English page data. Props from waterfall SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const waterfallDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Layout Components' },
    { text: 'Waterfall · Web' },
  ],
  title: 'Waterfall · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'An image / feed-first masonry container: every direct child of the ' },
    { t: 'code', s: 'default' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/waterfall',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Waterfall · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Waterfall } from '@snui/vue-web';
</script>

<template>
  <Waterfall />
</template>`,
  },
  demos: [
    { name: 'waterfall-web-basic', title: 'Basic', blurb: 'Basic' },
    {
      name: 'waterfall-web-image',
      title: 'Image wall & lazy loading',
      blurb: 'Image wall & lazy loading',
    },
    { name: 'waterfall-web-responsive', title: 'Responsive columns', blurb: 'Responsive columns' },
    {
      name: 'waterfall-web-card',
      title: 'Card wall & masonry off',
      blurb: 'Card wall & masonry off',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'columns',
        type: 'number',
        default: '3',
        desc: 'Logical column count (integer ≥ 1). Used as-is, or as the initial guess in `minColumnWidth` (responsive) mode, and ignored when `masonry` is off.',
      },
      {
        name: 'minColumnWidth',
        type: 'number | string',
        default: '—',
        desc: 'Minimum column width. When set the column count follows the measured container width (responsive mode) and `columns` only serves as the pre-measurement guess.',
      },
      {
        name: 'columnGap',
        type: 'number | string',
        default: '16',
        desc: 'Gap between columns (number → px).',
      },
      {
        name: 'rowGap',
        type: 'number | string',
        default: '16',
        desc: "Gap between items (number → px); applied as the columns' `row-gap`.",
      },
      {
        name: 'masonry',
        type: 'boolean',
        default: 'true',
        desc: 'Convenience "off" switch: `false` renders a plain vertical stack (single column, no multi-column layout).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnWaterfall.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Items — each direct child becomes one `.sn-waterfall__item` box.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Waterfall · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Waterfall } from '@snui/vue-web';",
    chipCopy: "import { Waterfall } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Waterfall', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'split', link: '/en/components/web/split' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
