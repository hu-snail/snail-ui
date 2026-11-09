/**
 * Skeleton 骨架屏（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-skeleton.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const skeletonDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Skeleton 骨架屏' },
  ],
  title: 'Skeleton 骨架屏',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '三种形态（字符串 / 字符串数组 / 布尔映射对象）在根节点上的效果一致，对象形态适合按状态开关类名：',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-skeleton',
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
    fileLabel: 'Skeleton 骨架屏.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Skeleton } from '@snui/uni';
</script>

<template>
  <sn-skeleton />
</template>`,
  },
  demos: [
    { name: 'skeleton-mp-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'skeleton-mp-custom', title: '自定义行列', blurb: '自定义行列' },
    { name: 'skeleton-mp-animation', title: '微光动画与切换', blurb: '微光动画与切换' },
    { name: 'skeleton-mp-custom-style', title: '自定义类名与样式', blurb: '自定义类名与样式' },
    {
      name: 'skeleton-mp-custom-class-forms',
      title: '自定义类名与样式',
      blurb: '自定义类名与样式',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'theme',
        type: 'SkeletonTheme',
        default: "'text'",
        desc: 'Preset layout when `rowCol` is empty.',
      },
      {
        name: 'rowCol',
        type: 'SkeletonRowCol[]',
        default: '() => []',
        desc: 'Per-row layout: a column count or an explicit column list per row.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the skeleton is shown; `false` renders the default slot.',
      },
      { name: 'animation', type: 'SkeletonAnimation', default: "''", desc: 'Shimmer kind.' },
      {
        name: 'customClass',
        type: 'string | string[] | Record<string, boolean>',
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
    copy: 'Skeleton 骨架屏 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Skeleton } from '@snui/uni';",
    chipCopy: "import { Skeleton } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-skeleton', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-empty', link: '/components/uni/empty' },
    next: { text: 'sn-loadmore', link: '/components/uni/loadmore' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
