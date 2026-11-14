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
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '跨 uni-app x 多端的多行文本输入控件。easycom 自动注册（' },
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
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
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
      name: 'textarea-mp-word-limit',
      title: '字数统计（`showWordLimit`）',
      blurb: 'showWordLimit + maxlength 在右下角显示计数。',
    },
    {
      name: 'textarea-mp-clearable',
      title: '可清空（`clearable`）',
      blurb: 'clearable 在右侧显示 × 一键清空。',
    },
    {
      name: 'textarea-mp-error',
      title: '错误态（`error`）',
      blurb: 'error 由表单驱动标记内容不合规。',
    },
    {
      name: 'textarea-mp-auto-height',
      title: '自动增高（`autoHeight`）',
      blurb: 'autoHeight 随内容增高。',
    },
    {
      name: 'textarea-mp-disabled-readonly',
      title: '只读与禁用（`readonly` / `disabled`）',
      blurb: 'readonly 可选中不可编辑；disabled 整体锁掉。',
    },
    {
      name: 'textarea-mp-compact',
      title: '紧凑模式（`compact`）',
      blurb: 'compact 无边框、无背景，用于表单行内。',
    },
    {
      name: 'textarea-mp-prefix-icon',
      title: '前置图标（`prefixIcon`）',
      blurb: 'prefixIcon 走 registry；iconPrefix + cssIcon 直接当 CSS 类名。',
    },
    {
      name: 'textarea-mp-placeholder',
      title: '占位符样式',
      blurb: 'placeholderStyle 内联声明 + placeholderClass 类名，只作用于占位文本。',
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
        desc: 'Class applied to the placeholder pseudo-element (uni-app x MP).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: '禁用，原生 `disabled` + 阻断事件。',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: '只读，可见不可编辑，阻断事件。',
      },
      { name: 'maxlength', type: 'number', default: '-1', desc: '最大长度，`-1` 不限制。' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '显示 × 清空按钮。' },
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
        desc: '是否按 CSS 图标处理。',
      },
      {
        name: 'showWordLimit',
        type: 'boolean',
        default: 'false',
        desc: '显示字数统计，需 `maxlength > 0`。',
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
        desc: '清空后自动聚焦（uni 端为占位实现，软键盘已收起）。',
      },
      {
        name: 'error',
        type: 'boolean',
        default: 'false',
        desc: '错误态（红边框 + `aria-invalid`）。',
      },
      { name: 'focus', type: 'boolean', default: 'false', desc: '挂载即聚焦。' },
      { name: 'autoFocus', type: 'boolean', default: 'false', desc: '自动聚焦并拉起键盘。' },
      { name: 'autoHeight', type: 'boolean', default: 'false', desc: '高度随内容增长。' },
      {
        name: 'fixed',
        type: 'boolean',
        default: 'false',
        desc: '`position: fixed` 区域下的固定模式。',
      },
      { name: 'cursorSpacing', type: 'number', default: '0', desc: '光标与键盘距离（px）。' },
      { name: 'cursor', type: 'number', default: '-1', desc: '初始光标位置，`-1` 表示不设置。' },
      {
        name: 'confirmType',
        type: "'send' | 'search' | 'next' | 'go' | 'done' | undefined",
        default: 'undefined',
        desc: 'Soft-keyboard confirm button label.',
      },
      { name: 'confirmHold', type: 'boolean', default: 'false', desc: '点确认键时保持键盘。' },
      {
        name: 'showConfirmBar',
        type: 'boolean',
        default: 'true',
        desc: '键盘上方「完成」工具栏。',
      },
      { name: 'selectionStart', type: 'number', default: '-1', desc: '选区起点。' },
      { name: 'selectionEnd', type: 'number', default: '-1', desc: '选区终点。' },
      {
        name: 'adjustPosition',
        type: 'boolean',
        default: 'true',
        desc: '键盘弹起时自动上推页面。',
      },
      {
        name: 'disableDefaultPadding',
        type: 'boolean',
        default: 'false',
        desc: '去掉 iOS 默认内边距。',
      },
      { name: 'holdKeyboard', type: 'boolean', default: 'false', desc: '聚焦时点击页面保持键盘。' },
      {
        name: 'ignoreCompositionEvent',
        type: 'boolean',
        default: 'true',
        desc: '`false` 时合成期间也触发 `input`。',
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
        desc: '支付宝小程序启用原生输入框。',
      },
      {
        name: 'compact',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: '紧凑模式（未显式设置时由 sn-form-item 决定）。',
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
    prev: { text: 'Input', link: '/components/uni/input' },
    next: { text: 'CodeInput', link: '/components/uni/code-input' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
