/**
 * 空状态 Empty 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const emptyDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '空状态 Empty' },
  ],
  title: '空状态 Empty',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '居中的空状态占位：图标 + 描述 + 附加操作区。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/empty',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '空状态 Empty.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Empty } from '@snui/vue-web';
</script>

<template>
  <Empty />
</template>`,
  },
  demos: [
    { name: 'empty-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'empty-web-icon', title: '自定义图标与操作', blurb: '自定义图标与操作' },
    { name: 'empty-web-size', title: '尺寸', blurb: '尺寸' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'description',
        type: 'string',
        default: '—',
        desc: 'Description text; the `default` slot overrides it.',
      },
      {
        name: 'showDescription',
        type: 'boolean',
        default: 'true',
        desc: 'Render the description line.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: 'Render the default glyph (or the `icon` slot).',
      },
      {
        name: 'size',
        type: "'tiny' | 'small' | 'medium' | 'large' | 'huge'",
        default: "'medium'",
        desc: 'Visual scale of the glyph + description.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '空状态 Empty 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Empty } from '@snui/vue-web';",
    chipCopy: "import { Empty } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Empty', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'descriptions', link: '/components/web/descriptions' },
    next: { text: 'equation', link: '/components/web/equation' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
