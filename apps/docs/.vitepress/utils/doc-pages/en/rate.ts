/** Rate · Web (Web) — English page data. Props from rate SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const rateDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Rate · Web' }],
  title: 'Rate · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Rating with inline SVG stars (no emoji), half stars, clearable, and keyboard support.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/rate',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Rate · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Rate } from '@snui/vue-web';
</script>

<template>
  <Rate />
</template>`,
  },
  demos: [
    { name: 'rate-web-basic', title: 'Basic', blurb: 'v-model + count.' },
    {
      name: 'rate-web-half',
      title: 'Half stars (allowHalf)',
      blurb: 'Two 50% hit zones per star, 0.5 steps.',
    },
    {
      name: 'rate-web-readonly',
      title: 'Readonly',
      blurb: 'readonly display state.',
    },
    {
      name: 'rate-web-disabled',
      title: 'Disabled',
      blurb: 'disabled: greyed out, no interaction.',
    },
    {
      name: 'rate-web-clearable',
      title: 'Clearable',
      blurb: 'Clicking the current value clears it.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | null',
        default: 'null',
        desc: 'Bound rating value. 0 (or null) = unrated.',
      },
      { name: 'count', type: 'number', default: '5', desc: 'Number of stars rendered.' },
      {
        name: 'allowHalf',
        type: 'boolean',
        default: 'false',
        desc: 'Allow half-star precision (0.5 steps).',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — visible but not interactive.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disabled — greyed out, not interactive.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Drives star glyph size.',
      },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Filled-star color. Accepts any CSS color (token variable like `var(--sn-web-color-feedback-warning)` is recommended); applied via the `--sn-rate-color` CSS variable so it stays themeable.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Clicking the same rating again resets the value to 0.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible label for the radiogroup.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnRate.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      { name: 'update:modelValue', payload: '(value: number)', desc: '`v-model` sync.' },
      {
        name: 'change',
        payload: '(value: number)',
        desc: 'Fired on every committed rating change (click / keyboard).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnRate.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'icon',
        props: '{ index: number; filled: boolean }',
        desc: 'Custom per-star content; replaces the built-in SVG star.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Rate · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Rate } from '@snui/vue-web';",
    chipCopy: "import { Rate } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Rate', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'slider-bar', link: '/en/components/web/slider-bar' },
    next: { text: 'form', link: '/en/components/web/form' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
