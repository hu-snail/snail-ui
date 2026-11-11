/**
 * Layout 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const layoutDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '布局组件 Layout' }, { text: 'Layout 布局' }],
  title: 'Layout 布局',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '页面布局族五件套：SnLayout / SnLayoutSider / SnLayoutHeader / SnLayoutContent / SnLayoutFooter。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/layout',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Layout.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Layout } from '@snui/vue-web';
</script>

<template>
  <Layout />
</template>`,
  },
  demos: [
    { name: 'layout-web-basic', title: '基础三段', blurb: 'Header / Content / Footer 纵向编排。' },
    {
      name: 'layout-web-sider',
      title: '带侧栏（hasSider）',
      blurb: '横向编排 + Sider 折叠触发器。',
    },
    {
      name: 'layout-web-collapse',
      title: '折叠模式（collapseMode）',
      blurb: 'transform 保 DOM / width 重排两档。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'hasSider', type: 'boolean', default: 'false', desc: '横向编排（含 Sider）' },
      {
        name: 'position',
        type: 'SnLayoutPosition',
        default: "'static'",
        desc: "Positioning mode. 'static' keeps normal flow; 'absolute' pins the root to inset 0. Mirrors n-layout `position`. Default 'static'.",
      },
      {
        name: 'contentStyle',
        type: 'SnLayoutStyleValue',
        default: '—',
        desc: '透传到 `SnLayoutContent` 子节点的内联样式。对应 n-layout 的 `content-style`。',
      },
      {
        name: 'headerStyle',
        type: 'SnLayoutStyleValue',
        default: '—',
        desc: '透传到 `SnLayoutHeader` 子节点的内联样式。',
      },
      {
        name: 'footerStyle',
        type: 'SnLayoutStyleValue',
        default: '—',
        desc: '透传到 `SnLayoutFooter` 子节点的内联样式。',
      },
      {
        name: 'siderStyle',
        type: 'SnLayoutStyleValue',
        default: '—',
        desc: '透传到 `SnLayoutSider` 子节点的内联样式。对应 n-layout 的 `sider-style`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnLayout.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: '放置布局子组件（如 `SnLayoutSider`），或嵌套 `SnLayout`。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Layout 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Layout } from '@snui/vue-web';",
    chipCopy: "import { Layout } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Layout', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'flex', link: '/components/web/flex' },
    next: { text: 'split', link: '/components/web/split' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
