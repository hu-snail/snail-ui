/**
 * Progress 进度条（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-progress.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const progressDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Progress 进度条' },
  ],
  title: 'Progress 进度条',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '无。' },
    { t: 'code', s: 'sn-progress' },
    { t: 'text', s: ' 是纯展示组件，不发事件。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-progress',
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
    fileLabel: 'Progress 进度条.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Progress } from '@snui/uni';
</script>

<template>
  <sn-progress />
</template>`,
  },
  demos: [
    {
      name: 'progress-mp-basic',
      title: '基础用法',
      blurb: '0 / 30 / 68 / 100 与 hide-text 五档。',
    },
    {
      name: 'progress-mp-color',
      title: '状态与自定义颜色',
      blurb: 'success / warning / danger 三档状态色，以及 color 字符串与渐变数组。',
    },
    {
      name: 'progress-mp-label',
      title: '文案位置与对齐',
      blurb: 'outer left / outer center / inner right / inner center，以及 duration 动画。',
    },
    {
      name: 'progress-mp-custom',
      title: '自定义类名与样式',
      blurb: 'custom-class 加虚线外框 / custom-style 加内边距 / 两者叠加。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'percentage',
        type: 'number',
        default: '0',
        desc: '进度数值，最大值 100（越界截断）',
      },
      { name: 'hideText', type: 'boolean', default: 'false', desc: '是否隐藏进度文字' },
      {
        name: 'color',
        type: 'string | string[] | SnProgressColor[]',
        default: "''",
        desc: 'Fill color: solid string, gradient string[], or threshold entries.',
      },
      {
        name: 'status',
        type: 'ProgressStatus',
        default: "''",
        desc: 'Semantic status; overrides `color` when set.',
      },
      { name: 'duration', type: 'number', default: '30', desc: '进度增加 1% 所需毫秒数' },
      {
        name: 'percentPosition',
        type: 'SnProgressPercentPosition',
        default: "() => ({ type: 'outer'",
        desc: 'Percentage text placement + alignment.',
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
    copy: 'Progress 进度条 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Progress } from '@snui/uni';",
    chipCopy: "import { Progress } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-progress', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Loading', link: '/components/uni/loading' },
    next: { text: 'Circle', link: '/components/uni/circle' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
