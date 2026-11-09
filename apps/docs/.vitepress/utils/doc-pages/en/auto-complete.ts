/** AutoComplete · Web (Web) — English page data. Props from auto-complete SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const autoCompleteDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'AutoComplete · Web' },
  ],
  title: 'AutoComplete · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Autocomplete input. Candidates on typing, keyboard selection, per-segment highlight.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/auto-complete',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'AutoComplete · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { AutoComplete } from '@snui/vue-web';
</script>

<template>
  <AutoComplete />
</template>`,
  },
  demos: [
    { name: 'auto-complete-web-basic', title: 'Basic', blurb: 'options + v-model.' },
    {
      name: 'auto-complete-web-highlight',
      title: 'Highlight (nested label)',
      blurb: 'label arrays render with matched segments highlighted.',
    },
    {
      name: 'auto-complete-web-keyboard',
      title: 'Keyboard selection',
      blurb: 'ArrowUp/Down + Enter + Esc.',
    },
    {
      name: 'auto-complete-web-getshow',
      title: 'Dynamic candidates (getShow)',
      blurb: 'Compute candidates from input.',
    },
    {
      name: 'auto-complete-web-states',
      title: 'blurAfterSelect / clearable / disabled',
      blurb: 'Blur after select, clear, disabled.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Bound value (`v-model`).' },
      {
        name: 'options',
        type: 'SnAutoCompleteRawOption[]',
        default: '() => []',
        desc: 'Static candidate list. Ignored when `getShow` is provided.',
      },
      { name: 'placeholder', type: 'string', default: "''", desc: 'Placeholder text.' },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Show the clear (×) button when the field has a non-empty value.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction (typing, selecting, clearing).',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — value visible, not editable, no dropdown.',
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
        name: 'blurAfterSelect',
        type: 'boolean',
        default: 'false',
        desc: 'Blur the input after an option is selected (naive `blur-after-select`).',
      },
      {
        name: 'getShow',
        type: 'SnAutoCompleteGetShow',
        default: '—',
        desc: 'Dynamically compute the candidate list from the current value (naive `get-show`). Wins over the static `options` prop.',
      },
      { name: 'ariaLabel', type: 'string', default: "''", desc: 'Native ARIA label.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'AutoComplete · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { AutoComplete } from '@snui/vue-web';",
    chipCopy: "import { AutoComplete } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'AutoComplete', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'input-number', link: '/en/components/web/input-number' },
    next: { text: 'select', link: '/en/components/web/select' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
