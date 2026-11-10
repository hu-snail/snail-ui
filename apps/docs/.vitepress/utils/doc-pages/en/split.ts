/** Split · Web (Web) — English page data. Props from split SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const splitDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Layout Components' }, { text: 'Split · Web' }],
  title: 'Split · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Split panes (n-splitter aligned). Drag to resize, keyboard accessible, collapsible panels.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/split',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Split · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Split } from '@snui/vue-web';
</script>

<template>
  <Split />
</template>`,
  },
  demos: [
    {
      name: 'split-web-basic',
      title: 'Basic',
      blurb: 'Dual panes drag + min/max, two backgrounds to tell panels apart.',
    },
    { name: 'split-web-vertical', title: 'Vertical', blurb: "direction='vertical'." },
    {
      name: 'split-web-collapse',
      title: 'Collapsible',
      blurb: 'Snap-collapse below min; double-click to restore.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: 'Split axis. Panels lay out in a row (horizontal) or column (vertical).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable all divider interaction.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Split · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Split } from '@snui/vue-web';",
    chipCopy: "import { Split } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Split', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'layout', link: '/en/components/web/layout' },
    next: { text: 'waterfall', link: '/en/components/web/waterfall' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
