/**
 * Popover 气泡卡片（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-popover.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const popoverDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Popover 气泡卡片' },
  ],
  title: 'Popover 气泡卡片',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '气泡高度由内容决定：长文案在气泡最大宽度内换行、气泡向下增长，内容不会被裁切；菜单项的长文案同样换行。行内图标与关闭图标都走尺寸 token（',
    },
    { t: 'code', s: '--sn-popover-menu-icon-size' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-popover-close-icon-size' },
    { t: 'text', s: '），图标放大时行高随内容增长，不溢出。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-popover',
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
    fileLabel: 'Popover 气泡卡片.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popover } from '@snui/uni';
</script>

<template>
  <sn-popover />
</template>`,
  },
  demos: [
    {
      name: 'popover-mp-basic',
      title: '代码演示',
      blurb: 'normal 模式 + 关闭按钮；触发器切换，点击外部关闭。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the bubble is shown (v-model).',
      },
      {
        name: 'content',
        type: 'string | SnPopoverMenuItem[]',
        default: "''",
        desc: 'Bubble body: a string in `normal` mode, a list in `menu` mode.',
      },
      { name: 'mode', type: 'PopoverMode', default: "'normal'", desc: 'Bubble display mode.' },
      { name: 'placement', type: 'PopoverPlacement', default: "'bottom'", desc: 'Bubble anchor.' },
      {
        name: 'offset',
        type: 'PopoverOffset',
        default: '0',
        desc: 'Gap between trigger and bubble, in design px.',
      },
      {
        name: 'visibleArrow',
        type: 'boolean',
        default: 'true',
        desc: 'Render the arrow pointing at the trigger.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the trigger — taps are ignored and the bubble stays closed.',
      },
      {
        name: 'showClose',
        type: 'boolean',
        default: 'false',
        desc: 'Render a close button inside the bubble.',
      },
      {
        name: 'closeOnClickOutside',
        type: 'boolean',
        default: 'true',
        desc: 'Close the bubble when the user taps outside it (additive, AUI-OPT-07). The close rides the page-root `closeOutside` channel and never swallows the tap — the same gesture still lands on whatever button sits under it. Pass `false` to unregister the outside-close while mounted.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Extra class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customArrow',
        type: 'string',
        default: "''",
        desc: 'Extra class on the arrow node.',
      },
      { name: 'customPop', type: 'string', default: "''", desc: 'Extra class on the bubble node.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for `wd-popover` parity, NOT implemented — miniprogram has no portal host, so the bubble cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Popover 气泡卡片 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Popover } from '@snui/uni';",
    chipCopy: "import { Popover } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-popover', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-tooltip', link: '/components/uni/tooltip' },
    next: { text: 'sn-form', link: '/components/uni/form' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
