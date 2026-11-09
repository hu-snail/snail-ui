/**
 * Carousel 轮播图 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const carouselDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Carousel 轮播图' },
  ],
  title: 'Carousel 轮播图',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnCarousel' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'SnCarouselItem' },
    {
      t: 'text',
      s: ' 在有限空间内轮播展示内容，支持 slide / fade / card / custom 四种切换效果、循环克隆、自动播放、拖拽、滚轮与键盘切换。',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/carousel',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Carousel 轮播图.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Carousel } from '@snui/vue-web';
</script>

<template>
  <Carousel />
</template>`,
  },
  demos: [{ name: 'carousel-web-basic', title: '代码演示', blurb: '基础轮播，循环滚动' }],
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Carousel 轮播图 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Carousel } from '@snui/vue-web';",
    chipCopy: "import { Carousel } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Carousel', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'calendar', link: '/components/web/calendar' },
    next: { text: 'marquee', link: '/components/web/marquee' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
