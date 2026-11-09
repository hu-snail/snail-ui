/**
 * Split 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const splitDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '布局组件 Layout' }, { text: 'Split' }],
  title: 'Split',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '分栏容器。拖拽调整面板比例，键盘可达，支持折叠。' }],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/split',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Split.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Split } from '@snui/vue-web';
</script>

<template>
  <Split />
</template>`,
  },
  demos: [
    {
      name: 'split-web-basic',
      title: '基础用法',
      blurb: '双面板拖拽 + min/max，两种背景区分面板。',
    },
    { name: 'split-web-vertical', title: '垂直分栏', blurb: "direction='vertical'。" },
    {
      name: 'split-web-collapse',
      title: '可折叠面板（collapsible）',
      blurb: '拖到 min 以下 snap 收起，双击手柄恢复。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: 'Split axis. Panels lay out in a row (horizontal) or column (vertical).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable all divider interaction.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Split 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Split } from '@snui/vue-web';",
    chipCopy: "import { Split } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Split', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'layout', link: '/components/web/layout' },
    next: { text: 'waterfall', link: '/components/web/waterfall' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
