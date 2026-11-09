/**
 * 评论 Comment 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const commentDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '评论 Comment' },
  ],
  title: '评论 Comment',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '展示评论信息：头像 / 作者 / 时间 / 正文 / 操作，支持嵌套回复。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/comment',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '评论 Comment.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Comment } from '@snui/vue-web';
</script>

<template>
  <Comment />
</template>`,
  },
  demos: [
    {
      name: 'comment-web-basic',
      title: '代码演示',
      blurb: 'avatar / author / datetime / content 完整场景 + actions 插槽。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'author',
        type: 'string',
        default: '—',
        desc: 'Author name; the `author` slot overrides it.',
      },
      {
        name: 'avatar',
        type: 'string',
        default: '—',
        desc: 'Avatar image URL; the `avatar` slot overrides it.',
      },
      {
        name: 'content',
        type: 'string',
        default: '—',
        desc: 'Comment body; the `content` slot overrides it.',
      },
      {
        name: 'datetime',
        type: 'string',
        default: '—',
        desc: 'Datetime text; the `datetime` slot overrides it.',
      },
      {
        name: 'align',
        type: 'SnCommentAlign',
        default: "'left'",
        desc: 'Alignment of the datetime row and the actions row. A string applies to both rows; an object overrides them separately.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '评论 Comment 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Comment } from '@snui/vue-web';",
    chipCopy: "import { Comment } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Comment', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'code', link: '/components/web/code' },
    next: { text: 'data-table', link: '/components/web/data-table' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
