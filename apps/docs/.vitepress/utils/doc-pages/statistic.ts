/**
 * Statistic 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const statisticDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Statistic' }],
  title: 'Statistic',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '统计数据展示：小号 label 压在大号数值上，支持前缀/后缀装饰与等宽数字排版。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/statistic',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Statistic.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Statistic } from '@snui/vue-web';
</script>

<template>
  <Statistic />
</template>`,
  },
  demos: [
    {
      name: 'statistic-web-basic',
      title: '代码演示',
      blurb: 'label + value，prefix / suffix 插槽与 default 插槽两种取值方式。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'label', type: 'string | undefined', default: 'undefined', desc: '数值上方的标签' },
      {
        name: 'value',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '当前值。',
      },
      {
        name: 'tabularNums',
        type: 'boolean',
        default: 'false',
        desc: '数字等宽渲染（`font-variant-numeric: tabular-nums`）。对应 n-statistic 的 `tabularNums`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnStatistic.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: '值内容，仅在未传 `value` 时使用（对应 n-statistic `default`）。',
      },
      {
        name: 'label',
        props: '—',
        desc: '标签内容，仅在未传 `label` 时使用（对应 n-statistic `label`）。',
      },
      { name: 'prefix', props: '—', desc: '值内容之前的前缀（对应 n-statistic `prefix`）。' },
      { name: 'suffix', props: '—', desc: '值内容之后的后缀（对应 n-statistic `suffix`）。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Statistic 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Statistic } from '@snui/vue-web';",
    chipCopy: "import { Statistic } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Statistic', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'qr-code', link: '/components/web/qr-code' },
    next: { text: 'table', link: '/components/web/table' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
