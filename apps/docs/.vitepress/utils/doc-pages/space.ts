/**
 * Space 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const spaceDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '布局组件 Layout' }, { text: 'Space' }],
  title: 'Space',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '间距容器。CSS gap 实现，子项无包裹层。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/space',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Space.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Space } from '@snui/vue-web';
</script>

<template>
  <Space />
</template>`,
  },
  demos: [
    { name: 'space-web-basic', title: '基础用法', blurb: '默认横向 + 档位 size。' },
    {
      name: 'space-web-vertical',
      title: '纵向与数组 gap',
      blurb: 'vertical + [横向, 纵向] 双轴。',
    },
    { name: 'space-web-align', title: '对齐与换行', blurb: 'justify / align / wrap。' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'vertical', type: 'boolean', default: 'false', desc: '纵向排布（强制 nowrap）' },
      {
        name: 'size',
        type: 'SnSpaceGap',
        default: "'medium'",
        desc: "Gap between children: px number, preset, or [horizontal, vertical] tuple. Default 'medium'.",
      },
      { name: 'wrap', type: 'boolean', default: 'true', desc: '换行' },
      {
        name: 'justify',
        type: 'SnSpaceJustify',
        default: "'start'",
        desc: "Main-axis distribution. Default 'start' (→ flex-start, like n-space).",
      },
      {
        name: 'align',
        type: 'SnSpaceAlign',
        default: '—',
        desc: "Cross-axis alignment. Default undefined (CSS 'normal', like n-space).",
      },
      { name: 'inline', type: 'boolean', default: 'false', desc: '行内容器' },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: "Extra class appended to the container (snail extension). Default ''.",
      },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: "Inline style appended to the container (snail extension). Default ''.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Space 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Space } from '@snui/vue-web';",
    chipCopy: "import { Space } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Space', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'collapse', link: '/components/web/collapse' },
    next: { text: 'flex', link: '/components/web/flex' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
