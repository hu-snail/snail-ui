/**
 * CalendarView 日历视图（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-calendar-view.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const calendarViewDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'CalendarView 日历视图' },
  ],
  title: 'CalendarView 日历视图',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-calendar-view 平铺月网格：minDate / maxDate 决定月份范围，tap 某天写回时间戳。',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-calendar-view',
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
    fileLabel: 'CalendarView 日历视图.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { CalendarView } from '@snui/uni';
</script>

<template>
  <sn-calendar-view />
</template>`,
  },
  demos: [
    {
      name: 'calendar-view-mp-basic',
      title: '基础用法',
      blurb: 'sn-calendar-view 平铺月网格：minDate / maxDate 决定月份范围，tap 某天写回时间戳。',
    },
    {
      name: 'calendar-view-mp-range-switch',
      title: '区间与月份切换（`type` / `maxRange` / `switchMode`）',
      blurb:
        'type=daterange 选区间；maxRange 限制跨度并显示提示；switchMode=month 改为单月 + 上下月按钮。',
    },
    {
      name: 'calendar-view-mp-formatter-week',
      title: '周起始、单元格格式与面板标题（`firstDayOfWeek` / `formatter` / `showPanelTitle`）',
      blurb:
        'firstDayOfWeek=1 周一起始；formatter 在周末格底部加「休」；showPanelTitle=false 收起月份标题。',
    },
    {
      name: 'calendar-view-mp-same-day-time',
      title: '同日区间、默认时分与自定义样式（`allowSameDay` / `defaultTime` / `immediateChange`）',
      blurb:
        'allowSameDay 允许区间起止同一天；defaultTime 决定写回时间戳的时分秒；immediateChange 点中即触发；customClass / customStyle 落在根节点。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'CalendarValue',
        default: 'null',
        desc: 'Selected value — a timestamp, a timestamp list, or `null`.',
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
      {
        name: 'firstDayOfWeek',
        type: 'number',
        default: '0',
        desc: 'First weekday of the grid (0 = Sunday).',
      },
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
        desc: 'Maximum span for the range types (in days). `0` = unconstrained.',
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
        desc: 'Allow the range start and end to be the same day.',
      },
      {
        name: 'showPanelTitle',
        type: 'boolean',
        default: 'true',
        desc: 'Render the per-month panel title.',
      },
      {
        name: 'defaultTime',
        type: 'string | string[]',
        default: "'00:00:00'",
        desc: 'Default clock time applied to date / datetime values.',
      },
      {
        name: 'panelHeight',
        type: 'number',
        default: '316',
        desc: 'Scrollable panel height in px design units.',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Emit `change` as soon as a cell is tapped.',
      },
      {
        name: 'switchMode',
        type: "'none' | 'month' | 'year-month'",
        default: "'none'",
        desc: 'Month-switch mode. `none` renders every month flat.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
      {
        name: 'timeFilter',
        type: 'CalendarTimeFilter | undefined',
        default: 'undefined',
        desc: 'Time-column filter hook (`wd-calendar-view` `time-filter`). Declared for parity; this build renders no time roller, so the hook is never invoked. Documented as 「未实现」.',
      },
      {
        name: 'timeItemHeight',
        type: 'number',
        default: '44',
        desc: 'Time row height (`wd-calendar-view` `time-item-height`). Declared for parity.',
      },
      {
        name: 'timeVisibleItemCount',
        type: 'number',
        default: '6',
        desc: 'Visible time rows (`wd-calendar-view` `time-visible-item-count`). Declared for parity.',
      },
      {
        name: 'hideSecond',
        type: 'boolean',
        default: 'false',
        desc: 'Hide the seconds column (`wd-calendar-view` `hide-second`). Declared for parity.',
      },
      {
        name: 'showLunar',
        type: 'boolean',
        default: 'false',
        desc: '农历角标（additive，AGENTS.md §112.3a）：在格子下方显示农历日名 （初二、十五…），初一显示月名（正月 / 闰六月）。`formatter` 的 `bottomInfo` 优先级更高，可覆盖农历文案。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'CalendarView 日历视图 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { CalendarView } from '@snui/uni';",
    chipCopy: "import { CalendarView } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-calendar-view', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-calendar', link: '/components/uni/calendar' },
    next: { text: 'sn-date-strip', link: '/components/uni/date-strip' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
