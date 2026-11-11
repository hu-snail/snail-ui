/** Radio · Web (Web) — English page data. Props from radio SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const radioDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Radio · Web' }],
  title: 'Radio · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
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
      name: 'radio-web-disabled',
      title: 'Disabled',
      blurb: 'disabled: checked and unchecked greyed states.',
    },
    {
      name: 'radio-web-readonly',
      title: 'Readonly',
      blurb: 'readonly: visible but not editable.',
    },
    {
      name: 'radio-web-card',
      title: 'Card variant',
      blurb:
        'Whole card is selectable; #card slot for custom content; selected = themed border + soft fill + top-right tick.',
    },
    {
      name: 'radio-web-icon',
      title: 'Icon variant',
      blurb: 'Square icon tiles with the #icon slot glyph; no label row.',
    },
    {
      name: 'radio-web-indicator',
      title: 'Indicator placement & checked paint',
      blurb: 'indicatorPlacement top-right / bottom-right / none; checkedStyle border / fill.',
    },
    {
      name: 'radio-web-inverted',
      title: 'Inverted marker & label-first',
      blurb:
        'markerShape="inverted" fills the plate with the theme colour and punches a white dot; labelPlacement="label-first" puts the label first.',
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
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnRadio.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: SnRadioValue | null)',
        desc: "`v-model` sync; emits this radio's `checkedValue` on activation.",
      },
      {
        name: 'change',
        payload: '(value: SnRadioValue, event: Event)',
        desc: 'Fired on user activation (native `change`).',
      },
      {
        name: 'checked',
        payload: '(value: SnRadioValue)',
        desc: 'Fires when the checked state flips to true via user interaction.',
      },
      {
        name: 'update',
        payload: '(value: SnRadioValue | null, event: Event)',
        desc: 'Native `update` event; fires on every state change.',
      },
      { name: 'focus', payload: 'FocusEvent', desc: 'Native focus.' },
      { name: 'blur', payload: 'FocusEvent', desc: 'Native blur.' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnRadio.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Fallback label content; renders when the `label` slot is absent.',
      },
      {
        name: 'label',
        props: '{ checked: boolean; disabled: boolean }',
        desc: 'Custom label content with `{ checked, disabled }` scope; replaces `label` text.',
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
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
