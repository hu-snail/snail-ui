/**
 * Collapse 折叠面板 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const collapseDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '布局组件 Layout' },
    { text: 'Collapse 折叠面板' },
  ],
  title: 'Collapse 折叠面板',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnCollapse' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'SnCollapseItem' },
    { t: 'text', s: ' 是 ' },
    { t: 'code', s: '@snui/vue-web' },
    {
      t: 'text',
      s: '（PC 桌面端）的折叠面板组。手风琴（accordion）模式、箭头位置（arrowPlacement）、触发方式（hover / click）。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/collapse',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Collapse 折叠面板.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Collapse } from '@snui/vue-web';
</script>

<template>
  <Collapse />
</template>`,
  },
  demos: [
    { name: 'collapse-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'collapse-web-accordion', title: '手风琴模式', blurb: '手风琴模式' },
    { name: 'collapse-web-bordered', title: '边框样式', blurb: '边框样式' },
    { name: 'collapse-web-trigger', title: '触发区域', blurb: '触发区域' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'expandedNames', type: 'Array<string | number>', default: '() => []', desc: '`[]`' },
      {
        name: 'defaultExpandedNames',
        type: 'Array<string | number>',
        default: '() => []',
        desc: '`[]`',
      },
      { name: 'accordion', type: 'boolean', default: 'false', desc: '一次只展开一个' },
      {
        name: 'arrowPlacement',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Where to place the expand arrow. Mirrors n-collapse `arrowPlacement`.',
      },
      {
        name: 'trigger',
        type: "'click' | 'hover'",
        default: "'click'",
        desc: 'Trigger mode. Mirrors n-collapse `trigger`.',
      },
      { name: 'bordered', type: 'boolean', default: 'false', desc: '卡片化外框（共享分隔线）' },
      {
        name: 'displayDirective',
        type: "'show' | 'if'",
        default: "'if'",
        desc: "How to render collapsed content: 'show' uses display (keeps DOM, cheap to toggle); 'if' uses v-if (saves DOM but re-mount cost on each toggle). Mirrors n-collapse `displayDirective`. Default 'if'.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Collapse 折叠面板 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Collapse } from '@snui/vue-web';",
    chipCopy: "import { Collapse } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Collapse', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'grid', link: '/components/web/grid' },
    next: { text: 'space', link: '/components/web/space' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
