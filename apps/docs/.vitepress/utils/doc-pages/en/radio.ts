/** Radio · Web (Web) — English page data. Props from radio SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const radioDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Radio · Web' }],
  title: 'Radio · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Radio built on a native ' },
    { t: 'code', s: 'input[type=radio]' },
    { t: 'text', s: ' (arrow-key roaming via shared name), plus ' },
    { t: 'code', s: 'SnRadioButton' },
    { t: 'text', s: ' and ' },
    { t: 'code', s: 'SnRadioGroup' },
    { t: 'text', s: '.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/radio',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Radio · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Radio } from '@snui/vue-web';
</script>

<template>
  <Radio />
</template>`,
  },
  demos: [
    { name: 'radio-web-basic', title: 'Basic', blurb: 'v-model + checkedValue match.' },
    {
      name: 'radio-web-group',
      title: 'Group (RadioGroup)',
      blurb: 'Declarative options / slot children; shared name.',
    },
    {
      name: 'radio-web-button',
      title: 'Button style (RadioButton)',
      blurb: 'Border-merged segmented buttons.',
    },
    { name: 'radio-web-sizes', title: 'Sizes', blurb: 'mini / tiny / small / medium / large.' },
    {
      name: 'radio-web-states',
      title: 'Disabled / readonly',
      blurb: 'Group-level OR item-level disabled; readonly visual.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'checkedValue',
        type: 'SnRadioValue | null',
        default: 'null',
        desc: "The value this radio represents — when the group's (or own) `modelValue` equals it, this radio is checked. naive-ui calls this `value`.",
      },
      {
        name: 'modelValue',
        type: 'SnRadioValue | null',
        default: 'null',
        desc: "Standalone bound value. Inside a group the group's modelValue wins.",
      },
      {
        name: 'label',
        type: 'string | undefined',
        default: "''",
        desc: 'Label text rendered next to the dot. Slot `label` overrides.',
      },
      {
        name: 'name',
        type: 'string | undefined',
        default: '—',
        desc: 'Native radio group name — required for arrow-key nav. Provided by group.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables this radio. Group-level disabled ORs in.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — renders but ignores activation.',
      },
      {
        name: 'size',
        type: 'SnRadioSize',
        default: '—',
        desc: "Visual size preset. Falls back to group size then 'medium'.",
      },
      {
        name: 'status',
        type: 'SnRadioStatus',
        default: '—',
        desc: "Visual status. Falls back to group status then 'default'.",
      },
      {
        name: 'ariaLabel',
        type: 'string | undefined',
        default: '—',
        desc: 'Native ARIA label (overrides label for the accessible name).',
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
    copy: 'Radio · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Radio } from '@snui/vue-web';",
    chipCopy: "import { Radio } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Radio', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'checkbox', link: '/en/components/web/checkbox' },
    next: { text: 'switch', link: '/en/components/web/switch' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
