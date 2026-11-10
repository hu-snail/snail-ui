/**
 * Circle 环形进度条（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-circle.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const circleDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Circle 环形进度条' },
  ],
  title: 'Circle 环形进度条',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '无。`` 是纯展示组件，不发事件。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-circle',
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
    fileLabel: 'Circle 环形进度条.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Circle } from '@snui/uni';
</script>

<template>
  <sn-circle />
</template>`,
  },
  demos: [
    {
      name: 'circle-mp-basic',
      title: '基础用法',
      blurb: '0 / 30 / 70 / 100 四档，以及三档尺寸与动态加减。',
    },
    {
      name: 'circle-mp-color',
      title: '颜色与形态',
      blurb: '状态色 / 渐变色 / 自定义轨道与底盘 / 逆时针。',
    },
    {
      name: 'circle-mp-speed',
      title: '动画速度（speed）',
      blurb: 'speed=0 / 200 / 10 三档过渡对比，0 关闭过渡。',
    },
    {
      name: 'circle-mp-custom-style',
      title: '根节点样式',
      blurb: 'custom-class 与 custom-style 都落在 sn-circle 根节点上。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'number', default: '0', desc: '当前进度，0–100（越界截断）' },
      { name: 'size', type: 'number | string', default: '120', desc: '120' },
      {
        name: 'color',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Ring color: a solid CSS color, or a `{ offset: color }` gradient map.',
      },
      { name: 'layerColor', type: 'string', default: "''", desc: 'Track (unfilled) color.' },
      {
        name: 'fill',
        type: 'string',
        default: "''",
        desc: 'Filled disc color inside the ring; empty renders a hollow ring.',
      },
      {
        name: 'speed',
        type: 'number',
        default: '50',
        desc: '动画速度（百分比 / 秒）；`0` 关闭过渡',
      },
      {
        name: 'text',
        type: 'string',
        default: "''",
        desc: 'Text shown in the middle; empty shows the rounded percentage.',
      },
      { name: 'strokeWidth', type: 'number | string', default: '18', desc: '18' },
      {
        name: 'strokeLinecap',
        type: 'CircleLinecap',
        default: "'round'",
        desc: 'Stroke cap (parity only — a conic sweep has no caps).',
      },
      { name: 'clockwise', type: 'boolean', default: 'true', desc: '是否顺时针增加' },
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
    copy: 'Circle 环形进度条 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Circle } from '@snui/uni';",
    chipCopy: "import { Circle } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-circle', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-progress', link: '/components/uni/progress' },
    next: { text: 'sn-toast', link: '/components/uni/toast' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
