/**
 * DateStrip 日期条（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-date-strip.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dateStripDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'DateStrip 日期条' },
  ],
  title: 'DateStrip 日期条',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '单选，点整列即写 ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: '；初始页自动定位到已选值所在页。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-date-strip',
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
    fileLabel: 'DateStrip 日期条.vue',
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
      title: '基础用法',
      blurb: 'sn-date-strip 基础用法：单选，点整列即写 v-model。',
    },
    {
      name: 'date-strip-mp-nav',
      title: '导航按钮',
      blurb: 'show-nav 两侧翻页 + #prev / #next 自定义插槽 + pagechange + show-lunar。',
    },
    {
      name: 'date-strip-mp-lunar',
      title: '农历显示',
      blurb: 'show-lunar：日号下方农历角标，初一显示月名。',
    },
    {
      name: 'date-strip-mp-formatter',
      title: '自定义日期文案',
      blurb: 'formatter 在日号下方注入价格文案（bottomInfo）。',
    },
    {
      name: 'date-strip-mp-range',
      title: '自定义日期范围',
      blurb: 'type=range：首点定起点、再点定终点，越界自动交换。',
    },
    {
      name: 'date-strip-mp-custom-style',
      title: '自定义样式',
      blurb: 'custom-class / custom-style 换条底色与圆角。',
    },
  ],
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
      { name: 'count', type: 'number', default: '7', desc: '每页天数（swiper 每页一屏）' },
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
      { name: 'showWeek', type: 'boolean', default: 'true', desc: '每列顶部的星期字' },
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
      { name: 'disabled', type: 'boolean', default: 'false', desc: '整条禁用' },
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'DateStrip 日期条 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { DateStrip } from '@snui/uni';",
    chipCopy: "import { DateStrip } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-date-strip', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-calendar-view', link: '/components/uni/calendar-view' },
    next: { text: 'sn-datetime-picker', link: '/components/uni/datetime-picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
