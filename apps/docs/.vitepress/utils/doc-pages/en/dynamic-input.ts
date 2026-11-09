/** DynamicInput · Web (Web) — English page data. Props from dynamic-input SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dynamicInputDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'DynamicInput · Web' },
  ],
  title: 'DynamicInput · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Dynamic input rows. Array v-model with per-row editing and + / − controls; slots for object rows.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/dynamic-input',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'DynamicInput · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DynamicInput } from '@snui/vue-web';
</script>

<template>
  <DynamicInput />
</template>`,
  },
  demos: [
    {
      name: 'dynamic-input-web-basic',
      title: 'Basic',
      blurb: 'String array; per-row input + add/remove.',
    },
    {
      name: 'dynamic-input-web-preset',
      title: 'Custom creation (preset / onCreate)',
      blurb: 'preset factory creates new rows; onCreate refines.',
    },
    {
      name: 'dynamic-input-web-slot',
      title: 'Object rows (slot)',
      blurb: 'default slot scoped { value, index }.',
    },
    {
      name: 'dynamic-input-web-bounds',
      title: 'min / max bounds',
      blurb: 'Buttons hidden at bounds.',
    },
    {
      name: 'dynamic-input-web-states',
      title: 'Disabled / readonly',
      blurb: 'disabled blocks interaction; readonly freezes rows.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'DynamicInputValue[]',
        default: '() => []',
        desc: 'Bound array of row values. Each row edits exactly one entry in place.',
      },
      {
        name: 'preset',
        type: 'DynamicInputPreset',
        default: '() => null',
        desc: "Factory creating the value of a newly inserted row. Defaults to naive-ui semantics (`null`); pass e.g. `() => ''` for text rows.",
      },
      {
        name: 'min',
        type: 'number',
        default: '0',
        desc: 'Lower bound on the row count. The − button hides at the bound.',
      },
      {
        name: 'max',
        type: 'number',
        default: '—',
        desc: 'Upper bound on the row count. The + button hides at the bound.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables every row input and the row action buttons.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only rows — values are visible but not editable and the structural − / + actions are not rendered (row set is frozen).',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Drives the built-in input height + font-size.',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status, cascaded to every built-in row input.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'DynamicInput · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DynamicInput } from '@snui/vue-web';",
    chipCopy: "import { DynamicInput } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'DynamicInput', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'select', link: '/en/components/web/select' },
    next: { text: 'dynamic-tags', link: '/en/components/web/dynamic-tags' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
