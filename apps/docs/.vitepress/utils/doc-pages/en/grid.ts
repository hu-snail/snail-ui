/** Grid (Web) — English page data. Props from SnGrid.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const gridDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Layout' }, { text: 'Grid' }],
  title: 'Grid',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'CSS Grid container with N equal-width columns + gap control. Mirrors naive-ui ',
    },
    { t: 'code', s: 'n-grid' },
    {
      t: 'text',
      s: ' 1:1 on the props the docs site actually uses; advanced features (suffix / collapsed / collapsedRows / layoutShiftDisabled / self-vs-screen responsive observer) are §112 future markers.',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/grid',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Grid.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Grid } from '@snui/vue-web';
</script>

<template>
  <Grid />
</template>`,
  },
  demos: [
    { name: 'grid-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'grid-web-responsive', title: 'Responsive layout', blurb: 'Responsive layout' },
    { name: 'grid-web-collapsed', title: 'Collapsed', blurb: 'Collapsed' },
    { name: 'grid-web-gap', title: 'Gap control', blurb: 'Gap control' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'cols',
        type: 'number | string | ResponsiveCols',
        default: '24',
        desc: 'Number of grid columns. Default 24 (matches n-grid). Can also be a ResponsiveCols object keyed by breakpoint suffix.',
      },
      {
        name: 'xGap',
        type: 'number | string',
        default: '0',
        desc: 'Horizontal gap between columns (px). Default 0.',
      },
      {
        name: 'yGap',
        type: 'number | string',
        default: '0',
        desc: 'Vertical gap between rows (px). Default 0.',
      },
      {
        name: 'itemResponsive',
        type: 'boolean',
        default: 'false',
        desc: 'Whether children should adapt their layout to the container width. Mirrors n-grid `itemResponsive` (forces the grid to subscribe to resize events). Default false.',
      },
      {
        name: 'itemStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to each direct child. Mirrors n-grid `itemStyle`.',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        desc: 'Whether to render the grid in collapsed mode (show "+N more" overflow). Mirrors n-grid `collapsed`. Default false.',
      },
      {
        name: 'collapsedRows',
        type: 'number',
        default: '1',
        desc: 'Number of rows to show when collapsed. Default 1. Mirrors n-grid `collapsedRows`.',
      },
      {
        name: 'suffix',
        type: 'boolean',
        default: 'false',
        desc: 'Optional render function for the suffix slot (rendered after children, typically used to anchor "X more" expand affordance).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnGrid.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Direct children become grid items.' },
      {
        name: 'suffix',
        props: '—',
        desc: 'Suffix slot appended after grid items, e.g. a "show more" button.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Grid ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Grid } from '@snui/vue-web';",
    chipCopy: "import { Grid } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Grid', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
