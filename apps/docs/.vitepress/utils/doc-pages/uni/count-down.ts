/**
 * CountDown 倒计时（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-count-down.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const countDownDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'CountDown 倒计时' },
  ],
  title: 'CountDown 倒计时',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '暴露方法：' },
    { t: 'code', s: 'start()' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'pause()' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'reset()' },
    { t: 'text', s: '。' },
    { t: 'code', s: 'SnCountDownTimeData' },
    { t: 'text', s: ' = ' },
    { t: 'code', s: '{ total, days, hours, minutes, seconds, milliseconds }' },
    { t: 'text', s: '。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-count-down',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'CountDown 倒计时.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { CountDown } from '@snui/uni';
</script>

<template>
  <sn-count-down />
</template>`,
  },
  demos: [
    { name: 'count-down-mp-basic', title: '基础用法', blurb: '三种格式与 finish 回调。' },
    {
      name: 'count-down-mp-control',
      title: '控制方法（start / pause / reset）',
      blurb: '实例方法开始 / 继续、暂停、重置，finish 回调计数。',
    },
    {
      name: 'count-down-mp-millisecond',
      title: '毫秒渲染（millisecond）',
      blurb: 'millisecond 打开后按 ss.S 渲染，小数位实时跳动。',
    },
    {
      name: 'count-down-mp-autostart',
      title: 'auto-start 与自定义类名',
      blurb: 'auto-start=false 手动开始、reset 不自动跑，以及 customClass / customStyle。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'time', type: 'number', default: '0', desc: '倒计时时长（ms）' },
      {
        name: 'millisecond',
        type: 'boolean',
        default: 'false',
        desc: '是否开启毫秒级渲染（约 16ms 一跳）',
      },
      {
        name: 'format',
        type: 'string',
        default: "'HH:mm:ss'",
        desc: 'Format string; tokens are `DD` / `DDD` / `HH` / `mm` / `ss` / `S`.',
      },
      {
        name: 'autoStart',
        type: 'boolean',
        default: 'true',
        desc: '是否在初始化和 `time` 变化后自动开始',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'CountDown 倒计时 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { CountDown } from '@snui/uni';",
    chipCopy: "import { CountDown } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-count-down', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'FitSwiper', link: '/components/uni/fit-swiper' },
    next: { text: 'CountTo', link: '/components/uni/count-to' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
