/**
 * Overlay 遮罩层（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-overlay.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const overlayDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Overlay 遮罩层' },
  ],
  title: 'Overlay 遮罩层',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '遮罩底色走 ' },
    { t: 'code', s: '--sn-mp-color-background-overlay' },
    { t: 'text', s: '，该变量在 ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    { t: 'text', s: ' 的 ' },
    { t: 'code', s: '.sn-theme-dark' },
    {
      t: 'text',
      s: ' 块里已覆盖（暗色下为更深的近黑），因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-overlay',
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
    fileLabel: 'Overlay 遮罩层.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Overlay } from '@snui/uni';
</script>

<template>
  <sn-overlay />
</template>`,
  },
  demos: [
    {
      name: 'overlay-mp-basic',
      title: '基础用法',
      blurb: '点击遮罩触发 click 并计数；遮罩上的卡片用 @tap.stop 阻止冒泡。',
    },
    {
      name: 'overlay-mp-config',
      title: '动画与滚动锁定',
      blurb: 'duration=false / duration=800 + zIndex / lockScroll=false + customStyle。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'show', type: 'boolean', default: 'false', desc: '是否展示遮罩层' },
      {
        name: 'duration',
        type: 'OverlayDuration',
        default: 'DEFAULT_DURATION',
        desc: 'Animation duration in ms. `false` = no animation, record = per-leg.',
      },
      {
        name: 'lockScroll',
        type: 'boolean',
        default: 'true',
        desc: 'Lock background scroll while shown (intercepts touchmove).',
      },
      { name: 'zIndex', type: 'number', default: '10', desc: '层级' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Overlay 遮罩层 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Overlay } from '@snui/uni';",
    chipCopy: "import { Overlay } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-overlay', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-popup', link: '/components/uni/popup' },
    next: { text: 'sn-dialog', link: '/components/uni/dialog' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
