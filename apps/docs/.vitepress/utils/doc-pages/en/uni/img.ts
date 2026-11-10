/** Img · uni-app (uni-app) — English page data. Props from sn-img.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const imgDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'Img · uni-app' },
  ],
  title: 'Img · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'The placeholder plate, spinner and error text all come from semantic tokens (',
    },
    { t: 'code', s: '--sn-mp-color-background-subtle' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-border-default' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-action-primary' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-text-tertiary' },
    { t: 'text', s: '), all overridden in the dark block of `@snui/tokens' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-img',
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
    fileLabel: 'Img · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Img } from '@snui/uni';
</script>

<template>
  <sn-img />
</template>`,
  },
  demos: [
    {
      name: 'img-mp-mode',
      title: 'Crop modes (`mode`)',
      blurb: 'The three crop modes: scaleToFill / aspectFit / aspectFill.',
    },
    {
      name: 'img-mp-shape',
      title: 'Round & radius (`round` / `radius`)',
      blurb: 'round makes a circle; radius sets a custom corner; the square default as a control.',
    },
    {
      name: 'img-mp-state',
      title: 'Loading and error states',
      blurb:
        'Switch between a valid and a broken URL, a custom error slot, built-in states disabled.',
    },
    {
      name: 'img-mp-preview',
      title: 'Tap-to-preview (`enablePreview`)',
      blurb:
        'Thumbnail opens the large image, preview-src overrides; plus the show-menu-by-longpress menu (WeChat only).',
    },
    {
      name: 'img-mp-lazy-load',
      title: 'Lazy loading (`lazyLoad`)',
      blurb: 'lazy-load is handed to the native image; loading starts near the viewport.',
    },
    {
      name: 'img-mp-custom',
      title: 'Custom classes and styles',
      blurb: 'Root class / inline style and the inner image class each take effect.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'src', type: 'string', default: "''", desc: 'Image source.' },
      {
        name: 'previewSrc',
        type: 'string',
        default: "''",
        desc: 'Image opened by `enablePreview` (defaults to `src`).',
      },
      {
        name: 'width',
        type: 'string | number',
        default: "''",
        desc: 'Width — a bare number is treated as rpx.',
      },
      {
        name: 'height',
        type: 'string | number',
        default: "''",
        desc: 'Height — a bare number is treated as rpx.',
      },
      { name: 'mode', type: 'ImageMode', default: "'scaleToFill'", desc: 'Crop mode.' },
      { name: 'round', type: 'boolean', default: 'false', desc: 'Render as a circle.' },
      {
        name: 'radius',
        type: 'string | number',
        default: "''",
        desc: 'Corner radius — a bare number is treated as rpx.',
      },
      {
        name: 'lazyLoad',
        type: 'boolean',
        default: 'false',
        desc: "Lazy-load the image (uni `<image lazy-load>`). When the prop is not passed, an ancestor `sn-waterfall`'s container-level `lazyLoad` config is inherited (see the header note).",
      },
      {
        name: 'enablePreview',
        type: 'boolean',
        default: 'false',
        desc: 'Tap opens `uni.previewImage`.',
      },
      {
        name: 'showMenuByLongpress',
        type: 'boolean',
        default: 'false',
        desc: 'Long-press shows the miniprogram QR menu (WeChat only).',
      },
      {
        name: 'showLoading',
        type: 'boolean',
        default: 'true',
        desc: 'Show the built-in loading indicator until the image loads.',
      },
      {
        name: 'showError',
        type: 'boolean',
        default: 'true',
        desc: 'Show the built-in error state when the image fails.',
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
        name: 'customImage',
        type: 'string',
        default: "''",
        desc: 'Custom class for the inner `<image>`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Img · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Img } from '@snui/uni';",
    chipCopy: "import { Img } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-img', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-card', link: '/en/components/uni/card' },
    next: { text: 'sn-swiper', link: '/en/components/uni/swiper' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
