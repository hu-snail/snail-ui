/** Liquid (uni-app) — English page data. Props from sn-liquid.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const liquidDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Business Components' }, { text: 'Liquid' }],
  title: 'Liquid',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The water level is driven by ' },
    { t: 'code', s: 'percent' },
    { t: 'text', s: ' (clamped to 0-100); ' },
    { t: 'code', s: 'v-model:current' },
    {
      t: 'text',
      s: ' exposes the transitioning value. The center label defaults to the percentage and is slot-customizable.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-liquid',
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
    fileLabel: 'Liquid.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Liquid } from '@snui/uni';
</script>

<template>
  <sn-liquid />
</template>`,
  },
  demos: [
    {
      name: 'liquid-mp-basic',
      title: 'Basic usage',
      blurb: 'percent drives the water level with an increment interaction; clamps out of range.',
    },
    {
      name: 'liquid-mp-states',
      title: 'State & bounds',
      blurb: '0 / 100 / clamping / duration=0 immediate / custom ball-core slot.',
    },
    {
      name: 'liquid-mp-size',
      title: 'Size',
      blurb: '120 / 160 / 200rpx.',
    },
    {
      name: 'liquid-mp-outline',
      title: 'Outline ring',
      blurb: 'outline on/off side by side.',
    },
    {
      name: 'liquid-mp-radius',
      title: 'Container radius',
      blurb: 'radius="32rpx" squircle container.',
    },
    {
      name: 'liquid-mp-colors',
      title: 'Wave colors',
      blurb: 'waveColor / innerColor configured in pairs.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'percent',
        type: 'number',
        default: '0',
        desc: '进度百分比（0-100），超出范围会被夹取。',
      },
      {
        name: 'size',
        type: 'string',
        default: "'160rpx'",
        desc: '球体尺寸（rpx / px 长度字符串）。',
      },
      {
        name: 'duration',
        type: 'number',
        default: '500',
        desc: '水位 / current 过渡时长（ms），0 表示立即到位。',
      },
      { name: 'outline', type: 'boolean', default: 'false', desc: '是否显示外圈描边。' },
      { name: 'radius', type: 'string', default: "'50%'", desc: '圆角（默认正圆）。' },
      {
        name: 'waveColor',
        type: 'string',
        default: "'var(--sn-mp-color-action-primary)'",
        desc: '波浪颜色。',
      },
      {
        name: 'innerColor',
        type: 'string',
        default: "'var(--sn-mp-color-action-primary-soft)'",
        desc: '球内背景色（水面以上区域）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Liquid ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Liquid } from '@snui/uni';",
    chipCopy: "import { Liquid } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-liquid', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-waterfall', link: '/en/components/uni/waterfall' },
    next: { text: 'sn-barcode', link: '/en/components/uni/barcode' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
