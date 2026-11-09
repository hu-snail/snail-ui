/**
 * Textarea 文本域（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-textarea.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const textareaDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Textarea 文本域' }],
  title: 'Textarea 文本域',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '跨 uni-app 多端的多行文本输入控件。easycom 自动注册（' },
    { t: 'code', s: 'components/sn-textarea/sn-textarea.vue' },
    { t: 'text', s: ' → ' },
    { t: 'code', s: '<sn-textarea>' },
    { t: 'text', s: '），几何值使用 ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: '，颜色全部走 ' },
    { t: 'code', s: '--sn-mp-*' },
    { t: 'text', s: ' token。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-textarea',
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
    fileLabel: 'Textarea 文本域.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Textarea } from '@snui/uni';
</script>

<template>
  <sn-textarea />
</template>`,
  },
  demos: [
    { name: 'textarea-mp-basic', title: '基础用法', blurb: 'v-model 双向绑定 + placeholder。' },
    {
      name: 'textarea-mp-counter-clear',
      title: '字数统计与清空（`showWordLimit` / `clearable`）',
      blurb: 'showWordLimit + maxlength 计数；clearable 清空；error 错误态。',
    },
    {
      name: 'textarea-mp-states',
      title: '状态（`autoHeight` / `readonly` / `disabled` / `compact`）',
      blurb: 'autoHeight / readonly / disabled / compact。',
    },
    {
      name: 'textarea-mp-prefix-icon',
      title:
        '前置图标与占位符（`prefixIcon` / `iconPrefix` / `cssIcon` / `placeholderStyle` / `placeholderClass`）',
      blurb:
        'prefixIcon 走 registry；iconPrefix + cssIcon 走 CSS 类；placeholderStyle / placeholderClass 定制占位符。',
    },
    {
      name: 'textarea-mp-clear-trigger',
      title: '清空时机（`clearTrigger` / `focusWhenClear`）',
      blurb: 'clearTrigger: always / focus 控制 × 显示时机；focusWhenClear 控制清空后回焦。',
    },
    {
      name: 'textarea-mp-mp-runtime',
      title: '小程序原生属性（MP-only）',
      blurb:
        'focus / autoFocus / fixed / cursor / selection-* / cursorSpacing / adjustPosition / disableDefaultPadding / holdKeyboard / confirmType / confirmHold / showConfirmBar / ignoreCompositionEvent / enableNative / inputmode。',
    },
    {
      name: 'textarea-mp-custom-class',
      title: '自定义样式挂载点（`customClass` / `customStyle` / `customTextareaClass`）',
      blurb: 'customClass + customStyle 挂根节点；customTextareaClass 挂内层 textarea。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number',
        default: "''",
        desc: 'Bound value (v-model). Numbers are rendered as their string form.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'请输入...'",
        desc: 'Placeholder text. wd-textarea defaults to `请输入...`.',
      },
      {
        name: 'placeholderStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style declarations for the placeholder pseudo-element.',
      },
      {
        name: 'placeholderClass',
        type: 'string',
        default: "''",
        desc: 'Class applied to the placeholder pseudo-element (uni-app MP).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction. Native `disabled` attribute is set.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — value is visible but not editable.',
      },
      {
        name: 'maxlength',
        type: 'number',
        default: '-1',
        desc: 'Max character length. `-1` means unlimited (wd-textarea default).',
      },
      { name: 'clearable', type: 'boolean', default: 'false', desc: 'Show the × clear button.' },
      {
        name: 'prefixIcon',
        type: 'string',
        default: "''",
        desc: 'Front icon name, resolved through the sn-icon registry.',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: 'Front icon CSS class (bypasses the sn-icon registry).',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `prefixIcon` is treated as a CSS class name.',
      },
      {
        name: 'showWordLimit',
        type: 'boolean',
        default: 'false',
        desc: 'Show the running `current / max` counter. Requires `maxlength`.',
      },
      {
        name: 'clearTrigger',
        type: "'always' | 'focus'",
        default: "'always'",
        desc: 'When the clear button is shown: `always` or only while focused.',
      },
      {
        name: 'focusWhenClear',
        type: 'boolean',
        default: 'true',
        desc: 'Refocus the field after the clear button is tapped.',
      },
      {
        name: 'error',
        type: 'boolean',
        default: 'false',
        desc: 'Error state — red border + `aria-invalid`.',
      },
      { name: 'focus', type: 'boolean', default: 'false', desc: 'Focus the field on mount.' },
      {
        name: 'autoFocus',
        type: 'boolean',
        default: 'false',
        desc: 'Auto-focus + raise the soft keyboard on mount.',
      },
      {
        name: 'autoHeight',
        type: 'boolean',
        default: 'false',
        desc: 'Grow the field height with its content.',
      },
      {
        name: 'fixed',
        type: 'boolean',
        default: 'false',
        desc: 'Fixed-position mode — prevents the field from being pushed by the keyboard.',
      },
      {
        name: 'cursorSpacing',
        type: 'number',
        default: '0',
        desc: 'Distance kept between the caret and the soft keyboard (px).',
      },
      {
        name: 'cursor',
        type: 'number',
        default: '-1',
        desc: 'Initial caret position. `-1` means "unset".',
      },
      {
        name: 'confirmType',
        type: "'send' | 'search' | 'next' | 'go' | 'done' | undefined",
        default: 'undefined',
        desc: 'Soft-keyboard confirm button label.',
      },
      {
        name: 'confirmHold',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the keyboard up when the confirm button is tapped.',
      },
      {
        name: 'showConfirmBar',
        type: 'boolean',
        default: 'true',
        desc: 'Show the "完成" toolbar above the soft keyboard.',
      },
      {
        name: 'selectionStart',
        type: 'number',
        default: '-1',
        desc: 'Initial selection range start. Pairs with `selectionEnd`.',
      },
      {
        name: 'selectionEnd',
        type: 'number',
        default: '-1',
        desc: 'Initial selection range end. Pairs with `selectionStart`.',
      },
      {
        name: 'adjustPosition',
        type: 'boolean',
        default: 'true',
        desc: 'Auto-scroll the page when the keyboard covers the field.',
      },
      {
        name: 'disableDefaultPadding',
        type: 'boolean',
        default: 'false',
        desc: 'Drop the iOS default inner padding.',
      },
      {
        name: 'holdKeyboard',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the keyboard up when the page is tapped while focused.',
      },
      {
        name: 'ignoreCompositionEvent',
        type: 'boolean',
        default: 'true',
        desc: 'Ignore composition events; `false` emits `input` mid-composition.',
      },
      {
        name: 'inputmode',
        type: "'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'",
        default: "'text'",
        desc: 'Soft-keyboard type hint.',
      },
      {
        name: 'enableNative',
        type: 'boolean',
        default: 'true',
        desc: 'Alipay MP: use the native textarea (avoids the keyboard push-up jump).',
      },
      {
        name: 'compact',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Compact layout — strips the default padding / background so the field nests inside a form row. `undefined` lets `sn-form-item` decide.',
      },
      {
        name: 'customTextareaClass',
        type: 'string',
        default: "''",
        desc: 'Class on the inner native `<textarea>`.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Textarea 文本域 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Textarea } from '@snui/uni';",
    chipCopy: "import { Textarea } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-textarea', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-input', link: '/components/uni/input' },
    next: { text: 'sn-code-input', link: '/components/uni/code-input' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
