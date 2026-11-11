/**
 * PickerView 选择器视图（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-picker-view.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const pickerViewDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'PickerView 选择器视图' },
  ],
  title: 'PickerView 选择器视图',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'sn-picker-view 单列滚轮：columns 传字符串数组，tap 某一行即可选中。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-picker-view',
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
    fileLabel: 'PickerView 选择器视图.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { PickerView } from '@snui/uni';
</script>

<template>
  <sn-picker-view />
</template>`,
  },
  demos: [
    {
      name: 'picker-view-mp-basic',
      title: '基础用法',
      blurb: 'sn-picker-view 单列滚轮：columns 传字符串数组，tap 某一行即可选中。',
    },
    {
      name: 'picker-view-mp-cascade',
      title: '级联模式（`cascade`）',
      blurb: 'cascade 模式下 columns 传树形结构，组件按已选路径推导后续列。',
    },
    {
      name: 'picker-view-mp-disabled',
      title: '禁用（`disabled`）',
      blurb: 'disabled 整列不可交互，滚轮冻结在当前值。',
    },
    {
      name: 'picker-view-mp-rows',
      title: '滚筒几何（`itemHeight` / `visibleItemCount`）',
      blurb: 'itemHeight 调行高（px 设计值 → rpx），visibleItemCount 调可见行数。',
    },
    {
      name: 'picker-view-mp-keys',
      title: '自定义字段名（`valueKey` / `labelKey` / `childrenKey`）',
      blurb: 'valueKey / labelKey / childrenKey 让组件读取自定义字段名，业务数据不必重命名。',
    },
    {
      name: 'picker-view-mp-immediate',
      title: '拖动即时回写（`immediateChange`）',
      blurb: 'immediateChange 拖动中持续触发 change，配合事件实时联动。',
    },
    {
      name: 'picker-view-mp-custom-style',
      title: '根节点样式（`customClass` / `customStyle`）',
      blurb: 'customClass / customStyle 落在根节点上，改滚轮外框与底色。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'PickerValue[]', default: '() => []', desc: '`[]`' },
      { name: 'columns', type: 'PickerColumn[]', default: '() => []', desc: '列配置。' },
      { name: 'itemHeight', type: 'number', default: '44', desc: '单项高度（px 设计值）' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: '可见项数量' },
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
        desc: 'Option key holding the visible label.',
      },
      {
        name: 'childrenKey',
        type: 'string',
        default: "'children'",
        desc: 'Option key holding the children (cascade mode only).',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: '拖动过程中立即触发 change',
      },
      { name: 'cascade', type: 'boolean', default: 'false', desc: '把 columns 当树处理' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用滚轮' },
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
    copy: 'PickerView 选择器视图 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { PickerView } from '@snui/uni';",
    chipCopy: "import { PickerView } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-picker-view', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Picker', link: '/components/uni/picker' },
    next: { text: 'SelectPicker', link: '/components/uni/select-picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
