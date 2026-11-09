/** Watermark · Web (Web) — English page data. Props from watermark SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const watermarkDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Watermark · Web' },
  ],
  title: 'Watermark · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Tiles a text or image watermark over a page or a region to mark ownership,' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/watermark',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Watermark · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Watermark } from '@snui/vue-web';
</script>

<template>
  <Watermark />
</template>`,
  },
  demos: [
    { name: 'watermark-web-basic', title: 'Demos', blurb: 'Wrapped content / rotate and opacity.' },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'content',
        type: 'string | string[] | undefined',
        default: 'undefined',
        desc: 'Watermark text; array items render as separate lines. Mirrors n-watermark `content`.',
      },
      {
        name: 'image',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Watermark image URL (drawn instead of text). Mirrors n-watermark `image`.',
      },
      {
        name: 'cross',
        type: 'boolean',
        default: 'false',
        desc: 'Stagger alternate tiles by half a tile. Mirrors n-watermark `cross`. Default false.',
      },
      {
        name: 'fullscreen',
        type: 'boolean',
        default: 'false',
        desc: 'Cover the whole viewport instead of the wrapper. Mirrors n-watermark `fullscreen`. Default false.',
      },
      {
        name: 'fontSize',
        type: 'number',
        default: '16',
        desc: 'Text size in px. Mirrors n-watermark `fontSize`. Default 16.',
      },
      {
        name: 'lineHeight',
        type: 'number',
        default: '16',
        desc: 'Text line height in px. Mirrors n-watermark `lineHeight`. Default 16.',
      },
      {
        name: 'width',
        type: 'number',
        default: '128',
        desc: 'Tile width in px. Mirrors n-watermark `width`. Default 128.',
      },
      {
        name: 'height',
        type: 'number',
        default: '64',
        desc: 'Tile height in px. Mirrors n-watermark `height`. Default 64.',
      },
      {
        name: 'rotate',
        type: 'number',
        default: '0',
        desc: 'Tile rotation in degrees. Mirrors n-watermark `rotate`. Default 0.',
      },
      {
        name: 'x',
        type: 'number',
        default: '0',
        desc: 'Tile x offset in px. Mirrors n-watermark `x`. Default 0.',
      },
      {
        name: 'y',
        type: 'number',
        default: '0',
        desc: 'Tile y offset in px. Mirrors n-watermark `y`. Default 0.',
      },
      {
        name: 'zIndex',
        type: 'number',
        default: '10',
        desc: 'Overlay stacking order. Mirrors n-watermark `zIndex`. Default 10.',
      },
      {
        name: 'opacity',
        type: 'number',
        default: '0.5',
        desc: 'Overlay opacity (0–1). Mirrors n-watermark `opacity`. Default 0.5.',
      },
      {
        name: 'fontFamily',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Text font family. Mirrors n-watermark `fontFamily`.',
      },
      {
        name: 'fontWeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Text font weight. Mirrors n-watermark `fontWeight`.',
      },
      {
        name: 'fontStyle',
        type: "'normal' | 'italic' | 'oblique' | undefined",
        default: 'undefined',
        desc: 'Text font style. Mirrors n-watermark `fontStyle`.',
      },
      {
        name: 'fontColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Text color. Mirrors n-watermark `fontColor`.',
      },
      {
        name: 'background',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Tile background color. Mirrors n-watermark `background`.',
      },
      {
        name: 'grayscale',
        type: 'number',
        default: '0',
        desc: 'CSS filter grayscale on the overlay. Mirrors n-watermark `grayscale`. Default 0.',
      },
      {
        name: 'blend',
        type: "CSSProperties['mixBlendMode'] | undefined",
        default: 'undefined',
        desc: 'CSS mix-blend-mode on the overlay. Mirrors n-watermark `blend`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Watermark · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Watermark } from '@snui/vue-web';",
    chipCopy: "import { Watermark } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Watermark', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'heatmap', link: '/en/components/web/heatmap' },
    next: { text: 'ellipsis', link: '/en/components/web/ellipsis' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
