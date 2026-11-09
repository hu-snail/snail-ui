/**
 * Code 代码 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const codeDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Code 代码' }],
  title: 'Code 代码',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '等宽字体的代码展示块，支持行号、软换行、行内模式与 JSON 语法着色。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/code',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Code 代码.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Code } from '@snui/vue-web';
</script>

<template>
  <Code />
</template>`,
  },
  demos: [{ name: 'code-web-basic', title: '代码演示', blurb: 'json 语法着色 + 纯文本语言。' }],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'code',
        type: 'string',
        default: "''",
        desc: 'Source code text. Mirrors n-code `code`.',
      },
      {
        name: 'language',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Highlighter language. Only `json` tokenizes (built-in); others render plain. Mirrors n-code `language`.',
      },
      {
        name: 'trim',
        type: 'boolean',
        default: 'true',
        desc: 'Trim the displayed code on the highlighted path. Mirrors n-code `trim`.',
      },
      {
        name: 'inline',
        type: 'boolean',
        default: 'false',
        desc: 'Inline (single-line) rendering without the pre wrapper. Mirrors n-code `inline`.',
      },
      {
        name: 'wordWrap',
        type: 'boolean',
        default: 'false',
        desc: 'Soft-wrap overflowing lines. Mirrors n-code `word-wrap`.',
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        default: 'false',
        desc: 'Show the line-number gutter (ignored when inline or word-wrap). Mirrors n-code `show-line-numbers`.',
      },
      {
        name: 'uri',
        type: 'boolean',
        default: 'false',
        desc: 'Decode `code` as a URI component before display. Mirrors n-code `uri`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Code 代码 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Code } from '@snui/vue-web';",
    chipCopy: "import { Code } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Code', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'countdown', link: '/components/web/countdown' },
    next: { text: 'comment', link: '/components/web/comment' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
