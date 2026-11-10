/**
 * Popup 弹出层（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-popup.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const popupDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Popup 弹出层' },
  ],
  title: 'Popup 弹出层',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '组件的遮罩与面板分别走 ' },
    { t: 'code', s: '--sn-mp-color-background-overlay' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: '，两者都在 ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    { t: 'text', s: ' 的 ' },
    { t: 'code', s: '.sn-theme-dark' },
    {
      t: 'text',
      s: ' 块里覆盖过，因此暗色下自动适配，无需额外配置。可用 sn-config-provider 的 theme 设为 dark 包裹验证：',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-popup',
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
    fileLabel: 'Popup 弹出层.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popup } from '@snui/uni';
</script>

<template>
  <sn-popup />
</template>`,
  },
  demos: [
    { name: 'popup-mp-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'popup-mp-position', title: '弹出位置', blurb: '弹出位置' },
    { name: 'popup-mp-config', title: '遮罩与关闭行为', blurb: '遮罩与关闭行为' },
    {
      name: 'popup-mp-custom-style',
      title: '面板与遮罩样式',
      blurb: 'modal-style 写在遮罩上；custom-style 写在面板上。',
    },
    {
      name: 'popup-mp-render',
      title: '懒渲染与安全区',
      blurb: 'lazy-render=false 提前渲染；safe-area-inset-bottom 底部安全区。',
    },
    { name: 'popup-mp-scroll', title: '样式、懒渲染与安全区', blurb: '样式、懒渲染与安全区' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'boolean', default: 'false', desc: '是否显示（`v-model`）' },
      {
        name: 'transition',
        type: "PopupTransition | ''",
        default: "''",
        desc: 'Animation name; empty falls back to the default for `position`.',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        desc: "Show the close button in the panel's top-right corner.",
      },
      {
        name: 'position',
        type: 'PopupPosition',
        default: "'center'",
        desc: 'Anchor of the panel.',
      },
      { name: 'closeOnClickModal', type: 'boolean', default: 'true', desc: '点击遮罩是否关闭' },
      { name: 'duration', type: 'PopupDuration', default: 'DEFAULT_DURATION', desc: '动画时长。' },
      { name: 'modal', type: 'boolean', default: 'true', desc: '是否显示遮罩' },
      { name: 'zIndex', type: 'number', default: '10', desc: '弹层层级' },
      { name: 'hideWhenClose', type: 'boolean', default: 'true', desc: '关闭时是否移除节点' },
      { name: 'modalStyle', type: 'string', default: "''", desc: 'Inline style for the scrim.' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'false',
        desc: '底部弹层是否适配底部安全区',
      },
      { name: 'lazyRender', type: 'boolean', default: 'true', desc: '弹层内容是否懒渲染' },
      { name: 'lockScroll', type: 'boolean', default: 'true', desc: '是否锁定背景滚动' },
      { name: 'round', type: 'boolean', default: 'false', desc: '是否开启圆角（按位置自动适配）' },
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
        desc: 'Custom inline style for the panel.',
      },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Popup 弹出层 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Popup } from '@snui/uni';",
    chipCopy: "import { Popup } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-popup', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-captcha', link: '/components/uni/captcha' },
    next: { text: 'sn-overlay', link: '/components/uni/overlay' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
