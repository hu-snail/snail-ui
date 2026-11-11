/** DatePicker · Web (Web) — English page data. Props from date-picker SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const datePickerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'DatePicker · Web' },
  ],
  title: 'DatePicker · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Date picker with date / datetime / week / quarter / month / year and their range modes; no third-party date library. Single ',
    },
    { t: 'code', s: 'datetime' },
    { t: 'text', s: ' uses a side-by-side "calendar | time columns" layout; ' },
    { t: 'code', s: 'datetimerange' },
    { t: 'text', s: ' uses four header fields + dual calendars + a time popov' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/date-picker',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'DatePicker · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DatePicker } from '@snui/vue-web';
</script>

<template>
  <DatePicker />
</template>`,
  },
  demos: [
    {
      name: 'date-picker-web-basic',
      title: 'Basic (date)',
      blurb: 'Month grid; v-model in ms timestamps.',
    },
    {
      name: 'date-picker-web-datetime',
      title: 'Date & time (datetime, side-by-side)',
      blurb: 'Calendar | H/M/S columns layout + confirm.',
    },
    {
      name: 'date-picker-web-week-quarter',
      title: 'Week / quarter',
      blurb:
        "type='week' / 'quarter' / 'weekrange': week-row picks (value = Monday), quarter grid (value = quarter start).",
    },
    {
      name: 'date-picker-web-month-year',
      title: 'Month / year',
      blurb: "type='month' / 'year' grids with drill-down.",
    },
    {
      name: 'date-picker-web-range',
      title: 'Range (daterange / datetimerange)',
      blurb:
        'Dual calendars; start then end; auto-swap when reversed; datetimerange uses a four-field header with an H/M/S popover and a Clear / Confirm footer.',
    },
    {
      name: 'date-picker-web-input-position',
      title: 'Input bar position',
      blurb: "input-position='bottom' moves the input bar under the calendars.",
    },
    {
      name: 'date-picker-web-month-range',
      title: 'Month range (monthrange)',
      blurb:
        'Dual scrollable year | month panes with range highlight, auto-swap and a Clear / Confirm footer; values are the first-day timestamps of both months.',
    },
    {
      name: 'date-picker-web-shortcuts',
      title: 'Shortcuts',
      blurb: 'Shortcut entries + shortcuts-position (left / right / bottom).',
    },
    {
      name: 'date-picker-web-dynamic-range',
      title: 'Dynamic range limiting',
      blurb: 'onSelect + disabledDate limit the selectable range (±7 days after the first pick).',
    },
    {
      name: 'date-picker-web-format',
      title: 'format',
      blurb: 'Lowercase tokens: yyyy / MM / dd / HH / mm / ss / ww (ISO week) / qq (quarter).',
    },
    {
      name: 'date-picker-web-clearable',
      title: 'Clearable',
      blurb: 'A clear button empties the value.',
    },
    {
      name: 'date-picker-web-disabled',
      title: 'Disabled',
      blurb: 'Interaction disabled.',
    },
    {
      name: 'date-picker-web-readonly',
      title: 'Readonly',
      blurb: 'Visible but not editable.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | [number, number] | null',
        default: 'null',
        desc: 'Bound value: timestamp (single) | [start, end] (range) | null.',
      },
      { name: 'type', type: 'SnDatePickerType', default: "'date'", desc: 'Panel / value mode.' },
      {
        name: 'format',
        type: 'string',
        default: "''",
        desc: 'Display format — lowercase tokens (yyyy MM dd HH mm ss).',
      },
      {
        name: 'placeholder',
        type: 'string | [string, string]',
        default: '—',
        desc: 'Placeholder; `[start, end]` pair in range modes.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Show the clear (×) button when a value is present.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — opens nothing, commits nothing.',
      },
      { name: 'size', type: 'SnDatePickerSize', default: "'medium'", desc: 'Visual size preset.' },
      {
        name: 'status',
        type: 'SnDatePickerStatus',
        default: "'default'",
        desc: 'Validation-driven visual status.',
      },
      {
        name: 'disabledDate',
        type: '(ts: number) => boolean',
        default: '—',
        desc: "Predicate on each cell's local-midnight timestamp; true disables the cell.",
      },
      {
        name: 'shortcuts',
        type: 'SnDatePickerShortcut[]',
        default: '—',
        desc: 'Quick-pick entries rendered inside the panel. `value` may be a lazy getter — it is resolved at click time.',
      },
      {
        name: 'shortcutsPosition',
        type: 'SnDatePickerShortcutsPosition',
        default: "'bottom'",
        desc: 'Where the shortcuts bar renders.',
      },
      {
        name: 'inputPosition',
        type: 'SnDatePickerInputPosition',
        default: "'top'",
        desc: 'Where the four-field input bar renders in `datetimerange` panels. `bottom` places it under the calendars (the time popover opens upward).',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: "Accessible name for the trigger (fallback: 'Date picker').",
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
      { t: 'code', s: 'SnDatePicker.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(number | [number, number] | null)',
        desc: '`v-model` sync; fired on any commit.',
      },
      {
        name: 'change',
        payload: '(number | [number, number] | null)',
        desc: 'Value committed; also fires when the value is cleared.',
      },
      {
        name: 'select',
        payload: '(number | [number, number] | null)',
        desc: 'Fired when a panel cell is picked: the draft, or range start then end.',
      },
      { name: 'clear', payload: '—', desc: 'Fired when the value is cleared via the × button.' },
      { name: 'focus', payload: '(FocusEvent)', desc: 'Fired when the trigger gains focus.' },
      { name: 'blur', payload: '(FocusEvent)', desc: 'Fired when the trigger loses focus.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'DatePicker · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DatePicker } from '@snui/vue-web';",
    chipCopy: "import { DatePicker } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'DatePicker', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'time-picker', link: '/en/components/web/time-picker' },
    next: { text: 'color-picker', link: '/en/components/web/color-picker' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
