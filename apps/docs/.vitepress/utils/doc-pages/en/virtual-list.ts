/** VirtualList · Web (Web) — English page data. Props from virtual-list SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const virtualListDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'VirtualList · Web' },
  ],
  title: 'VirtualList · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'The virtual list renders only the rows inside the viewport (plus an overscan',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/virtual-list',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'VirtualList · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { VirtualList } from '@snui/vue-web';
</script>

<template>
  <VirtualList />
</template>`,
  },
  demos: [
    { name: 'virtual-list-web-basic', title: 'Basic', blurb: 'Basic' },
    {
      name: 'virtual-list-web-resizable',
      title: 'Dynamic row heights',
      blurb: 'Dynamic row heights',
    },
    {
      name: 'virtual-list-web-scroll',
      title: 'Scroll readout and overscan buffering',
      blurb: 'Scroll readout and overscan buffering',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'items',
        type: 'SnVirtualListItem[]',
        default: '() => []',
        desc: 'Full data list (only the visible window renders). Mirrors n-virtual-list `items`.',
      },
      {
        name: 'itemSize',
        type: 'number',
        default: '30',
        desc: 'Fixed row height in px (also the fallback estimate for unmeasured rows). Mirrors n-virtual-list `itemSize`.',
      },
      {
        name: 'itemResizable',
        type: 'boolean',
        default: 'false',
        desc: 'Measure rendered rows with ResizeObserver and reflow from measured heights. Mirrors n-virtual-list `itemResizable`.',
      },
      {
        name: 'keyField',
        type: 'string',
        default: "'value'",
        desc: 'Object field used as the render key. Mirrors n-virtual-list `keyField`.',
      },
      {
        name: 'overscan',
        type: 'number',
        default: '3',
        desc: 'Extra rows rendered above / below the visible window. Mirrors n-virtual-list `overscan`.',
      },
      {
        name: 'visibleHeight',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Viewport height in px; when omitted the container height is measured.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnVirtualList.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'scroll',
        payload: 'Event',
        desc: 'Native scroll event of the container; mirrors n-virtual-list `on-scroll`.',
      },
      {
        name: 'update:scrollTop',
        payload: '(scrollTop: number)',
        desc: 'rAF-throttled scroll offset; mirrors n-virtual-list `on-update:scroll-top`.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnVirtualList.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'item',
        props: '{ item: SnVirtualListItem; index: number }',
        desc: 'Row content; receives `{ item, index }`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'VirtualList · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { VirtualList } from '@snui/vue-web';",
    chipCopy: "import { VirtualList } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'VirtualList', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'ellipsis', link: '/en/components/web/ellipsis' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
