/** Infinite Scroll · Web (Web) — English page data. Props from infinite-scroll SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const infiniteScrollDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Infinite Scroll · Web' },
  ],
  title: 'Infinite Scroll · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Scroll container that triggers a load callback near the bottom, with a' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/infinite-scroll',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Infinite Scroll · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { InfiniteScroll } from '@snui/vue-web';
</script>

<template>
  <InfiniteScroll />
</template>`,
  },
  demos: [
    {
      name: 'infinite-scroll-web-basic',
      title: 'Basic',
      blurb: 'height 240px + distance 10, append on load.',
    },
    {
      name: 'infinite-scroll-web-chat',
      title: 'Chat Stream',
      blurb: 'Message stream + pending spinner + no-more notice.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'distance',
        type: 'number',
        default: '0',
        desc: 'Bottom-distance threshold in px that triggers `load`. Mirrors n-infinite-scroll `distance`.',
      },
      {
        name: 'scrollbarProps',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Extra attributes for the internal scroll container (the reference applies them to its Scrollbar). Mirrors n-infinite-scroll `scrollbar-props`.',
      },
      {
        name: 'showLoading',
        type: 'boolean',
        default: 'true',
        desc: 'Render an inline-SVG spinner at the bottom while `load` is pending (addition — the reference ships no loading UI).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Infinite Scroll · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { InfiniteScroll } from '@snui/vue-web';",
    chipCopy: "import { InfiniteScroll } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'InfiniteScroll', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tree', link: '/en/components/web/tree' },
    next: { text: 'highlight', link: '/en/components/web/highlight' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
