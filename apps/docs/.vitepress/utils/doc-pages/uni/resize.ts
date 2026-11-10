/**
 * Resize 监听元素尺寸变化（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-resize.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const resizeDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'Resize 监听元素尺寸变化' },
  ],
  title: 'Resize 监听元素尺寸变化',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '内容变化（例如列表增长）后，宿主常需重新计算布局。' },
    { t: 'code', s: 'sn-resize' },
    { t: 'text', s: ' 在首次测量与每次尺寸变化时上报盒模型。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-resize',
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
    fileLabel: 'Resize 监听元素尺寸变化.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Resize } from '@snui/uni';
</script>

<template>
  <sn-resize />
</template>`,
  },
  demos: [
    { name: 'resize-mp-basic', title: '基础用法', blurb: '增加一行后，测量结果随之更新。' },
    {
      name: 'resize-mp-custom',
      title: '自定义类名与测量边界',
      blurb: 'customClass / customStyle 画外层包裹边界，customContainerClass 画被测量的内层节点。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      {
        name: 'customContainerClass',
        type: 'string',
        default: "''",
        desc: '内层容器自定义类名（实际被测量的节点）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Resize 监听元素尺寸变化 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Resize } from '@snui/uni';",
    chipCopy: "import { Resize } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-resize', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-transition', link: '/components/uni/transition' },
    next: { text: 'sn-config-provider', link: '/components/uni/config-provider' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
