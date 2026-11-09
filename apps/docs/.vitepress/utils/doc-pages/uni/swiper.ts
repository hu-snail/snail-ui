/**
 * Swiper 轮播（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-swiper.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const swiperDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '展示组件 Display' }, { text: 'Swiper 轮播' }],
  title: 'Swiper 轮播',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '无。' }],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-swiper',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Swiper 轮播.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Swiper } from '@snui/uni';
</script>

<template>
  <sn-swiper />
</template>`,
  },
  demos: [
    { name: 'swiper-mp-basic', title: '基础用法', blurb: '三张图自动播放，含文案与当前索引。' },
    {
      name: 'swiper-mp-playback',
      title: '播放控制',
      blurb: '开关 autoplay / loop，切换 interval / duration / easing。',
    },
    {
      name: 'swiper-mp-multiple',
      title: '多图与边距',
      blurb: '同屏两张、左右边距露出邻张、snap-to-edge 首尾对齐。',
    },
    {
      name: 'swiper-mp-vertical',
      title: '竖向轮播',
      blurb: '竖向滑动；字符串高度 + 支付宝专属的 adjust-height / adjust-vertical-height。',
    },
    {
      name: 'swiper-mp-indicator-position',
      title: '指示器位置',
      blurb: '四个角落的指示器位置，以及 minShowNum 阈值隐藏。',
    },
    {
      name: 'swiper-mp-indicator',
      title: '指示器',
      blurb: '圆点 / 条形 / 分式 / 带左右控制按钮。',
    },
    {
      name: 'swiper-mp-card3d',
      title: '3D 卡片（card3d）',
      blurb: '3D 卡片一屏 2 张 / 1 张，以及普通模式对照；指示器按页计数。',
    },
    {
      name: 'swiper-mp-video',
      title: '视频项',
      blurb: '视频项渲染 poster；五个视频类 props 已声明但不改变画面。',
    },
    {
      name: 'swiper-mp-custom',
      title: '圆角与自定义类名',
      blurb: '圆角 + 根 / 项 / 图片 / 文案 / 指示器的自定义类名与样式。',
    },
    {
      name: 'swiper-mp-data',
      title: '数据字段与事件',
      blurb: '自定义字段名、受控 current、aspectFit 裁剪、三个事件回传。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'autoplay', type: 'boolean', default: 'true', desc: '是否自动播放' },
      {
        name: 'current',
        type: 'number',
        default: '0',
        desc: 'Current slide index (v-model:current).',
      },
      { name: 'direction', type: 'SwiperDirection', default: "'horizontal'", desc: 'Scroll axis.' },
      {
        name: 'displayMultipleItems',
        type: 'number',
        default: '1',
        desc: 'Slides visible at once.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '300',
        desc: 'Slide transition duration in ms.',
      },
      {
        name: 'easingFunction',
        type: 'string',
        default: "'default'",
        desc: 'Easing name (parity; the native swiper uses a fixed ease).',
      },
      {
        name: 'height',
        type: 'string | number',
        default: '192',
        desc: 'Height of the carousel — a bare number is treated as rpx.',
      },
      { name: 'interval', type: 'number', default: '5000', desc: '自动轮播间隔（ms）' },
      {
        name: 'list',
        type: 'Array<string | SnSwiperItem>',
        default: '() => []',
        desc: 'Slide data: strings or `SwiperItem` objects.',
      },
      { name: 'loop', type: 'boolean', default: 'true', desc: '是否循环播放' },
      {
        name: 'coverflow',
        type: 'boolean',
        default: 'false',
        desc: 'Coverflow 模式（AUI-additive）：中间全尺寸、两侧露出缩小。 露出宽度由 previous-margin / next-margin 控制（两者均未设置时默认各 80rpx）。',
      },
      {
        name: 'coverflowScale',
        type: 'number',
        default: '0.85',
        desc: 'Coverflow 模式非激活卡片的缩放比例（默认 0.85）。',
      },
      {
        name: 'videoLoop',
        type: 'boolean',
        default: 'false',
        desc: 'Loop video items (declared for parity; video degrades to its poster).',
      },
      {
        name: 'muted',
        type: 'boolean',
        default: 'false',
        desc: 'Mute video items (declared for parity; video degrades to its poster).',
      },
      {
        name: 'autoplayVideo',
        type: 'boolean',
        default: 'false',
        desc: 'Autoplay video items (declared for parity; see header).',
      },
      {
        name: 'stopPreviousVideo',
        type: 'boolean',
        default: 'false',
        desc: "Stop the previous slide's video on change (parity; see header).",
      },
      {
        name: 'stopAutoplayWhenVideoPlay',
        type: 'boolean',
        default: 'false',
        desc: 'Pause autoplay while a video plays (parity; see header).',
      },
      {
        name: 'adjustHeight',
        type: "'first' | 'current' | 'highest' | ''",
        default: "''",
        desc: "Auto-size the container to the slide height. Alipay-only upstream; the value is forwarded to the native `<swiper>` and ignored elsewhere. `''` (default) leaves the height to the `height` prop.",
      },
      {
        name: 'adjustVerticalHeight',
        type: 'boolean',
        default: 'false',
        desc: 'Force `adjustHeight` to apply in vertical mode (Alipay-only upstream).',
      },
      {
        name: 'nextMargin',
        type: 'string | number',
        default: '0',
        desc: 'Next-slide inset — a bare number is treated as rpx.',
      },
      {
        name: 'indicatorPosition',
        type: 'SwiperIndicatorPosition',
        default: "'bottom'",
        desc: 'Indicator anchor.',
      },
      {
        name: 'previousMargin',
        type: 'string | number',
        default: '0',
        desc: 'Previous-slide inset — a bare number is treated as rpx.',
      },
      {
        name: 'radius',
        type: 'string | number',
        default: "''",
        desc: 'Corner radius — a bare number is treated as rpx.',
      },
      {
        name: 'snapToEdge',
        type: 'boolean',
        default: 'false',
        desc: 'Snap the insets to the first / last slide.',
      },
      {
        name: 'indicator',
        type: 'boolean | SnSwiperIndicator',
        default: 'true',
        desc: 'Indicator config; `false` hides it.',
      },
      {
        name: 'imageMode',
        type: 'SwiperImageMode',
        default: "'aspectFill'",
        desc: 'Image crop mode forwarded to sn-img.',
      },
      {
        name: 'showMenuByLongpress',
        type: 'boolean',
        default: 'false',
        desc: 'Long-press shows the miniprogram QR menu.',
      },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Field name holding the image URL in an item object.',
      },
      {
        name: 'textKey',
        type: 'string',
        default: "'text'",
        desc: 'Field name holding the caption in an item object.',
      },
      {
        name: 'customIndicatorClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the indicator node.',
      },
      {
        name: 'customImageClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the image node.',
      },
      {
        name: 'customPrevImageClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the prev-slide image (parity; no peek slides rendered).',
      },
      {
        name: 'customNextImageClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the next-slide image (parity; no peek slides rendered).',
      },
      {
        name: 'customItemClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for each slide.',
      },
      {
        name: 'customPrevClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the prev slide (parity; no peek slides rendered).',
      },
      {
        name: 'customNextClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the next slide (parity; no peek slides rendered).',
      },
      {
        name: 'customTextClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the caption node.',
      },
      {
        name: 'customTextStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the caption node.',
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Swiper 轮播 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Swiper } from '@snui/uni';",
    chipCopy: "import { Swiper } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-swiper', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-img', link: '/components/uni/img' },
    next: { text: 'sn-fit-swiper', link: '/components/uni/fit-swiper' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
