/**
 * InputNumber 计数器（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-input-number.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const inputNumberDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'InputNumber 计数器' },
  ],
  title: 'InputNumber 计数器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'sn-input-number 基础计数器：min / max 边界、step 步进、precision 精度。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-input-number',
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
    fileLabel: 'InputNumber 计数器.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { InputNumber } from '@snui/uni';
</script>

<template>
  <sn-input-number />
</template>`,
  },
  demos: [
    {
      name: 'input-number-mp-basic',
      title: '基础用法',
      blurb: 'sn-input-number 基础计数器：min / max 边界、step 步进、precision 精度。',
    },
    {
      name: 'input-number-mp-theme-state',
      title: '主题与状态（`theme` / `round` / `disabled` / `longPress`）',
      blurb:
        'default / outline / outline-split / primary 四种主题；round 圆角；disabled 拦掉全部交互；longPress 按住连续加减。',
    },
    {
      name: 'input-number-mp-controls',
      title:
        '按钮与输入框独立开关（`disableInput` / `disableMinus` / `disablePlus` / `withoutInput` / `inputWidth`）',
      blurb: 'disableInput / disableMinus / disablePlus；withoutInput 只留按钮；inputWidth。',
    },
    {
      name: 'input-number-mp-commit-hooks',
      title:
        '取值规则与提交时机（`stepStrictly` / `allowNull` / `placeholder` / `beforeChange` / `immediateChange` / `updateOnInit` / `inputType` / `adjustPosition` / `custom*`）',
      blurb:
        'stepStrictly；allowNull + placeholder；beforeChange 拦截；immediateChange=false；updateOnInit；inputType；adjustPosition。',
    },
    {
      name: 'input-number-mp-custom-class',
      title: '自定义样式（`customClass` / `customStyle`）',
      blurb: 'customClass 与 customStyle 两个挂载点。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | string',
        default: '0',
        desc: 'Bound value (`v-model`).',
      },
      { name: 'min', type: 'number', default: '1', desc: 'Lower bound.' },
      { name: 'max', type: 'number', default: 'Number.MAX_SAFE_INTEGER', desc: 'Upper bound.' },
      { name: 'step', type: 'number', default: '1', desc: 'Increment / decrement step.' },
      {
        name: 'stepStrictly',
        type: 'boolean',
        default: 'false',
        desc: 'Snap every committed value onto the `step` grid.',
      },
      {
        name: 'precision',
        type: 'number | string',
        default: '0',
        desc: 'Decimal places kept after every commit.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables the whole stepper.' },
      {
        name: 'disableInput',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the editable field only (buttons stay live).',
      },
      {
        name: 'disableMinus',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the minus button only.',
      },
      {
        name: 'disablePlus',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the plus button only.',
      },
      {
        name: 'withoutInput',
        type: 'boolean',
        default: 'false',
        desc: 'Hide the field — buttons only.',
      },
      {
        name: 'inputWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Field width. A number is treated as an rpx design value.',
      },
      {
        name: 'allowNull',
        type: 'boolean',
        default: 'false',
        desc: 'Allow the field to hold an empty string.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        desc: 'Placeholder shown while the field is empty.',
      },
      {
        name: 'adjustPosition',
        type: 'boolean',
        default: 'true',
        desc: 'Auto-scroll the page when the soft keyboard covers the field.',
      },
      {
        name: 'longPress',
        type: 'boolean',
        default: 'false',
        desc: 'Repeat the step while the button is held down.',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'true',
        desc: 'Emit while typing; `false` commits on blur / button only.',
      },
      {
        name: 'updateOnInit',
        type: 'boolean',
        default: 'true',
        desc: 'Emit a corrected value on mount (clamped / snapped / rounded).',
      },
      {
        name: 'inputType',
        type: "'number' | 'digit'",
        default: "'digit'",
        desc: 'Native keyboard type for the field.',
      },
      { name: 'theme', type: 'InputNumberTheme', default: "'default'", desc: 'Visual theme.' },
      { name: 'round', type: 'boolean', default: 'false', desc: 'Fully rounded action buttons.' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'InputNumber 计数器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { InputNumber } from '@snui/uni';",
    chipCopy: "import { InputNumber } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-input-number', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-plate-input', link: '/components/uni/plate-input' },
    next: { text: 'sn-search', link: '/components/uni/search' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
