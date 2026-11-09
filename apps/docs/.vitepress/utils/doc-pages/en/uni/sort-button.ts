/** SortButton · uni-app (uni-app) — English page data. Props from sn-sort-button.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const sortButtonDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'SortButton · uni-app' },
  ],
  title: 'SortButton · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Tri-state sort toggle: 1 ascending / 0 reset / -1 descending; by default it toggles between ascending and descending.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-sort-button',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'SortButton · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SortButton } from '@snui/uni';
</script>

<template>
  <sn-sort-button />
</template>`,
  },
  demos: [
    {
      name: 'sort-button-mp-basic',
      title: 'Basic usage',
      blurb:
        'Tri-state sort toggle: 1 ascending / 0 reset / -1 descending; by default it toggles between ascending and descending.',
    },
    {
      name: 'sort-button-mp-reset-line',
      title: 'Reset, descending-first & underline (`allowReset` / `descFirst` / `line`)',
      blurb:
        '`allowReset` puts 0 back into the cycle; `descFirst` starts with descending; `line` adds an underline.',
    },
    {
      name: 'sort-button-mp-custom-style',
      title: 'Root class & inline style (`customClass` / `customStyle`)',
      blurb:
        '`customClass` is appended to the root; `customStyle` is the root inline style and can override padding, fill and radius.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SortButtonValue',
        default: '0',
        desc: 'Current direction (`v-model`).',
      },
      { name: 'title', type: 'string', default: "''", desc: 'Button label.' },
      {
        name: 'allowReset',
        type: 'boolean',
        default: 'false',
        desc: 'Include the reset state in the tap cycle.',
      },
      {
        name: 'descFirst',
        type: 'boolean',
        default: 'false',
        desc: 'Cycle to descending before ascending.',
      },
      {
        name: 'line',
        type: 'boolean',
        default: 'false',
        desc: 'Render an underline under the label.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'SortButton · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { SortButton } from '@snui/uni';",
    chipCopy: "import { SortButton } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-sort-button', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-upload', link: '/en/components/uni/upload' },
    next: { text: 'sn-signature', link: '/en/components/uni/signature' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
