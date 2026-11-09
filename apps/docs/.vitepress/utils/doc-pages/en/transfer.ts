/** Transfer · Web (Web) — English page data. Props from transfer SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const transferDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Transfer · Web' }],
  title: 'Transfer · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'The transfer shuttle presents candidates and selected items in two side-by-side',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/transfer',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Transfer · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Transfer } from '@snui/vue-web';
</script>

<template>
  <Transfer />
</template>`,
  },
  demos: [
    {
      name: 'transfer-web-basic',
      title: 'Examples',
      blurb: 'v-model:value two-panel shuttle with a selected-order readout.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'options',
        type: 'SnTransferOption[]',
        default: '() => []',
        desc: 'Transferable entries. Mirrors n-transfer `options`.',
      },
      {
        name: 'value',
        type: 'SnTransferValue[] | undefined',
        default: 'undefined',
        desc: 'Selected (right-panel) values (controlled). Mirrors n-transfer `value`.',
      },
      {
        name: 'defaultValue',
        type: 'SnTransferValue[]',
        default: '() => []',
        desc: 'Initial selected values for uncontrolled mode. Mirrors n-transfer `default-value`.',
      },
      {
        name: 'filterable',
        type: 'boolean',
        default: 'false',
        desc: 'Show the per-panel filter input. Mirrors n-transfer `filterable`.',
      },
      {
        name: 'sourceFilterPlaceholder',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Filter placeholder in the source panel. Mirrors n-transfer `source-filter-placeholder`.',
      },
      {
        name: 'targetFilterPlaceholder',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Filter placeholder in the target panel. Mirrors n-transfer `target-filter-placeholder`.',
      },
      {
        name: 'size',
        type: 'SnTransferSize',
        default: "'medium'",
        desc: 'Visual size of rows / buttons. Mirrors n-transfer `size`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable every control. Mirrors n-transfer `disabled`.',
      },
      {
        name: 'sourceTitle',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Source panel title (fixed zh default). Mirrors n-transfer `source-title`.',
      },
      {
        name: 'targetTitle',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Target panel title (fixed zh default). Mirrors n-transfer `target-title`.',
      },
      {
        name: 'renderSourceLabel',
        type: 'RenderLabelFn | undefined',
        default: 'undefined',
        desc: 'Custom label renderer for source rows. Mirrors n-transfer `render-source-label`.',
      },
      {
        name: 'renderTargetLabel',
        type: 'RenderLabelFn | undefined',
        default: 'undefined',
        desc: 'Custom label renderer for target rows. Mirrors n-transfer `render-target-label`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Transfer · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Transfer } from '@snui/vue-web';",
    chipCopy: "import { Transfer } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Transfer', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'form', link: '/en/components/web/form' },
    next: { text: 'drag-sort', link: '/en/components/web/drag-sort' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
