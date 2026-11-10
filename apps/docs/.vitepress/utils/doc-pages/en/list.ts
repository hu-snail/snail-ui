/** List · Web (Web) — English page data. Props from list SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const listDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback Components' }, { text: 'List · Web' }],
  title: 'List · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Generic list container with header / rows / footer areas and prefix /' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/list',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'List · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { List } from '@snui/vue-web';
</script>

<template>
  <List />
</template>`,
  },
  demos: [
    { name: 'list-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'list-web-hoverable', title: 'Hoverable & clickable', blurb: 'Hoverable & clickable' },
    { name: 'list-web-border', title: 'Border & dividers', blurb: 'Border & dividers' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Font scale marker (emitted as a modifier class).',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'false',
        desc: 'Draw the outer border with rounded corners.',
      },
      {
        name: 'clickable',
        type: 'boolean',
        default: 'false',
        desc: 'Rows get the pointer cursor.',
      },
      { name: 'hoverable', type: 'boolean', default: 'false', desc: 'Rows highlight on hover.' },
      {
        name: 'showDivider',
        type: 'boolean',
        default: 'true',
        desc: 'Render the 1px divider between rows.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'List · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { List } from '@snui/vue-web';",
    chipCopy: "import { List } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'List', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'video-player', link: '/en/components/web/video-player' },
    next: { text: 'log', link: '/en/components/web/log' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
