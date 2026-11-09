/** Alert (Web) — English page data. Props from SnAlert.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const alertDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback' }, { text: 'Alert' }],
  title: 'Alert',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Inline feedback banner for a page or section: success confirmation, warning, error, or informational note. Stays in the document flow (unlike a toast, which is transient and overlaid).',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/alert',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Alert.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Alert } from '@snui/vue-web';
</script>

<template>
  <Alert />
</template>`,
  },
  demos: [
    { name: 'alert-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'alert-web-bordered', title: 'Bordered', blurb: 'Bordered' },
    { name: 'alert-web-icon', title: 'Icon items', blurb: 'Icon items' },
    { name: 'alert-web-no-icon', title: 'Without icon', blurb: 'Without icon' },
    {
      name: 'alert-web-closable',
      title: 'Closable and intercept',
      blurb: 'Closable and intercept',
    },
    { name: 'alert-web-slots', title: 'Slot overrides', blurb: 'Slot overrides' },
    { name: 'alert-web-marquee', title: 'Scrolling announcement', blurb: 'Scrolling announcement' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Alert heading. Mirrors n-alert `title`.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: 'Show the leading type icon. Mirrors n-alert `showIcon` (default true).',
      },
      {
        name: 'type',
        type: "'info' | 'warning' | 'error' | 'success' | 'default'",
        default: "'default'",
        desc: 'Semantic type — drives color + default icon. Mirrors n-alert `type`.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'true',
        desc: 'Draw the surrounding border. Mirrors n-alert `bordered` (default true).',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        desc: 'Render the close button. Mirrors n-alert `closable`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Alert ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Alert } from '@snui/vue-web';",
    chipCopy: "import { Alert } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Alert', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'Props Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
