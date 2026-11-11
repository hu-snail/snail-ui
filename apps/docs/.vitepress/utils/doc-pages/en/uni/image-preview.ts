/** ImagePreview · uni-app (uni-app) — English page data. Props from sn-image-preview.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const imagePreviewDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'ImagePreview · uni-app' },
  ],
  title: 'ImagePreview · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'It is composed from ' },
    { t: 'code', s: 'sn-popup' },
    {
      t: 'text',
      s: ' (scrim / stacking / scroll lock / animation); the image track and the WeChat-grade gestures (paging / pinch / double-tap / drag-down dismiss) are built in — see the Gestures section below.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-image-preview',
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
    fileLabel: 'ImagePreview · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ImagePreview } from '@snui/uni';
</script>

<template>
  <sn-image-preview />
</template>`,
  },
  demos: [
    {
      name: 'image-preview-mp-basic',
      title: 'Basic usage',
      blurb:
        'Tap a thumbnail to open at that index; a button opens from the first image; events are reported.',
    },
    {
      name: 'image-preview-mp-close-position',
      title: 'Close button position (`closeIconPosition`)',
      blurb: 'closeIconPosition defaults to top-right; this demo flips it to top-left.',
    },
    {
      name: 'image-preview-mp-index',
      title: 'Page counter & footer slot',
      blurb:
        'showIndex=false hides the built-in counter; the #default slot receives current for custom footer copy.',
    },
    {
      name: 'image-preview-mp-gestures',
      title: 'Gestures (WeChat-grade preview)',
      blurb:
        'Pinch to zoom, double-tap, pan when zoomed, drag down to dismiss — WeChat image viewer gestures.',
    },
    {
      name: 'image-preview-mp-selector',
      title: '`selector` hit areas',
      blurb:
        'selector=".sn-demo__thumb" lays transparent hit zones over the thumbnails on open(); open / close events are reported.',
    },
    {
      name: 'image-preview-mp-close-behavior',
      title: 'Close & loop behaviour',
      blurb:
        'loop=no wrapping; closeable=no close button; close-on-click=backdrop taps do not close.',
    },
    {
      name: 'image-preview-mp-longpress',
      title: 'Long-press menu & event',
      blurb:
        'show-menu-by-longpress opens the recognise-miniprogram-QR menu on long press (WeChat only) and emits long-press.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'CSS selector whose matched elements open the viewer (see header).',
      },
      { name: 'images', type: 'string[]', default: '() => []', desc: 'Image URL list.' },
      { name: 'startPosition', type: 'number', default: '0', desc: 'Index shown when opened.' },
      {
        name: 'showIndex',
        type: 'boolean',
        default: 'true',
        desc: 'Show the `current / total` counter.',
      },
      {
        name: 'loop',
        type: 'boolean',
        default: 'true',
        desc: 'Loop from the last image to the first.',
      },
      { name: 'closeable', type: 'boolean', default: 'true', desc: 'Render the close button.' },
      {
        name: 'closeIcon',
        type: 'string',
        default: "'close'",
        desc: 'Close glyph: a sn-icon registry name; unknown names fall back to the built-in X.',
      },
      {
        name: 'closeIconPosition',
        type: 'ImagePreviewClosePosition',
        default: "'top-right'",
        desc: 'Close-button anchor.',
      },
      {
        name: 'closeOnClick',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the image or the scrim closes the viewer.',
      },
      {
        name: 'showMenuByLongpress',
        type: 'boolean',
        default: 'true',
        desc: 'Long-press shows the miniprogram QR menu on the image.',
      },
      { name: 'zIndex', type: 'number', default: '1000', desc: 'Stacking level of the layer.' },
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
    copy: 'ImagePreview · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { ImagePreview } from '@snui/uni';",
    chipCopy: "import { ImagePreview } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-image-preview', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-watermark', link: '/en/components/uni/watermark' },
    next: { text: 'sn-video-preview', link: '/en/components/uni/video-preview' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
