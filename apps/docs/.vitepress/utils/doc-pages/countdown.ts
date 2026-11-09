/**
 * Countdown 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const countdownDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Countdown' }],
  title: 'Countdown',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '倒计时：从 ' },
    { t: 'code', s: 'duration' },
    { t: 'text', s: ' 毫秒倒数到 0，渲染 ' },
    { t: 'code', s: 'HH:MM:SS' },
    { t: 'text', s: '，支持小数精度与自定义渲染。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/countdown',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Countdown.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Countdown } from '@snui/vue-web';
</script>

<template>
  <Countdown />
</template>`,
  },
  demos: [
    {
      name: 'countdown-web-basic',
      title: '代码演示',
      blurb: 'duration 5000ms，active 控制走/停。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'duration',
        type: 'number',
        default: '0',
        desc: 'Countdown length in ms (non-reactive). Mirrors n-countdown `duration`.',
      },
      {
        name: 'active',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the countdown is ticking. Mirrors n-countdown `active`.',
      },
      {
        name: 'precision',
        type: '0 | 1 | 2 | 3',
        default: '0',
        desc: 'Displayed precision: 0 = seconds, 1-3 add decimal digits. Mirrors n-countdown `precision`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Countdown 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Countdown } from '@snui/vue-web';",
    chipCopy: "import { Countdown } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Countdown', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'marquee', link: '/components/web/marquee' },
    next: { text: 'code', link: '/components/web/code' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
