/** Comment · Web (Web) — English page data. Props from comment SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const commentDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Comment · Web' },
  ],
  title: 'Comment · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Comment block with avatar / author / datetime / content / actions, with' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/comment',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Comment · Web.vue',
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
      title: 'Examples',
      blurb: 'Full avatar / author / datetime / content scene + the actions slot.',
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Comment · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Comment } from '@snui/vue-web';",
    chipCopy: "import { Comment } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Comment', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'code', link: '/en/components/web/code' },
    next: { text: 'data-table', link: '/en/components/web/data-table' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
