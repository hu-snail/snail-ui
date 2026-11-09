/**
 * Curtain 幕帘（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-curtain.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const curtainDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Curtain 幕帘' },
  ],
  title: 'Curtain 幕帘',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '遮罩走 ' },
    { t: 'code', s: '--sn-mp-color-background-overlay' },
    { t: 'text', s: '，关闭按钮底色 / 描边 / 图标分别走 ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-border-default' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-text-secondary' },
    { t: 'text', s: '，全部在 ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    { t: 'text', s: ' 的 ' },
    { t: 'code', s: '.sn-theme-dark' },
    { t: 'text', s: ' 块里覆盖，因此暗色下自动适配。可用 `<sn-config-provider theme="dark"' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-curtain',
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
    fileLabel: 'Curtain 幕帘.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Curtain } from '@snui/uni';
</script>

<template>
  <sn-curtain />
</template>`,
  },
  demos: [
    { name: 'curtain-mp-basic', title: '基础用法', blurb: '默认 inset 关闭按钮，点击图片即关闭。' },
    {
      name: 'curtain-mp-close-position',
      title: '关闭按钮位置',
      blurb: 'top 与 bottom-right 两种位置，右下角带自定义阴影。',
    },
    {
      name: 'curtain-mp-behavior',
      title: '关闭行为',
      blurb: '点图片不关闭 / 点遮罩关闭 / 关闭后保留节点 + zIndex=150。',
    },
    {
      name: 'curtain-mp-custom',
      title: '自定义样式',
      blurb: '关闭按钮内联样式 + 根节点内联样式 + 长按识别菜单。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the curtain is shown (v-model).',
      },
      {
        name: 'src',
        type: 'string',
        default: "''",
        desc: 'Image URL — must be a network / package path, not a base64 blob.',
      },
      {
        name: 'width',
        type: 'number',
        default: '0',
        desc: 'Image width in design px; 0 = fit the screen width.',
      },
      {
        name: 'to',
        type: 'string',
        default: "''",
        desc: 'Page path to open when the image is tapped.',
      },
      {
        name: 'closePosition',
        type: 'CurtainClosePosition',
        default: "'inset'",
        desc: 'Where the close button sits.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'false',
        desc: 'Close the curtain when the scrim is tapped.',
      },
      {
        name: 'closeOnClick',
        type: 'boolean',
        default: 'true',
        desc: 'Close the curtain when the image is tapped.',
      },
      {
        name: 'hideWhenClose',
        type: 'boolean',
        default: 'true',
        desc: 'Remove the node from the tree once the leave animation finished.',
      },
      { name: 'zIndex', type: 'number', default: '10', desc: '层级' },
      {
        name: 'customCloseClass',
        type: 'string',
        default: "''",
        desc: 'Extra class on the close button.',
      },
      {
        name: 'customCloseStyle',
        type: 'string',
        default: "''",
        desc: 'Extra inline style on the close button.',
      },
      {
        name: 'showMenuByLongpress',
        type: 'boolean',
        default: 'false',
        desc: 'Show the WeChat long-press menu on the image (WeChat only).',
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
        desc: "Accepted for `wd-curtain` parity, NOT implemented — miniprogram has no portal host, so the curtain cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Curtain 幕帘 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Curtain } from '@snui/uni';",
    chipCopy: "import { Curtain } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-curtain', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-paging', link: '/components/uni/paging' },
    next: { text: 'sn-swipe-action', link: '/components/uni/swipe-action' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
