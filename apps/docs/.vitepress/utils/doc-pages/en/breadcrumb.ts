/** Breadcrumb (Web) — English page data. Props from SnBreadcrumb.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const breadcrumbDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'Breadcrumb' }],
  title: 'Breadcrumb',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Page breadcrumb trail. Renders a ' },
    { t: 'code', s: '<nav aria-label="Breadcrumb">' },
    { t: 'text', s: ' wrapping a list of ' },
    { t: 'code', s: '<SnBreadcrumbItem>' },
    { t: 'text', s: ' children separated by a separator glyph.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/breadcrumb',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Breadcrumb.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Breadcrumb } from '@snui/vue-web';
</script>

<template>
  <Breadcrumb />
</template>`,
  },
  demos: [
    { name: 'breadcrumb-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'breadcrumb-web-separator', title: 'Custom separator', blurb: 'Custom separator' },
    { name: 'breadcrumb-web-icon', title: 'Icon items', blurb: 'Icon items' },
    { name: 'breadcrumb-web-variant', title: 'Style variants', blurb: 'Style variants' },
    { name: 'breadcrumb-web-max-count', title: 'Max count', blurb: 'Max count' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'separator',
        type: 'string',
        default: "'/'",
        desc: 'Separator glyph between items. Mirrors n-breadcrumb `separator`.',
      },
      {
        name: 'maxCount',
        type: 'number',
        default: 'Infinity',
        desc: 'Maximum number of items to display. When the total exceeds this count, the trail renders as `head(1) + ellipsis + tail(maxCount-1)` — the middle items are folded into a single `…` affordance. Default Infinity (show all). AUI extension beyond n-breadcrumb (naive-ui handles long breadcrumbs via a dropdown slot on the middle item; this prop gives consumers a faster declarative cap). Algorithm matches Element Plus `max-count` / NextUI `maxItems`: - head always shows the first 1 item - tail shows the last `maxCount - 1` items - everything between is collapsed into an ellipsis',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnBreadcrumb.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'default', props: '—', desc: 'Sequence of `<SnBreadcrumbItem>` children.' }],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Breadcrumb ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Breadcrumb } from '@snui/vue-web';",
    chipCopy: "import { Breadcrumb } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Breadcrumb', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
