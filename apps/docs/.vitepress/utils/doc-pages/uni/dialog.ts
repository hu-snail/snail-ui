/**
 * Dialog 弹框（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-dialog.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dialogDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Dialog 弹框' }],
  title: 'Dialog 弹框',
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
    { t: 'code', s: '--sn-mp-color-feedback-*' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-dialog',
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
    fileLabel: 'Dialog 弹框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Dialog } from '@snui/uni';
</script>

<template>
  <sn-dialog />
</template>`,
  },
  demos: [
    {
      name: 'dialog-mp-basic',
      title: '基础用法',
      blurb: 'alert / confirm / prompt 三种形态，prompt 带长度校验。',
    },
    {
      name: 'dialog-mp-variant',
      title: '形态与图标',
      blurb: '成功 / 警告图标、text 主题按钮、竖排按钮。',
    },
    {
      name: 'dialog-mp-actions',
      title: '自定义操作与拦截',
      blurb: '自定义 actions 行（含禁用项）与 beforeConfirm 拦截。',
    },
    {
      name: 'dialog-mp-custom',
      title: '自定义面板样式',
      blurb: 'custom-style 追加内边距与最小宽度；selector / root-portal 为对齐声明。',
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
        desc: 'Whether the dialog is visible (v-model). Component-form counterpart of `useDialog().show()`.',
      },
      { name: 'title', type: 'string', default: "''", desc: 'Title text.' },
      { name: 'msg', type: 'string', default: "''", desc: 'Message body text.' },
      {
        name: 'type',
        type: 'DialogType',
        default: "'alert'",
        desc: 'Dialog flavour: `alert` (one button), `confirm` (two), `prompt` (two + input).',
      },
      {
        name: 'theme',
        type: 'DialogTheme',
        default: "'button'",
        desc: 'Button style: filled buttons or borderless text buttons.',
      },
      { name: 'zIndex', type: 'number', default: '99', desc: 'Stacking level of the dialog.' },
      {
        name: 'lazyRender',
        type: 'boolean',
        default: 'true',
        desc: 'Defer body rendering until the dialog is first opened.',
      },
      {
        name: 'headerImage',
        type: 'string',
        default: "''",
        desc: 'Full-width image above the body.',
      },
      {
        name: 'icon',
        type: 'string',
        default: "''",
        desc: 'Status icon: `success` / `info` / `warning` / `danger`, or a registry icon name.',
      },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: 'Status icon color (any CSS color value).',
      },
      {
        name: 'iconProps',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'Props forwarded to the inner sn-icon.',
      },
      {
        name: 'inputValue',
        type: 'string | number',
        default: "''",
        desc: 'Initial value of the prompt input.',
      },
      {
        name: 'inputProps',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'Props forwarded to the inner sn-input (prompt mode).',
      },
      {
        name: 'textareaProps',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'When non-empty, prompt mode renders sn-textarea instead of sn-input.',
      },
      {
        name: 'inputPattern',
        type: 'RegExp | undefined',
        default: 'undefined',
        desc: 'Regexp the prompt value must match.',
      },
      {
        name: 'inputError',
        type: 'string',
        default: "''",
        desc: 'Fallback message shown when prompt validation fails.',
      },
      {
        name: 'showErr',
        type: 'boolean',
        default: 'false',
        desc: 'Show the validation message under the input.',
      },
      {
        name: 'actionLayout',
        type: 'DialogActionLayout',
        default: "'horizontal'",
        desc: 'Action button arrangement.',
      },
      {
        name: 'showCancelButton',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Show the cancel button. Defaults to `false` for `alert`, `true` otherwise.',
      },
      { name: 'confirmButtonText', type: 'string', default: "''", desc: 'Confirm button label.' },
      { name: 'cancelButtonText', type: 'string', default: "''", desc: 'Cancel button label.' },
      {
        name: 'confirmButtonProps',
        type: 'DialogButtonOption',
        default: '() => ({})',
        desc: 'Confirm button option (label / extra props / `null` to hide).',
      },
      {
        name: 'cancelButtonProps',
        type: 'DialogButtonOption | undefined',
        default: 'undefined',
        desc: 'Cancel button option (label / extra props / `null` to hide).',
      },
      {
        name: 'actions',
        type: 'DialogAction[]',
        default: '() => []',
        desc: 'Custom action rows; when set they replace the confirm / cancel buttons.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'false',
        desc: 'Close when the scrim is tapped.',
      },
      {
        name: 'showClose',
        type: 'boolean',
        default: 'false',
        desc: 'Show the close button in the top-right corner.',
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
    copy: 'Dialog 弹框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Dialog } from '@snui/uni';",
    chipCopy: "import { Dialog } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-dialog', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-overlay', link: '/components/uni/overlay' },
    next: { text: 'sn-action-sheet', link: '/components/uni/action-sheet' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
