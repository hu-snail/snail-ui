/**
 * SwipeAction 滑动操作（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-swipe-action.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const swipeActionDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'SwipeAction 滑动操作' },
  ],
  title: 'SwipeAction 滑动操作',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '内容放默认插槽，操作按钮放 ' },
    { t: 'code', s: 'right' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'left' },
    { t: 'text', s: ' 插槽。' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' 回报 ' },
    { t: 'code', s: "'left' | 'close' | 'right'" },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-swipe-action',
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
    fileLabel: 'SwipeAction 滑动操作.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SwipeAction } from '@snui/uni';
</script>

<template>
  <sn-swipe-action />
</template>`,
  },
  demos: [
    {
      name: 'swipe-action-mp-basic',
      title: '基础用法',
      blurb: '向左滑动露出删除按钮，状态实时显示。',
    },
    {
      name: 'swipe-action-mp-both-sides',
      title: '两侧操作区',
      blurb: '#left / #right 插槽同时渲染两侧操作区。',
    },
    {
      name: 'swipe-action-mp-before-close',
      title: '关闭拦截（before-close）',
      blurb: 'before-close 拦截第一次关闭，返回 false 阻止。',
    },
    {
      name: 'swipe-action-mp-disabled',
      title: '禁用（disabled）',
      blurb: 'disabled 手势被忽略，行保持关闭。',
    },
    {
      name: 'swipe-action-mp-custom-style',
      title: '根节点样式',
      blurb: 'custom-class / custom-style 落在根节点上。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SwipeActionStatus',
        default: "'close'",
        desc: 'Current swipe state (v-model): `left` / `close` / `right`.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用滑动' },
      { name: 'beforeClose', type: 'SwipeActionBeforeClose', default: '—', desc: '—' },
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
    copy: 'SwipeAction 滑动操作 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { SwipeAction } from '@snui/uni';",
    chipCopy: "import { SwipeAction } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-swipe-action', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Curtain', link: '/components/uni/curtain' },
    next: { text: 'FloatingPanel', link: '/components/uni/floating-panel' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
