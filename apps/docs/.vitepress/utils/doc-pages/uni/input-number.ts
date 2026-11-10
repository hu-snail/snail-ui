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
      name: 'input-number-mp-theme',
      title: '主题（theme）',
      blurb: 'default / outline / outline-split / primary 四种主题。',
    },
    {
      name: 'input-number-mp-round',
      title: '圆角（round）',
      blurb: 'round 圆角胶囊。',
    },
    {
      name: 'input-number-mp-long-press',
      title: '长按连加（longPress）',
      blurb: 'longPress 按住连续加减。',
    },
    {
      name: 'input-number-mp-disabled',
      title: '禁用（disabled）',
      blurb: 'disabled 拦掉全部交互。',
    },
    {
      name: 'input-number-mp-controls',
      title:
        '按钮与输入框独立开关（`disableInput` / `disableMinus` / `disablePlus` / `withoutInput` / `inputWidth`）',
      blurb: 'disableInput / disableMinus / disablePlus；withoutInput 只留按钮；inputWidth。',
    },
    {
      name: 'input-number-mp-step-strictly',
      title: '步进吸附（stepStrictly）',
      blurb: 'stepStrictly 值吸附到步进网格。',
    },
    {
      name: 'input-number-mp-allow-null',
      title: '可空输入（allowNull）',
      blurb: 'allowNull + placeholder：输入框可留空。',
    },
    {
      name: 'input-number-mp-before-change',
      title: '提交拦截（beforeChange）',
      blurb: 'beforeChange 拦截。',
    },
    {
      name: 'input-number-mp-commit-timing',
      title: '提交时机与输入属性',
      blurb:
        'immediateChange=false；updateOnInit；inputType；adjustPosition。',
    },
    {
      name: 'input-number-mp-custom-class',
      title: '自定义样式（`customClass` / `customStyle`）',
      blurb: 'customClass 与 customStyle 两个挂载点。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'number | string', default: '0', desc: '`0`' },
      { name: 'min', type: 'number', default: '1', desc: '最小值' },
      { name: 'max', type: 'number', default: 'Number.MAX_SAFE_INTEGER', desc: '最大值' },
      { name: 'step', type: 'number', default: '1', desc: '步进值' },
      { name: 'stepStrictly', type: 'boolean', default: 'false', desc: '是否严格按步进值对齐' },
      { name: 'precision', type: 'number | string', default: '0', desc: '`0`' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整个计数器' },
      { name: 'disableInput', type: 'boolean', default: 'false', desc: '禁用输入框（按钮仍可用）' },
      { name: 'disableMinus', type: 'boolean', default: 'false', desc: '禁用减号按钮' },
      { name: 'disablePlus', type: 'boolean', default: 'false', desc: '禁用加号按钮' },
      { name: 'withoutInput', type: 'boolean', default: 'false', desc: '不显示输入框，只保留按钮' },
      {
        name: 'inputWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '输入框宽度。',
      },
      { name: 'allowNull', type: 'boolean', default: 'false', desc: '允许值为空字符串' },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        desc: 'Placeholder shown while the field is empty.',
      },
      { name: 'adjustPosition', type: 'boolean', default: 'true', desc: '键盘弹起时自动上推页面' },
      { name: 'longPress', type: 'boolean', default: 'false', desc: '长按连续加减' },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'true',
        desc: '输入时立即提交；false 仅在失焦提交',
      },
      { name: 'updateOnInit', type: 'boolean', default: 'true', desc: '初始化时回写修正后的值' },
      {
        name: 'inputType',
        type: "'number' | 'digit'",
        default: "'digit'",
        desc: 'Native keyboard type for the field.',
      },
      { name: 'theme', type: 'InputNumberTheme', default: "'default'", desc: 'Visual theme.' },
      { name: 'round', type: 'boolean', default: 'false', desc: '圆角样式' },
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
