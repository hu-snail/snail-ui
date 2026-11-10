/** Watermark · uni-app (uni-app) — English page data. Props from sn-watermark.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const watermarkDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'Watermark · uni-app' },
  ],
  title: 'Watermark · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'None.' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-watermark',
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
    fileLabel: 'Watermark · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Watermark } from '@snui/uni';
</script>

<template>
  <sn-watermark />
</template>`,
  },
  demos: [
    {
      name: 'watermark-mp-basic',
      title: 'Basic usage',
      blurb: 'A text watermark over a contract preview area.',
    },
    {
      name: 'watermark-mp-config',
      title: 'Tiles and layout',
      blurb: 'Three tile size / gutter / rotation / staggered combinations.',
    },
    {
      name: 'watermark-mp-image',
      title: 'Image tiles and font control',
      blurb: 'Image tiles, font family / style / weight, z-index and customClass / customStyle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'content', type: 'string', default: "''", desc: 'Watermark text.' },
      {
        name: 'image',
        type: 'string',
        default: "''",
        desc: 'Watermark image source (network or base64).',
      },
      {
        name: 'imageHeight',
        type: 'number',
        default: '100',
        desc: 'Image height in px (per the wd reference).',
      },
      { name: 'imageWidth', type: 'number', default: '100', desc: 'Image width in px.' },
      {
        name: 'gutterX',
        type: 'number',
        default: '0',
        desc: 'Horizontal gutter between tiles, in px.',
      },
      {
        name: 'gutterY',
        type: 'number',
        default: '0',
        desc: 'Vertical gutter between tiles, in px.',
      },
      { name: 'width', type: 'number', default: '100', desc: 'Tile width in px.' },
      { name: 'height', type: 'number', default: '100', desc: 'Tile height in px.' },
      {
        name: 'fullScreen',
        type: 'boolean',
        default: 'true',
        desc: 'Cover the whole viewport instead of the parent box.',
      },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Text color override (any CSS color value).',
      },
      { name: 'size', type: 'number', default: '14', desc: 'Text size in px.' },
      { name: 'fontStyle', type: 'WatermarkFontStyle', default: "'normal'", desc: 'Font style.' },
      { name: 'fontWeight', type: 'string | number', default: "'normal'", desc: 'Font weight.' },
      { name: 'fontFamily', type: 'string', default: "'PingFang SC'", desc: 'Font family.' },
      { name: 'rotate', type: 'number', default: '-25', desc: 'Rotation angle in degrees.' },
      { name: 'zIndex', type: 'number', default: '1100', desc: 'Stacking level.' },
      { name: 'opacity', type: 'number | undefined', default: 'undefined', desc: 'Opacity, 0–1.' },
      { name: 'layout', type: 'WatermarkLayout', default: "'grid'", desc: 'Repeat layout.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Watermark · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Watermark } from '@snui/uni';",
    chipCopy: "import { Watermark } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-watermark', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-count-to', link: '/en/components/uni/count-to' },
    next: { text: 'sn-image-preview', link: '/en/components/uni/image-preview' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
