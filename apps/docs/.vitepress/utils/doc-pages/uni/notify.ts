/**
 * Notify 消息通知（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-notify.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const notifyDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Notify 消息通知' },
  ],
  title: 'Notify 消息通知',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '填充色与文字色全部来自语义色 token（' },
    { t: 'code', s: '--sn-mp-color-action-primary' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-feedback-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-text-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: '），这些都在 ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    {
      t: 'text',
      s: ' 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-notify',
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
    fileLabel: 'Notify 消息通知.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Notify } from '@snui/uni';
</script>

<template>
  <sn-notify />
</template>`,
  },
  demos: [
    {
      name: 'notify-mp-basic',
      title: '基础用法',
      blurb: 'primary / success / warning / danger 四种类型。',
    },
    {
      name: 'notify-mp-variant',
      title: '形态与位置',
      blurb: 'floating 悬浮卡片、可关闭（不自动消失）、底部弹出。',
    },
    {
      name: 'notify-mp-style',
      title: '颜色、层级与安全区',
      blurb: '自定义底色与文字色 / safe-height=88 / zIndex=300 + custom-style。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'visible', type: 'boolean', default: 'false', desc: '是否显示（`v-model:visible`）' },
      {
        name: 'type',
        type: 'NotifyType',
        default: "'danger'",
        desc: 'Semantic type — drives the fill color and the default icon.',
      },
      {
        name: 'message',
        type: 'string | number',
        default: "''",
        desc: 'Message text; `\\n` renders as a line break.',
      },
      { name: 'duration', type: 'number', default: '3000', desc: '展示时长（ms），`0` 表示不消失' },
      { name: 'position', type: 'NotifyPosition', default: "'top'", desc: 'Anchor of the banner.' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Text color override (any CSS color value).',
      },
      {
        name: 'background',
        type: 'string',
        default: "''",
        desc: 'Background color override (any CSS color value).',
      },
      { name: 'zIndex', type: 'number', default: '99', desc: '层级' },
      { name: 'safeHeight', type: 'number | string | undefined', default: 'undefined', desc: '—' },
      { name: 'closable', type: 'boolean', default: 'false', desc: '是否显示关闭按钮' },
      {
        name: 'variant',
        type: 'NotifyVariant',
        default: "'filled'",
        desc: 'Visual shape: edge-to-edge bar or a floating rounded card.',
      },
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'Instance id used by the function API (parity only, no effect here).',
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
    copy: 'Notify 消息通知 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Notify } from '@snui/uni';",
    chipCopy: "import { Notify } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-notify', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-toast', link: '/components/uni/toast' },
    next: { text: 'sn-notice-bar', link: '/components/uni/notice-bar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
