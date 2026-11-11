/**
 * SelectPicker 单复选选择器（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-select-picker.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const selectPickerDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'SelectPicker 单复选选择器' },
  ],
  title: 'SelectPicker 单复选选择器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'checkbox 类型用数组 v-model；min / max 限制可选数量；tap 行即切换。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-select-picker',
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
    fileLabel: 'SelectPicker 单复选选择器.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SelectPicker } from '@snui/uni';
</script>

<template>
  <sn-select-picker />
</template>`,
  },
  demos: [
    {
      name: 'select-picker-mp-basic',
      title: '基础用法',
      blurb: 'checkbox 类型用数组 v-model；min / max 限制可选数量；tap 行即切换。',
    },
    {
      name: 'select-picker-mp-type-radio',
      title: '单选模式（`type=radio`）',
      blurb: 'type=radio 写回标量（不是数组）。',
    },
    {
      name: 'select-picker-mp-filterable',
      title: '可搜索（`filterable`）',
      blurb: 'filterable 打开搜索框按 label 过滤，filterPlaceholder 自定占位文案。',
    },
    {
      name: 'select-picker-mp-fields',
      title: '字段映射（`valueKey` / `labelKey`）',
      blurb: 'valueKey / labelKey 让组件读取自定义字段名。',
    },
    {
      name: 'select-picker-mp-chip-size',
      title: 'chip 尺寸与确认（`selectSize` / `showConfirm`）',
      blurb:
        'selectSize 控制 chip 尺寸档位；showConfirm=false 隐藏确认按钮；confirmButtonText 覆盖文案。',
    },
    {
      name: 'select-picker-mp-checked-color',
      title: '选中色（`checkedColor`）',
      blurb: 'checkedColor 覆盖选中行的勾选色。',
    },
    {
      name: 'select-picker-mp-loading',
      title: '加载态（`loading`）',
      blurb: 'loading 显示选项列表加载中，loadingColor 覆盖 spinner 颜色。',
    },
    {
      name: 'select-picker-mp-before-confirm',
      title: '确认拦截（`beforeConfirm`）',
      blurb: 'beforeConfirm 返回 false 时不写 v-model。',
    },
    {
      name: 'select-picker-mp-sheet',
      title: '弹层行为与样式',
      blurb:
        'closeOnClickModal；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle。',
    },
    {
      name: 'select-picker-mp-scroll-into-view',
      title: '滚动定位（`scrollIntoView`）',
      blurb: 'scrollIntoView 打开时把选中行滚进视野；customContentClass 定制内容区。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SelectValue | SelectValue[] | undefined',
        default: 'undefined',
        desc: '绑定值。',
      },
      { name: 'visible', type: 'boolean', default: 'false', desc: '弹层显隐' },
      { name: 'title', type: 'string', default: "'选择器'", desc: 'Toolbar title.' },
      {
        name: 'checkedColor',
        type: 'string',
        default: "''",
        desc: 'Checked accent color (CSS color). Empty = token default.',
      },
      {
        name: 'selectSize',
        type: "'mini' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Chip size preset — mirrors wot-ui `select-size`.',
      },
      { name: 'min', type: 'number', default: '0', desc: '最少必选数量（`0` 表示不限制）。' },
      { name: 'max', type: 'number', default: '0', desc: '最多可选数量（`0` 表示不限制）。' },
      {
        name: 'type',
        type: "'checkbox' | 'radio'",
        default: "'checkbox'",
        desc: 'Selection type.',
      },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Option key holding the value.',
      },
      {
        name: 'labelKey',
        type: 'string',
        default: "'label'",
        desc: 'Option key holding the label.',
      },
      {
        name: 'confirmButtonText',
        type: 'string',
        default: "'确认'",
        desc: 'Confirm button label.',
      },
      { name: 'loading', type: 'boolean', default: 'false', desc: '选项列表的加载状态。' },
      {
        name: 'loadingColor',
        type: 'string',
        default: "''",
        desc: 'Loading spinner color (CSS color).',
      },
      { name: 'closeOnClickModal', type: 'boolean', default: 'true', desc: '点击遮罩关闭' },
      { name: 'columns', type: 'SelectOption[]', default: '() => []', desc: '选项列表' },
      { name: 'zIndex', type: 'number', default: '15', desc: '层级。' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: '为设备安全区留出内边距。',
      },
      { name: 'filterable', type: 'boolean', default: 'false', desc: '渲染搜索输入框。' },
      {
        name: 'filterPlaceholder',
        type: 'string',
        default: "'搜索'",
        desc: 'Search field placeholder.',
      },
      { name: 'scrollIntoView', type: 'boolean', default: 'true', desc: '打开时滚动到已选行' },
      {
        name: 'customContentClass',
        type: 'string',
        default: "''",
        desc: 'Class on the option content wrapper.',
      },
      { name: 'showConfirm', type: 'boolean', default: 'true', desc: '是否渲染确认按钮' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
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
    copy: 'SelectPicker 单复选选择器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { SelectPicker } from '@snui/uni';",
    chipCopy: "import { SelectPicker } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-select-picker', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'PickerView', link: '/components/uni/picker-view' },
    next: { text: 'Cascader', link: '/components/uni/cascader' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
