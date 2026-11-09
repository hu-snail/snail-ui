/** LoadingBar (Web) — English page data. Props from loading-bar SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const loadingBarDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback Components' }, { text: 'LoadingBar' }],
  title: 'LoadingBar',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Not suitable: localised spinners belong in ' },
    { t: 'code', s: 'SnLoading' },
    {
      t: 'text',
      s: '; exact percentages should be implemented by the app itself — this component carries no real progress.',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/loading-bar',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'LoadingBar.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { LoadingBar } from '@snui/vue-web';
</script>

<template>
  <LoadingBar />
</template>`,
  },
  demos: [
    { name: 'loading-bar-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    {
      name: 'loading-bar-web-flow',
      title: 'Full flow and error comparison',
      blurb: 'Full flow and error comparison',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'barStyle',
        type: 'StyleValue',
        default: '—',
        desc: 'Inline style (width / opacity / transition) computed by the provider.',
      },
      {
        name: 'status',
        type: 'LoadingBarStatus',
        default: '—',
        desc: "Colour state: 'default' primary colour, 'error' danger colour.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'LoadingBar ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { LoadingBar } from '@snui/vue-web';",
    chipCopy: "import { LoadingBar } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'LoadingBar', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'notification', link: '/en/components/web/notification' },
    next: { text: 'progress', link: '/en/components/web/progress' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
