/** DragSort 拖拽排序（Web 端） (Web) — English page data. Props from drag-sort SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dragSortDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'DragSort 拖拽排序（Web 端）' },
  ],
  title: 'DragSort 拖拽排序（Web 端）',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'commit on release, ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' binds the complete reordered array. Zero' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/drag-sort',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'DragSort 拖拽排序（Web 端）.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DragSort } from '@snui/vue-web';
</script>

<template>
  <DragSort />
</template>`,
  },
  demos: [
    {
      name: 'drag-sort-web-basic',
      title: 'Examples',
      blurb: 'Live preview + locked row + Alt+arrow keyboard moves.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnDragSortItem[]',
        default: '() => []',
        desc: 'Bound row array (`v-model`). Emits the complete reordered array.',
      },
      {
        name: 'direction',
        type: 'SnDragSortDirection',
        default: "'vertical'",
        desc: 'Layout axis the drag is measured against.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables dragging AND keyboard moves for the whole list.',
      },
      {
        name: 'handle',
        type: 'boolean',
        default: 'false',
        desc: 'Restrict drag initiation to the built-in grip handle — rows stay text-selectable; without it every row is grabbable.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'DragSort 拖拽排序（Web 端） ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DragSort } from '@snui/vue-web';",
    chipCopy: "import { DragSort } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'DragSort', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'transfer', link: '/en/components/web/transfer' },
    next: { text: 'card', link: '/en/components/web/card' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
