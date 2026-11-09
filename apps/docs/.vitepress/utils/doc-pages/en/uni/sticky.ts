/** Sticky · uni-app (uni-app) — English page data. Props from sn-sticky.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const stickyDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Sticky · uni-app' },
  ],
  title: 'Sticky · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Wrap the content that should stay pinned; it stays visible while the scroll container (page or ',
    },
    { t: 'code', s: 'scroll-view' },
    { t: 'text', s: ') scrolls:' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-sticky',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Sticky · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Sticky } from '@snui/uni';
</script>

<template>
  <sn-sticky />
</template>`,
  },
  demos: [
    {
      name: 'sticky-mp-basic',
      title: 'Basic usage',
      blurb:
        'Used inside a scroll-view; offset-top sets the sticky distance; z-index sets the stacking level.',
    },
    {
      name: 'sticky-mp-offset',
      title: 'Custom offset and stacking level',
      blurb: 'offset-top=24 sticks 24px from the top; z-index=20 sets the stacking level.',
    },
    {
      name: 'sticky-mp-layers',
      title: 'Stacked layers and custom styling',
      blurb:
        'custom-class / custom-style on the root; two layers with different offset-top pin in sequence; z-index ordering.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'zIndex', type: 'number', default: '1', desc: '层级。' },
      { name: 'offsetTop', type: 'number', default: '0', desc: '吸顶距离（px）。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Sticky · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Sticky } from '@snui/uni';",
    chipCopy: "import { Sticky } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-sticky', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-collapse', link: '/en/components/uni/collapse' },
    next: { text: 'sn-grid', link: '/en/components/uni/grid' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
