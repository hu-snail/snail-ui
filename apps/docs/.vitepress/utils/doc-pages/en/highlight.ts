/** Highlight · Web (Web) — English page data. Props from highlight SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const highlightDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Highlight · Web' },
  ],
  title: 'Highlight · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Highlights matched keywords inside plain text with a configurable element.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/highlight',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Highlight · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Highlight } from '@snui/vue-web';
</script>

<template>
  <Highlight />
</template>`,
  },
  demos: [
    { name: 'highlight-web-basic', title: 'Basic', blurb: 'Multiple patterns rendered as marks.' },
    {
      name: 'highlight-web-style',
      title: 'Custom style',
      blurb: 'highlight-style with design tokens.',
    },
    {
      name: 'highlight-web-case-sensitive',
      title: 'Case sensitive',
      blurb: 'case-sensitive on vs. off.',
    },
    {
      name: 'highlight-web-component',
      title: 'Custom tag',
      blurb: 'highlight-tag=span + underline style.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'text',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Full text to render. Mirrors n-highlight `text`.',
      },
      {
        name: 'patterns',
        type: 'string[]',
        default: '() => []',
        desc: 'Substrings to highlight; matched fragments render inside `highlight-tag`. Mirrors n-highlight `patterns`.',
      },
      {
        name: 'highlightTag',
        type: 'string',
        default: "'mark'",
        desc: 'HTML element used for matched fragments. Mirrors n-highlight `highlight-tag`.',
      },
      {
        name: 'caseSensitive',
        type: 'boolean',
        default: 'false',
        desc: 'Case-sensitive matching. Mirrors n-highlight `case-sensitive`.',
      },
      {
        name: 'autoEscape',
        type: 'boolean',
        default: 'true',
        desc: 'Escape regex metacharacters in `patterns` so they match literally. Mirrors n-highlight `auto-escape`.',
      },
      {
        name: 'highlightClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Extra class merged onto matched fragments. Mirrors n-highlight `highlight-class`.',
      },
      {
        name: 'highlightStyle',
        type: 'CSSProperties | string | undefined',
        default: 'undefined',
        desc: 'Inline style (object or string) merged onto matched fragments. Mirrors n-highlight `highlight-style`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Highlight · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Highlight } from '@snui/vue-web';",
    chipCopy: "import { Highlight } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Highlight', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'infinite-scroll', link: '/en/components/web/infinite-scroll' },
    next: { text: 'heatmap', link: '/en/components/web/heatmap' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
