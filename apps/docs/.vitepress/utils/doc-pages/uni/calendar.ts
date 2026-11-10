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
    { name: 'calendar-mp-basic', title: '基础用法', blurb: '基础用法' },
    {
      name: 'calendar-mp-card',
      title: '卡片入口（cells card 形态）',
      blurb: '卡片入口（cells card 形态）',
    },
    {
      name: 'calendar-mp-grid-range',
      title:
        '网格与区间约束（`firstDayOfWeek` / `formatter` / `maxRange` / `rangePrompt` / `allowSameDay` / `defaultTime`）',
      blurb:
        '网格与区间约束（`firstDayOfWeek` / `formatter` / `maxRange` / `rangePrompt` / `allowSameDay` / `defaultTime`）',
    },
    {
      name: 'calendar-mp-header',
      title: '弹层头部插槽（`header`，AUI 追加）',
      blurb: '弹层头部插槽（`header`，AUI 追加）',
    },
    {
      name: 'calendar-mp-hooks-parity',
      title: '快捷回调与声明参数（`onShortcutsClick` / `beforeConfirm`）',
      blurb: '快捷回调与声明参数（`onShortcutsClick` / `beforeConfirm`）',
    },
    {
      name: 'calendar-mp-lunar',
      title: '农历角标（`showLunar`，AUI 追加）',
      blurb: '农历角标（`showLunar`，AUI 追加）',
    },
    {
      name: 'calendar-mp-panel-sheet',
      title:
        '面板与弹层（`panelHeight` / `switchMode` / `immediateChange` / `showConfirm` / 遮罩层级）',
      blurb:
        '面板与弹层（`panelHeight` / `switchMode` / `immediateChange` / `showConfirm` / 遮罩层级）',
    },
    {
      name: 'calendar-mp-shortcuts-range',
      title: '快捷选项与区间（`shortcuts` / `type`）',
      blurb: '快捷选项与区间（`shortcuts` / `type`）',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'CalendarValue', default: 'null', desc: '绑定值。' },
      { name: 'visible', type: 'boolean', default: 'false', desc: '弹层显隐' },
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
      { name: 'firstDayOfWeek', type: 'number', default: '0', desc: '周起始日' },
      {
        name: 'formatter',
        type: 'CalendarFormatter | undefined',
        default: 'undefined',
        desc: '单元格格式化钩子',
      },
      {
        name: 'maxRange',
        type: 'number',
        default: '0',
        desc: '区间类型的最大跨度（天），`0` 表示不限制。',
      },
      {
        name: 'rangePrompt',
        type: 'string',
        default: "''",
        desc: 'Message shown when `maxRange` is exceeded.',
      },
      { name: 'allowSameDay', type: 'boolean', default: 'false', desc: '允许区间起止同一天' },
      {
        name: 'defaultTime',
        type: 'string | string[]',
        default: "'00:00:00'",
        desc: 'Default clock time applied to date / datetime values.',
      },
      { name: 'title', type: 'string', default: "'选择日期'", desc: 'Toolbar title.' },
      { name: 'closeOnClickModal', type: 'boolean', default: 'true', desc: '点击遮罩关闭' },
      { name: 'zIndex', type: 'number', default: '15', desc: '弹层层级' },
      { name: 'showConfirm', type: 'boolean', default: 'true', desc: '渲染确认按钮。' },
      { name: 'confirmText', type: 'string', default: "'确定'", desc: 'Confirm button label.' },
      { name: 'shortcuts', type: 'CalendarShortcut[]', default: '() => []', desc: '快捷选项 chip' },
      { name: 'safeAreaInsetBottom', type: 'boolean', default: 'true', desc: '底部安全区留白' },
      {
        name: 'customViewClass',
        type: 'string',
        default: "''",
        desc: 'Class forwarded to the panel body.',
      },
      { name: 'immediateChange', type: 'boolean', default: 'false', desc: '点击即写回 `v-model`' },
      {
        name: 'panelHeight',
        type: 'number',
        default: '316',
        desc: '可滚动面板高度（px 设计值）。',
      },
      { name: 'showPanelTitle', type: 'boolean', default: 'true', desc: '渲染每个月的面板标题。' },
      {
        name: 'switchMode',
        type: "'none' | 'month' | 'year-month'",
        default: "'none'",
        desc: 'Month-switch mode.',
      },
      { name: 'duration', type: 'number', default: '200', desc: '弹层动画时长（ms）' },
      {
        name: 'timeFilter',
        type: 'CalendarTimeFilter | undefined',
        default: 'undefined',
        desc: '时间选项过滤钩子（datetime / datetimerange）。',
      },
      {
        name: 'hideSecond',
        type: 'boolean',
        default: 'false',
        desc: '隐藏秒级滚轮（datetime / datetimerange）。',
      },
      { name: 'ellipsis', type: 'boolean', default: 'false', desc: '区间文案超长时省略。' },
      { name: 'showTypeSwitch', type: 'boolean', default: 'true', desc: '显示日 / 周 / 月切换。' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: '把面板传送到页面流之外（小程序端无 portal 宿主）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the sheet.' },
      {
        name: 'showLunar',
        type: 'boolean',
        default: 'false',
        desc: '农历角标——**AUI 追加**（初一显示月名；`formatter` 可覆盖）',
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
