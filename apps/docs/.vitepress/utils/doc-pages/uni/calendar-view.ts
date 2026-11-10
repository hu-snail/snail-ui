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
      name: 'calendar-view-mp-range',
      title: '区间选择（type="daterange"）',
      blurb: 'type=daterange 选区间；maxRange 限制跨度并显示提示。',
    },
    {
      name: 'calendar-view-mp-switch-mode',
      title: '月 / 年切换（switchMode）',
      blurb: 'switchMode=month 改为单月 + 上下月按钮。',
    },
    {
      name: 'calendar-view-mp-first-day-of-week',
      title: '周起始日',
      blurb: 'firstDayOfWeek=1 把周一挪到第一列。',
    },
    {
      name: 'calendar-view-mp-formatter',
      title: '单元格格式化',
      blurb: 'formatter 在周末格底部加「休」。',
    },
    {
      name: 'calendar-view-mp-panel-title',
      title: '面板标题（showPanelTitle）',
      blurb: 'showPanelTitle=false 收起月份标题，面板只剩网格。',
    },
    {
      name: 'calendar-view-mp-same-day',
      title: '起止同一天（allowSameDay）',
      blurb: 'allowSameDay 允许区间起止同一天。',
    },
    {
      name: 'calendar-view-mp-default-time',
      title: '默认时分与即时写回',
      blurb: 'defaultTime 决定写回时间戳的时分秒；immediateChange 点中即触发。',
    },
    {
      name: 'calendar-view-mp-time-props',
      title: '时间列声明参数',
      blurb:
        'timeFilter / timeItemHeight / timeVisibleItemCount / hideSecond 只做声明对齐（面板内无时间滚筒）；customClass / customStyle 落在根节点。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'CalendarValue', default: 'null', desc: '绑定值。' },
      { name: 'type', type: 'CalendarType', default: "'date'", desc: 'Selection mode.' },
      {
        name: 'minDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '最小日期（时间戳）。',
      },
      {
        name: 'maxDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '最大日期（时间戳）。',
      },
      { name: 'firstDayOfWeek', type: 'number', default: '0', desc: '周起始日（0 为周日）' },
      {
        name: 'formatter',
        type: 'CalendarFormatter | undefined',
        default: 'undefined',
        desc: '单元格格式化钩子',
      },
      { name: 'maxRange', type: 'number', default: '0', desc: '区间最大跨度（天，0 不限制）' },
      {
        name: 'rangePrompt',
        type: 'string',
        default: "''",
        desc: 'Message shown when `maxRange` is exceeded.',
      },
      { name: 'allowSameDay', type: 'boolean', default: 'false', desc: '允许区间起止同一天' },
      { name: 'showPanelTitle', type: 'boolean', default: 'true', desc: '是否显示月份标题' },
      {
        name: 'defaultTime',
        type: 'string | string[]',
        default: "'00:00:00'",
        desc: 'Default clock time applied to date / datetime values.',
      },
      { name: 'panelHeight', type: 'number', default: '316', desc: '可滚动面板高度（px 设计值）' },
      { name: 'immediateChange', type: 'boolean', default: 'false', desc: '点击即触发 change' },
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
        desc: '时间列过滤钩子——**声明但未实现**（面板内无时间滚筒）',
      },
      {
        name: 'timeItemHeight',
        type: 'number',
        default: '44',
        desc: '时间行高——**声明但未实现**（同上）',
      },
      {
        name: 'timeVisibleItemCount',
        type: 'number',
        default: '6',
        desc: '时间可见行数——**声明但未实现**（同上）',
      },
      {
        name: 'hideSecond',
        type: 'boolean',
        default: 'false',
        desc: '隐藏秒列——**声明但未实现**（同上）',
      },
      {
        name: 'showLunar',
        type: 'boolean',
        default: 'false',
        desc: '农历角标——**AUI 追加**：格下农历日名，初一显示月名；`formatter` 可覆盖',
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
