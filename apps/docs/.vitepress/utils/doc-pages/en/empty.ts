/** Empty · Web (Web) — English page data. Props from empty SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const emptyDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Empty · Web' },
  ],
  title: 'Empty · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Centered empty-state placeholder: glyph + description + optional extra' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/empty',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Empty · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Empty } from '@snui/vue-web';
</script>

<template>
  <Empty />
</template>`,
  },
  demos: [
    { name: 'empty-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'empty-web-icon', title: 'Custom icon & action', blurb: 'Custom icon & action' },
    { name: 'empty-web-size', title: 'Size', blurb: 'Size' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'description',
        type: 'string',
        default: '—',
        desc: 'Description text; the `default` slot overrides it.',
      },
      {
        name: 'showDescription',
        type: 'boolean',
        default: 'true',
        desc: 'Render the description line.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: 'Render the default glyph (or the `icon` slot).',
      },
      {
        name: 'size',
        type: "'tiny' | 'small' | 'medium' | 'large' | 'huge'",
        default: "'medium'",
        desc: 'Visual scale of the glyph + description.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Empty · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Empty } from '@snui/vue-web';",
    chipCopy: "import { Empty } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Empty', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'descriptions', link: '/en/components/web/descriptions' },
    next: { text: 'equation', link: '/en/components/web/equation' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
