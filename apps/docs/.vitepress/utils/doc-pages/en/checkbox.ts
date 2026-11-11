/** Checkbox · Web (Web) — English page data. Props from checkbox SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const checkboxDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Checkbox · Web' }],
  title: 'Checkbox · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Checkbox built on a native ' },
    { t: 'code', s: 'input[type=checkbox]' },
    { t: 'text', s: ' (tri-state aria-checked), usable standalone or inside ' },
    { t: 'code', s: 'SnCheckboxGroup' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/checkbox',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Checkbox · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Checkbox } from '@snui/vue-web';
</script>

<template>
  <Checkbox />
</template>`,
  },
  demos: [
    { name: 'checkbox-web-basic', title: 'Basic', blurb: 'v-model binding + label.' },
    {
      name: 'checkbox-web-group',
      title: 'Group (CheckboxGroup)',
      blurb: 'Declarative options / slot children; array v-model.',
    },
    {
      name: 'checkbox-web-indeterminate',
      title: 'Indeterminate',
      blurb: "aria-checked='mixed' — parent select-all pattern.",
    },
    { name: 'checkbox-web-sizes', title: 'Sizes', blurb: 'mini / tiny / small / medium / large.' },
    {
      name: 'checkbox-web-disabled',
      title: 'Disabled',
      blurb: 'Disabled checked / unchecked states.',
    },
    {
      name: 'checkbox-web-readonly',
      title: 'Readonly',
      blurb: 'Looks normal, cannot toggle.',
    },
    {
      name: 'checkbox-web-values',
      title: 'Custom values (checkedValue / uncheckedValue)',
      blurb: "Non-boolean mapping: 'on' / 'off', 1 / 0.",
    },
    {
      name: 'checkbox-web-custom',
      title: 'Custom slots (`indicator` / `icon` / default)',
      blurb: 'indicator tag / card styles + custom tick via icon slot + default slot scope.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnCheckboxValue | SnCheckboxValue[]',
        default: '—',
        desc: 'Bound checked state (`v-model`). For a standalone checkbox this is `checkedValue` / `uncheckedValue`; inside a group the parent group owns the array and this prop is ignored on children.',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        default: 'false',
        desc: 'Uncontrolled initial checked state.',
      },
      {
        name: 'label',
        type: 'string',
        default: "''",
        desc: 'Label text rendered next to the box. Use the default slot for rich content.',
      },
      {
        name: 'value',
        type: 'SnCheckboxValue',
        default: '—',
        desc: 'Value this checkbox represents inside a group (`v-model:value` on the group collects these). Mirrors n-checkbox `value`.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — visible but not toggleable.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        desc: 'Half-checked state (parent-of-many pattern). Mirrors n-checkbox `indeterminate`.',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Mirrors n-checkbox `size` (adds `mini` per AUI convention).',
      },
      {
        name: 'checkedValue',
        type: 'SnCheckboxValue',
        default: 'true',
        desc: 'Value emitted when checked. Defaults to `true`. Mirrors n-checkbox `checked-value`.',
      },
      {
        name: 'uncheckedValue',
        type: 'SnCheckboxValue',
        default: 'false',
        desc: 'Value emitted when unchecked. Defaults to `false`. Mirrors n-checkbox `unchecked-value`.',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status. Drives box color + `aria-invalid`.',
      },
      {
        name: 'focusable',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the native input participates in tab order. Mirrors n-checkbox `focusable`.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible name when no `label` / slot content is present.',
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
      { t: 'code', s: 'SnCheckbox.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(SnCheckboxValue)',
        desc: '`v-model` sync; emitted with the next value in standalone usage.',
      },
      {
        name: 'update:checked',
        payload: '(boolean)',
        desc: "Checked state committed by click or Space; naive-ui's `onUpdate:checked`.",
      },
      {
        name: 'checkedChange',
        payload: '(boolean)',
        desc: "Checked state committed; naive-ui's `checked-change` payload.",
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnCheckbox.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '{ checked: boolean; disabled: boolean; indeterminate: boolean }',
        desc: 'Rich label content; wins over the `label` prop, scope carries the state.',
      },
      {
        name: 'icon',
        props: '{ checked: boolean }',
        desc: 'Custom checkmark glyph rendered inside the box instead of the CSS tick.',
      },
      {
        name: 'indicator',
        props: '{ checked: boolean; indeterminate: boolean }',
        desc: 'Replaces the whole box for card / tag styles; scope exposes the state.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Checkbox · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Checkbox } from '@snui/vue-web';",
    chipCopy: "import { Checkbox } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Checkbox', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'upload', link: '/en/components/web/upload' },
    next: { text: 'radio', link: '/en/components/web/radio' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
