/**
 * Calendar 日历（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-calendar.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const calendarDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Calendar 日历' }],
  title: 'Calendar 日历',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '弹层日历：滚动只改草稿，确认才写 ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: '；取消会丢弃草稿。入口行用 ' },
    { t: 'code', s: 'sn-cell' },
    { t: 'text', s: ' 的 card 形态，右侧显示已确认值。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-calendar',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Calendar 日历.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Calendar } from '@snui/uni';
</script>

<template>
  <sn-calendar />
</template>`,
  },
  demos: [
    {
      name: 'calendar-mp-basic',
      title: '代码演示',
      blurb: '弹层日历：滚动只改草稿，确认才写 v-model；取消会丢弃草稿。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'CalendarValue', default: 'null', desc: 'Selected value.' },
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Sheet visibility (`v-model:visible`).',
      },
      { name: 'type', type: 'CalendarType', default: "'date'", desc: 'Selection mode.' },
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
      { name: 'firstDayOfWeek', type: 'number', default: '0', desc: 'First weekday of the grid.' },
      {
        name: 'formatter',
        type: 'CalendarFormatter | undefined',
        default: 'undefined',
        desc: 'Cell formatter hook.',
      },
      {
        name: 'maxRange',
        type: 'number',
        default: '0',
        desc: 'Maximum span for range types (days). `0` = unconstrained.',
      },
      {
        name: 'rangePrompt',
        type: 'string',
        default: "''",
        desc: 'Message shown when `maxRange` is exceeded.',
      },
      {
        name: 'allowSameDay',
        type: 'boolean',
        default: 'false',
        desc: 'Allow a zero-length range.',
      },
      {
        name: 'defaultTime',
        type: 'string | string[]',
        default: "'00:00:00'",
        desc: 'Default clock time applied to date / datetime values.',
      },
      { name: 'title', type: 'string', default: "'选择日期'", desc: 'Toolbar title.' },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the mask closes the sheet.',
      },
      { name: 'zIndex', type: 'number', default: '15', desc: 'Stacking level.' },
      { name: 'showConfirm', type: 'boolean', default: 'true', desc: 'Render the confirm button.' },
      { name: 'confirmText', type: 'string', default: "'确定'", desc: 'Confirm button label.' },
      {
        name: 'shortcuts',
        type: 'CalendarShortcut[]',
        default: '() => []',
        desc: 'Preset chips shown above the grid.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the sheet for the device safe area.',
      },
      {
        name: 'customViewClass',
        type: 'string',
        default: "''",
        desc: 'Class forwarded to the panel body.',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Emit `change` as soon as a cell is tapped.',
      },
      {
        name: 'panelHeight',
        type: 'number',
        default: '316',
        desc: 'Scrollable panel height in px design units.',
      },
      {
        name: 'showPanelTitle',
        type: 'boolean',
        default: 'true',
        desc: 'Render the per-month panel title.',
      },
      {
        name: 'switchMode',
        type: "'none' | 'month' | 'year-month'",
        default: "'none'",
        desc: 'Month-switch mode.',
      },
      { name: 'duration', type: 'number', default: '200', desc: 'Sheet animation duration in ms.' },
      {
        name: 'timeFilter',
        type: 'CalendarTimeFilter | undefined',
        default: 'undefined',
        desc: 'Time-option filter hook (datetime / datetimerange).',
      },
      {
        name: 'hideSecond',
        type: 'boolean',
        default: 'false',
        desc: 'Hide the seconds roller (datetime / datetimerange).',
      },
      { name: 'ellipsis', type: 'boolean', default: 'false', desc: 'Ellipsis the range text.' },
      {
        name: 'showTypeSwitch',
        type: 'boolean',
        default: 'true',
        desc: 'Show the day / week / month switch.',
      },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: 'Teleport the sheet out of the page flow (no portal host on MP).',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the sheet.' },
      {
        name: 'showLunar',
        type: 'boolean',
        default: 'false',
        desc: '农历角标（additive，AGENTS.md §112.3a）：转发给 `sn-calendar-view`， 格子下方显示农历日名，初一显示月名。`formatter` 可覆盖。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Calendar 日历 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Calendar } from '@snui/uni';",
    chipCopy: "import { Calendar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-calendar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-cascader', link: '/components/uni/cascader' },
    next: { text: 'sn-calendar-view', link: '/components/uni/calendar-view' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
