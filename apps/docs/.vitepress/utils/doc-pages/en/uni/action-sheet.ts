/** ActionSheet · uni-app x (uni-app x) — English page data. Props from sn-action-sheet.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const actionSheetDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'ActionSheet · uni-app x' },
  ],
  title: 'ActionSheet · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Each ' },
    { t: 'code', s: 'actions' },
    { t: 'text', s: ' entry renders one row; an empty ' },
    { t: 'code', s: 'cancelText' },
    { t: 'text', s: ' hides the cancel button.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-action-sheet',
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
    fileLabel: 'ActionSheet · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ActionSheet } from '@snui/uni';
</script>

<template>
  <sn-action-sheet />
</template>`,
  },
  demos: [
    {
      name: 'action-sheet-mp-basic',
      title: 'Basic usage',
      blurb: 'List rows plus a cancel button, with one disabled entry.',
    },
    {
      name: 'action-sheet-mp-header',
      title: 'Header & close button',
      blurb:
        'Title + description + title-row close button (description / show-close are AUI-additive).',
    },
    {
      name: 'action-sheet-mp-action-icons',
      title: 'Row icons (`icon`)',
      blurb: 'Each action row can carry an icon, resolved by registry name.',
    },
    {
      name: 'action-sheet-mp-panels',
      title: 'Icon grid',
      blurb: 'Single-row and multi-row grids, icons from the sn-icon registry.',
    },
    {
      name: 'action-sheet-mp-behavior',
      title: 'Close behaviour and animation',
      blurb: 'Stays open after selecting / scrim tap does not close / duration=600 + zIndex=200.',
    },
    {
      name: 'action-sheet-mp-custom-style',
      title: 'Custom styles',
      blurb: 'custom-title-class styles the title; custom-style lands on the panel.',
    },
    {
      name: 'action-sheet-mp-render',
      title: 'Render timing & safe area',
      blurb:
        'lazy-render=false renders up front; safe-area-inset-bottom=false drops the bottom padding.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the sheet is visible (v-model).',
      },
      { name: 'actions', type: 'SnActionSheetAction[]', default: '() => []', desc: 'List rows.' },
      {
        name: 'panels',
        type: 'Array<SnActionSheetPanel | SnActionSheetPanel[]>',
        default: '() => []',
        desc: 'Grid cells; a nested array is treated as multiple rows.',
      },
      { name: 'title', type: 'string', default: "''", desc: 'Title text above the list.' },
      {
        name: 'description',
        type: 'string',
        default: "''",
        desc: 'Intro text shown under the title (AUI-additive).',
      },
      {
        name: 'cancelText',
        type: 'string',
        default: "''",
        desc: 'Cancel button label. An empty string hides the cancel button.',
      },
      {
        name: 'showClose',
        type: 'boolean',
        default: 'false',
        desc: 'Show the close button in the title row (AUI-additive).',
      },
      {
        name: 'closeOnClickAction',
        type: 'boolean',
        default: 'true',
        desc: 'Close the sheet after a row / cell is selected.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Close the sheet when the scrim is tapped.',
      },
      { name: 'duration', type: 'number', default: '200', desc: 'Animation duration in ms.' },
      { name: 'zIndex', type: 'number', default: '10', desc: 'Stacking level of the sheet.' },
      {
        name: 'lazyRender',
        type: 'boolean',
        default: 'true',
        desc: 'Defer panel content rendering until the sheet is first opened.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the bottom sheet for the device safe area.',
      },
      {
        name: 'customTitleClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the title area.',
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
        desc: 'Custom inline style for the panel.',
      },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'ActionSheet · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { ActionSheet } from '@snui/uni';",
    chipCopy: "import { ActionSheet } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-action-sheet', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Dialog', link: '/en/components/uni/dialog' },
    next: { text: 'Loading', link: '/en/components/uni/loading' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
