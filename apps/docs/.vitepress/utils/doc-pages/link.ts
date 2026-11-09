/**
 * Link 链接 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const linkDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Link 链接' }],
  title: 'Link 链接',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '超链接文字：语义状态色、悬停下划线、禁用态，可选前缀图标，支持自定义渲染标签。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/link',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Link 链接.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Link } from '@snui/vue-web';
</script>

<template>
  <Link />
</template>`,
  },
  demos: [
    { name: 'link-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'link-web-type', title: '语义色对照', blurb: '语义色对照' },
    {
      name: 'link-web-state',
      title: '下划线、禁用与自定义标签',
      blurb: '下划线、禁用与自定义标签',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'href',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Navigation target. Mirrors n-a `href`.',
      },
      {
        name: 'target',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Browsing context for the navigation (`_blank`, …). Mirrors n-a `target`.',
      },
      {
        name: 'rel',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Relationship metadata for the target. Mirrors n-a `rel`.',
      },
      {
        name: 'type',
        type: 'LinkType',
        default: "'default'",
        desc: "Visual type — drives the text color. Mirrors n-a `type`. Default 'default'.",
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disabled state — blocks clicks and navigation. Mirrors n-a `disabled`. Default false.',
      },
      {
        name: 'underline',
        type: 'boolean',
        default: 'false',
        desc: '`true` underlines permanently; `false` underlines on hover only. Mirrors n-a `underline`. Default false.',
      },
      {
        name: 'tag',
        type: 'string',
        default: "'a'",
        desc: "Element to render as the root. Mirrors n-a `tag`. Default 'a'.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Link 链接 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Link } from '@snui/vue-web';",
    chipCopy: "import { Link } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Link', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'avatar-group', link: '/components/web/avatar-group' },
    next: { text: 'input', link: '/components/web/input' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
