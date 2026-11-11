/** VideoPreview · uni-app x (uni-app x) — English page data. Props from sn-video-preview.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const videoPreviewDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'VideoPreview · uni-app x' },
  ],
  title: 'VideoPreview · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'It is composed from ' },
    { t: 'code', s: 'sn-popup' },
    { t: 'text', s: " (scrim / stacking / scroll lock / animation) wrapping the platform's own " },
    { t: 'code', s: '<video>' },
    { t: 'text', s: ' element, so playback and the player controls come from the vendor runtime.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-video-preview',
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
    fileLabel: 'VideoPreview · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { VideoPreview } from '@snui/uni';
</script>

<template>
  <sn-video-preview />
</template>`,
  },
  demos: [
    {
      name: 'video-preview-mp-basic',
      title: 'Basic usage',
      blurb: 'A button opens the video layer; open / close events are reported.',
    },
    {
      name: 'video-preview-mp-fullscreen',
      title: 'Full-screen mode (`fullScreen`)',
      blurb: 'full-screen playback (autoplay) with an on-open call counter.',
    },
    {
      name: 'video-preview-mp-close-position',
      title: 'Close button position (`closePosition`)',
      blurb: 'closePosition sets where the close button sits; right-top here.',
    },
    {
      name: 'video-preview-mp-selector',
      title: 'Instance id (`selector`)',
      blurb:
        'selector renders as data-selector (an instance marker); plus on-open / on-close counters.',
    },
    {
      name: 'video-preview-mp-layer',
      title: 'Stacking & style (`zIndex` / `customStyle`)',
      blurb:
        'z-index is forwarded to the inner sn-popup; customStyle is appended to the layer root\u2019s inline style.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'Instance identifier (parity with the reference; useful for logs / telemetry).',
      },
      { name: 'zIndex', type: 'number', default: '1000', desc: 'Stacking level of the layer.' },
      {
        name: 'fullScreen',
        type: 'boolean',
        default: 'false',
        desc: 'Fill the viewport with the video instead of the centred 16:9 stage.',
      },
      {
        name: 'closePosition',
        type: 'VideoPreviewClosePosition',
        default: "'left-top'",
        desc: 'Close-button anchor.',
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
    copy: 'VideoPreview · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { VideoPreview } from '@snui/uni';",
    chipCopy: "import { VideoPreview } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-video-preview', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'ImagePreview', link: '/en/components/uni/image-preview' },
    next: { text: 'ImgCropper', link: '/en/components/uni/img-cropper' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
