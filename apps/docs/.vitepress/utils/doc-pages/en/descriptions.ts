/** Descriptions · Web (Web) — English page data. Props from descriptions SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const descriptionsDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Descriptions · Web' },
  ],
  title: 'Descriptions · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Grouped key/value detail list in a grid, with column control, entry' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/descriptions',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Descriptions · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Descriptions } from '@snui/vue-web';
</script>

<template>
  <Descriptions />
</template>`,
  },
  demos: [
    {
      name: 'descriptions-web-basic',
      title: 'Examples',
      blurb: 'Three columns by default, labels above content.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string',
        default: '—',
        desc: 'Title above the table; the `header` slot overrides it.',
      },
      {
        name: 'column',
        type: 'number',
        default: '3',
        desc: 'Total number of logical columns the grid is laid out with.',
      },
      {
        name: 'labelPlacement',
        type: "'left' | 'top'",
        default: "'top'",
        desc: 'Where labels sit relative to their content.',
      },
      {
        name: 'labelAlign',
        type: "'left' | 'right' | 'center'",
        default: "'left'",
        desc: 'Label text alignment (applies to the th cells).',
      },
      {
        name: 'separator',
        type: 'string',
        default: "':'",
        desc: 'Separator between inline label and content (`left` + no border).',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Font scale.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'false',
        desc: 'Draw the bordered grid (outlined cells + tinted label background).',
      },
      {
        name: 'labelClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to every rendered label cell / span.',
      },
      {
        name: 'labelStyle',
        type: 'string | CSSProperties',
        default: '—',
        desc: 'Style applied to every rendered label cell / span.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to every rendered content cell / span.',
      },
      {
        name: 'contentStyle',
        type: 'string | CSSProperties',
        default: '—',
        desc: 'Style applied to every rendered content cell / span.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Descriptions · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Descriptions } from '@snui/vue-web';",
    chipCopy: "import { Descriptions } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Descriptions', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'data-table', link: '/en/components/web/data-table' },
    next: { text: 'empty', link: '/en/components/web/empty' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
