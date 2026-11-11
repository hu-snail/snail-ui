/**
 * Flex 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const flexDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '布局组件 Layout' }, { text: 'Flex' }],
  title: 'Flex',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '弹性布局原语。通用 flex 容器，gap 直通像素值。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/flex',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Flex.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Flex } from '@snui/vue-web';
</script>

<template>
  <Flex />
</template>`,
  },
  demos: [
    { name: 'flex-web-basic', title: '基础用法', blurb: '横向排布 + gap。' },
    {
      name: 'flex-web-vertical',
      title: '纵向与两端对齐',
      blurb: 'vertical / justify / align 组合。',
    },
    {
      name: 'flex-web-expand',
      title: '子项撑满（expand）',
      blurb: 'expand 为 snail 扩展（naive 无此 prop）。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'vertical', type: 'boolean', default: 'false', desc: '纵向排布' },
      {
        name: 'gap',
        type: 'SnFlexGap',
        default: "'medium'",
        desc: "Gap between children: px number, preset, or [horizontal, vertical] tuple. Default 'medium'.",
      },
      { name: 'wrap', type: 'boolean', default: 'true', desc: '换行' },
      {
        name: 'justify',
        type: 'SnFlexJustify',
        default: "'start'",
        desc: "Main-axis distribution, passed through as-is (like n-flex). Default 'start'.",
      },
      {
        name: 'align',
        type: 'SnFlexAlign',
        default: '—',
        desc: "Cross-axis alignment. Default undefined (CSS 'normal', like n-flex).",
      },
      { name: 'inline', type: 'boolean', default: 'false', desc: '行内容器' },
      { name: 'expand', type: 'boolean', default: 'false', desc: '子项 flex:1 撑满（snail 扩展）' },
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
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnFlex.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'default', props: '—', desc: '直接子节点即容器的 flex 子项。' }],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Flex 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Flex } from '@snui/vue-web';",
    chipCopy: "import { Flex } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Flex', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'space', link: '/components/web/space' },
    next: { text: 'layout', link: '/components/web/layout' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
