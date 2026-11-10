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
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnSelectValue | SnSelectValue[] | null',
        default: 'null',
        desc: 'Bound value: a single value or `null`; an array when `multiple`.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: 'Allow selecting several values (tag-style display).',
      },
      {
        name: 'options',
        type: 'SnSelectOptionInput[]',
        default: '—',
        desc: 'Option list: object options or bare values.',
      },
      {
        name: 'labelField',
        type: 'string',
        default: "'label'",
        desc: 'Field remapping for object option labels (naive `label-field`).',
      },
      {
        name: 'valueField',
        type: 'string',
        default: "'value'",
        desc: 'Field remapping for object option values (naive `value-field`).',
      },
      {
        name: 'childrenField',
        type: 'string',
        default: "'children'",
        desc: 'Field remapping for group children (naive `children-field`).',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Please select'",
        desc: 'Placeholder text shown when empty.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Show the clear (×) button when a value is present.',
      },
      {
        name: 'filterable',
        type: 'boolean',
        default: 'false',
        desc: 'Enable the internal filter input.',
      },
      {
        name: 'filter',
        type: 'SnSelectFilter',
        default: '—',
        desc: 'Custom filter predicate; replaces the default label match.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Row-level disabled (ORs with select-level disabled).',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — opens nothing and commits nothing.',
      },
      { name: 'size', type: 'SnSelectSize', default: "'medium'", desc: 'Visual size preset.' },
      {
        name: 'status',
        type: 'SnSelectStatus',
        default: "'default'",
        desc: 'Validation-driven visual status.',
      },
      {
        name: 'maxTagCount',
        type: 'number',
        default: '—',
        desc: 'Collapse tags into `+N` beyond this count.',
      },
      { name: 'tag', type: 'boolean', default: 'false', desc: 'Tag visual style (naive `tag`).' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Show the loading spinner in place of the arrow.',
      },
      {
        name: 'remote',
        type: 'boolean',
        default: 'false',
        desc: 'Remote search mode: typing emits `search`; the host drives options.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible name for the trigger (falls back to `label`).',
      },
      { name: 'label', type: 'string', default: '—', desc: 'Row label text.' },
      {
        name: 'emptyText',
        type: 'string',
        default: '—',
        desc: 'Empty-state text (overridden by the `empty` slot).',
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
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnSelect.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: SnSelectValue | SnSelectValue[] | null)',
        desc: '`v-model` sync.',
      },
      {
        name: 'update:value',
        payload: '(value: SnSelectValue | SnSelectValue[] | null)',
        desc: "naive-ui's `onUpdate:value` spelling.",
      },
      {
        name: 'change',
        payload: '(value: SnSelectValue | SnSelectValue[] | null)',
        desc: 'Fired when a selection is committed (also for tag removal and clear).',
      },
      {
        name: 'search',
        payload: '(query: string)',
        desc: 'Fired when the filter query changes (`filterable`; remote keystrokes too).',
      },
      { name: 'clear', payload: '—', desc: 'Fired when the clear button is activated.' },
      { name: 'focus', payload: 'FocusEvent', desc: 'Fired when the trigger gains focus.' },
      { name: 'blur', payload: 'FocusEvent', desc: 'Fired when the trigger loses focus.' },
      { name: 'scroll', payload: 'Event', desc: 'Fired when the menu body scrolls to the bottom.' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnSelect.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'header', props: '—', desc: 'Dropdown top area.' },
      { name: 'empty', props: '—', desc: 'Empty state.' },
      { name: 'action', props: '—', desc: 'Dropdown bottom area.' },
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
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
