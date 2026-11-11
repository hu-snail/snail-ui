/**
 * LoadingBar 加载条 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const loadingBarDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'LoadingBar 加载条' },
  ],
  title: 'LoadingBar 加载条',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnLoadingBarProvider' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'useLoadingBar()' },
    {
      t: 'text',
      s: ' 提供页面顶部的全局加载进度条：细长、全宽、悬浮于页面最上层，用于表达"页面正在忙碌"。',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/loading-bar',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'LoadingBar 加载条.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { LoadingBar } from '@snui/vue-web';
</script>

<template>
  <LoadingBar />
</template>`,
  },
  demos: [
    { name: 'loading-bar-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'loading-bar-web-flow', title: '完整流程与出错对照', blurb: '完整流程与出错对照' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'barStyle',
        type: 'StyleValue',
        default: '—',
        desc: '由 Provider 计算的内联样式（宽度 / 透明度 / 过渡）。',
      },
      {
        name: 'status',
        type: 'LoadingBarStatus',
        default: '—',
        desc: "Colour state: 'default' primary colour, 'error' danger colour.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'LoadingBar 加载条 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { LoadingBar } from '@snui/vue-web';",
    chipCopy: "import { LoadingBar } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'LoadingBar', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'notification', link: '/components/web/notification' },
    next: { text: 'progress', link: '/components/web/progress' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
