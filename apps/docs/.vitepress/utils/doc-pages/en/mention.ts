/** Mention · Web (Web) — English page data. Props from mention SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const mentionDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Mention · Web' }],
  title: 'Mention · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Mention input. Typing ' },
    { t: 'code', s: '@' },
    {
      t: 'text',
      s: ' (customizable delimiter) opens a candidate panel; selection replaces the trigger word.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/mention',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Mention · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Mention } from '@snui/vue-web';
</script>

<template>
  <Mention />
</template>`,
  },
  demos: [
    {
      name: 'mention-web-basic',
      title: 'Basic',
      blurb: '@ opens candidates → filter → keyboard/click to replace.',
    },
    {
      name: 'mention-web-textarea',
      title: 'textarea',
      blurb: "type='textarea' multi-line mentions.",
    },
    {
      name: 'mention-web-delimiter',
      title: 'Custom delimiter',
      blurb: "delimiter='#' topic mentions.",
    },
    { name: 'mention-web-states', title: 'Disabled / readonly', blurb: 'disabled / readonly.' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Bound value (`v-model`).' },
      {
        name: 'options',
        type: 'SnMentionRawOption[]',
        default: '() => []',
        desc: 'Static candidate list.',
      },
      {
        name: 'delimiter',
        type: 'string | string[]',
        default: "'@'",
        desc: "Trigger character(s). A string delimiter uses its last character as the trigger char (n-mention semantics); an array accepts any of the entries' last characters (each simplified to a single char).",
      },
      { name: 'placeholder', type: 'string', default: "''", desc: 'Placeholder text.' },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction (typing, selecting).',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — value visible, not editable, no panel.',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset.',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status. Drives border color.',
      },
      {
        name: 'type',
        type: "'text' | 'textarea'",
        default: "'text'",
        desc: 'Input variant: single-line text or multi-line textarea.',
      },
      { name: 'rows', type: 'number', default: '3', desc: 'Rows for `type="textarea"`.' },
      { name: 'ariaLabel', type: 'string', default: "''", desc: 'Native ARIA label.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Mention · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Mention } from '@snui/vue-web';",
    chipCopy: "import { Mention } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Mention', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'color-picker', link: '/en/components/web/color-picker' },
    next: { text: 'upload', link: '/en/components/web/upload' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
