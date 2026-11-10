/** DynamicTags · Web (Web) — English page data. Props from dynamic-tags SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dynamicTagsDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'DynamicTags · Web' },
  ],
  title: 'DynamicTags · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Dynamic tags. Tag list + inline add input; Enter commits / Esc cancels / blur submits.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/dynamic-tags',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'DynamicTags · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DynamicTags } from '@snui/vue-web';
</script>

<template>
  <DynamicTags />
</template>`,
  },
  demos: [
    {
      name: 'dynamic-tags-web-basic',
      title: 'Basic',
      blurb: 'Add / remove tags with array v-model.',
    },
    {
      name: 'dynamic-tags-web-flow',
      title: 'Add flow (keyboard)',
      blurb: 'Enter commits and keeps typing; Esc cancels; blur submits.',
    },
    {
      name: 'dynamic-tags-web-bounds',
      title: 'max / closable',
      blurb: 'max hides the add button; closable=false hides removal.',
    },
    {
      name: 'dynamic-tags-web-slots',
      title: 'Custom rendering (slots)',
      blurb: 'tag / trigger / empty customization.',
    },
    {
      name: 'dynamic-tags-web-states',
      title: 'Disabled / readonly',
      blurb: 'disabled blocks interaction; readonly hides the add button.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnDynamicTagValue[]',
        default: '() => []',
        desc: 'Bound tag array (`v-model`). Emits the complete array on change.',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'true',
        desc: 'Show the × close button on each tag. Mirrors n-dynamic-tags `closable`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction — no trigger, no close buttons.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — tags visible, no adding / removing.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Mirrors n-dynamic-tags `size`.',
      },
      {
        name: 'max',
        type: 'number',
        default: '—',
        desc: 'Max tag count — the add trigger hides once reached.',
      },
      {
        name: 'trigger',
        type: "'click' | 'focus'",
        default: "'click'",
        desc: 'How the inline input opens. `click` — only the trigger button opens it; `focus` — clicking anywhere on the component opens it. Mirrors n-dynamic-tags `trigger` (naive default: click).',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        desc: 'Placeholder for the inline input (simplified `inputProps`).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'DynamicTags · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DynamicTags } from '@snui/vue-web';",
    chipCopy: "import { DynamicTags } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'DynamicTags', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'dynamic-input', link: '/en/components/web/dynamic-input' },
    next: { text: 'cascader', link: '/en/components/web/cascader' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
