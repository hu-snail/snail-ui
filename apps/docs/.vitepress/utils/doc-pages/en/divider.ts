/** Divider (Web) — English page data. Props from divider SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dividerDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Divider' }],
  title: 'Divider',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: "import { SnDivider } from '@snui/vue-web';" }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/divider',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Divider.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Divider } from '@snui/vue-web';
</script>

<template>
  <Divider />
</template>`,
  },
  demos: [
    {
      name: 'divider-web',
      title: 'Live preview',
      blurb:
        'Comprehensive preview of all variants: horizontal / dashed / with text / marginSize / vertical.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: 'Axis: horizontal (full-width line) or vertical (inline line).',
      },
      { name: 'dashed', type: 'boolean', default: 'false', desc: 'Dashed instead of solid.' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Optional color override (CSS color value).',
      },
      {
        name: 'marginSize',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Vertical margin (only for horizontal direction).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnDivider.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Optional content shown on the line (e.g. "OR").' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Divider ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Divider } from '@snui/vue-web';",
    chipCopy: "import { Divider } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Divider', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'button', link: '/en/components/web/button' },
    next: { text: 'icon', link: '/en/components/web/icon' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
