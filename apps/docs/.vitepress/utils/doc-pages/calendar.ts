/**
 * 日历 Calendar 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const calendarDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '日历 Calendar' },
  ],
  title: '日历 Calendar',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '按月展示与选择日期的面板组件，支持自定义日期单元格内容与禁用指定日期。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/calendar',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '日历 Calendar.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Calendar } from '@snui/vue-web';
</script>

<template>
  <Calendar />
</template>`,
  },
  demos: [
    {
      name: 'calendar-web-basic',
      title: '代码演示',
      blurb: 'v-model:value + 自定义单元格 + 禁用日期。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'number | null | undefined',
        default: 'undefined',
        desc: 'Selected date (millisecond timestamp), v-model:value. Mirrors n-calendar `value`.',
      },
      {
        name: 'defaultValue',
        type: 'number | null | undefined',
        default: 'null',
        desc: 'Uncontrolled initial selection (millisecond timestamp); also anchors the first panel month. Mirrors n-calendar `defaultValue`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '日历 Calendar 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Calendar } from '@snui/vue-web';",
    chipCopy: "import { Calendar } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Calendar', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'progress', link: '/components/web/progress' },
    next: { text: 'carousel', link: '/components/web/carousel' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
