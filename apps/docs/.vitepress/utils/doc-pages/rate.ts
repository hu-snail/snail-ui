/**
 * Rate 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const rateDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Rate' }],
  title: 'Rate',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
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
    {
      name: 'rate-web-states',
      title: '只读 / 禁用',
      blurb: 'readonly 展示态；disabled 不可交互。',
    },
    { name: 'rate-web-clearable', title: '再次点击清零（clearable）', blurb: '点当前值星清零。' },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | null',
        default: 'null',
        desc: 'Bound rating value. 0 (or null) = unrated.',
      },
      { name: 'count', type: 'number', default: '5', desc: 'Number of stars rendered.' },
      {
        name: 'allowHalf',
        type: 'boolean',
        default: 'false',
        desc: 'Allow half-star precision (0.5 steps).',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — visible but not interactive.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disabled — greyed out, not interactive.',
      },
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
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Clicking the same rating again resets the value to 0.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible label for the radiogroup.',
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
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
