/**
 * Sticky 粘性布局（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-sticky.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const stickyDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Sticky 粘性布局' },
  ],
  title: 'Sticky 粘性布局',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '把需要吸顶的内容包进 ' },
    { t: 'code', s: 'sn-sticky' },
    { t: 'text', s: '，滚动容器（页面或 ' },
    { t: 'code', s: 'scroll-view' },
    { t: 'text', s: '）滚动时它保持可见：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-sticky',
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
    fileLabel: 'Sticky 粘性布局.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Sticky } from '@snui/uni';
</script>

<template>
  <sn-sticky />
</template>`,
  },
  demos: [
    {
      name: 'sticky-mp-basic',
      title: '基础用法',
      blurb: '在 scroll-view 内使用；offset-top 控制吸顶距离；z-index 控制层级。',
    },
    {
      name: 'sticky-mp-offset',
      title: '自定义吸顶距离与层级',
      blurb: 'offset-top=24 距顶 24px 吸顶；z-index=20 控制层级。',
    },
    {
      name: 'sticky-mp-layers',
      title: '多层吸顶与自定义样式',
      blurb:
        'custom-class / custom-style 自定义根节点；两层不同 offset-top 依次吸顶；z-index 控制层级。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'zIndex', type: 'number', default: '1', desc: '层级。' },
      { name: 'offsetTop', type: 'number', default: '0', desc: '吸顶距离（px）。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Sticky 粘性布局 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Sticky } from '@snui/uni';",
    chipCopy: "import { Sticky } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-sticky', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-collapse', link: '/components/uni/collapse' },
    next: { text: 'sn-grid', link: '/components/uni/grid' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
