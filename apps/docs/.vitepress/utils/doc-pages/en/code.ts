/** Code · Web (Web) — English page data. Props from code SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const codeDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback Components' }, { text: 'Code · Web' }],
  title: 'Code · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Monospace code block with an optional line-number gutter, soft-wrap, inline' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/code',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Code · Web.vue',
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
    { name: 'code-web-basic', title: 'Basic', blurb: 'JSON token colors + plain languages.' },
    { name: 'code-web-inline', title: 'Inline', blurb: 'Inline code inside a sentence.' },
    { name: 'code-web-softwrap', title: 'Word wrap', blurb: 'Soft-wrap overflowing lines.' },
    {
      name: 'code-web-line-numbers',
      title: 'Line numbers',
      blurb: 'Gutter aligned with code rows.',
    },
    {
      name: 'code-web-loop-debug',
      title: 'Reactive code',
      blurb: 'code prop updates re-render tokens.',
    },
  ],
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Code · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Code } from '@snui/vue-web';",
    chipCopy: "import { Code } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Code', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'countdown', link: '/en/components/web/countdown' },
    next: { text: 'comment', link: '/en/components/web/comment' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
