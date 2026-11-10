/** Empty · uni-app (uni-app) — English page data. Props from sn-empty.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const emptyDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Empty · uni-app' },
  ],
  title: 'Empty · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Without ' },
    { t: 'code', s: 'icon' },
    {
      t: 'text',
      s: ' the component renders its built-in inline SVG glyph (no emoji, no external image — AGENTS.md §113).',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-empty',
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
    fileLabel: 'Empty · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Empty } from '@snui/uni';
</script>

<template>
  <sn-empty />
</template>`,
  },
  demos: [
    {
      name: 'empty-mp-basic',
      title: 'Basic usage',
      blurb: 'Default glyph, a tip line, and a longer wrapping tip.',
    },
    {
      name: 'empty-mp-icon',
      title: 'Glyph sources',
      blurb: 'Registry icon / custom iconSize / CSS icon class / data-URI image — four sources.',
    },
    {
      name: 'empty-mp-slots',
      title: 'Slots',
      blurb: 'A retry button in the bottom slot; a fully custom glyph in the image slot.',
    },
    {
      name: 'empty-mp-custom',
      title: 'Custom class and style',
      blurb: 'custom-class dashed outline / custom-style padding / both together.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'icon',
        type: 'string',
        default: "'empty'",
        desc: 'Icon name, registry key, image URL, or CSS class (see header).',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: 'Iconfont class prefix, applied together with `icon`.',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'CSS-icon mode: treat `icon` / `iconPrefix` as class names.',
      },
      {
        name: 'iconSize',
        type: 'number | string',
        default: "''",
        desc: 'Icon / image size. A bare number is treated as rpx.',
      },
      { name: 'tip', type: 'string', default: "''", desc: 'Tip text under the glyph.' },
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
    copy: 'Empty · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Empty } from '@snui/uni';",
    chipCopy: "import { Empty } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-empty', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-notice-bar', link: '/en/components/uni/notice-bar' },
    next: { text: 'sn-skeleton', link: '/en/components/uni/skeleton' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
