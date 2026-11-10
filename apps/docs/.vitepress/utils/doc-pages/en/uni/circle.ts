/** Circle · uni-app (uni-app) — English page data. Props from sn-circle.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const circleDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Circle · uni-app' },
  ],
  title: 'Circle · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'None — the component is presentational.' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-circle',
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
    fileLabel: 'Circle · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Circle } from '@snui/uni';
</script>

<template>
  <sn-circle />
</template>`,
  },
  demos: [
    {
      name: 'circle-mp-basic',
      title: 'Basic usage',
      blurb: '0 / 30 / 70 / 100, three sizes and a live +/- control.',
    },
    {
      name: 'circle-mp-color',
      title: 'Colors and shapes',
      blurb: 'Status colors / gradient / custom track and disc / counter-clockwise.',
    },
    {
      name: 'circle-mp-speed',
      title: 'Animation speed (`speed`)',
      blurb: 'speed=0 / 200 / 10 transitions side by side; 0 disables the transition.',
    },
    {
      name: 'circle-mp-custom-style',
      title: 'Root styling',
      blurb: 'custom-class and custom-style both land on the sn-circle root node.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number',
        default: '0',
        desc: 'Current progress, 0–100 (out-of-range values are clamped).',
      },
      {
        name: 'size',
        type: 'number | string',
        default: '120',
        desc: 'Ring diameter. A bare number is treated as rpx (750 design).',
      },
      {
        name: 'color',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Ring color: a solid CSS color, or a `{ offset: color }` gradient map.',
      },
      { name: 'layerColor', type: 'string', default: "''", desc: 'Track (unfilled) color.' },
      {
        name: 'fill',
        type: 'string',
        default: "''",
        desc: 'Filled disc color inside the ring; empty renders a hollow ring.',
      },
      {
        name: 'speed',
        type: 'number',
        default: '50',
        desc: 'Animation speed in percent per second; `0` disables the transition.',
      },
      {
        name: 'text',
        type: 'string',
        default: "''",
        desc: 'Text shown in the middle; empty shows the rounded percentage.',
      },
      {
        name: 'strokeWidth',
        type: 'number | string',
        default: '18',
        desc: 'Ring thickness. A bare number is treated as rpx.',
      },
      {
        name: 'strokeLinecap',
        type: 'CircleLinecap',
        default: "'round'",
        desc: 'Stroke cap (parity only — a conic sweep has no caps).',
      },
      {
        name: 'clockwise',
        type: 'boolean',
        default: 'true',
        desc: 'Sweep clockwise (the default) or counter-clockwise.',
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
    copy: 'Circle · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Circle } from '@snui/uni';",
    chipCopy: "import { Circle } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-circle', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-progress', link: '/en/components/uni/progress' },
    next: { text: 'sn-toast', link: '/en/components/uni/toast' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
