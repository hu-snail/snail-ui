/** DatetimePickerView · uni-app (uni-app) — English page data. Props from sn-datetime-picker-view.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const datetimePickerViewDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'DatetimePickerView · uni-app' },
  ],
  title: 'DatetimePickerView · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Roller body: ' },
    { t: 'code', s: 'type' },
    { t: 'text', s: ' sets the column set and minDate / maxDate bound the range.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-datetime-picker-view',
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
    fileLabel: 'DatetimePickerView · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DatetimePickerView } from '@snui/uni';
</script>

<template>
  <sn-datetime-picker-view />
</template>`,
  },
  demos: [
    {
      name: 'datetime-picker-view-mp-basic',
      title: 'Basic usage',
      blurb: 'Roller body: `type` sets the column set and minDate / maxDate bound the range.',
    },
    {
      name: 'datetime-picker-view-mp-time-format',
      title: 'Time type & formatting (`type="time"` / `formatter` / `filter`)',
      blurb:
        '`type=time` renders hour / minute only and writes an `HH:mm` string; `formatter` rewrites labels and `filter` trims the values.',
    },
    {
      name: 'datetime-picker-view-mp-columns',
      title:
        'Roller geometry & column rewriting (`itemHeight` / `visibleItemCount` / `valueKey` / `labelKey` / `columnFormatter`)',
      blurb:
        'itemHeight / visibleItemCount; valueKey / labelKey; columnFormatter reverses the year column.',
    },
    {
      name: 'datetime-picker-view-mp-time-bounds',
      title:
        'Time column bounds & seconds (`minMinute` / `maxMinute` / `useSecond` / `minSecond` / `maxSecond`)',
      blurb: 'minMinute / maxMinute; useSecond + minSecond / maxSecond.',
    },
    {
      name: 'datetime-picker-view-mp-range-boundary',
      title:
        'Range linkage & write-back timing (`boundaryMinDate` / `boundaryMaxDate` / `immediateChange` / `custom*`)',
      blurb:
        'boundaryMinDate / boundaryMaxDate (declared but not rendered); immediateChange; customClass / customStyle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: "Selected value — a timestamp, or `HH:mm[:ss]` for `type: 'time'`.",
      },
      { name: 'type', type: 'DateTimeType', default: "'datetime'", desc: 'Column set.' },
      { name: 'itemHeight', type: 'number', default: '44', desc: 'Row height in px design units.' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: 'Number of visible rows.' },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Option key holding the value (parity; columns are generated).',
      },
      {
        name: 'labelKey',
        type: 'string',
        default: "'label'",
        desc: 'Option key holding the label (parity; columns are generated).',
      },
      {
        name: 'minDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Minimum date (timestamp).',
      },
      {
        name: 'maxDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Maximum date (timestamp).',
      },
      { name: 'minHour', type: 'number', default: '0', desc: 'Minimum hour (`time` type).' },
      { name: 'maxHour', type: 'number', default: '23', desc: 'Maximum hour (`time` type).' },
      { name: 'minMinute', type: 'number', default: '0', desc: 'Minimum minute (`time` type).' },
      { name: 'maxMinute', type: 'number', default: '59', desc: 'Maximum minute (`time` type).' },
      { name: 'useSecond', type: 'boolean', default: 'false', desc: 'Show the seconds column.' },
      { name: 'minSecond', type: 'number', default: '0', desc: 'Minimum second.' },
      { name: 'maxSecond', type: 'number', default: '59', desc: 'Maximum second.' },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Emit `change` on release instead of only on settle.',
      },
      {
        name: 'boundaryMinDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Range-mode lower bound (linkage helper).',
      },
      {
        name: 'boundaryMaxDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Range-mode upper bound (linkage helper).',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
      {
        name: 'lunar',
        type: 'boolean',
        default: 'false',
        desc: '农历滚筒（additive，AGENTS.md §112.3a）：年列显示干支（甲辰年）、月列 显示正月至腊月（含闰X月）、日列显示初一到三十。`v-model` 仍是公历 时间戳。仅对 date / year-month / year / datetime 生效，`time` 忽略； `minDate` / `maxDate` 在农历模式下只约束年列。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'DatetimePickerView · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DatetimePickerView } from '@snui/uni';",
    chipCopy: "import { DatetimePickerView } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-datetime-picker-view', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-datetime-picker', link: '/en/components/uni/datetime-picker' },
    next: { text: 'sn-upload', link: '/en/components/uni/upload' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
