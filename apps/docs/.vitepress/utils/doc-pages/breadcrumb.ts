/**
 * Breadcrumb 面包屑 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const breadcrumbDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Breadcrumb 面包屑' },
  ],
  title: 'Breadcrumb 面包屑',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnBreadcrumb' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'SnBreadcrumbItem' },
    {
      t: 'text',
      s: ' 展示当前位置在层级结构中的路径，并提供逐级返回的入口。每项自行渲染尾随分隔符。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/breadcrumb',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Breadcrumb 面包屑.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Breadcrumb } from '@snui/vue-web';
</script>

<template>
  <Breadcrumb />
</template>`,
  },
  demos: [
    { name: 'breadcrumb-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'breadcrumb-web-separator', title: '自定义分隔符', blurb: '自定义分隔符' },
    { name: 'breadcrumb-web-icon', title: '图标项', blurb: '图标项' },
    { name: 'breadcrumb-web-variant', title: '样式变体', blurb: '样式变体' },
    { name: 'breadcrumb-web-max-count', title: '最大数量', blurb: '最大数量' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'separator',
        type: 'string',
        default: "'/'",
        desc: 'Separator glyph between items. Mirrors n-breadcrumb `separator`.',
      },
      {
        name: 'maxCount',
        type: 'number',
        default: 'Infinity',
        desc: '最多显示几项；超出部分折叠为 `head(1) + ellipsis + tail(maxCount-1)`。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Breadcrumb 面包屑 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Breadcrumb } from '@snui/vue-web';",
    chipCopy: "import { Breadcrumb } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Breadcrumb', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'menu', link: '/components/web/menu' },
    next: { text: 'tabs', link: '/components/web/tabs' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
