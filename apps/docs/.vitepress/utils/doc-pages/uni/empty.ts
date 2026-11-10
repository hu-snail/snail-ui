/**
 * Empty 缺省提示（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-empty.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const emptyDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Empty 缺省提示' },
  ],
  title: 'Empty 缺省提示',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '不传 ' },
    { t: 'code', s: 'icon' },
    {
      t: 'text',
      s: ' 时渲染内置的内联 SVG 缺省图形（不使用 emoji / 外部图片，遵循 AGENTS.md §113）。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-empty',
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
    fileLabel: 'Empty 缺省提示.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Empty } from '@snui/uni';
</script>

<template>
  <sn-empty />
</template>`,
  },
  demos: [
    { name: 'empty-mp-basic', title: '基础用法', blurb: '默认图形、带 tip 文案、长文案换行三档。' },
    {
      name: 'empty-mp-icon',
      title: '图形来源',
      blurb: '注册表图标 / 自定义 iconSize / CSS 图标类名 / data-URI 图片四种来源。',
    },
    {
      name: 'empty-mp-slots',
      title: '插槽',
      blurb: 'bottom 插槽放重试按钮；image 插槽完全自定义图形。',
    },
    {
      name: 'empty-mp-custom',
      title: '自定义类名与样式',
      blurb: 'custom-class 加虚线外框 / custom-style 加内边距 / 两者叠加。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'icon',
        type: 'string',
        default: "'empty'",
        desc: 'Icon name, registry key, image URL, or CSS class (see header).',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: 'Iconfont class prefix, applied together with `icon`.',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: '是否按 CSS 图标处理。',
      },
      {
        name: 'iconSize',
        type: 'number | string',
        default: "''",
        desc: 'Icon / image size. A bare number is treated as rpx.',
      },
      { name: 'tip', type: 'string', default: "''", desc: 'Tip text under the glyph.' },
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
    copy: 'Empty 缺省提示 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Empty } from '@snui/uni';",
    chipCopy: "import { Empty } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-empty', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-notice-bar', link: '/components/uni/notice-bar' },
    next: { text: 'sn-skeleton', link: '/components/uni/skeleton' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
