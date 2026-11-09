/** Carousel · Web (Web) — English page data. Props from carousel SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const carouselDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Carousel · Web' },
  ],
  title: 'Carousel · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'slide / fade / card / custom effects, seamless looping (edge clones),' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/carousel',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Carousel · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Carousel } from '@snui/vue-web';
</script>

<template>
  <Carousel />
</template>`,
  },
  demos: [{ name: 'carousel-web-basic', title: 'Examples', blurb: 'Basic looping carousel' }],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'autoplay',
        type: 'boolean',
        default: '—',
        desc: 'Auto-advance between slides. Pauses while hovered.',
      },
      {
        name: 'centeredSlides',
        type: 'boolean',
        default: '—',
        desc: 'Centre the active slide (for slides-per-view / auto layouts).',
      },
      {
        name: 'currentIndex',
        type: 'number | undefined',
        default: '—',
        desc: 'Controlled current display index (`v-model:current-index`).',
      },
      {
        name: 'defaultIndex',
        type: 'number',
        default: '—',
        desc: 'Initial display index (uncontrolled).',
      },
      { name: 'direction', type: "'horizontal' | 'vertical'", default: '—', desc: 'Scroll axis.' },
      {
        name: 'dotPlacement',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: '—',
        desc: 'Where indicator dots sit.',
      },
      { name: 'dotType', type: "'dot' | 'line'", default: '—', desc: 'Indicator dots shape.' },
      {
        name: 'draggable',
        type: 'boolean',
        default: '—',
        desc: 'Drag with the mouse to switch slides.',
      },
      {
        name: 'effect',
        type: "'slide' | 'fade' | 'card' | 'custom'",
        default: '—',
        desc: 'Transition effect between slides.',
      },
      { name: 'interval', type: 'number', default: '—', desc: 'Autoplay interval in ms.' },
      { name: 'loop', type: 'boolean', default: '—', desc: 'Wrap around at both ends.' },
      {
        name: 'mousewheel',
        type: 'boolean',
        default: '—',
        desc: 'Switch slides with the mouse wheel.',
      },
      {
        name: 'options',
        type: 'SnCarouselMediaItem[]',
        default: '—',
        desc: "Data-driven slide list. Each entry renders as a full-bleed image or video slide — the media markup lives inside the component, callers no longer hand-write `<img>` / `<video>`; `type: 'video'` marks a video entry. When set (non-empty) the default slot is ignored, while the `item` slot can still override the built-in media per slide.",
      },
      {
        name: 'nextSlideStyle',
        type: 'CSSProperties | string',
        default: '—',
        desc: 'Inline style override for the next slide (card mode).',
      },
      {
        name: 'prevSlideStyle',
        type: 'CSSProperties | string',
        default: '—',
        desc: 'Inline style override for the previous slide (card mode).',
      },
      {
        name: 'slidesPerView',
        type: "number | 'auto'",
        default: '—',
        desc: "Slides per view: fixed number or 'auto' (measured from the DOM).",
      },
      { name: 'spaceBetween', type: 'number', default: '—', desc: 'Space (px) between slides.' },
      {
        name: 'showArrow',
        type: 'boolean',
        default: '—',
        desc: 'Show built-in prev/next arrow buttons.',
      },
      { name: 'showDots', type: 'boolean', default: '—', desc: 'Show indicator dots.' },
      {
        name: 'touchable',
        type: 'boolean',
        default: '—',
        desc: 'Drag with touch to switch slides.',
      },
      { name: 'transitionDuration', type: 'string', default: '—', desc: 'transitionDuration' },
      {
        name: 'transitionTimingFunction',
        type: 'string',
        default: '—',
        desc: 'transitionTimingFunction',
      },
      {
        name: 'transitionProps',
        type: 'TransitionProps',
        default: '—',
        desc: "Vue `<Transition>` props, for `effect='custom'`.",
      },
      {
        name: 'trigger',
        type: "'click' | 'hover'",
        default: '—',
        desc: 'How indicator dots activate.',
      },
      {
        name: 'keyboard',
        type: 'boolean',
        default: '—',
        desc: 'Arrow keys switch slides while a dot is focused.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Carousel · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Carousel } from '@snui/vue-web';",
    chipCopy: "import { Carousel } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Carousel', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'calendar', link: '/en/components/web/calendar' },
    next: { text: 'marquee', link: '/en/components/web/marquee' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
