/**
 * DatetimePicker 日期时间选择器（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-datetime-picker.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const datetimePickerDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'DatetimePicker 日期时间选择器' },
  ],
  title: 'DatetimePicker 日期时间选择器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'sn-datetime-picker 弹层选择器：滚动只改草稿，确认才写 v-model。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-datetime-picker',
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
    fileLabel: 'DatetimePicker 日期时间选择器.vue',
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
      title: '基础用法',
      blurb: 'sn-datetime-picker 弹层选择器：滚动只改草稿，确认才写 v-model。',
    },
    {
      name: 'datetime-picker-mp-card',
      title: '单元格卡片布局（`sn-cell` 的 `card`）',
      blurb: 'sn-cell-group card / sn-cell card：每行入口独立成卡，行间距走 token。',
    },
    {
      name: 'datetime-picker-mp-header',
      title: '弹层头部（取消左 / 标题中 / 确认右）',
      blurb: 'title 有 / 无、自定义按钮文案：确认始终贴右，两个动作均为纯文字。',
    },
    {
      name: 'datetime-picker-mp-lunar',
      title: '农历选择（`lunar`，AUI 追加）',
      blurb:
        'lunar：年干支 / 月含闰月 / 日初一三十；v-model 仍是公历时间戳；datetime + lunar 保留时分。',
    },
    {
      name: 'datetime-picker-mp-time-type',
      title: '时间类型（type="time"）',
      blurb: 'type=time 写回 HH:mm 字符串。',
    },
    {
      name: 'datetime-picker-mp-before-confirm',
      title: '确认拦截（beforeConfirm）',
      blurb: 'beforeConfirm 返回 false 时弹层不关闭。',
    },
    {
      name: 'datetime-picker-mp-roller-geometry',
      title: '滚筒几何（itemHeight / visibleItemCount）',
      blurb: 'itemHeight / visibleItemCount 调整滚筒行高与可见行数。',
    },
    {
      name: 'datetime-picker-mp-time-bounds',
      title: '时分秒边界',
      blurb:
        'minHour / maxHour / minMinute / maxMinute；useSecond + minSecond / maxSecond。',
    },
    {
      name: 'datetime-picker-mp-column-format',
      title: '列文案与过滤（formatter / filter）',
      blurb: 'formatter 改写列文案；filter 过滤列取值。',
    },
    {
      name: 'datetime-picker-mp-immediate-change',
      title: '即时写回（immediateChange）',
      blurb: 'immediateChange：滚动即写 v-model，不必确认。',
    },
    {
      name: 'datetime-picker-mp-sheet-chrome',
      title: '弹层外观（文案 / 遮罩 / 层级）',
      blurb:
        'cancelButtonText；closeOnClickModal；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle / customViewClass；displayFormatTabLabel。',
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
      { name: 'visible', type: 'boolean', default: 'false', desc: '弹层显隐' },
      { name: 'type', type: 'DateTimeType', default: "'datetime'", desc: 'Column set.' },
      { name: 'title', type: 'string', default: "''", desc: 'Toolbar title.' },
      { name: 'cancelButtonText', type: 'string', default: "'取消'", desc: 'Cancel button label.' },
      {
        name: 'confirmButtonText',
        type: 'string',
        default: "'确认'",
        desc: 'Confirm button label.',
      },
      { name: 'closeOnClickModal', type: 'boolean', default: 'true', desc: '点击遮罩关闭面板。' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: '为设备安全区留出内边距。',
      },
      { name: 'itemHeight', type: 'number', default: '44', desc: '行高（px 设计值）。' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: '可见行数。' },
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
        desc: '最小日期（时间戳）。',
      },
      {
        name: 'maxDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '最大日期（时间戳）。',
      },
      { name: 'minHour', type: 'number', default: '0', desc: '最小小时。' },
      { name: 'maxHour', type: 'number', default: '23', desc: '最大小时。' },
      { name: 'minMinute', type: 'number', default: '0', desc: '最小分钟。' },
      { name: 'maxMinute', type: 'number', default: '59', desc: '最大分钟。' },
      { name: 'useSecond', type: 'boolean', default: 'false', desc: '显示秒列。' },
      { name: 'minSecond', type: 'number', default: '0', desc: '最小秒。' },
      { name: 'maxSecond', type: 'number', default: '59', desc: '最大秒。' },
      { name: 'zIndex', type: 'number', default: '15', desc: '弹层层级' },
      { name: 'immediateChange', type: 'boolean', default: 'false', desc: '滚动即写回 v-model' },
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'DatetimePicker 日期时间选择器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { DatetimePicker } from '@snui/uni';",
    chipCopy: "import { DatetimePicker } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-datetime-picker', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-date-strip', link: '/components/uni/date-strip' },
    next: { text: 'sn-datetime-picker-view', link: '/components/uni/datetime-picker-view' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
