/** BackTop (Web) — English page data. Props from SnBackTop.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const backTopDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'BackTop' }],
  title: 'BackTop',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A floating button that appears once the user has scrolled past a threshold and smooth-scrolls the container back to the top when clicked. Typical use: long article or catalogue pages.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/back-top',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'BackTop.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { BackTop } from '@snui/vue-web';
</script>

<template>
  <BackTop />
</template>`,
  },
  demos: [
    { name: 'back-top-web-basic', title: 'Top web basic', blurb: 'Top web basic' },
    {
      name: 'back-top-web-visibility-height',
      title: 'Top web visibility height',
      blurb: 'Top web visibility height',
    },
    {
      name: 'back-top-web-change-position',
      title: 'Top web change position',
      blurb: 'Top web change position',
    },
    {
      name: 'back-top-web-target-container',
      title: 'Top web target container',
      blurb: 'Top web target container',
    },
    { name: 'back-top-web-control', title: 'Top web control', blurb: 'Top web control' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean',
        default: 'undefined as any',
        desc: 'Controlled visibility. When omitted the component manages it itself from the scroll position (`v-model:show`).',
      },
      {
        name: 'right',
        type: 'string | number',
        default: '40',
        desc: 'Distance from the viewport right edge.',
      },
      {
        name: 'bottom',
        type: 'string | number',
        default: '40',
        desc: 'Distance from the viewport bottom edge.',
      },
      {
        name: 'to',
        type: 'HTMLElement | string',
        default: "'body'",
        desc: 'Element to render the button into. Accepted for API parity.',
      },
      {
        name: 'visibilityHeight',
        type: 'number',
        default: '180',
        desc: 'Scroll distance after which the button appears.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'BackTop ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { BackTop } from '@snui/vue-web';",
    chipCopy: "import { BackTop } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'BackTop', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'Props Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
