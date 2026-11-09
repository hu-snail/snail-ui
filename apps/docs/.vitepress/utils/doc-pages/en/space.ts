/** Space · Web (Web) — English page data. Props from space SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const spaceDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Layout Components' }, { text: 'Space · Web' }],
  title: 'Space · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Spacing container (n-space aligned). CSS gap — no wrapper elements.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/space',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Space · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Space } from '@snui/vue-web';
</script>

<template>
  <Space />
</template>`,
  },
  demos: [
    { name: 'space-web-basic', title: 'Basic', blurb: 'Horizontal + preset size.' },
    {
      name: 'space-web-vertical',
      title: 'Vertical & tuple gap',
      blurb: 'vertical + [horizontal, vertical] gap.',
    },
    { name: 'space-web-align', title: 'Align & wrap', blurb: 'justify / align / wrap.' },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'vertical',
        type: 'boolean',
        default: 'false',
        desc: 'Stack children vertically (column). Default false (row).',
      },
      {
        name: 'size',
        type: 'SnSpaceGap',
        default: "'medium'",
        desc: "Gap between children: px number, preset, or [horizontal, vertical] tuple. Default 'medium'.",
      },
      {
        name: 'wrap',
        type: 'boolean',
        default: 'true',
        desc: 'Let horizontal children wrap across lines. Default true.',
      },
      {
        name: 'justify',
        type: 'SnSpaceJustify',
        default: "'start'",
        desc: "Main-axis distribution. Default 'start' (→ flex-start, like n-space).",
      },
      {
        name: 'align',
        type: 'SnSpaceAlign',
        default: '—',
        desc: "Cross-axis alignment. Default undefined (CSS 'normal', like n-space).",
      },
      {
        name: 'inline',
        type: 'boolean',
        default: 'false',
        desc: 'Render as inline-flex. Default false.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: "Extra class appended to the container (snail extension). Default ''.",
      },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: "Inline style appended to the container (snail extension). Default ''.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Space · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Space } from '@snui/vue-web';",
    chipCopy: "import { Space } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Space', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    next: { text: 'flex', link: '/en/components/web/flex' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
