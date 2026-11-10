/** TimePicker · Web (Web) — English page data. Props from time-picker SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const timePickerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'TimePicker · Web' },
  ],
  title: 'TimePicker · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Teleport three-column (H/M/S) panel with 12-hour mode and full keyboard support.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/time-picker',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'TimePicker · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { TimePicker } from '@snui/vue-web';
</script>

<template>
  <TimePicker />
</template>`,
  },
  demos: [
    {
      name: 'time-picker-web-basic',
      title: 'Basic',
      blurb: 'v-model (ms timestamp) + default HH:mm:ss.',
    },
    {
      name: 'time-picker-web-format',
      title: 'format (columns)',
      blurb: 'HH:mm hides the seconds column; seconds zero on commit.',
    },
    {
      name: 'time-picker-web-12h',
      title: '12-hour (use12Hours)',
      blurb: 'Clock-face order 12/1…11 + AM/PM column.',
    },
    {
      name: 'time-picker-web-states',
      title: 'Clearable / disabled / readonly',
      blurb: 'clearable, disabled, readonly.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | null',
        default: 'null',
        desc: 'Bound value: millisecond timestamp, or null when empty.',
      },
      {
        name: 'format',
        type: 'SnTimePickerFormat',
        default: "'HH:mm:ss'",
        desc: 'Display format — also decides whether the seconds column renders.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Please select time'",
        desc: 'Placeholder text when empty.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Show the clear (×) button when a value is present.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — opens nothing, commits nothing.',
      },
      { name: 'size', type: 'SnTimePickerSize', default: "'medium'", desc: 'Visual size preset.' },
      {
        name: 'status',
        type: 'SnTimePickerStatus',
        default: "'default'",
        desc: 'Validation-driven visual status.',
      },
      {
        name: 'use12Hours',
        type: 'boolean',
        default: 'false',
        desc: '12-hour clock: hour faces 1–12 plus an AM/PM column.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: "Accessible name for the trigger (fallback: 'Time picker').",
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'TimePicker · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { TimePicker } from '@snui/vue-web';",
    chipCopy: "import { TimePicker } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'TimePicker', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tree-select', link: '/en/components/web/tree-select' },
    next: { text: 'date-picker', link: '/en/components/web/date-picker' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
