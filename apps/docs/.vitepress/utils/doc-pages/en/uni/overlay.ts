/** Overlay · uni-app x (uni-app x) — English page data. Props from sn-overlay.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const overlayDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Overlay · uni-app x' },
  ],
  title: 'Overlay · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The scrim uses ' },
    { t: 'code', s: '--sn-mp-color-background-overlay' },
    { t: 'text', s: ', already overridden in the ' },
    { t: 'code', s: '.sn-theme-dark' },
    { t: 'text', s: ' block of ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    {
      t: 'text',
      s: ' (a deeper near-black), so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-overlay',
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
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Overlay · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Overlay } from '@snui/uni';
</script>

<template>
  <sn-overlay />
</template>`,
  },
  demos: [
    {
      name: 'overlay-mp-basic',
      title: 'Basic usage',
      blurb: 'Scrim taps are counted; content on the scrim uses @tap.stop to keep the scrim open.',
    },
    {
      name: 'overlay-mp-config',
      title: 'Animation and scroll lock',
      blurb: 'duration=false / duration=800 + zIndex / lockScroll=false + customStyle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'show', type: 'boolean', default: 'false', desc: 'Whether the overlay is shown.' },
      {
        name: 'duration',
        type: 'OverlayDuration',
        default: 'DEFAULT_DURATION',
        desc: 'Animation duration in ms. `false` = no animation, record = per-leg.',
      },
      {
        name: 'lockScroll',
        type: 'boolean',
        default: 'true',
        desc: 'Lock background scroll while shown (intercepts touchmove).',
      },
      { name: 'zIndex', type: 'number', default: '10', desc: 'Stacking level.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Overlay · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Overlay } from '@snui/uni';",
    chipCopy: "import { Overlay } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-overlay', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Popup', link: '/en/components/uni/popup' },
    next: { text: 'Dialog', link: '/en/components/uni/dialog' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
