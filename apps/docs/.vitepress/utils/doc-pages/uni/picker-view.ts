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
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
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
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
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
      title: '级联与禁用（`cascade` / `disabled` / `valueKey`）',
      blurb: 'cascade 模式下 columns 传树形结构，组件按已选路径推导后续列；disabled 整列不可交互。',
    },
    {
      name: 'picker-view-mp-keys-geometry',
      title:
        '几何与自定义字段名（`itemHeight` / `visibleItemCount` / `valueKey` / `labelKey` / `childrenKey`）',
      blurb:
        'itemHeight / visibleItemCount 调行高与可见行数；valueKey / labelKey / childrenKey 读取自定义字段名。',
    },
    {
      name: 'picker-view-mp-immediate-custom',
      title: '拖动即时回写与根节点样式（`immediateChange` / `customClass` / `customStyle`）',
      blurb:
        'immediateChange 拖动中持续触发 change；customClass / customStyle 改根节点外框与底色。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'PickerValue[]',
        default: '() => []',
        desc: 'Selected value per column (`v-model`).',
      },
      {
        name: 'columns',
        type: 'PickerColumn[]',
        default: '() => []',
        desc: 'Columns. Each entry is a column of primitives / option objects. In `cascade` mode pass the option *tree* here instead: the component derives the visible columns from the selected path.',
      },
      {
        name: 'itemHeight',
        type: 'number',
        default: '44',
        desc: 'Row height in px design units (converted to rpx for layout).',
      },
      {
        name: 'visibleItemCount',
        type: 'number',
        default: '6',
        desc: 'Number of visible rows; must be odd so a row can sit in the middle.',
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
        desc: 'Emit `change` while dragging instead of only on release.',
      },
      {
        name: 'cascade',
        type: 'boolean',
        default: 'false',
        desc: 'Treat `columns` as a nested option tree.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables the whole roller.' },
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
    prev: { text: 'sn-picker', link: '/components/uni/picker' },
    next: { text: 'sn-select-picker', link: '/components/uni/select-picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
