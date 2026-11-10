/**
 * DatetimePickerView 日期时间选择器视图（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-datetime-picker-view.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const datetimePickerViewDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'DatetimePickerView 日期时间选择器视图' },
  ],
  title: 'DatetimePickerView 日期时间选择器视图',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-datetime-picker-view 滚筒本体：type 决定列集合，minDate / maxDate 限制可选范围。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-datetime-picker-view',
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
    fileLabel: 'DatetimePickerView 日期时间选择器视图.vue',
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
      title: '基础用法',
      blurb: 'sn-datetime-picker-view 滚筒本体：type 决定列集合，minDate / maxDate 限制可选范围。',
    },
    {
      name: 'datetime-picker-view-mp-time-type',
      title: '时间类型写回',
      blurb: 'type=time 只出时分列并写回 HH:mm 字符串。',
    },
    {
      name: 'datetime-picker-view-mp-formatter',
      title: '列文案格式化（formatter）',
      blurb: 'formatter 改写列文案。',
    },
    {
      name: 'datetime-picker-view-mp-roller-geometry',
      title: '滚筒几何',
      blurb: 'itemHeight / visibleItemCount 调整滚筒行高与可见行数。',
    },
    {
      name: 'datetime-picker-view-mp-keys',
      title: '字段映射（valueKey / labelKey）',
      blurb: 'valueKey / labelKey 为对齐参数（列由组件生成）。',
    },
    {
      name: 'datetime-picker-view-mp-column-formatter',
      title: '列改写（columnFormatter）',
      blurb: 'columnFormatter 倒序年份列。',
    },
    {
      name: 'datetime-picker-view-mp-time-bounds',
      title:
        '时间列边界与秒列（`minMinute` / `maxMinute` / `useSecond` / `minSecond` / `maxSecond`）',
      blurb: 'minMinute / maxMinute；useSecond + minSecond / maxSecond。',
    },
    {
      name: 'datetime-picker-view-mp-boundary',
      title: '区间联动（boundaryMinDate / boundaryMaxDate）',
      blurb: 'boundaryMinDate / boundaryMaxDate（声明但未参与渲染）。',
    },
    {
      name: 'datetime-picker-view-mp-immediate-change',
      title: '即时 change（immediateChange）',
      blurb: 'immediateChange：每次滚动立即 emit change。',
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
      { name: 'itemHeight', type: 'number', default: '44', desc: '行高（px 设计值）。' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: '可见行数。' },
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
        desc: '最小日期（时间戳）。',
      },
      {
        name: 'maxDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '最大日期（时间戳）。',
      },
      { name: 'minHour', type: 'number', default: '0', desc: '最小小时（`time` 类型）。' },
      { name: 'maxHour', type: 'number', default: '23', desc: '最大小时（`time` 类型）。' },
      { name: 'minMinute', type: 'number', default: '0', desc: '最小分钟（`time` 类型）。' },
      { name: 'maxMinute', type: 'number', default: '59', desc: '最大分钟（`time` 类型）。' },
      { name: 'useSecond', type: 'boolean', default: 'false', desc: '显示秒列。' },
      { name: 'minSecond', type: 'number', default: '0', desc: '最小秒。' },
      { name: 'maxSecond', type: 'number', default: '59', desc: '最大秒。' },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: '拖动过程中立即触发 change',
      },
      {
        name: 'boundaryMinDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '区间模式的下界（联动辅助）。',
      },
      {
        name: 'boundaryMaxDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: '区间模式的上界（联动辅助）。',
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'DatetimePickerView 日期时间选择器视图 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { DatetimePickerView } from '@snui/uni';",
    chipCopy: "import { DatetimePickerView } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-datetime-picker-view', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-datetime-picker', link: '/components/uni/datetime-picker' },
    next: { text: 'sn-upload', link: '/components/uni/upload' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
