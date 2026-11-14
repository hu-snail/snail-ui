/** Curtain · uni-app x (uni-app x) — English page data. Props from sn-curtain.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const curtainDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Curtain · uni-app x' },
  ],
  title: 'Curtain · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The scrim uses ' },
    { t: 'code', s: '--sn-mp-color-background-overlay' },
    { t: 'text', s: '; the close button uses ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-border-default' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-text-secondary' },
    { t: 'text', s: ' for fill, outline and glyph. All are overridden in the ' },
    { t: 'code', s: '.sn-theme-dark' },
    { t: 'text', s: ' block of `@sn' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-curtain',
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
    fileLabel: 'Curtain · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Curtain } from '@snui/uni';
</script>

<template>
  <sn-curtain />
</template>`,
  },
  demos: [
    {
      name: 'curtain-mp-basic',
      title: 'Basic usage',
      blurb: 'Default inset close button; tapping the image closes the curtain.',
    },
    {
      name: 'curtain-mp-close-position',
      title: 'Close button position',
      blurb: 'top and bottom-right positions; the corner button gets a custom shadow.',
    },
    {
      name: 'curtain-mp-behavior',
      title: 'Close behaviour',
      blurb: 'Image tap keeps it open / scrim tap closes / node kept after close + zIndex=150.',
    },
    {
      name: 'curtain-mp-custom-style',
      title: 'Custom styles',
      blurb: 'custom-close-style lands on the close button; custom-style lands on the root node.',
    },
    {
      name: 'curtain-mp-longpress',
      title: 'Long-press menu (`showMenuByLongpress`)',
      blurb: 'Forwarded to the image; only takes effect in the WeChat miniprogram.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the curtain is shown (v-model).',
      },
      {
        name: 'src',
        type: 'string',
        default: "''",
        desc: 'Image URL — must be a network / package path, not a base64 blob.',
      },
      {
        name: 'width',
        type: 'number',
        default: '0',
        desc: 'Image width in design px; 0 = fit the screen width.',
      },
      {
        name: 'to',
        type: 'string',
        default: "''",
        desc: 'Page path to open when the image is tapped.',
      },
      {
        name: 'closePosition',
        type: 'CurtainClosePosition',
        default: "'inset'",
        desc: 'Where the close button sits.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'false',
        desc: 'Close the curtain when the scrim is tapped.',
      },
      {
        name: 'closeOnClick',
        type: 'boolean',
        default: 'true',
        desc: 'Close the curtain when the image is tapped.',
      },
      {
        name: 'hideWhenClose',
        type: 'boolean',
        default: 'true',
        desc: 'Remove the node from the tree once the leave animation finished.',
      },
      { name: 'zIndex', type: 'number', default: '10', desc: 'Stacking level of the curtain.' },
      {
        name: 'customCloseClass',
        type: 'string',
        default: "''",
        desc: 'Extra class on the close button.',
      },
      {
        name: 'customCloseStyle',
        type: 'string',
        default: "''",
        desc: 'Extra inline style on the close button.',
      },
      {
        name: 'showMenuByLongpress',
        type: 'boolean',
        default: 'false',
        desc: 'Show the WeChat long-press menu on the image (WeChat only).',
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
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for `wd-curtain` parity, NOT implemented — miniprogram has no portal host, so the curtain cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Curtain · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Curtain } from '@snui/uni';",
    chipCopy: "import { Curtain } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-curtain', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Paging', link: '/en/components/uni/paging' },
    next: { text: 'SwipeAction', link: '/en/components/uni/swipe-action' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
