/** Card · uni-app (Mobile) (uni-app) — English page data. Props from sn-card.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const cardDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'Card · uni-app (Mobile)' },
  ],
  title: 'Card · uni-app (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-card',
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
    fileLabel: 'Card · uni-app (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Card } from '@snui/uni';
</script>

<template>
  <sn-card />
</template>`,
  },
  demos: [
    {
      name: 'card-mp',
      title: 'Basic usage',
      blurb:
        "Default card (title prop + footer slot) + Rectangle card (type='rectangle', list-style).",
    },
    {
      name: 'card-mp-custom',
      title: 'Per-region custom classes and styles',
      blurb:
        'Three region classes, the root class plus inline style, and the same customisation on the rectangle variant.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Card title. Rendered in the title region; can be empty.',
      },
      {
        name: 'type',
        type: 'string',
        default: "''",
        desc: "Card type. 'rectangle' adds the rectangle (大格) visual style.",
      },
      {
        name: 'customTitleClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the title region.',
      },
      {
        name: 'customContentClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the content region.',
      },
      {
        name: 'customFooterClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the footer region.',
      },
      {
        name: 'customClass',
        type: 'string',
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
    copy: 'Card · uni-app (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Card } from '@snui/uni';",
    chipCopy: "import { Card } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-card', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-avatar-group', link: '/en/components/uni/avatar-group' },
    next: { text: 'sn-img', link: '/en/components/uni/img' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
