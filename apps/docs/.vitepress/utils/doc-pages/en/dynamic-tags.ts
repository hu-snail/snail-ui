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
    { label: 'Web', tone: 'accent', icon: 'dual' },
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
      name: 'dynamic-tags-web-max',
      title: 'Max tags',
      blurb: 'max hides the add button at the cap.',
    },
    {
      name: 'dynamic-tags-web-closable',
      title: 'Closable',
      blurb: 'closable=false hides removal.',
    },
    {
      name: 'dynamic-tags-web-slots',
      title: 'Custom rendering (slots)',
      blurb: 'tag / trigger / empty customization.',
    },
    {
      name: 'dynamic-tags-web-disabled',
      title: 'Disabled',
      blurb: 'Whole group inert.',
    },
    {
      name: 'dynamic-tags-web-readonly',
      title: 'Readonly',
      blurb: 'The add button is hidden.',
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
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnDynamicTags.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: SnDynamicTagValue[])',
        desc: '`v-model` sync — always the complete next array.',
      },
      {
        name: 'change',
        payload: '(value: SnDynamicTagValue[])',
        desc: 'Fired when the tag array changes (add / remove); naive-ui `on-change` payload.',
      },
      {
        name: 'add',
        payload: '(value: SnDynamicTagValue)',
        desc: 'Fired when a tag is added; naive-ui `on-add` payload.',
      },
      {
        name: 'remove',
        payload: '(value: SnDynamicTagValue)',
        desc: 'Fired when a tag is removed; naive-ui `on-remove` payload.',
      },
      {
        name: 'click',
        payload: '(value: SnDynamicTagValue, event: MouseEvent)',
        desc: 'Fired when a tag is clicked, with the tag value and the native mouse event.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnDynamicTags.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'input',
        props:
          '{ value: string; placeholder: string; confirm: () => void; cancel: () => void; setValue: (v: string) => void }',
        desc: 'Inline input; scope: `value`, `placeholder`, `confirm`, `cancel`, `setValue`.',
      },
      {
        name: 'tag',
        props: '{ label: SnDynamicTagValue; index: number }',
        desc: 'Custom tag rendering, scoped `{ label, index }`.',
      },
      {
        name: 'trigger',
        props: '—',
        desc: 'Custom add-trigger content, replacing the default + icon.',
      },
      { name: 'empty', props: '—', desc: 'Empty state shown when there are no tags.' },
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
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
