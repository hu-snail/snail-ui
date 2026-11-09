/** Select · Web (Web) — English page data. Props from select SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const selectDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Select · Web' }],
  title: 'Select · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Teleport dropdown with viewport flipping; single / multiple / filterable / grouped / remote search.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/select',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Select · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Select } from '@snui/vue-web';
</script>

<template>
  <Select />
</template>`,
  },
  demos: [
    { name: 'select-web-basic', title: 'Basic', blurb: 'options + v-model single select.' },
    {
      name: 'select-web-multiple',
      title: 'Multiple',
      blurb: 'Array v-model + tag removal + maxTagCount.',
    },
    {
      name: 'select-web-filterable',
      title: 'Filterable',
      blurb: 'Type to filter; custom filter supported.',
    },
    {
      name: 'select-web-group',
      title: 'Groups (children)',
      blurb: 'children render as group titles.',
    },
    {
      name: 'select-web-fields',
      title: 'Custom fields (labelField / valueField)',
      blurb: 'Non-label/value field mapping.',
    },
    {
      name: 'select-web-states',
      title: 'Clearable / disabled / loading',
      blurb: 'clearable, disabled, loading.',
    },
    {
      name: 'select-web-remote',
      title: 'Remote search (remote)',
      blurb:
        'remote + search event against a mocked API (450ms latency, debounce, aborted requests); swap the mock for fetch in real apps.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'label', type: 'string', default: '—', desc: 'Row label text.' },
      {
        name: 'value',
        type: 'string | number | boolean',
        default: '—',
        desc: 'Row value — what selection commits to the v-model.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Row-level disabled (ORs with select-level disabled).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Select · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Select } from '@snui/vue-web';",
    chipCopy: "import { Select } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Select', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'auto-complete', link: '/en/components/web/auto-complete' },
    next: { text: 'dynamic-input', link: '/en/components/web/dynamic-input' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
