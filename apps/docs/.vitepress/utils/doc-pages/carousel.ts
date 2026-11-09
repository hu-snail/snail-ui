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
  demos: [
    { name: 'carousel-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'carousel-web-autoplay', title: '自动播放', blurb: '自动播放' },
    { name: 'carousel-web-arrow', title: '箭头', blurb: '箭头' },
    { name: 'carousel-web-dots', title: '指示点', blurb: '指示点' },
    { name: 'carousel-web-vertical', title: '垂直方向', blurb: '垂直方向' },
    { name: 'carousel-web-effect', title: '切换效果对比', blurb: '切换效果对比' },
    { name: 'carousel-web-effect-custom', title: '自定义过渡效果', blurb: '自定义过渡效果' },
    { name: 'carousel-web-card-3d', title: '3D 卡片效果', blurb: '3D 卡片效果' },
    { name: 'carousel-web-slides-per-view', title: '多屏展示', blurb: '多屏展示' },
    { name: 'carousel-web-mousewheel', title: '滚轮切换', blurb: '滚轮切换' },
    {
      name: 'carousel-web-custom-arrow-and-dots',
      title: '自定义箭头与指示点',
      blurb: '自定义箭头与指示点',
    },
    {
      name: 'carousel-web-video',
      title: '视频 / 图片（options 数据驱动）',
      blurb: '视频 / 图片（options 数据驱动）',
    },
    { name: 'carousel-web-banner', title: '业务场景', blurb: '业务场景' },
    { name: 'carousel-web-product-cards', title: '业务场景', blurb: '业务场景' },
    { name: 'carousel-web-news', title: '业务场景', blurb: '业务场景' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'autoplay', type: 'boolean', default: '—', desc: '自动播放；悬停暂停，移出恢复' },
      {
        name: 'centeredSlides',
        type: 'boolean',
        default: '—',
        desc: '活动项居中（多图 / 自适应布局下使用）。',
      },
      {
        name: 'currentIndex',
        type: 'number | undefined',
        default: '—',
        desc: '受控的当前展示下标（`v-model:current-index`）。',
      },
      { name: 'defaultIndex', type: 'number', default: '—', desc: '非受控模式下的初始展示下标。' },
      { name: 'direction', type: "'horizontal' | 'vertical'", default: '—', desc: 'Scroll axis.' },
      {
        name: 'dotPlacement',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: '—',
        desc: 'Where indicator dots sit.',
      },
      { name: 'dotType', type: "'dot' | 'line'", default: '—', desc: 'Indicator dots shape.' },
      { name: 'draggable', type: 'boolean', default: '—', desc: '鼠标拖拽切换' },
      {
        name: 'effect',
        type: "'slide' | 'fade' | 'card' | 'custom'",
        default: '—',
        desc: 'Transition effect between slides.',
      },
      { name: 'interval', type: 'number', default: '—', desc: '自动播放间隔（ms）' },
      {
        name: 'loop',
        type: 'boolean',
        default: '—',
        desc: '两端循环（slide + 单屏时用首尾克隆实现无缝循环）',
      },
      { name: 'mousewheel', type: 'boolean', default: '—', desc: '滚轮切换' },
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
        desc: '下一张幻灯片的内联样式覆盖（卡片模式）。',
      },
      {
        name: 'prevSlideStyle',
        type: 'CSSProperties | string',
        default: '—',
        desc: '上一张幻灯片的内联样式覆盖（卡片模式）。',
      },
      {
        name: 'slidesPerView',
        type: "number | 'auto'",
        default: '—',
        desc: "Slides per view: fixed number or 'auto' (measured from the DOM).",
      },
      { name: 'spaceBetween', type: 'number', default: '—', desc: '幻灯片间距（px）。' },
      { name: 'showArrow', type: 'boolean', default: '—', desc: '显示内置的上 / 下一张按钮。' },
      { name: 'showDots', type: 'boolean', default: '—', desc: '显示指示点。' },
      { name: 'touchable', type: 'boolean', default: '—', desc: '触摸拖拽切换' },
      { name: 'transitionDuration', type: 'string', default: '—', desc: '过渡时长。' },
      { name: 'transitionTimingFunction', type: 'string', default: '—', desc: '过渡缓动函数。' },
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
      { name: 'keyboard', type: 'boolean', default: '—', desc: '焦点在指示点上时方向键切换' },
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
