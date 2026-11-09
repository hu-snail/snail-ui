/** Progress · uni-app (uni-app) — English page data. Props from sn-progress.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const progressDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Progress · uni-app' },
  ],
  title: 'Progress · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'None — ' },
    { t: 'code', s: 'sn-progress' },
    { t: 'text', s: ' is purely presentational.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-progress',
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
    fileLabel: 'Progress · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Progress } from '@snui/uni';
</script>

<template>
  <sn-progress />
</template>`,
  },
  demos: [
    { name: 'progress-mp-basic', title: 'Basic usage', blurb: '0 / 30 / 68 / 100 plus hide-text.' },
    {
      name: 'progress-mp-color',
      title: 'Status and custom colors',
      blurb: 'success / warning / danger status colors, plus a solid color and a gradient array.',
    },
    {
      name: 'progress-mp-label',
      title: 'Label placement and alignment',
      blurb: 'outer left / outer center / inner right / inner center, plus the duration animation.',
    },
    {
      name: 'progress-mp-custom',
      title: 'Custom class and style',
      blurb: 'custom-class dashed outline / custom-style padding / both together.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'percentage',
        type: 'number',
        default: '0',
        desc: 'Progress value, 0–100 (values outside the range are clamped).',
      },
      { name: 'hideText', type: 'boolean', default: 'false', desc: 'Hide the percentage text.' },
      {
        name: 'color',
        type: 'string | string[] | SnProgressColor[]',
        default: "''",
        desc: 'Fill color: solid string, gradient string[], or threshold entries.',
      },
      {
        name: 'status',
        type: 'ProgressStatus',
        default: "''",
        desc: 'Semantic status; overrides `color` when set.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '30',
        desc: 'Milliseconds the bar takes to advance 1% (total = percentage × this).',
      },
      {
        name: 'percentPosition',
        type: 'SnProgressPercentPosition',
        default: "() => ({ type: 'outer'",
        desc: 'Percentage text placement + alignment.',
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
    copy: 'Progress · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Progress } from '@snui/uni';",
    chipCopy: "import { Progress } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-progress', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-loading', link: '/en/components/uni/loading' },
    next: { text: 'sn-circle', link: '/en/components/uni/circle' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
