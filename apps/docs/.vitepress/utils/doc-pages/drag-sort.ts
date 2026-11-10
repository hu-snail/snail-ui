/**
 * DragSort 拖拽排序 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dragSortDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '表单组件 Form' },
    { text: 'DragSort 拖拽排序' },
  ],
  title: 'DragSort 拖拽排序',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnDragSort' },
    { t: 'text', s: ' 提供拖拽排序列表：行内拖拽实时预览、松手提交，' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' 双向绑定完整新数组。零第三方依赖（HTML5 DnD + TransitionGroup FLIP）。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/drag-sort',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'DragSort 拖拽排序.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DragSort } from '@snui/vue-web';
</script>

<template>
  <DragSort />
</template>`,
  },
  demos: [
    { name: 'drag-sort-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'drag-sort-web-handle', title: '把手模式（handle）', blurb: '把手模式（handle）' },
    { name: 'drag-sort-web-horizontal', title: '横向排序', blurb: '横向排序' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnDragSortItem[]',
        default: '() => []',
        desc: '`v-model` 绑定行数组；`key` 必填，其余字段透传给插槽',
      },
      {
        name: 'direction',
        type: 'SnDragSortDirection',
        default: "'vertical'",
        desc: 'Layout axis the drag is measured against.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用整表拖拽与键盘移动' },
      {
        name: 'handle',
        type: 'boolean',
        default: 'false',
        desc: '仅内置把手可发起拖拽，行内容保持文本可选中',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'DragSort 拖拽排序 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { DragSort } from '@snui/vue-web';",
    chipCopy: "import { DragSort } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'DragSort', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'transfer', link: '/components/web/transfer' },
    next: { text: 'card', link: '/components/web/card' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
