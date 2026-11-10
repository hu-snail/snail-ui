/**
 * Layout 布局（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-col.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const layoutDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Layout 布局' }],
  title: 'Layout 布局',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-layout',
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
    fileLabel: 'Layout 布局.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Layout } from '@snui/uni';
</script>

<template>
  <sn-layout />
</template>`,
  },
  demos: [
    {
      name: 'layout-mp-basic',
      title: '基础用法',
      blurb: 'span 为 24 栅格中的列数；24 / 12+12 / 8+8+8 三种常见组合。',
    },
    {
      name: 'layout-mp-gutter',
      title: '间距、偏移与对齐',
      blurb: 'gutter=16 列间距；offset=8 左侧偏移；justify=space-between + align=middle 对齐。',
    },
    {
      name: 'layout-mp-align',
      title: '对齐全档位与自定义样式',
      blurb:
        'justify 的 center / end / space-around / space-evenly；align 的 middle / bottom；行级与列级 customClass / customStyle。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'span', type: 'number', default: '24', desc: '列元素宽度（24 栅格中的列数）' },
      { name: 'offset', type: 'number', default: '0', desc: '列元素左侧偏移列数' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Layout 布局 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Layout } from '@snui/uni';",
    chipCopy: "import { Layout } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-layout', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-text', link: '/components/uni/text' },
    next: { text: 'sn-cell', link: '/components/uni/cell' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
