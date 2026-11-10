/** DatetimePicker · uni-app (uni-app) — English page data. Props from sn-datetime-picker.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const datetimePickerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'DatetimePicker · uni-app' },
  ],
  title: 'DatetimePicker · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Sheet picker: rolling only updates the draft and ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' is written on confirm.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-datetime-picker',
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
    fileLabel: 'DatetimePicker · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DatetimePicker } from '@snui/uni';
</script>

<template>
  <sn-datetime-picker />
</template>`,
  },
  demos: [
    {
      name: 'datetime-picker-mp-basic',
      title: 'Basic usage',
      blurb: 'Sheet picker: rolling only updates the draft and `v-model` is written on confirm.',
    },
    {
      name: 'datetime-picker-mp-card',
      title: "Cell card layout (`sn-cell`'s `card`)",
      blurb: 'sn-cell-group card / sn-cell card: one card per entry row, token gap between them.',
    },
    {
      name: 'datetime-picker-mp-header',
      title: 'Sheet header (cancel left / title centre / confirm right)',
      blurb:
        'With / without a title and with custom labels: confirm stays flush right, both actions are text-only.',
    },
    {
      name: 'datetime-picker-mp-lunar',
      title: 'Lunar roller (`lunar`, AUI-added)',
      blurb:
        'lunar: stem-branch year / months with leap month / days 初一…三十; v-model stays a solar timestamp; datetime + lunar keeps the clock.',
    },
    {
      name: 'datetime-picker-mp-time-confirm',
      title: 'Time type & confirm guard (`type="time"` / `beforeConfirm`)',
      blurb:
        '`type=time` writes an `HH:mm` string; a `beforeConfirm` that returns false keeps the sheet open.',
    },
    {
      name: 'datetime-picker-mp-columns-bounds',
      title:
        'Roller geometry & column values (`itemHeight` / `visibleItemCount` / h-m-s bounds / `formatter` / `filter`)',
      blurb:
        'itemHeight / visibleItemCount; minHour / maxHour / minMinute / maxMinute; useSecond + minSecond / maxSecond; formatter / filter; valueKey / labelKey.',
    },
    {
      name: 'datetime-picker-mp-sheet',
      title:
        'Sheet chrome & write-back timing (`cancelButtonText` / `immediateChange` / `zIndex` / `rootPortal` / `custom*`)',
      blurb:
        'immediateChange; cancelButtonText; closeOnClickModal; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle / customViewClass; displayFormatTabLabel.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: "Bound value — a timestamp, or `HH:mm[:ss]` for `type: 'time'`.",
      },
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Sheet visibility (`v-model:visible`).',
      },
      { name: 'type', type: 'DateTimeType', default: "'datetime'", desc: 'Column set.' },
      { name: 'title', type: 'string', default: "''", desc: 'Toolbar title.' },
      { name: 'cancelButtonText', type: 'string', default: "'取消'", desc: 'Cancel button label.' },
      {
        name: 'confirmButtonText',
        type: 'string',
        default: "'确认'",
        desc: 'Confirm button label.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the mask closes the sheet.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the sheet for the device safe area.',
      },
      { name: 'itemHeight', type: 'number', default: '44', desc: 'Row height in px design units.' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: 'Number of visible rows.' },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Option key holding the value (parity).',
      },
      {
        name: 'labelKey',
        type: 'string',
        default: "'label'",
        desc: 'Option key holding the label (parity).',
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
      { name: 'minHour', type: 'number', default: '0', desc: 'Minimum hour.' },
      { name: 'maxHour', type: 'number', default: '23', desc: 'Maximum hour.' },
      { name: 'minMinute', type: 'number', default: '0', desc: 'Minimum minute.' },
      { name: 'maxMinute', type: 'number', default: '59', desc: 'Maximum minute.' },
      { name: 'useSecond', type: 'boolean', default: 'false', desc: 'Show the seconds column.' },
      { name: 'minSecond', type: 'number', default: '0', desc: 'Minimum second.' },
      { name: 'maxSecond', type: 'number', default: '59', desc: 'Maximum second.' },
      { name: 'zIndex', type: 'number', default: '15', desc: 'Stacking level.' },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Write `v-model` on every roll instead of only on confirm.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the sheet.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow. Forwarded to `sn-popup`, which declares the same parity-only prop.",
      },
      {
        name: 'customViewClass',
        type: 'string',
        default: "''",
        desc: 'Class forwarded to the roller body.',
      },
      {
        name: 'lunar',
        type: 'boolean',
        default: 'false',
        desc: "农历滚筒（additive，AGENTS.md §112.3a）：转发给 `sn-datetime-picker-view`。 年列干支（甲辰年）、月列正月…腊月（含闰X月）、日列初一…三十； `v-model` 仍为公历时间戳。`type: 'time'` 下无效果。",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'DatetimePicker · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DatetimePicker } from '@snui/uni';",
    chipCopy: "import { DatetimePicker } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-datetime-picker', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-date-strip', link: '/en/components/uni/date-strip' },
    next: { text: 'sn-datetime-picker-view', link: '/en/components/uni/datetime-picker-view' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
