/** Popover · uni-app (uni-app) — English page data. Props from sn-popover.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const popoverDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Popover · uni-app' },
  ],
  title: 'Popover · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'In ' },
    { t: 'code', s: 'normal' },
    { t: 'text', s: ' mode ' },
    { t: 'code', s: 'content' },
    { t: 'text', s: ' is a string; ' },
    { t: 'code', s: 'showClose' },
    {
      t: 'text',
      s: ' adds a close button inside the bubble. Tapping anywhere outside the bubble (page-root closeOutside channel — the same gesture still reaches other controls) or the trigger again closes it.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-popover',
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
    fileLabel: 'Popover · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popover } from '@snui/uni';
</script>

<template>
  <sn-popover />
</template>`,
  },
  demos: [
    {
      name: 'popover-mp-basic',
      title: 'Code demos',
      blurb: 'normal mode + close button; the trigger toggles it, an outside tap closes it.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the bubble is shown (v-model).',
      },
      {
        name: 'content',
        type: 'string | SnPopoverMenuItem[]',
        default: "''",
        desc: 'Bubble body: a string in `normal` mode, a list in `menu` mode.',
      },
      { name: 'mode', type: 'PopoverMode', default: "'normal'", desc: 'Bubble display mode.' },
      { name: 'placement', type: 'PopoverPlacement', default: "'bottom'", desc: 'Bubble anchor.' },
      {
        name: 'offset',
        type: 'PopoverOffset',
        default: '0',
        desc: 'Gap between trigger and bubble, in design px.',
      },
      {
        name: 'visibleArrow',
        type: 'boolean',
        default: 'true',
        desc: 'Render the arrow pointing at the trigger.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the trigger — taps are ignored and the bubble stays closed.',
      },
      {
        name: 'showClose',
        type: 'boolean',
        default: 'false',
        desc: 'Render a close button inside the bubble.',
      },
      {
        name: 'closeOnClickOutside',
        type: 'boolean',
        default: 'true',
        desc: 'Close the bubble when the user taps outside it (additive, AUI-OPT-07). The close rides the page-root `closeOutside` channel and never swallows the tap — the same gesture still lands on whatever button sits under it. Pass `false` to unregister the outside-close while mounted.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Extra class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customArrow',
        type: 'string',
        default: "''",
        desc: 'Extra class on the arrow node.',
      },
      { name: 'customPop', type: 'string', default: "''", desc: 'Extra class on the bubble node.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for `wd-popover` parity, NOT implemented — miniprogram has no portal host, so the bubble cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Popover · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Popover } from '@snui/uni';",
    chipCopy: "import { Popover } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-popover', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-tooltip', link: '/en/components/uni/tooltip' },
    next: { text: 'sn-form', link: '/en/components/uni/form' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
