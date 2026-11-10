/** Switch · Web (Web) — English page data. Props from switch SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const switchDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Switch · Web' }],
  title: 'Switch · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'See the component ' },
    { t: 'code', s: 'ai-description.md' },
    { t: 'text', s: ' for the full contract.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/switch',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Switch · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Switch } from '@snui/vue-web';
</script>

<template>
  <Switch />
</template>`,
  },
  demos: [
    { name: 'switch-web-basic', title: 'Basic', blurb: 'v-model binding.' },
    {
      name: 'switch-web-values',
      title: 'Value mapping (checkedValue / uncheckedValue)',
      blurb: "Non-boolean values: 'on' / 'off', 1 / 0.",
    },
    { name: 'switch-web-sizes', title: 'Sizes', blurb: 'small / medium / large.' },
    {
      name: 'switch-web-states',
      title: 'Disabled / readonly / loading',
      blurb: 'disabled / readonly / loading spinner.',
    },
    {
      name: 'switch-web-slots',
      title: 'Rail slots (checked / unchecked)',
      blurb: 'Inline rail text per state.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean | string | number',
        default: 'false',
        desc: 'Bound value compared against `checkedValue` / `uncheckedValue`.',
      },
      {
        name: 'checkedValue',
        type: 'boolean | string | number',
        default: 'true',
        desc: 'Value emitted when the switch is on. Compared by strict equality.',
      },
      {
        name: 'uncheckedValue',
        type: 'boolean | string | number',
        default: 'false',
        desc: 'Value emitted when the switch is off.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Drives rail width / height / knob size.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction + dims the rail.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — renders normally but does not toggle.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Shows a spinner in the knob and blocks interaction while pending.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible name for the switch element.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Switch · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Switch } from '@snui/vue-web';",
    chipCopy: "import { Switch } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Switch', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'radio', link: '/en/components/web/radio' },
    next: { text: 'slider', link: '/en/components/web/slider' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
