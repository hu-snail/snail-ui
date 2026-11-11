/**
 * VirtualList 虚拟列表 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const virtualListDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'VirtualList 虚拟列表' },
  ],
  title: 'VirtualList 虚拟列表',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '虚拟列表只渲染可视窗口（含上下 overscan 缓冲）内的行，用全高占位撑起原生滚动条，让万级数据保持流畅滚动。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/virtual-list',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'VirtualList 虚拟列表.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { VirtualList } from '@snui/vue-web';
</script>

<template>
  <VirtualList />
</template>`,
  },
  demos: [
    { name: 'virtual-list-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'virtual-list-web-resizable', title: '动态行高', blurb: '动态行高' },
    {
      name: 'virtual-list-web-scroll',
      title: '滚动回显与 overscan 缓冲',
      blurb: '滚动回显与 overscan 缓冲',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'items', type: 'SnVirtualListItem[]', default: '() => []', desc: '列表数据。' },
      {
        name: 'itemSize',
        type: 'number',
        default: '30',
        desc: '固定行高（px，也是未测量行的兜底估算值）。对应 n-virtual-list 的 `itemSize`。',
      },
      {
        name: 'itemResizable',
        type: 'boolean',
        default: 'false',
        desc: '用 ResizeObserver 测量实际行高，并按实测值重排。对应 n-virtual-list 的 `itemResizable`。',
      },
      {
        name: 'keyField',
        type: 'string',
        default: "'value'",
        desc: 'Object field used as the render key. Mirrors n-virtual-list `keyField`.',
      },
      {
        name: 'overscan',
        type: 'number',
        default: '3',
        desc: '视口上下额外渲染的行数，用于吸收快速滚动。',
      },
      {
        name: 'visibleHeight',
        type: 'number | undefined',
        default: 'undefined',
        desc: '视口高度（px）；省略时测量容器高度。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnVirtualList.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'scroll',
        payload: 'Event',
        desc: '容器原生滚动事件；对齐 n-virtual-list `on-scroll`。',
      },
      {
        name: 'update:scrollTop',
        payload: '(scrollTop: number)',
        desc: 'rAF 节流后提交的滚动偏移；对齐 n-virtual-list `on-update:scroll-top`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnVirtualList.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'item',
        props: '{ item: SnVirtualListItem; index: number }',
        desc: '行内容，作用域为 `{ item, index }`。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'VirtualList 虚拟列表 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { VirtualList } from '@snui/vue-web';",
    chipCopy: "import { VirtualList } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'VirtualList', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'ellipsis', link: '/components/web/ellipsis' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
