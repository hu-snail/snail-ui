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
  demos: [
    { name: 'carousel-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'carousel-web-autoplay', title: 'Autoplay', blurb: 'Autoplay' },
    { name: 'carousel-web-arrow', title: 'Arrows', blurb: 'Arrows' },
    { name: 'carousel-web-dots', title: 'Dots', blurb: 'Dots' },
    { name: 'carousel-web-vertical', title: 'Vertical', blurb: 'Vertical' },
    { name: 'carousel-web-effect', title: 'Effects', blurb: 'Effects' },
    { name: 'carousel-web-effect-custom', title: 'Custom transition', blurb: 'Custom transition' },
    { name: 'carousel-web-card-3d', title: '3D card effect', blurb: '3D card effect' },
    {
      name: 'carousel-web-slides-per-view',
      title: 'Multiple slides per view',
      blurb: 'Multiple slides per view',
    },
    { name: 'carousel-web-mousewheel', title: 'Mouse wheel', blurb: 'Mouse wheel' },
    {
      name: 'carousel-web-custom-arrow-and-dots',
      title: 'Custom arrows and dots',
      blurb: 'Custom arrows and dots',
    },
    { name: 'carousel-web-video', title: 'Video', blurb: 'Video' },
    { name: 'carousel-web-banner', title: 'Real-world scenarios', blurb: 'Real-world scenarios' },
    {
      name: 'carousel-web-product-cards',
      title: 'Real-world scenarios',
      blurb: 'Real-world scenarios',
    },
    { name: 'carousel-web-news', title: 'Real-world scenarios', blurb: 'Real-world scenarios' },
  ],
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
      {
        name: 'transitionStyle',
        type: '{ transitionDuration?: string; transitionTimingFunction?: string; }',
        default: '—',
        desc: 'Duration and easing for slide, fade and card transitions.',
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
      {
        name: 'onUpdateCurrentIndex',
        type: '(currentIndex: number, lastIndex: number) => void',
        default: '—',
        desc: 'Secondary callback channel for index changes (naive-ui parity).',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnCarousel.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:currentIndex',
        payload: '(currentIndex: number, lastIndex: number)',
        desc: 'Active display index changed, with the previous display index.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnCarousel.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Sequence of `<SnCarouselItem>` children (ignored with `options`).',
      },
      {
        name: 'item',
        props:
          '{ item: SnCarouselMediaItem; index: number; isActive: boolean; isPrev: boolean; isNext: boolean }',
        desc: 'Per-slide override for `options` — replaces the built-in media renderer.',
      },
      {
        name: 'arrow',
        props:
          '{ total: number; currentIndex: number; to: (index: number) => void; prev: () => void; next: () => void; isPrevDisabled: () => boolean; isNextDisabled: () => boolean }',
        desc: 'Custom arrow buttons; falls back to the built-in pair.',
      },
      {
        name: 'dots',
        props: '{ total: number; currentIndex: number; to: (index: number) => void }',
        desc: 'Custom indicator dots; falls back to the built-in dots.',
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
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
