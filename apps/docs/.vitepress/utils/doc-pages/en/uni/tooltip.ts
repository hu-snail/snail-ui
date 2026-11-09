/** Tooltip · uni-app (uni-app) — English page data. Props from sn-tooltip.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tooltipDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Tooltip · uni-app' },
  ],
  title: 'Tooltip · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'An array ' },
    { t: 'code', s: 'content' },
    { t: 'text', s: ' renders one line per entry (objects contribute whichever of ' },
    { t: 'code', s: 'label' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'text' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'content' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'name' },
    { t: 'text', s: ' is present); the ' },
    { t: 'code', s: 'content' },
    { t: 'text', s: ' slot replaces the bubble body entirely with any structure:' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tooltip',
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
    fileLabel: 'Tooltip · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tooltip } from '@snui/uni';
</script>

<template>
  <sn-tooltip />
</template>`,
  },
  demos: [
    {
      name: 'tooltip-mp-basic',
      title: 'Basic usage',
      blurb: 'Tap the button to toggle the bubble; tapping outside closes it.',
    },
    {
      name: 'tooltip-mp-placement',
      title: 'Placement',
      blurb: 'All 12 directions in the wot-ui demo grid, one open at a time.',
    },
    {
      name: 'tooltip-mp-config',
      title: 'Arrow / close button / offset / colors',
      blurb: 'No arrow / close button + offset / disabled.',
    },
    {
      name: 'tooltip-mp-content',
      title: 'Multi-line content and the content slot',
      blurb:
        'array content renders multiple lines; the content slot carries a custom structure; offset as [x, y] and { x, y }.',
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
        type: 'string | TooltipContentRow[]',
        default: "''",
        desc: 'Bubble text; an array renders one line per entry.',
      },
      { name: 'placement', type: 'TooltipPlacement', default: "'bottom'", desc: 'Bubble anchor.' },
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
        name: 'customArrow',
        type: 'string',
        default: "''",
        desc: 'Extra class on the arrow node.',
      },
      { name: 'customPop', type: 'string', default: "''", desc: 'Extra class on the bubble node.' },
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
        desc: "Accepted for `wd-tooltip` parity, NOT implemented — miniprogram has no portal host, so the bubble cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tooltip · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tooltip } from '@snui/uni';",
    chipCopy: "import { Tooltip } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tooltip', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-drop-menu', link: '/en/components/uni/drop-menu' },
    next: { text: 'sn-popover', link: '/en/components/uni/popover' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
