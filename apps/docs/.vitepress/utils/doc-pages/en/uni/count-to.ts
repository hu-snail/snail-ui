/** CountTo · uni-app (uni-app) — English page data. Props from sn-count-to.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const countToDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'CountTo · uni-app' },
  ],
  title: 'CountTo · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Exposed methods: ' },
    { t: 'code', s: 'start()' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'pause()' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'reset()' },
    { t: 'text', s: '.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-count-to',
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
    fileLabel: 'CountTo · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { CountTo } from '@snui/uni';
</script>

<template>
  <sn-count-to />
</template>`,
  },
  demos: [
    {
      name: 'count-to-mp-basic',
      title: 'Basic usage',
      blurb: 'Basic tween, currency prefix, decimals and a custom separator.',
    },
    {
      name: 'count-to-mp-type',
      title: 'Type colors and controls',
      blurb: 'Five type colors plus manual start / pause / reset.',
    },
    {
      name: 'count-to-mp-easing',
      title: 'Easing and custom classes',
      blurb: 'The rhythm with use-easing on and off, plus customClass / customStyle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Text color override (any CSS color value).',
      },
      {
        name: 'type',
        type: 'CountToType',
        default: "'default'",
        desc: 'Semantic text theme; `default` uses the body text token.',
      },
      { name: 'startVal', type: 'number', default: '0', desc: 'Start value.' },
      { name: 'endVal', type: 'number', default: '2024', desc: 'End value.' },
      { name: 'duration', type: 'number', default: '3000', desc: 'Tween duration in ms.' },
      {
        name: 'autoStart',
        type: 'boolean',
        default: 'true',
        desc: 'Start the animation on mount / on value change.',
      },
      { name: 'decimals', type: 'number', default: '0', desc: 'Decimal places to keep (>= 0).' },
      { name: 'decimal', type: 'string', default: "'.'", desc: 'Decimal separator character.' },
      { name: 'separator', type: 'string', default: "'", desc: 'Thousands separator character.' },
      { name: 'prefix', type: 'string', default: "''", desc: 'Text before the number.' },
      { name: 'suffix', type: 'string', default: "''", desc: 'Text after the number.' },
      {
        name: 'useEasing',
        type: 'boolean',
        default: 'true',
        desc: 'Use cubic ease-out instead of a linear ramp.',
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
    copy: 'CountTo · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { CountTo } from '@snui/uni';",
    chipCopy: "import { CountTo } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-count-to', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-count-down', link: '/en/components/uni/count-down' },
    next: { text: 'sn-watermark', link: '/en/components/uni/watermark' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
