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
  demos: [
    { name: 'code-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'code-web-inline', title: '行内显示', blurb: '行内显示' },
    { name: 'code-web-softwrap', title: '软换行', blurb: '软换行' },
    { name: 'code-web-line-numbers', title: '显示行号', blurb: '显示行号' },
    { name: 'code-web-loop-debug', title: '动态更新', blurb: '动态更新' },
  ],
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
        desc: '高亮语言；`json` 使用内置分词器，其他语言纯文本展示',
      },
      { name: 'trim', type: 'boolean', default: 'true', desc: '高亮路径下是否去掉首尾空白' },
      { name: 'inline', type: 'boolean', default: 'false', desc: '行内样式' },
      {
        name: 'wordWrap',
        type: 'boolean',
        default: 'false',
        desc: '溢出长行自动换行。对应 n-code 的 `word-wrap`。',
      },
      {
        name: 'showLineNumbers',
        type: 'boolean',
        default: 'false',
        desc: '显示行号栏（内联或自动换行时忽略）。对应 n-code 的 `show-line-numbers`。',
      },
      { name: 'uri', type: 'boolean', default: 'false', desc: '是否将 `code` 按 URI 解码后展示' },
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
