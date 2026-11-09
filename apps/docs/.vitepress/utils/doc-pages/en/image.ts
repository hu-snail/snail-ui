/** Image · Web (Web) — English page data. Props from image SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const imageDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Image · Web' },
  ],
  title: 'Image · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Image with click-to-preview: a full-screen overlay with zoom, rotation, 1:1' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/image',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Image · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Image } from '@snui/vue-web';
</script>

<template>
  <Image />
</template>`,
  },
  demos: [
    {
      name: 'image-web-basic',
      title: 'Examples',
      blurb: 'width / height / object-fit thumbnails.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'alt',
        type: 'string | undefined',
        default: '—',
        desc: 'Image description exposed as alt/aria-label. Mirrors `alt`.',
      },
      {
        name: 'width',
        type: 'string | number | undefined',
        default: '—',
        desc: 'Thumbnail width (number → px). Mirrors `width`.',
      },
      {
        name: 'height',
        type: 'string | number | undefined',
        default: '—',
        desc: 'Thumbnail height (number → px). Mirrors `height`.',
      },
      {
        name: 'imgProps',
        type: 'ImgHTMLAttributes | undefined',
        default: '—',
        desc: 'Extra attributes forwarded to the inner <img>. Mirrors `img-props`.',
      },
      {
        name: 'lazy',
        type: 'boolean',
        default: '—',
        desc: 'Load on viewport entry. Mirrors `lazy`.',
      },
      {
        name: 'intersectionObserverOptions',
        type: 'LazyVisibilityOptions | undefined',
        default: '—',
        desc: 'IntersectionObserver config for lazy loading. Mirrors `intersection-observer-options`.',
      },
      {
        name: 'objectFit',
        type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'",
        default: '—',
        desc: 'Thumbnail fit inside its box. Mirrors `object-fit`.',
      },
      {
        name: 'previewSrc',
        type: 'string | undefined',
        default: '—',
        desc: 'Dedicated (larger) preview url; falls back to `src`. Mirrors `preview-src`.',
      },
      {
        name: 'fallbackSrc',
        type: 'string | undefined',
        default: '—',
        desc: 'Shown when the thumbnail fails to load. Mirrors `fallback-src`.',
      },
      {
        name: 'src',
        type: 'string | undefined',
        default: '—',
        desc: 'Image source. Mirrors `src`.',
      },
      {
        name: 'previewDisabled',
        type: 'boolean',
        default: '—',
        desc: 'Disable click-to-preview. Mirrors `preview-disabled`.',
      },
      {
        name: 'previewedImgProps',
        type: 'ImgHTMLAttributes | undefined',
        default: '—',
        desc: 'Attributes/style for the previewed <img>. Mirrors `previewed-img-props`.',
      },
      {
        name: 'showToolbar',
        type: 'boolean | undefined',
        default: '—',
        desc: 'Toolbar visibility in the preview. Mirrors `show-toolbar`.',
      },
      {
        name: 'showToolbarTooltip',
        type: 'boolean | undefined',
        default: '—',
        desc: 'Native title hints on toolbar buttons. Mirrors `show-toolbar-tooltip`.',
      },
      {
        name: 'keepDragOffset',
        type: 'boolean | undefined',
        default: '—',
        desc: 'Keep the dragged offset after release. Mirrors `keep-drag-offset`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Image · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Image } from '@snui/vue-web';",
    chipCopy: "import { Image } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Image', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'equation', link: '/en/components/web/equation' },
    next: { text: 'video-preview', link: '/en/components/web/video-preview' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
