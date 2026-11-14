/** Popover · uni-app x (uni-app x) — English page data. Props from sn-popover.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const popoverDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Popover · uni-app x' },
  ],
  title: 'Popover · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
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
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Popover · uni-app x.vue',
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
    { name: 'popover-mp-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'popover-mp-height', title: 'Auto height', blurb: 'Auto height' },
    {
      name: 'popover-mp-menu',
      title: 'Menu mode and icon configuration',
      blurb: 'Menu mode and icon configuration',
    },
    {
      name: 'popover-mp-placement',
      title: 'Placement / arrow / disabled / colors',
      blurb: 'Placement / arrow / disabled / colors',
    },
    { name: 'popover-mp-theme', title: 'Dark theme', blurb: 'Dark theme' },
    {
      name: 'popover-mp-icon-class',
      title: 'Legacy icon field (`iconClass`)',
      blurb:
        'In menu mode the legacy iconClass field still works: names resolve through SnIcon, image sources render as <image>.',
    },
    {
      name: 'popover-mp-content-slot',
      title: '`content` slot',
      blurb: 'The #content slot replaces the bubble body entirely, in both modes.',
    },
    {
      name: 'popover-mp-custom-style',
      title: 'Node classes & offset',
      blurb:
        'custom-arrow / custom-pop append classes; offset and custom-style act on the root node.',
    },
  ],
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
    copy: 'Popover · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Popover } from '@snui/uni';",
    chipCopy: "import { Popover } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-popover', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Tooltip', link: '/en/components/uni/tooltip' },
    next: { text: 'Form', link: '/en/components/uni/form' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
