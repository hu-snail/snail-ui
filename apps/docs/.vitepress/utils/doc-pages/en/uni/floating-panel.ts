/** FloatingPanel · uni-app (uni-app) — English page data. Props from sn-floating-panel.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const floatingPanelDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'FloatingPanel · uni-app' },
  ],
  title: 'FloatingPanel · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The wot-ui default is ' },
    { t: 'code', s: '[100, viewportHeight * 0.6]' },
    { t: 'text', s: '. There is no ' },
    { t: 'code', s: 'window' },
    { t: 'text', s: ' on miniprogram, so the default is resolved from ' },
    { t: 'code', s: 'globalThis.uni.getSystemInfoSync()' },
    { t: 'text', s: ', falling back to the single ' },
    { t: 'code', s: '100' },
    { t: 'text', s: ' anchor. An explicit ' },
    { t: 'code', s: 'anchors' },
    { t: 'text', s: ' array always wins; it is sorted and n' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-floating-panel',
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
    fileLabel: 'FloatingPanel · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { FloatingPanel } from '@snui/uni';
</script>

<template>
  <sn-floating-panel />
</template>`,
  },
  demos: [
    {
      name: 'floating-panel-mp-basic',
      title: 'Basic usage',
      blurb:
        'Drag the bar to resize; anchors at 120 / 320 with the current and settled height shown live.',
    },
    {
      name: 'floating-panel-mp-config',
      title: 'Controlled height / no animation / content not draggable',
      blurb:
        'Button-controlled height + duration=0 + content not draggable + hidden scrollbar + safe area.',
    },
    {
      name: 'floating-panel-mp-custom',
      title: 'Custom class and style',
      blurb:
        'custom-style radius / custom-class shadow, with snapping still working on the handle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'height',
        type: 'number',
        default: '0',
        desc: 'Panel height in design px (v-model:height).',
      },
      {
        name: 'anchors',
        type: 'number[]',
        default: '() => []',
        desc: 'Snap points in design px; empty = free positioning.',
      },
      {
        name: 'duration',
        type: 'number',
        default: 'DEFAULT_DURATION',
        desc: 'Snap animation duration in ms; 0 disables the animation.',
      },
      {
        name: 'contentDraggable',
        type: 'boolean',
        default: 'true',
        desc: 'Let the content area drag the panel too, not only the handle.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'false',
        desc: 'Pad the panel for the device safe area.',
      },
      {
        name: 'showScrollbar',
        type: 'boolean',
        default: 'true',
        desc: 'Render the scrollbar of the content area.',
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
    copy: 'FloatingPanel · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { FloatingPanel } from '@snui/uni';",
    chipCopy: "import { FloatingPanel } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-floating-panel', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-swipe-action', link: '/en/components/uni/swipe-action' },
    next: { text: 'sn-avatar', link: '/en/components/uni/avatar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
