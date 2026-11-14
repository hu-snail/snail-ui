/** Swiper · uni-app x (uni-app x) — English page data. Props from sn-swiper.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const swiperDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'Swiper · uni-app x' },
  ],
  title: 'Swiper · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Pass ' },
    { t: 'code', s: 'false' },
    { t: 'text', s: ' to ' },
    { t: 'code', s: 'indicator' },
    { t: 'text', s: ' to hide it; an object accepts ' },
    { t: 'code', s: 'type' },
    { t: 'text', s: ' (' },
    { t: 'code', s: 'dots' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'dots-bar' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'fraction' },
    { t: 'text', s: '), ' },
    { t: 'code', s: 'minShowNum' },
    { t: 'text', s: ' and ' },
    { t: 'code', s: 'showControls' },
    { t: 'text', s: '.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-swiper',
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
    fileLabel: 'Swiper · uni-app x.vue',
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
    {
      name: 'swiper-mp-basic',
      title: 'Basic usage',
      blurb: 'Three autoplaying slides with captions and the current index.',
    },
    {
      name: 'swiper-mp-playback',
      title: 'Playback controls',
      blurb: 'Toggle autoplay / loop and switch interval / duration / easing.',
    },
    {
      name: 'swiper-mp-multiple',
      title: 'Multiple slides and margins',
      blurb: 'Two slides at once, peek margins, and snap-to-edge on the edges.',
    },
    {
      name: 'swiper-mp-vertical',
      title: 'Vertical carousel',
      blurb:
        'Vertical scrolling; a string height plus the Alipay-only adjust-height / adjust-vertical-height.',
    },
    {
      name: 'swiper-mp-indicator-position',
      title: 'Indicator position',
      blurb: 'Four corner anchors, plus the minShowNum threshold hiding the indicator.',
    },
    {
      name: 'swiper-mp-indicator',
      title: 'Indicators',
      blurb: 'Dots / bar / fraction / with prev-next controls.',
    },
    {
      name: 'swiper-mp-video',
      title: 'Video items',
      blurb:
        'Video items render their poster; the five video props are declared but never change the picture.',
    },
    {
      name: 'swiper-mp-custom',
      title: 'Radius and custom classes',
      blurb: 'Radius plus custom classes / styles on the root, item, image, caption and indicator.',
    },
    {
      name: 'swiper-mp-data-keys',
      title: 'Data field mapping',
      blurb:
        'valueKey / textKey rename the fields (defaults value / text); a controlled current index with jump buttons; change / animationfinish / click events.',
    },
    {
      name: 'swiper-mp-image-mode',
      title: 'Image fit (`imageMode`)',
      blurb: 'imageMode is forwarded to the inner sn-img: aspectFit letterboxes the whole image.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'autoplay', type: 'boolean', default: 'true', desc: 'Autoplay.' },
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
      { name: 'interval', type: 'number', default: '5000', desc: 'Autoplay interval in ms.' },
      {
        name: 'list',
        type: 'Array<string | SnSwiperItem>',
        default: '() => []',
        desc: 'Slide data: strings or `SwiperItem` objects.',
      },
      { name: 'loop', type: 'boolean', default: 'true', desc: 'Loop the slides.' },
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Swiper · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Swiper } from '@snui/uni';",
    chipCopy: "import { Swiper } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-swiper', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Img', link: '/en/components/uni/img' },
    next: { text: 'FitSwiper', link: '/en/components/uni/fit-swiper' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
