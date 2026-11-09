/**
 * BackTop 回到顶部 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const backTopDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'BackTop 回到顶部' },
  ],
  title: 'BackTop 回到顶部',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnBackTop' },
    { t: 'text', s: ' 是滚动超过阈值后浮出的「回到顶部」按钮，点击后带平滑动画滚回容器顶部。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/back-top',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'BackTop 回到顶部.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { BackTop } from '@snui/vue-web';
</script>

<template>
  <BackTop />
</template>`,
  },
  demos: [{ name: 'back-top-web-basic', title: '代码演示', blurb: '滚动超过 200px 后浮出按钮' }],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean',
        default: 'undefined as any',
        desc: 'Controlled visibility. When omitted the component manages it itself from the scroll position (`v-model:show`).',
      },
      {
        name: 'right',
        type: 'string | number',
        default: '40',
        desc: 'Distance from the viewport right edge.',
      },
      {
        name: 'bottom',
        type: 'string | number',
        default: '40',
        desc: 'Distance from the viewport bottom edge.',
      },
      {
        name: 'to',
        type: 'HTMLElement | string',
        default: "'body'",
        desc: 'Element to render the button into. Accepted for API parity.',
      },
      {
        name: 'visibilityHeight',
        type: 'number',
        default: '180',
        desc: 'Scroll distance after which the button appears.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'BackTop 回到顶部 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { BackTop } from '@snui/vue-web';",
    chipCopy: "import { BackTop } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'BackTop', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'anchor', link: '/components/web/anchor' },
    next: { text: 'floating-toc', link: '/components/web/floating-toc' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
