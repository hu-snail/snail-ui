/**
 * CountTo 数字滚动（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-count-to.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const countToDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'CountTo 数字滚动' },
  ],
  title: 'CountTo 数字滚动',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-count-to',
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
    fileLabel: 'CountTo 数字滚动.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { CountTo } from '@snui/uni';
</script>

<template>
  <sn-count-to />
</template>`,
  },
  demos: [
    {
      name: 'count-to-mp-basic',
      title: '基础用法',
      blurb: '基础补间、货币前缀、小数与自定义分隔符。',
    },
    {
      name: 'count-to-mp-type',
      title: '主题色与控制方法',
      blurb: '五种主题色，以及手动开始 / 暂停 / 重置。',
    },
    {
      name: 'count-to-mp-easing',
      title: '缓动曲线与自定义类名',
      blurb: 'use-easing 开 / 关的节奏对比，以及 customClass / customStyle。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Text color override (any CSS color value).',
      },
      {
        name: 'type',
        type: 'CountToType',
        default: "'default'",
        desc: 'Semantic text theme; `default` uses the body text token.',
      },
      { name: 'startVal', type: 'number', default: '0', desc: 'Start value.' },
      { name: 'endVal', type: 'number', default: '2024', desc: 'End value.' },
      { name: 'duration', type: 'number', default: '3000', desc: 'Tween duration in ms.' },
      {
        name: 'autoStart',
        type: 'boolean',
        default: 'true',
        desc: 'Start the animation on mount / on value change.',
      },
      { name: 'decimals', type: 'number', default: '0', desc: 'Decimal places to keep (>= 0).' },
      { name: 'decimal', type: 'string', default: "'.'", desc: 'Decimal separator character.' },
      { name: 'separator', type: 'string', default: "'", desc: 'Thousands separator character.' },
      { name: 'prefix', type: 'string', default: "''", desc: 'Text before the number.' },
      { name: 'suffix', type: 'string', default: "''", desc: 'Text after the number.' },
      {
        name: 'useEasing',
        type: 'boolean',
        default: 'true',
        desc: 'Use cubic ease-out instead of a linear ramp.',
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
    copy: 'CountTo 数字滚动 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { CountTo } from '@snui/uni';",
    chipCopy: "import { CountTo } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-count-to', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-count-down', link: '/components/uni/count-down' },
    next: { text: 'sn-watermark', link: '/components/uni/watermark' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
