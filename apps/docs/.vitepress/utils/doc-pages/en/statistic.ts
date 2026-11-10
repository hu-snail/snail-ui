/** Statistic · Web (Web) — English page data. Props from statistic SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const statisticDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Statistic · Web' },
  ],
  title: 'Statistic · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Statistic display (n-statistic aligned): a small label above a large value, with prefix / suffix decorations and tabular numerals.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/statistic',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Statistic · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Statistic } from '@snui/vue-web';
</script>

<template>
  <Statistic />
</template>`,
  },
  demos: [
    {
      name: 'statistic-web-basic',
      title: 'Basic',
      blurb: 'label + value, prefix / suffix slots and the default slot.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'label',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Label shown above the value. Mirrors n-statistic `label`.',
      },
      {
        name: 'value',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Statistic value; when set it takes precedence over the default slot. Mirrors n-statistic `value`.',
      },
      {
        name: 'tabularNums',
        type: 'boolean',
        default: 'false',
        desc: 'Render digits with equal widths (font-variant-numeric: tabular-nums). Mirrors n-statistic `tabularNums`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Statistic · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Statistic } from '@snui/vue-web';",
    chipCopy: "import { Statistic } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Statistic', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'qr-code', link: '/en/components/web/qr-code' },
    next: { text: 'table', link: '/en/components/web/table' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
