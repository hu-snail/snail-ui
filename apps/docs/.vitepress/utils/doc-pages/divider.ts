/**
 * Divider 分割线 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dividerDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Divider 分割线' }],
  title: 'Divider 分割线',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnDivider' },
    { t: 'text', s: ' 是 ' },
    { t: 'code', s: '@snui/vue-web' },
    { t: 'text', s: '（PC 桌面端）的视觉分隔组件。所有视觉属性通过 ' },
    { t: 'code', s: '--sn-web-*' },
    { t: 'text', s: ' Token 别名层驱动。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/divider',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Divider 分割线.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Divider } from '@snui/vue-web';
</script>

<template>
  <Divider />
</template>`,
  },
  demos: [
    {
      name: 'divider-web',
      title: '实时预览',
      blurb: '水平 / 虚线 / 带文字 / marginSize / 垂直 等全部 variants 的综合预览。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: 'Axis: horizontal (full-width line) or vertical (inline line).',
      },
      { name: 'dashed', type: 'boolean', default: 'false', desc: '虚线' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Optional color override (CSS color value).',
      },
      {
        name: 'marginSize',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Vertical margin (only for horizontal direction).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Divider 分割线 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Divider } from '@snui/vue-web';",
    chipCopy: "import { Divider } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Divider', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'button', link: '/components/web/button' },
    next: { text: 'icon', link: '/components/web/icon' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
