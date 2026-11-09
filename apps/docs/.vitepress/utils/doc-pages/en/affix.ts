/** Affix (Web) — English page data. Props from SnAffix.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const affixDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'Affix' }],
  title: 'Affix',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Pin an element to the viewport (or a custom scroll container) while the page scrolls, then release it when the scroll position returns past the point at which it stuck. Typical uses: sticky table headers, sticky sidebars, sticky action bars, "save" toolbars on long forms.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/affix',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Affix.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Affix } from '@snui/vue-web';
</script>

<template>
  <Affix />
</template>`,
  },
  demos: [
    { name: 'affix-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'affix-web-position', title: 'Offset position', blurb: 'Offset position' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'top',
        type: 'number',
        default: 'undefined as any',
        desc: 'Offset from the viewport top when stuck.',
      },
      {
        name: 'bottom',
        type: 'number',
        default: 'undefined as any',
        desc: 'Offset from the viewport bottom when stuck.',
      },
      {
        name: 'triggerTop',
        type: 'number',
        default: 'undefined as any',
        desc: 'Scroll threshold that starts top-sticking. Falls back to `top`.',
      },
      {
        name: 'triggerBottom',
        type: 'number',
        default: 'undefined as any',
        desc: 'Scroll threshold that starts bottom-sticking. Falls back to `bottom`.',
      },
      {
        name: 'position',
        type: "'fixed' | 'absolute'",
        default: "'fixed'",
        desc: '`fixed` removes the element from flow; `absolute` keeps it in flow.',
      },
      { name: 'offsetTop', type: 'number', default: 'undefined as any', desc: 'offsetTop' },
      { name: 'offsetBottom', type: 'number', default: 'undefined as any', desc: 'offsetBottom' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Affix ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Affix } from '@snui/vue-web';",
    chipCopy: "import { Affix } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Affix', tone: 'accent' },
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
