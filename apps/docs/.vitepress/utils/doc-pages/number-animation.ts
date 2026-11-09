/**
 * NumberAnimation 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const numberAnimationDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'NumberAnimation' },
  ],
  title: 'NumberAnimation',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '数值动画：数字从 ' },
    { t: 'code', s: 'from' },
    { t: 'text', s: ' 缓动滚动到 ' },
    { t: 'code', s: 'to' },
    { t: 'text', s: '，支持精度、千分位分隔符与国际化。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/number-animation',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'NumberAnimation.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { NumberAnimation } from '@snui/vue-web';
</script>

<template>
  <NumberAnimation />
</template>`,
  },
  demos: [
    {
      name: 'number-animation-web-basic',
      title: '代码演示',
      blurb: 'SnStatistic 内滚动 + play() 重放。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'to',
        type: 'number',
        default: '0',
        desc: 'Target value; the animation runs from `from` towards `to`. Mirrors n-number-animation `to`.',
      },
      {
        name: 'precision',
        type: 'number',
        default: '0',
        desc: 'Digits kept after the decimal point. Mirrors n-number-animation `precision`.',
      },
      {
        name: 'showSeparator',
        type: 'boolean',
        default: 'false',
        desc: 'Format the integer part with locale thousands separators. Mirrors n-number-animation `showSeparator`.',
      },
      {
        name: 'locale',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'BCP-47 locale for Intl.NumberFormat (separators + decimal mark). Mirrors n-number-animation `locale`.',
      },
      {
        name: 'from',
        type: 'number',
        default: '0',
        desc: 'Start value. Mirrors n-number-animation `from`.',
      },
      {
        name: 'active',
        type: 'boolean',
        default: 'true',
        desc: 'Start / restart the animation. Mirrors n-number-animation `active`.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '2000',
        desc: 'Animation duration in ms (non-reactive, captured at setup). Mirrors n-number-animation `duration`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'NumberAnimation 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { NumberAnimation } from '@snui/vue-web';",
    chipCopy: "import { NumberAnimation } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'NumberAnimation', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'log', link: '/components/web/log' },
    next: { text: 'qr-code', link: '/components/web/qr-code' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
