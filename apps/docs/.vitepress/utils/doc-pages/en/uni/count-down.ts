/** CountDown · uni-app x (uni-app x) — English page data. Props from sn-count-down.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const countDownDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'CountDown · uni-app x' },
  ],
  title: 'CountDown · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'With a ' },
    { t: 'code', s: 'ref' },
    { t: 'text', s: ' on the instance you can call ' },
    { t: 'code', s: 'start()' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'pause()' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'reset()' },
    { t: 'text', s: '; ' },
    { t: 'code', s: 'millisecond' },
    { t: 'text', s: ' refreshes every ~16ms and exposes ' },
    { t: 'code', s: 'S' },
    { t: 'text', s: '.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-count-down',
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
    fileLabel: 'CountDown · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { CountDown } from '@snui/uni';
</script>

<template>
  <sn-count-down />
</template>`,
  },
  demos: [
    {
      name: 'count-down-mp-basic',
      title: 'Basic usage',
      blurb: 'Three formats plus the finish callback.',
    },
    {
      name: 'count-down-mp-control',
      title: 'Controls (start / pause / reset)',
      blurb: 'Instance methods to start / resume, pause and reset, with a finish counter.',
    },
    {
      name: 'count-down-mp-millisecond',
      title: 'Millisecond rendering (`millisecond`)',
      blurb: 'With millisecond on, the ss.S format ticks the fraction digit in real time.',
    },
    {
      name: 'count-down-mp-autostart',
      title: 'auto-start and custom classes',
      blurb:
        'auto-start=false with a manual start, reset staying idle, and customClass / customStyle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'time', type: 'number', default: '0', desc: 'Countdown length in milliseconds.' },
      {
        name: 'millisecond',
        type: 'boolean',
        default: 'false',
        desc: 'Render milliseconds too (ticks every frame-ish 16ms instead of 1s).',
      },
      {
        name: 'format',
        type: 'string',
        default: "'HH:mm:ss'",
        desc: 'Format string; tokens are `DD` / `DDD` / `HH` / `mm` / `ss` / `S`.',
      },
      {
        name: 'autoStart',
        type: 'boolean',
        default: 'true',
        desc: 'Start automatically on mount and after `time` changes.',
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
    copy: 'CountDown · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { CountDown } from '@snui/uni';",
    chipCopy: "import { CountDown } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-count-down', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'FitSwiper', link: '/en/components/uni/fit-swiper' },
    next: { text: 'CountTo', link: '/en/components/uni/count-to' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
