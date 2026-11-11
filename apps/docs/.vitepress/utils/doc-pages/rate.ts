/**
 * Rate 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const rateDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Rate 评分' }],
  title: 'Rate 评分',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '评分。内联 SVG 星形（无 emoji 图标），支持半星、clearable、键盘打分。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/rate',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Rate.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Rate } from '@snui/vue-web';
</script>

<template>
  <Rate />
</template>`,
  },
  demos: [
    { name: 'rate-web-basic', title: '基础用法', blurb: 'v-model + count。' },
    { name: 'rate-web-half', title: '半星（allowHalf）', blurb: '每星两个 50% 命中区，0.5 步进。' },
    { name: 'rate-web-readonly', title: '只读', blurb: 'readonly：展示态不可交互。' },
    { name: 'rate-web-disabled', title: '禁用', blurb: 'disabled：置灰且不可点。' },
    { name: 'rate-web-clearable', title: '再次点击清零（clearable）', blurb: '点当前值星清零。' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'number | null', default: 'null', desc: '绑定值。' },
      { name: 'count', type: 'number', default: '5', desc: '星数' },
      { name: 'allowHalf', type: 'boolean', default: 'false', desc: '半星' },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读：可见但不可交互。' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用：置灰且不可交互。' },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Drives star glyph size.',
      },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Filled-star color. Accepts any CSS color (token variable like `var(--sn-web-color-feedback-warning)` is recommended); applied via the `--sn-rate-color` CSS variable so it stays themeable.',
      },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '点同值清零' },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible label for the radiogroup.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnRate.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      { name: 'update:modelValue', payload: '(value: number)', desc: '`v-model` 同步。' },
      {
        name: 'change',
        payload: '(value: number)',
        desc: '每次提交评分变化时触发（点击 / 键盘）。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnRate.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'icon',
        props: '{ index: number; filled: boolean }',
        desc: '自定义每颗星内容，替换内置 SVG 星形。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Rate 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Rate } from '@snui/vue-web';",
    chipCopy: "import { Rate } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Rate', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'slider-bar', link: '/components/web/slider-bar' },
    next: { text: 'form', link: '/components/web/form' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
