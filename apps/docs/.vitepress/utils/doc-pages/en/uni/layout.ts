/** Layout · uni-app (uni-app) — English page data. Props from sn-col.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const layoutDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Layout · uni-app' },
  ],
  title: 'Layout · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'All six ' },
    { t: 'code', s: 'justify' },
    { t: 'text', s: ' steps and all three ' },
    { t: 'code', s: 'align' },
    { t: 'text', s: ' steps work on their own; ' },
    { t: 'code', s: 'custom-class' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'custom-style' },
    { t: 'text', s: ' land on the row and column roots:' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-layout',
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
    fileLabel: 'Layout · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Layout } from '@snui/uni';
</script>

<template>
  <sn-layout />
</template>`,
  },
  demos: [
    {
      name: 'layout-mp-basic',
      title: 'Basic usage',
      blurb: 'span is the column count out of 24; the three common splits are 24, 12+12 and 8+8+8.',
    },
    {
      name: 'layout-mp-gutter',
      title: 'Gutters, offsets and alignment',
      blurb:
        'gutter=16 spaces the columns; offset=8 pushes a column right; justify=space-between with align=middle aligns the row.',
    },
    {
      name: 'layout-mp-align',
      title: 'Every alignment step and custom styles',
      blurb:
        'justify center / end / space-around / space-evenly; align middle / bottom; row-level and column-level customClass / customStyle.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'span',
        type: 'number',
        default: '24',
        desc: '列元素宽度（栅格占据的列数，共 24 列）。',
      },
      {
        name: 'offset',
        type: 'number',
        default: '0',
        desc: '列元素偏移距离（栅格左侧的间隔列数）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Layout · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Layout } from '@snui/uni';",
    chipCopy: "import { Layout } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-layout', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-text', link: '/en/components/uni/text' },
    next: { text: 'sn-cell', link: '/en/components/uni/cell' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
