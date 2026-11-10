/** Marquee · Web (Web) — English page data. Props from marquee SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const marqueeDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Marquee · Web' },
  ],
  title: 'Marquee · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'continuous, seamless loop. Typical use: notice bars, promo strips, rolling' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/marquee',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Marquee · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Marquee } from '@snui/vue-web';
</script>

<template>
  <Marquee />
</template>`,
  },
  demos: [
    { name: 'marquee-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'marquee-web-direction', title: 'Directions', blurb: 'Directions' },
    { name: 'marquee-web-notice', title: 'Notice bar', blurb: 'Notice bar' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: 'SnMarqueeDirection',
        default: "'left'",
        desc: 'Direction the content travels.',
      },
      {
        name: 'duration',
        type: 'number',
        default: 'DEFAULT_DURATION',
        desc: 'Seconds for one full pass of the track. Non-positive / non-finite values fall back to the default so the animation stays valid.',
      },
      {
        name: 'repeat',
        type: 'number',
        default: 'MIN_COPIES',
        desc: 'How many copies of the slot content are rendered. Coerced to an integer ≥ 2 — a single copy has nothing to hand over to.',
      },
      {
        name: 'gap',
        type: 'number | string',
        default: 'DEFAULT_GAP',
        desc: 'Distance kept between two copies. Number → px.',
      },
      {
        name: 'pauseOnHover',
        type: 'boolean',
        default: 'true',
        desc: 'Pause the animation while the pointer hovers the marquee.',
      },
      {
        name: 'playing',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the ticker runs. `false` freezes it in place.',
      },
      {
        name: 'vertical',
        type: 'boolean',
        default: 'false',
        desc: "Shorthand for a vertical ticker: behaves as `direction=\"up\"` unless `direction` already is `'up'` / `'down'`.",
      },
      {
        name: 'height',
        type: 'number | string',
        default: '—',
        desc: 'Box height. Number → px. Recommended for a vertical marquee so the viewport has a fixed height to clip against.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnMarquee.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'One copy of the ticker content; the component duplicates it.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Marquee · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Marquee } from '@snui/vue-web';",
    chipCopy: "import { Marquee } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Marquee', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'carousel', link: '/en/components/web/carousel' },
    next: { text: 'countdown', link: '/en/components/web/countdown' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
