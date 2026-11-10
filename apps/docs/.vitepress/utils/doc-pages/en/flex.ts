/** Flex · Web (Web) — English page data. Props from flex SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const flexDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Layout Components' }, { text: 'Flex · Web' }],
  title: 'Flex · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Flex primitive (n-flex aligned). Generic flex container with direct gap values.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/flex',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Flex · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Flex } from '@snui/vue-web';
</script>

<template>
  <Flex />
</template>`,
  },
  demos: [
    { name: 'flex-web-basic', title: 'Basic', blurb: 'Horizontal layout + gap.' },
    {
      name: 'flex-web-vertical',
      title: 'Vertical & alignment',
      blurb: 'vertical / justify / align combos.',
    },
    {
      name: 'flex-web-expand',
      title: 'Expand children',
      blurb: 'expand is a snail extension (absent in naive).',
    },
  ],
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
        name: 'gap',
        type: 'SnFlexGap',
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
        type: 'SnFlexJustify',
        default: "'start'",
        desc: "Main-axis distribution, passed through as-is (like n-flex). Default 'start'.",
      },
      {
        name: 'align',
        type: 'SnFlexAlign',
        default: '—',
        desc: "Cross-axis alignment. Default undefined (CSS 'normal', like n-flex).",
      },
      {
        name: 'inline',
        type: 'boolean',
        default: 'false',
        desc: 'Render as inline-flex. Default false.',
      },
      {
        name: 'expand',
        type: 'boolean',
        default: 'false',
        desc: 'Grow direct children to fill the free main-axis space (snail extension). Default false.',
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
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnFlex.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: "Direct children become the container's flex items." },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Flex · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Flex } from '@snui/vue-web';",
    chipCopy: "import { Flex } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Flex', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'space', link: '/en/components/web/space' },
    next: { text: 'layout', link: '/en/components/web/layout' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
