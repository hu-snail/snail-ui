/** Notify · uni-app (uni-app) — English page data. Props from sn-notify.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const notifyDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Notify · uni-app' },
  ],
  title: 'Notify · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The fills and text colors all come from semantic tokens (' },
    { t: 'code', s: '--sn-mp-color-action-primary' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-feedback-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-text-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: '), all overridden in the dark block of ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    { t: 'text', s: ', so it adapts aut' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-notify',
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
    fileLabel: 'Notify · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Notify } from '@snui/uni';
</script>

<template>
  <sn-notify />
</template>`,
  },
  demos: [
    {
      name: 'notify-mp-basic',
      title: 'Basic usage',
      blurb: 'primary / success / warning / danger.',
    },
    {
      name: 'notify-mp-variant',
      title: 'Variant and position',
      blurb: 'Floating card, closable (never auto-dismisses), bottom anchor.',
    },
    {
      name: 'notify-mp-style',
      title: 'Colors, stacking and safe area',
      blurb: 'Custom fill and text color / safe-height=88 / zIndex=300 + custom-style.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the notification is visible (v-model:visible).',
      },
      {
        name: 'type',
        type: 'NotifyType',
        default: "'danger'",
        desc: 'Semantic type — drives the fill color and the default icon.',
      },
      {
        name: 'message',
        type: 'string | number',
        default: "''",
        desc: 'Message text; `\\n` renders as a line break.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '3000',
        desc: 'Auto-dismiss delay in ms; `0` keeps the notification open.',
      },
      { name: 'position', type: 'NotifyPosition', default: "'top'", desc: 'Anchor of the banner.' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Text color override (any CSS color value).',
      },
      {
        name: 'background',
        type: 'string',
        default: "''",
        desc: 'Background color override (any CSS color value).',
      },
      { name: 'zIndex', type: 'number', default: '99', desc: 'Stacking level.' },
      {
        name: 'safeHeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Extra top offset in px (or any CSS length) — accounts for a custom nav bar.',
      },
      { name: 'closable', type: 'boolean', default: 'false', desc: 'Show the close button.' },
      {
        name: 'variant',
        type: 'NotifyVariant',
        default: "'filled'",
        desc: 'Visual shape: edge-to-edge bar or a floating rounded card.',
      },
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'Instance id used by the function API (parity only, no effect here).',
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
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Notify · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Notify } from '@snui/uni';",
    chipCopy: "import { Notify } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-notify', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-toast', link: '/en/components/uni/toast' },
    next: { text: 'sn-notice-bar', link: '/en/components/uni/notice-bar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
