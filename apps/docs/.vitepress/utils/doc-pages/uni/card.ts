/**
 * Card · uni-app（移动端）（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-card.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const cardDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'Card · uni-app（移动端）' },
  ],
  title: 'Card · uni-app（移动端）',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-card',
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
    fileLabel: 'Card · uni-app（移动端）.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Card } from '@snui/uni';
</script>

<template>
  <sn-card />
</template>`,
  },
  demos: [
    {
      name: 'card-mp',
      title: '基本用法',
      blurb:
        "默认 Card（带 title prop + footer slot）+ Rectangle Card（type='rectangle'，列表大格样式）。",
    },
    {
      name: 'card-mp-custom',
      title: '分区自定义类名与样式',
      blurb: '三个分区类名、根节点类名与 inline style，以及 rectangle 变体上的同一套定制。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Card title. Rendered in the title region; can be empty.',
      },
      {
        name: 'type',
        type: 'string',
        default: "''",
        desc: "Card type. 'rectangle' adds the rectangle (大格) visual style.",
      },
      {
        name: 'customTitleClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the title region.',
      },
      {
        name: 'customContentClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the content region.',
      },
      {
        name: 'customFooterClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the footer region.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Card · uni-app（移动端） 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Card } from '@snui/uni';",
    chipCopy: "import { Card } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-card', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-avatar-group', link: '/components/uni/avatar-group' },
    next: { text: 'sn-img', link: '/components/uni/img' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
