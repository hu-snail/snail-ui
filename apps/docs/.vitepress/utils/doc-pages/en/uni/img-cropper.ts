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
      name: 'img-cropper-mp-ratio',
      title: 'Aspect ratio (`aspectRatio`)',
      blurb: 'Switching between 1:1 / 16:9 / 9:16, with the last confirmed ratio reported.',
    },
    {
      name: 'img-cropper-mp-rotate',
      title: 'Disable rotation & button labels (`disabledRotate`)',
      blurb:
        'disabled-rotate hides the rotation affordance; cancel / confirm-button-text relabel the bottom bar.',
    },
    {
      name: 'img-cropper-mp-frame',
      title: 'Preview frame size (`imgWidth` / `imgHeight`)',
      blurb:
        'img-width / img-height are design px (multiplied by 2 into rpx internally) and size the preview box.',
    },
    {
      name: 'img-cropper-mp-max-scale',
      title: 'Zoom cap (`maxScale`)',
      blurb: 'max-scale caps the pinch zoom (floor 0.5), compared at 2 and 6.',
    },
    {
      name: 'img-cropper-mp-export-props',
      title: 'Declared export props',
      blurb:
        'export-scale / quality / file-type only mirror the reference API: no rasterizing, the host exports from the confirm geometry.',
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
