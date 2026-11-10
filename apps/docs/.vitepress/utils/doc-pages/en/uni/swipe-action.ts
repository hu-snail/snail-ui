/** SwipeAction · uni-app (uni-app) — English page data. Props from sn-swipe-action.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const swipeActionDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'SwipeAction · uni-app' },
  ],
  title: 'SwipeAction · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Put the row content in the default slot and the actions in ' },
    { t: 'code', s: 'right' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'left' },
    { t: 'text', s: '. ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' reports ' },
    { t: 'code', s: "'left' | 'close' | 'right'" },
    { t: 'text', s: '.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-swipe-action',
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
    fileLabel: 'SwipeAction · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SwipeAction } from '@snui/uni';
</script>

<template>
  <sn-swipe-action />
</template>`,
  },
  demos: [
    {
      name: 'swipe-action-mp-basic',
      title: 'Basic usage',
      blurb: 'Swipe left to reveal Delete; the state is shown live.',
    },
    {
      name: 'swipe-action-mp-both-sides',
      title: 'Both sides / close guard',
      blurb: 'Left and right action areas + before-close blocking the first close.',
    },
    {
      name: 'swipe-action-mp-disabled',
      title: 'Disabled and custom styles',
      blurb: 'Swipeable + custom-class / custom-style, plus a disabled row that stays closed.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SwipeActionStatus',
        default: "'close'",
        desc: 'Current swipe state (v-model): `left` / `close` / `right`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable swiping — the row stays closed.',
      },
      {
        name: 'beforeClose',
        type: 'SwipeActionBeforeClose',
        default: '—',
        desc: 'Close guard; `false` (or a promise of it) blocks the close.',
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
    copy: 'SwipeAction · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { SwipeAction } from '@snui/uni';",
    chipCopy: "import { SwipeAction } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-swipe-action', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-curtain', link: '/en/components/uni/curtain' },
    next: { text: 'sn-floating-panel', link: '/en/components/uni/floating-panel' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
