/**
 * FloatingPanel 浮动面板（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-floating-panel.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const floatingPanelDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'FloatingPanel 浮动面板' },
  ],
  title: 'FloatingPanel 浮动面板',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '默认锚点来自 wot-ui：' },
    { t: 'code', s: '[100, 视口高度 * 0.6]' },
    { t: 'text', s: '。小程序没有 ' },
    { t: 'code', s: 'window' },
    { t: 'text', s: '，因此默认值通过 ' },
    { t: 'code', s: 'globalThis.uni.getSystemInfoSync()' },
    { t: 'text', s: ' 取视口高度，取不到时退化为单个 ' },
    { t: 'code', s: '100' },
    { t: 'text', s: ' 锚点。显式传入 ' },
    { t: 'code', s: 'anchors' },
    { t: 'text', s: ' 时永远优先，且会被排序、过滤掉非数值与负数。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-floating-panel',
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
    fileLabel: 'FloatingPanel 浮动面板.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { FloatingPanel } from '@snui/uni';
</script>

<template>
  <sn-floating-panel />
</template>`,
  },
  demos: [
    {
      name: 'floating-panel-mp-basic',
      title: '基础用法',
      blurb: '拖动横条调整高度，两个吸附点 120 / 320，实时显示当前与吸附后高度。',
    },
    {
      name: 'floating-panel-mp-config',
      title: '受控高度 / 无动画 / 内容区不可拖',
      blurb: '按钮控制高度 + duration=0 + 内容区不可拖 + 隐藏滚动条 + 安全区。',
    },
    {
      name: 'floating-panel-mp-custom',
      title: '自定义类名与样式',
      blurb: 'custom-style 加圆角 / custom-class 加阴影，拖动横条仍可吸附。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'height',
        type: 'number',
        default: '0',
        desc: '面板高度（设计稿 px，`v-model:height`）',
      },
      {
        name: 'anchors',
        type: 'number[]',
        default: '() => []',
        desc: '吸附点（设计稿 px）；不设置时用默认 `[100, 视口高度 * 0.6]`',
      },
      {
        name: 'duration',
        type: 'number',
        default: 'DEFAULT_DURATION',
        desc: '吸附动画时长（ms）；`0` 关闭动画',
      },
      { name: 'contentDraggable', type: 'boolean', default: 'true', desc: '是否允许拖拽内容区' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'false',
        desc: '是否适配底部安全区',
      },
      { name: 'showScrollbar', type: 'boolean', default: 'true', desc: '是否显示内容区滚动条' },
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
    copy: 'FloatingPanel 浮动面板 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { FloatingPanel } from '@snui/uni';",
    chipCopy: "import { FloatingPanel } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-floating-panel', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-swipe-action', link: '/components/uni/swipe-action' },
    next: { text: 'sn-avatar', link: '/components/uni/avatar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
