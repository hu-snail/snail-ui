/** Calendar · Web (Web) — English page data. Props from calendar SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const calendarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Calendar · Web' },
  ],
  title: 'Calendar · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'A month-view panel for browsing dates and picking a day.' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/calendar',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Calendar · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Calendar } from '@snui/vue-web';
</script>

<template>
  <Calendar />
</template>`,
  },
  demos: [
    {
      name: 'calendar-web-basic',
      title: 'Basic',
      blurb: 'v-model:value + custom cells + disabled dates.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'number | null | undefined',
        default: 'undefined',
        desc: 'Selected date (millisecond timestamp), v-model:value. Mirrors n-calendar `value`.',
      },
      {
        name: 'defaultValue',
        type: 'number | null | undefined',
        default: 'null',
        desc: 'Uncontrolled initial selection (millisecond timestamp); also anchors the first panel month. Mirrors n-calendar `defaultValue`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Calendar · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Calendar } from '@snui/vue-web';",
    chipCopy: "import { Calendar } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Calendar', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'progress', link: '/en/components/web/progress' },
    next: { text: 'carousel', link: '/en/components/web/carousel' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
