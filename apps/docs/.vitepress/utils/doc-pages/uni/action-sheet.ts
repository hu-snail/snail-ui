/**
 * ActionSheet 动作面板（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-action-sheet.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const actionSheetDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'ActionSheet 动作面板' },
  ],
  title: 'ActionSheet 动作面板',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '面板背景、文字与状态色全部来自语义色 token（' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-text-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-border-subtle' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-action-sheet',
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
    fileLabel: 'ActionSheet 动作面板.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ActionSheet } from '@snui/uni';
</script>

<template>
  <sn-action-sheet />
</template>`,
  },
  demos: [
    {
      name: 'action-sheet-mp-basic',
      title: '基础用法',
      blurb: '列表行 + 取消按钮，含一个禁用项。',
    },
    {
      name: 'action-sheet-mp-header',
      title: '标题、描述与关闭按钮',
      blurb: '标题 + 描述 + 关闭按钮 + 带图标的列表行。',
    },
    {
      name: 'action-sheet-mp-panels',
      title: '宫格面板',
      blurb: '单行宫格与多行宫格，图标来自 sn-icon 注册表。',
    },
    {
      name: 'action-sheet-mp-behavior',
      title: '关闭行为与动画',
      blurb: '选完不关闭 / 点遮罩不关闭 / duration=600 + zIndex=200。',
    },
    {
      name: 'action-sheet-mp-custom',
      title: '自定义样式与渲染时机',
      blurb: '标题类名 + 面板内联样式 + 提前渲染 + 关闭安全区。',
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
        desc: 'Whether the sheet is visible (v-model).',
      },
      { name: 'actions', type: 'SnActionSheetAction[]', default: '() => []', desc: 'List rows.' },
      {
        name: 'panels',
        type: 'Array<SnActionSheetPanel | SnActionSheetPanel[]>',
        default: '() => []',
        desc: 'Grid cells; a nested array is treated as multiple rows.',
      },
      { name: 'title', type: 'string', default: "''", desc: 'Title text above the list.' },
      {
        name: 'description',
        type: 'string',
        default: "''",
        desc: 'Intro text shown under the title (AUI-additive).',
      },
      {
        name: 'cancelText',
        type: 'string',
        default: "''",
        desc: 'Cancel button label. An empty string hides the cancel button.',
      },
      {
        name: 'showClose',
        type: 'boolean',
        default: 'false',
        desc: 'Show the close button in the title row (AUI-additive).',
      },
      {
        name: 'closeOnClickAction',
        type: 'boolean',
        default: 'true',
        desc: 'Close the sheet after a row / cell is selected.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Close the sheet when the scrim is tapped.',
      },
      { name: 'duration', type: 'number', default: '200', desc: 'Animation duration in ms.' },
      { name: 'zIndex', type: 'number', default: '10', desc: 'Stacking level of the sheet.' },
      {
        name: 'lazyRender',
        type: 'boolean',
        default: 'true',
        desc: 'Defer panel content rendering until the sheet is first opened.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the bottom sheet for the device safe area.',
      },
      {
        name: 'customTitleClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the title area.',
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
    copy: 'ActionSheet 动作面板 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { ActionSheet } from '@snui/uni';",
    chipCopy: "import { ActionSheet } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-action-sheet', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-dialog', link: '/components/uni/dialog' },
    next: { text: 'sn-loading', link: '/components/uni/loading' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
