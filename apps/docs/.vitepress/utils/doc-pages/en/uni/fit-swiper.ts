/** FitSwiper Adaptive Carousel (uni-app) — English page data. Props from sn-fit-swiper.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const fitSwiperDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'FitSwiper Adaptive Carousel' },
  ],
  title: 'FitSwiper Adaptive Carousel',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'For fixed-height image carousels use ' },
    { t: 'code', s: 'sn-swiper' },
    { t: 'text', s: '.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-fit-swiper',
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
    fileLabel: 'FitSwiper Adaptive Carousel.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { FitSwiper } from '@snui/uni';
</script>

<template>
  <sn-fit-swiper />
</template>`,
  },
  demos: [
    {
      name: 'fit-swiper-mp-basic',
      title: 'Basic usage',
      blurb:
        'Two King Kong grid pages with different row counts; the container height adapts on swipe.',
    },
    {
      name: 'fit-swiper-mp-indicator',
      title: 'Indicator',
      blurb: 'dots / dots-bar / fraction / slider built-in indicator styles.',
    },
    {
      name: 'fit-swiper-mp-custom',
      title: 'Custom indicator',
      blurb: 'A custom indicator rendered through the #indicator slot.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'list',
        type: 'SnFitSwiperPage[]',
        default: '() => []',
        desc: 'Page data rows; each is handed to the default slot verbatim.',
      },
      {
        name: 'current',
        type: 'number',
        default: '0',
        desc: 'Current page index (v-model:current).',
      },
      { name: 'autoplay', type: 'boolean', default: 'true', desc: 'Autoplay.' },
      { name: 'interval', type: 'number', default: '5000', desc: 'Autoplay interval in ms.' },
      {
        name: 'duration',
        type: 'number',
        default: '300',
        desc: 'Slide transition duration in ms.',
      },
      { name: 'loop', type: 'boolean', default: 'true', desc: 'Loop the pages.' },
      {
        name: 'height',
        type: 'string | number',
        default: '320',
        desc: 'Placeholder height before the first measurement lands — a bare number is treated as rpx. Once pages are measured the real px height takes over.',
      },
      {
        name: 'radius',
        type: 'string | number',
        default: "''",
        desc: 'Corner radius — a bare number is treated as rpx.',
      },
      {
        name: 'animateHeight',
        type: 'boolean',
        default: 'true',
        desc: 'Animate the container height when the page changes.',
      },
      {
        name: 'heightDuration',
        type: 'number',
        default: '300',
        desc: 'Height transition duration in ms.',
      },
      {
        name: 'indicator',
        type: 'boolean | SnFitSwiperIndicator',
        default: 'true',
        desc: 'Indicator config; `false` hides it.',
      },
      {
        name: 'indicatorPosition',
        type: 'FitSwiperIndicatorPosition',
        default: "'bottom'",
        desc: 'Indicator anchor.',
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
        name: 'customPageClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for each page item.',
      },
      {
        name: 'customIndicatorClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the indicator node.',
      },
      {
        name: 'customIndicatorStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the indicator node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'FitSwiper Adaptive Carousel ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { FitSwiper } from '@snui/uni';",
    chipCopy: "import { FitSwiper } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-fit-swiper', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-swiper', link: '/en/components/uni/swiper' },
    next: { text: 'sn-count-down', link: '/en/components/uni/count-down' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
