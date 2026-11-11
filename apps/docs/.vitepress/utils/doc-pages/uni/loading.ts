/**
 * Loading 加载指示器（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-loading.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const loadingDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Loading 加载指示器' },
  ],
  title: 'Loading 加载指示器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '默认是 ' },
    { t: 'code', s: 'circular' },
    { t: 'text', s: ' 圆环；' },
    { t: 'code', s: 'type' },
    { t: 'text', s: ' 切换 4 种形态。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-loading',
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
    fileLabel: 'Loading 加载指示器.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Loading } from '@snui/uni';
</script>

<template>
  <sn-loading />
</template>`,
  },
  demos: [
    {
      name: 'loading-mp-basic',
      title: '基础用法',
      blurb: 'circular / spinner / dots / wave 四种加载形态。',
    },
    {
      name: 'loading-mp-text',
      title: '文案、方向与尺寸',
      blurb: 'text 文案、horizontal 横排、size、color 与默认插槽。',
    },
    {
      name: 'loading-mp-custom',
      title: '继承颜色与自定义类名',
      blurb: 'inherit-color 继承父级色 / 根节点类名与内联样式 / 单独放大 spinner。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'type', type: 'LoadingType', default: "'circular'", desc: 'Spinner shape.' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Spinner color override (any CSS color value).',
      },
      {
        name: 'size',
        type: 'number | string',
        default: "''",
        desc: 'Base size — a bare number is treated as rpx, a string passes through.',
      },
      {
        name: 'text',
        type: 'string',
        default: "''",
        desc: 'Text shown next to / below the spinner.',
      },
      {
        name: 'direction',
        type: 'LoadingDirection',
        default: "'vertical'",
        desc: 'Layout direction of spinner + text.',
      },
      {
        name: 'inheritColor',
        type: 'boolean',
        default: 'false',
        desc: "Inherit the parent's `color` instead of the token default.",
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
      {
        name: 'customSpinnerClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the spinner box only.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Loading 加载指示器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Loading } from '@snui/uni';",
    chipCopy: "import { Loading } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-loading', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'ActionSheet', link: '/components/uni/action-sheet' },
    next: { text: 'Progress', link: '/components/uni/progress' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
