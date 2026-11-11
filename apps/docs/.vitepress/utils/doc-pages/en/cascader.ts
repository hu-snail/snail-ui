/** Cascader · Web (Web) — English page data. Props from cascader SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const cascaderDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Cascader · Web' }],
  title: 'Cascader · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Cascading selector. Teleport multi-column panel, path v-model, filterable, hover expand. Columns have a fixed width (they do not adapt to content); long labels ellipsize.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/cascader',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Cascader · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Cascader } from '@snui/vue-web';
</script>

<template>
  <Cascader />
</template>`,
  },
  demos: [
    {
      name: 'cascader-web-basic',
      title: 'Basic',
      blurb: 'Column-by-column selection with path v-model.',
    },
    {
      name: 'cascader-web-multiple',
      title: 'Multiple (tree check)',
      blurb: 'multiple: parent cascade, tag echo and per-tag removal.',
    },
    {
      name: 'cascader-web-strictly',
      title: 'Strict selection (check-strictly)',
      blurb: 'check-strictly: single commits parents and expands; multiple checks are independent.',
    },
    {
      name: 'cascader-web-filterable',
      title: 'Filterable',
      blurb: 'Full-path text match, flattened hits.',
    },
    {
      name: 'cascader-web-fields',
      title: 'Custom fields',
      blurb: 'labelField / valueField / childrenField.',
    },
    { name: 'cascader-web-trigger', title: 'Expand trigger', blurb: 'click (default) / hover.' },
    {
      name: 'cascader-web-clearable',
      title: 'Clearable',
      blurb: 'A clear button empties the selection.',
    },
    {
      name: 'cascader-web-disabled',
      title: 'Disabled',
      blurb: 'Component-level disable + disabled option nodes.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'Array<SnCascaderValue> | Array<Array<SnCascaderValue>> | null',
        default: '—',
        desc: 'Bound value. Single mode: one full leaf path (root-first). Multiple mode: an array of leaf paths. Clear commits an empty value either way.',
      },
      {
        name: 'options',
        type: 'SnCascaderOptionInput[]',
        default: '—',
        desc: 'Tree option list ({ label, value, disabled?, children? }).',
      },
      {
        name: 'labelField',
        type: 'string',
        default: '—',
        desc: 'Label key remapping for object options.',
      },
      {
        name: 'valueField',
        type: 'string',
        default: '—',
        desc: 'Value key remapping for object options.',
      },
      {
        name: 'childrenField',
        type: 'string',
        default: '—',
        desc: 'Children key remapping for object options.',
      },
      { name: 'placeholder', type: 'string', default: '—', desc: 'Placeholder text when empty.' },
      {
        name: 'clearable',
        type: 'boolean',
        default: '—',
        desc: 'Show the clear (×) button when a value is present.',
      },
      {
        name: 'filterable',
        type: 'boolean',
        default: '—',
        desc: 'Enable the internal filter input (matches on the full path text).',
      },
      { name: 'disabled', type: 'boolean', default: '—', desc: 'Disables interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: '—',
        desc: 'Read-only — opens nothing, commits nothing.',
      },
      { name: 'size', type: 'SnCascaderSize', default: '—', desc: 'Visual size preset.' },
      {
        name: 'status',
        type: 'SnCascaderStatus',
        default: '—',
        desc: 'Validation-driven visual status.',
      },
      {
        name: 'expandTrigger',
        type: 'SnCascaderExpandTrigger',
        default: '—',
        desc: 'How parent nodes expand the next column.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: '—',
        desc: 'Multiple selection (tree check) mode — every row renders a checkbox; checking a parent cascades to all of its selectable descendant leaves and `modelValue` holds one path per committed leaf.',
      },
      {
        name: 'maxTagCount',
        type: 'number | undefined',
        default: '—',
        desc: 'Max visible tags before the rest collapse into `+N` (multiple only).',
      },
      {
        name: 'checkStrictly',
        type: 'boolean',
        default: '—',
        desc: "Strict selection (check-strictly): ANY node — parent or leaf — can be committed. Single mode commits the clicked node's own path (parents still expand for drilling); multiple mode decouples parent/child — checkboxes check themselves only, no cascade, no indeterminate state.",
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Accessible name for the trigger.' },
      {
        name: 'emptyText',
        type: 'string',
        default: '—',
        desc: 'Empty-state text (overridden by the `empty` slot).',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnCascader.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: SnCascaderPath | SnCascaderPath[])',
        desc: '`v-model` sync — one leaf path (single) or an array of leaf paths (multiple).',
      },
      {
        name: 'change',
        payload: '(value: SnCascaderPath | SnCascaderPath[])',
        desc: 'Selection committed (also fires for clear).',
      },
      { name: 'clear', payload: '—', desc: 'Clear button activated.' },
      { name: 'focus', payload: 'FocusEvent', desc: 'Trigger gained focus.' },
      { name: 'blur', payload: 'FocusEvent', desc: 'Trigger lost focus.' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnCascader.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'empty', props: '—', desc: 'Empty state (no options / no filter match).' }],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Cascader · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Cascader } from '@snui/vue-web';",
    chipCopy: "import { Cascader } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Cascader', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'dynamic-tags', link: '/en/components/web/dynamic-tags' },
    next: { text: 'tree-select', link: '/en/components/web/tree-select' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
