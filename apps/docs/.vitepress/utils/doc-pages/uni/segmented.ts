/**
 * Segmented 分段器（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-segmented.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const segmentedDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Segmented 分段器' },
  ],
  title: 'Segmented 分段器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '**prop 名对齐了，事件名没有**：' },
    { t: 'code', s: 'value' },
    { t: 'text', s: ' 别名接受 wot-ui 的写法，但组件只 emit ' },
    { t: 'code', s: 'update:modelValue' },
    { t: 'text', s: '，wot-ui 风格的 ' },
    { t: 'code', s: '@update:value' },
    {
      t: 'text',
      s: ' 永远不会被调用 —— 标签会切换（组件内部状态），父组件的 ref 不会更新。迁移时把 ',
    },
    { t: 'code', s: '@update:value' },
    { t: 'text', s: ' 改成 ' },
    { t: 'code', s: '@update:model-value' },
    { t: 'text', s: '（或直接用 ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: '）。' },
    { t: 'code', s: 'customClass' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'customStyle' },
    { t: 'text', s: ' 都落在根节点，后者会覆盖组件自己的底色 / 圆角。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-segmented',
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
    fileLabel: 'Segmented 分段器.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Segmented } from '@snui/uni';
</script>

<template>
  <sn-segmented />
</template>`,
  },
  demos: [
    {
      name: 'segmented-mp-basic',
      title: '基础用法',
      blurb: 'v-model 绑定选中值；options 传字符串数组，标签自动取 String(value)。',
    },
    {
      name: 'segmented-mp-theme',
      title: '主题（theme）',
      blurb: 'theme=outline 轮廓风格；对象选项自定义 label。',
    },
    {
      name: 'segmented-mp-disabled',
      title: '禁用（disabled）',
      blurb: 'item 级 disabled 禁用单个选项；整控 disabled 禁用整个分段器。',
    },
    {
      name: 'segmented-mp-value',
      title: 'value 别名（wot-ui 迁移）',
      blurb: '`:value` 别名 + `@update:model-value` 展开写法；value 优先于 model-value。',
    },
    {
      name: 'segmented-mp-value-alias',
      title: '事件名差异（update:value）',
      blurb: 'wot-ui 风格 `@update:value` 与本组件 `@update:model-value` 均可父子同步。',
    },
    {
      name: 'segmented-mp-vibrate',
      title: '切换振动（vibrate-short）',
      blurb: '切换选项时触发短振动；无振动马达的宿主静默跳过。',
    },
    {
      name: 'segmented-mp-custom-style',
      title: '根节点样式',
      blurb: 'customClass 追加类名；customStyle 覆盖底色与圆角。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '绑定值。',
      },
      {
        name: 'value',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '当前值。',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用分段器' },
      { name: 'options', type: 'SegmentedRawOption[]', default: '() => []', desc: '选项列表。' },
      {
        name: 'theme',
        type: "'card' | 'outline'",
        default: "'card'",
        desc: '分段器主题：card / outline。',
      },
      { name: 'vibrateShort', type: 'boolean', default: 'false', desc: '切换时是否触发短振动' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Segmented 分段器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Segmented } from '@snui/uni';",
    chipCopy: "import { Segmented } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-segmented', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Tabs', link: '/components/uni/tabs' },
    next: { text: 'Sidebar', link: '/components/uni/sidebar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
