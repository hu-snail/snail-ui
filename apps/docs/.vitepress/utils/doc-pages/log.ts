/**
 * Log 日志 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const logDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Log 日志' }],
  title: 'Log 日志',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '固定高度的滚动日志查看器，支持按行渲染、触边加载与加载指示。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/log',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Log 日志.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Log } from '@snui/vue-web';
</script>

<template>
  <Log />
</template>`,
  },
  demos: [{ name: 'log-web-size', title: '代码演示', blurb: 'rows 控制日志高度。' }],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'log',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Log content; split into lines on `\\n`. Takes precedence over `lines`. Mirrors n-log `log`.',
      },
      {
        name: 'lines',
        type: 'string[]',
        default: '() => []',
        desc: 'Log lines; ignored when `log` is a non-empty string. Mirrors n-log `lines`.',
      },
      {
        name: 'trim',
        type: 'boolean',
        default: 'false',
        desc: 'Trim each displayed line. Mirrors n-log `trim`.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Show the loading indicator. Mirrors n-log `loading`.',
      },
      {
        name: 'fontSize',
        type: 'number',
        default: '14',
        desc: 'Text size in px. Mirrors n-log `font-size`.',
      },
      {
        name: 'lineHeight',
        type: 'number',
        default: '1.25',
        desc: 'Unitless line-height; rows stay aligned with the fixed height. Mirrors n-log `line-height`.',
      },
      {
        name: 'rows',
        type: 'number',
        default: '15',
        desc: 'Visible row count; the container height is rows × line-height × font-size. Mirrors n-log `rows`.',
      },
      {
        name: 'offsetTop',
        type: 'number',
        default: '0',
        desc: 'Top reach tolerance in px. Mirrors n-log `offset-top`.',
      },
      {
        name: 'offsetBottom',
        type: 'number',
        default: '0',
        desc: 'Bottom reach tolerance in px. Mirrors n-log `offset-bottom`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Log 日志 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Log } from '@snui/vue-web';",
    chipCopy: "import { Log } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Log', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'list', link: '/components/web/list' },
    next: { text: 'number-animation', link: '/components/web/number-animation' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
