/** Skeleton (Web) — English page data. Props from SnSkeleton.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const skeletonDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback' }, { text: 'Skeleton' }],
  title: 'Skeleton',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Placeholder block shown while content loads. One tag covers the common shapes:',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/skeleton',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Skeleton.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Skeleton } from '@snui/vue-web';
</script>

<template>
  <Skeleton />
</template>`,
  },
  demos: [
    { name: 'skeleton-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    {
      name: 'skeleton-web-box',
      title: 'Box placeholder',
      blurb: 'Bare boxes at explicit width / height.',
    },
    { name: 'skeleton-web-repeat', title: 'Repeated rows', blurb: 'Multiple rows via repeat.' },
    { name: 'skeleton-web-sharp', title: 'Sharp & round corners', blurb: 'sharp / round corners.' },
    { name: 'skeleton-web-size', title: 'Size', blurb: 'Size' },
    { name: 'skeleton-web-card', title: 'Card placeholder', blurb: 'Card placeholder' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'text',
        type: 'boolean',
        default: 'false',
        desc: 'Render as an inline text placeholder. Mirrors n-skeleton `text`.',
      },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: 'Fully rounded ends (pill). Mirrors n-skeleton `round`.',
      },
      {
        name: 'circle',
        type: 'boolean',
        default: 'false',
        desc: 'Circular block; width and height are forced equal. Mirrors `circle`.',
      },
      {
        name: 'height',
        type: 'string | number',
        default: 'undefined as any',
        desc: 'Block height — number is px. Mirrors n-skeleton `height`.',
      },
      {
        name: 'width',
        type: 'string | number',
        default: 'undefined as any',
        desc: 'Block width — number is px. Mirrors n-skeleton `width`.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: 'undefined as any',
        desc: 'Height tier used when no explicit height/width is given.',
      },
      {
        name: 'repeat',
        type: 'number',
        default: '1',
        desc: 'Number of sibling blocks to render. Mirrors n-skeleton `repeat`.',
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'true',
        desc: 'Run the shimmer animation. Mirrors n-skeleton `animated`.',
      },
      {
        name: 'sharp',
        type: 'boolean',
        default: 'true',
        desc: 'Keep square corners (unset the token radius). Mirrors `sharp`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Skeleton ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Skeleton } from '@snui/vue-web';",
    chipCopy: "import { Skeleton } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Skeleton', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
