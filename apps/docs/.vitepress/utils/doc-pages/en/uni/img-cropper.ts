/** ImgCropper · uni-app (uni-app) — English page data. Props from sn-img-cropper.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const imgCropperDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'ImgCropper · uni-app' },
  ],
  title: 'ImgCropper · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The crop stage listens to ' },
    { t: 'code', s: '@touchstart' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '@touchmove' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '@touchend' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '@touchcancel' },
    { t: 'text', s: ':' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-img-cropper',
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
    fileLabel: 'ImgCropper · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ImgCropper } from '@snui/uni';
</script>

<template>
  <sn-img-cropper />
</template>`,
  },
  demos: [
    {
      name: 'img-cropper-mp-basic',
      title: 'Basic usage',
      blurb: 'Open the cropper, drag / zoom / rotate, and see the geometry reported on confirm.',
    },
    {
      name: 'img-cropper-mp-ratio',
      title: 'Ratio and rotation',
      blurb: 'Switching between 1:1 / 16:9 / 9:16, disabled rotation and custom button labels.',
    },
    {
      name: 'img-cropper-mp-export',
      title: 'Declared but inert in this implementation',
      blurb:
        'img-width / img-height preview box, the max-scale cap, and export-scale / quality / file-type substituted into the confirm result.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the cropper layer is visible (`v-model`).',
      },
      { name: 'imgSrc', type: 'string', default: "''", desc: 'Source image URL.' },
      {
        name: 'imgWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Preview image width — a number is rpx, a string is used verbatim.',
      },
      {
        name: 'imgHeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Preview image height — a number is rpx, a string is used verbatim.',
      },
      {
        name: 'disabledRotate',
        type: 'boolean',
        default: 'false',
        desc: 'Disable rotation entirely.',
      },
      { name: 'maxScale', type: 'number', default: '3', desc: 'Maximum zoom factor.' },
      { name: 'exportScale', type: 'number', default: '1', desc: 'Export image scale factor.' },
      { name: 'quality', type: 'number', default: '0.92', desc: 'Export image quality, 0–1.' },
      { name: 'fileType', type: "'png' | 'jpg'", default: "'png'", desc: 'Export image type.' },
      { name: 'cancelButtonText', type: 'string', default: "'取消'", desc: 'Cancel button label.' },
      {
        name: 'confirmButtonText',
        type: 'string',
        default: "'完成'",
        desc: 'Confirm button label.',
      },
      {
        name: 'aspectRatio',
        type: 'string',
        default: "'1:1'",
        desc: 'Crop-frame aspect ratio, `"width:height"`.',
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
    copy: 'ImgCropper · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { ImgCropper } from '@snui/uni';",
    chipCopy: "import { ImgCropper } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-img-cropper', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-video-preview', link: '/en/components/uni/video-preview' },
    next: { text: 'sn-qr-code', link: '/en/components/uni/qr-code' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
