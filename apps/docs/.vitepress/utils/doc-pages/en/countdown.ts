/** Countdown · Web (Web) — English page data. Props from countdown SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const countdownDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Countdown · Web' },
  ],
  title: 'Countdown · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Countdown (n-countdown aligned): ticks from ' },
    { t: 'code', s: 'duration' },
    { t: 'text', s: ' (ms) down to zero, rendering ' },
    { t: 'code', s: 'HH:MM:SS' },
    { t: 'text', s: ' with optional decimal precision and custom rendering.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/countdown',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Countdown · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Countdown } from '@snui/vue-web';
</script>

<template>
  <Countdown />
</template>`,
  },
  demos: [
    { name: 'countdown-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'countdown-web-precision', title: 'Precision', blurb: 'Precision' },
    { name: 'countdown-web-render', title: 'Custom render', blurb: 'Custom render' },
    { name: 'countdown-web-reset', title: 'Reset', blurb: 'Reset' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'duration',
        type: 'number',
        default: '0',
        desc: 'Countdown length in ms (non-reactive). Mirrors n-countdown `duration`.',
      },
      {
        name: 'active',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the countdown is ticking. Mirrors n-countdown `active`.',
      },
      {
        name: 'precision',
        type: '0 | 1 | 2 | 3',
        default: '0',
        desc: 'Displayed precision: 0 = seconds, 1-3 add decimal digits. Mirrors n-countdown `precision`.',
      },
      {
        name: 'render',
        type: '((info: CountdownTimeInfo) => VNodeChild)',
        default: '—',
        desc: 'Custom render for the remaining time info; mirrors n-countdown `render`.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnCountdown.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'finish',
        payload: '—',
        desc: 'Fired once when the countdown reaches zero; mirrors n-countdown `onFinish`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Countdown · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Countdown } from '@snui/vue-web';",
    chipCopy: "import { Countdown } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Countdown', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'marquee', link: '/en/components/web/marquee' },
    next: { text: 'code', link: '/en/components/web/code' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
