/** Table · Web (Web) — English page data. Props from table SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const tableDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Table · Web' },
  ],
  title: 'Table · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Simple table (n-table aligned). You author ' },
    { t: 'code', s: 'thead/tbody/tr/th/td' },
    { t: 'text', s: '; the' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/table',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Table · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Table } from '@snui/vue-web';
</script>

<template>
  <Table />
</template>`,
  },
  demos: [
    { name: 'table-web-basic', title: 'Basic', blurb: 'Merged border grid + header background.' },
    {
      name: 'table-web-bordered',
      title: 'Bordered',
      blurb: 'Outer frame; bottom-bordered is ineffective while bordered.',
    },
    { name: 'table-web-size', title: 'Size', blurb: 'small / medium / large (padding 6/12/12px).' },
    { name: 'table-web-single-column', title: 'Single Column', blurb: 'Row separators only.' },
    {
      name: 'table-web-single-line',
      title: 'Single Line',
      blurb: 'single-line defaults to true; false restores column separators.',
    },
    { name: 'table-web-striped', title: 'Striped', blurb: 'Zebra stripes on even tbody rows.' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'bordered',
        type: 'boolean',
        default: 'true',
        desc: 'Draw the surrounding border. Mirrors n-table `bordered`.',
      },
      {
        name: 'bottomBordered',
        type: 'boolean',
        default: 'true',
        desc: 'Keep the bottom border of the last row (ignored when bordered). Mirrors n-table `bottom-bordered`.',
      },
      {
        name: 'singleColumn',
        type: 'boolean',
        default: 'false',
        desc: 'Remove the row separators (cell bottom borders). Mirrors n-table `single-column`.',
      },
      {
        name: 'singleLine',
        type: 'boolean',
        default: 'true',
        desc: 'Remove the column separators (cell right borders). Mirrors n-table `single-line`.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Table scale. Mirrors n-table `size`.',
      },
      {
        name: 'striped',
        type: 'boolean',
        default: 'false',
        desc: 'Zebra stripes on even tbody rows. Mirrors n-table `striped`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Table · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Table } from '@snui/vue-web';",
    chipCopy: "import { Table } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Table', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'statistic', link: '/en/components/web/statistic' },
    next: { text: 'thing', link: '/en/components/web/thing' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
