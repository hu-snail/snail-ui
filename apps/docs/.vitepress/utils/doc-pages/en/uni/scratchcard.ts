/** Scratchcard (uni-app) — English page data. Props from sn-scratchcard.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const scratchcardDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Business Components' },
    { text: 'Scratchcard' },
  ],
  title: 'Scratchcard',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Prize content goes in the default slot; ' },
    { t: 'code', s: 'ratio' },
    { t: 'text', s: ' sets the threshold, ' },
    { t: 'code', s: 'title' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'watermarkText' },
    { t: 'text', s: ' customize the cover.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-scratchcard',
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
    fileLabel: 'Scratchcard.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Scratchcard } from '@snui/uni';
</script>

<template>
  <sn-scratchcard />
</template>`,
  },
  demos: [
    {
      name: 'scratchcard-mp',
      title: 'Demos',
      blurb: 'Real pointer scratching, threshold open callback, and reset.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'coverColor',
        type: 'string',
        default: "'#C5C5C5'",
        desc: '封面颜色（coverImg 优先）。',
      },
      { name: 'coverImg', type: 'string', default: "''", desc: '封面图片。' },
      { name: 'ratio', type: 'number', default: '0.8', desc: '刮开比例阈值（0-1）。' },
      { name: 'scratchRadius', type: 'number', default: '10', desc: '刮擦半径（px）。' },
      { name: 'watermarkText', type: 'string', default: "''", desc: '封面水印文字。' },
      { name: 'watermarkSize', type: 'number', default: '14', desc: '水印字号（px）。' },
      { name: 'watermarkColor', type: 'string', default: "'rgba(0", desc: '水印颜色。' },
      { name: 'title', type: 'string', default: "''", desc: '封面标题文字。' },
      { name: 'titleSize', type: 'number', default: '24', desc: '标题字号（px）。' },
      { name: 'titleColor', type: 'string', default: "'rgba(0", desc: '标题颜色。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: '根节点自定义样式（至少提供 width / height）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Scratchcard ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Scratchcard } from '@snui/uni';",
    chipCopy: "import { Scratchcard } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-scratchcard', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-dialer', link: '/en/components/uni/dialer' },
    next: { text: 'sn-lucky', link: '/en/components/uni/lucky' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
