/**
 * Alert 提示 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const alertDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Alert 提示' }],
  title: 'Alert 提示',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnAlert' },
    { t: 'text', s: ' 是行内反馈条，用于在页面或区块内持续展示一条需要用户注意的信息。' },
  ],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/alert',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Alert 提示.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Alert } from '@snui/vue-web';
</script>

<template>
  <Alert />
</template>`,
  },
  demos: [
    {
      name: 'alert-web-basic',
      title: '代码演示',
      blurb: '五种 type：底色淡染，类型色只落在图标与边框上',
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
        desc: 'Alert heading. Mirrors n-alert `title`.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: 'Show the leading type icon. Mirrors n-alert `showIcon` (default true).',
      },
      {
        name: 'type',
        type: "'info' | 'warning' | 'error' | 'success' | 'default'",
        default: "'default'",
        desc: 'Semantic type — drives color + default icon. Mirrors n-alert `type`.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'true',
        desc: 'Draw the surrounding border. Mirrors n-alert `bordered` (default true).',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        desc: 'Render the close button. Mirrors n-alert `closable`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Alert 提示 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Alert } from '@snui/vue-web';",
    chipCopy: "import { Alert } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Alert', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'page-header', link: '/components/web/page-header' },
    next: { text: 'dialog', link: '/components/web/dialog' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
