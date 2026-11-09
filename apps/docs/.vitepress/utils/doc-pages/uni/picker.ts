/**
 * Picker 选择器（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-picker.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const pickerDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Picker 选择器' }],
  title: 'Picker 选择器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-picker 弹层选择器：v-model:visible 控制显隐，滚动只改草稿，确认才写 v-model。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-picker',
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
    fileLabel: 'Picker 选择器.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Picker } from '@snui/uni';
</script>

<template>
  <sn-picker />
</template>`,
  },
  demos: [
    {
      name: 'picker-mp-basic',
      title: '基础用法',
      blurb: 'sn-picker 弹层选择器：v-model:visible 控制显隐，滚动只改草稿，确认才写 v-model。',
    },
    {
      name: 'picker-mp-cascade-confirm',
      title: '级联与确认校验（`cascade` / `beforeConfirm`）',
      blurb:
        'cascade 让 columns 变成树，确认时返回完整路径；beforeConfirm 返回 false 时弹层不关闭、v-model 不写。',
    },
    {
      name: 'picker-mp-fields',
      title: '字段映射与按钮文案（`valueKey` / `labelKey` / `childrenKey` / `cancelButtonText`）',
      blurb: 'valueKey / labelKey / childrenKey 字段映射；cancelButtonText；confirmButtonText。',
    },
    {
      name: 'picker-mp-rows-sheet',
      title:
        '滚筒几何与弹层（`itemHeight` / `visibleItemCount` / `immediateChange` / 遮罩层级 / `custom*`）',
      blurb:
        'itemHeight / visibleItemCount；immediateChange；closeOnClickModal=false；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle / customViewClass。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'PickerValue[]',
        default: '() => []',
        desc: 'Confirmed value per column (`v-model`).',
      },
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Sheet visibility (`v-model:visible`).',
      },
      {
        name: 'columns',
        type: 'PickerColumn[]',
        default: '() => []',
        desc: 'Columns, or the option tree when `cascade` is set.',
      },
      {
        name: 'cascade',
        type: 'boolean',
        default: 'false',
        desc: 'Treat `columns` as a nested option tree.',
      },
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Toolbar title. Empty = no title row.',
      },
      { name: 'cancelButtonText', type: 'string', default: "'取消'", desc: 'Cancel button label.' },
      {
        name: 'confirmButtonText',
        type: 'string',
        default: "'确认'",
        desc: 'Confirm button label.',
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
        name: 'childrenKey',
        type: 'string',
        default: "'children'",
        desc: 'Option key holding the children (cascade mode).',
      },
      { name: 'itemHeight', type: 'number', default: '44', desc: 'Row height in px design units.' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: 'Number of visible rows.' },
      { name: 'value', type: 'PickerValue[]', default: '—', desc: 'value' },
      {
        name: 'selectedItems',
        type: 'Array<PickerOption | PickerValue>',
        default: '—',
        desc: 'selectedItems',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the mask closes the sheet.',
      },
      { name: 'zIndex', type: 'number', default: '15', desc: '弹层层级' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the sheet for the device safe area.',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Write `v-model` on every roll instead of only on confirm.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the sheet.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow.",
      },
      {
        name: 'customViewClass',
        type: 'string',
        default: "''",
        desc: 'Class forwarded to the roller body.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Picker 选择器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Picker } from '@snui/uni';",
    chipCopy: "import { Picker } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-picker', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-slider', link: '/components/uni/slider' },
    next: { text: 'sn-picker-view', link: '/components/uni/picker-view' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
