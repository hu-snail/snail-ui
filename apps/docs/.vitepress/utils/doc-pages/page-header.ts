/**
 * PageHeader 页头 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const pageHeaderDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'PageHeader 页头' },
  ],
  title: 'PageHeader 页头',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '页面级头部：返回控件 + 标题 / 副标题 + 右侧操作区，可选正文与底部区域。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/page-header',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'PageHeader 页头.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { PageHeader } from '@snui/vue-web';
</script>

<template>
  <PageHeader />
</template>`,
  },
  demos: [
    { name: 'page-header-web-basic', title: '基础页头', blurb: '基础页头' },
    { name: 'page-header-web-composite', title: '组合式页头', blurb: '组合式页头' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Page title text; the `title` slot takes precedence. Mirrors n-page-header `title`.',
      },
      {
        name: 'subtitle',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Subtitle under the title; the `subtitle` slot takes precedence. Mirrors n-page-header `subtitle`.',
      },
      {
        name: 'extra',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Right-side extra content; the `extra` slot takes precedence. Mirrors n-page-header `extra`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'PageHeader 页头 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { PageHeader } from '@snui/vue-web';",
    chipCopy: "import { PageHeader } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'PageHeader', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'pagination', link: '/components/web/pagination' },
    next: { text: 'alert', link: '/components/web/alert' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
