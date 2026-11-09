/** Skeleton · uni-app (uni-app) — English page data. Props from sn-skeleton.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const skeletonDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Skeleton · uni-app' },
  ],
  title: 'Skeleton · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Each ' },
    { t: 'code', s: 'rowCol' },
    {
      t: 'text',
      s: ' entry is either a number (that many default text blocks in the row) or an array of column descriptors. A descriptor accepts ',
    },
    { t: 'code', s: 'type' },
    { t: 'text', s: ' (' },
    { t: 'code', s: 'text' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'rect' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'circle' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'image' },
    { t: 'text', s: '), ' },
    { t: 'code', s: 'size' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'width' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'height' },
    { t: 'text', s: ' (bare number = rpx), ' },
    { t: 'code', s: 'margin' },
    { t: 'text', s: ', ' },
    { t: 'code', s: 'borderRadius' },
    { t: 'text', s: ' a' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-skeleton',
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
    fileLabel: 'Skeleton · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Skeleton } from '@snui/uni';
</script>

<template>
  <sn-skeleton />
</template>`,
  },
  demos: [
    { name: 'skeleton-mp-basic', title: 'Basic usage', blurb: 'The four preset layouts.' },
    {
      name: 'skeleton-mp-custom',
      title: 'Custom rows and columns',
      blurb: 'A card layout and a mixed image + text layout.',
    },
    {
      name: 'skeleton-mp-animation',
      title: 'Shimmer and switching',
      blurb: 'Both shimmer kinds, plus a loading toggle that reveals the real content.',
    },
    {
      name: 'skeleton-mp-custom-style',
      title: 'Custom class and style',
      blurb: 'custom-class dashed frame / custom-style padding and radius / both together.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'theme',
        type: 'SkeletonTheme',
        default: "'text'",
        desc: 'Preset layout when `rowCol` is empty.',
      },
      {
        name: 'rowCol',
        type: 'SkeletonRowCol[]',
        default: '() => []',
        desc: 'Per-row layout: a column count or an explicit column list per row.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the skeleton is shown; `false` renders the default slot.',
      },
      { name: 'animation', type: 'SkeletonAnimation', default: "''", desc: 'Shimmer kind.' },
      {
        name: 'customClass',
        type: 'string | string[] | Record<string, boolean>',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Skeleton · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Skeleton } from '@snui/uni';",
    chipCopy: "import { Skeleton } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-skeleton', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-empty', link: '/en/components/uni/empty' },
    next: { text: 'sn-loadmore', link: '/en/components/uni/loadmore' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
