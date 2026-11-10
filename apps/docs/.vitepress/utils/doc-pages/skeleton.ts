/**
 * Skeleton 骨架屏 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const skeletonDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Skeleton 骨架屏' },
  ],
  title: 'Skeleton 骨架屏',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnSkeleton' },
    { t: 'text', s: ' 是内容加载期间的占位块。一个标签覆盖常见形状：' },
    { t: 'code', s: 'text' },
    { t: 'text', s: ' 让它落进一行文字里、' },
    { t: 'code', s: 'circle' },
    { t: 'text', s: ' 变成头像、' },
    { t: 'code', s: 'repeat' },
    { t: 'text', s: ' 变多行段落。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/skeleton',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Skeleton 骨架屏.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Skeleton } from '@snui/vue-web';
</script>

<template>
  <Skeleton />
</template>`,
  },
  demos: [
    { name: 'skeleton-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'skeleton-web-box', title: '盒子形态', blurb: '盒子形态' },
    { name: 'skeleton-web-size', title: '尺寸与形状', blurb: '尺寸与形状' },
    { name: 'skeleton-web-card', title: '卡片占位', blurb: '卡片占位' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'text', type: 'boolean', default: 'false', desc: '渲染为文本骨架。' },
      { name: 'round', type: 'boolean', default: 'false', desc: '渲染为圆角骨架。' },
      { name: 'circle', type: 'boolean', default: 'false', desc: '渲染为圆形骨架。' },
      { name: 'height', type: 'string | number', default: 'undefined as any', desc: '高度。' },
      { name: 'width', type: 'string | number', default: 'undefined as any', desc: '宽度。' },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: 'undefined as any',
        desc: 'Height tier used when no explicit height/width is given.',
      },
      { name: 'repeat', type: 'number', default: '1', desc: '`1`' },
      { name: 'animated', type: 'boolean', default: 'true', desc: '是否启用闪烁动画。' },
      { name: 'sharp', type: 'boolean', default: 'true', desc: '是否渲染为直角骨架。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Skeleton 骨架屏 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Skeleton } from '@snui/vue-web';",
    chipCopy: "import { Skeleton } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Skeleton', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'loading', link: '/components/web/loading' },
    next: { text: 'notification', link: '/components/web/notification' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
