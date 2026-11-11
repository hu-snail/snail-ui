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
    { label: 'Web', tone: 'accent', icon: 'dual' },
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
      {
        name: 'isDateDisabled',
        type: '((date: number) => boolean)',
        default: '—',
        desc: 'Return `true` to disable a date (receives the local-midnight timestamp).',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnCalendar.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:value',
        payload: '(value: number, time: SnCalendarDateItem)',
        desc: 'Selection changed: emits `(timestamp, { year, month, date })` (n-calendar).',
      },
      {
        name: 'panel-change',
        payload: '(info: { year: number; month: number })',
        desc: 'Panel year/month switched (month is 1-based; n-calendar parity).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnCalendar.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '{ year: number; month: number; date: number }',
        desc: 'Custom content under the day number, per cell. Mirrors n-calendar `default`.',
      },
      {
        name: 'header',
        props: '{ year: number; month: number }',
        desc: 'Custom header title. Mirrors n-calendar `header`.',
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
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
