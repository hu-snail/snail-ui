/**
 * 瀑布流 Waterfall 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const waterfallDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '布局组件 Layout' },
    { text: '瀑布流 Waterfall' },
  ],
  title: '瀑布流 Waterfall',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '面向图片 / 信息流的 masonry 容器：' },
    { t: 'code', s: 'default' },
    { t: 'text', s: ' 槽里的每个直接子节点都会被包进一个' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/waterfall',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '瀑布流 Waterfall.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Waterfall } from '@snui/vue-web';
</script>

<template>
  <Waterfall />
</template>`,
  },
  demos: [
    { name: 'waterfall-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'waterfall-web-image', title: '图片墙 + 懒加载', blurb: '图片墙 + 懒加载' },
    { name: 'waterfall-web-responsive', title: '响应式列宽', blurb: '响应式列宽' },
    { name: 'waterfall-web-card', title: '卡片墙与关闭瀑布流', blurb: '卡片墙与关闭瀑布流' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'columns',
        type: 'number',
        default: '3',
        desc: '逻辑列数，取整到 ≥ 1（小数向下取整，0 / NaN / Infinity 回退为 1）。`min-column-width` 模式下作为**测量前的初始猜测**；`masonry=false` 时忽略',
      },
      {
        name: 'minColumnWidth',
        type: 'number | string',
        default: '—',
        desc: '最小列宽。设置后列数随容器实测宽度自适应（响应式模式），`columns` 仅作为测量前的预估值。',
      },
      {
        name: 'columnGap',
        type: 'number | string',
        default: '16',
        desc: '列间距（数字按 px 处理）。',
      },
      {
        name: 'rowGap',
        type: 'number | string',
        default: '16',
        desc: "Gap between items (number → px); applied as the columns' `row-gap`.",
      },
      {
        name: 'masonry',
        type: 'boolean',
        default: 'true',
        desc: '便捷关闭开关：`false` 时退化为普通单列竖向堆叠（子项恢复 `margin-bottom`，与旧版堆叠行为一致）',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnWaterfall.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: '瀑布流条目，每个直接子节点渲染为一个 `.sn-waterfall__item` 盒子。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '瀑布流 Waterfall 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Waterfall } from '@snui/vue-web';",
    chipCopy: "import { Waterfall } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Waterfall', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'split', link: '/components/web/split' },
    next: { text: 'menu', link: '/components/web/menu' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
