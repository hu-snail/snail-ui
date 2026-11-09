/** DateStrip · uni-app (uni-app) — English page data. Props from sn-date-strip.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dateStripDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'DateStrip · uni-app' },
  ],
  title: 'DateStrip · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Single selection; tapping a column writes ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: '. The initial page follows the bound value.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-date-strip',
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
    fileLabel: 'DateStrip · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DateStrip } from '@snui/uni';
</script>

<template>
  <sn-date-strip />
</template>`,
  },
  demos: [
    {
      name: 'date-strip-mp-basic',
      title: 'Basic usage',
      blurb: 'sn-date-strip basics: single selection, tap a whole column to write v-model.',
    },
    {
      name: 'date-strip-mp-nav',
      title: 'Navigation buttons',
      blurb: 'show-nav side buttons + #prev / #next slots + pagechange + show-lunar.',
    },
    {
      name: 'date-strip-mp-lunar',
      title: 'Lunar captions',
      blurb: 'show-lunar: lunar caption under the day number, month name on 初一.',
    },
    {
      name: 'date-strip-mp-formatter',
      title: 'Custom day text',
      blurb: 'formatter injects price captions (bottomInfo) under the day numbers.',
    },
    {
      name: 'date-strip-mp-range',
      title: 'Custom date range',
      blurb: 'type=range: first tap sets the start, second tap completes; out-of-order taps swap.',
    },
    {
      name: 'date-strip-mp-custom-style',
      title: 'Custom style',
      blurb: 'custom-class / custom-style restyle the strip.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | number[] | null',
        default: 'null',
        desc: '选中值：时间戳；`range` 模式为 `[start, end]`（进行中允许 `[start]`）。',
      },
      { name: 'type', type: "'single' | 'range'", default: "'single'", desc: '选择模式。' },
      { name: 'count', type: 'number', default: '7', desc: '每页天数。' },
      {
        name: 'startDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '首页起点（本地零点），默认今天。',
      },
      {
        name: 'minDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '早于该日（时间戳）的格子禁用，并夹住可翻页左边界。',
      },
      {
        name: 'maxDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '晚于该日（时间戳）的格子禁用，并夹住可翻页右边界。',
      },
      { name: 'showWeek', type: 'boolean', default: 'true', desc: '显示每列顶部的星期字。' },
      {
        name: 'showLunar',
        type: 'boolean',
        default: 'false',
        desc: '农历角标（additive）：日号下方显示农历日名，初一显示月名；`formatter` 可覆盖。',
      },
      {
        name: 'showNav',
        type: 'boolean',
        default: 'false',
        desc: '显示两侧翻页按钮（内容可用 `#prev` / `#next` 插槽自定义）。',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '整条禁用。' },
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
    copy: 'DateStrip · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DateStrip } from '@snui/uni';",
    chipCopy: "import { DateStrip } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-date-strip', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-calendar-view', link: '/en/components/uni/calendar-view' },
    next: { text: 'sn-datetime-picker', link: '/en/components/uni/datetime-picker' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
