/**
 * FitSwiper 自适应轮播（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-fit-swiper.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const fitSwiperDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'FitSwiper 自适应轮播' },
  ],
  title: 'FitSwiper 自适应轮播',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '固定高度的图片轮播请用 ' },
    { t: 'code', s: 'sn-swiper' },
    { t: 'text', s: '。' },
  ],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-fit-swiper',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'FitSwiper 自适应轮播.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { FitSwiper } from '@snui/uni';
</script>

<template>
  <sn-fit-swiper />
</template>`,
  },
  demos: [
    {
      name: 'fit-swiper-mp-basic',
      title: '基础用法',
      blurb: '两页金刚区网格，行数不同；滑动切换时容器高度自适应过渡。',
    },
    {
      name: 'fit-swiper-mp-indicator',
      title: '指示器',
      blurb: 'dots / dots-bar / fraction / slider 四种内置指示器样式。',
    },
    {
      name: 'fit-swiper-mp-custom',
      title: '自定义指示器',
      blurb: '用 #indicator 插槽渲染「第 n / N 页」文案的自定义指示器。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'list',
        type: 'SnFitSwiperPage[]',
        default: '() => []',
        desc: '页面数据行，逐行交给默认插槽。',
      },
      {
        name: 'current',
        type: 'number',
        default: '0',
        desc: '当前页索引（`v-model:current`），越界值自动收敛。',
      },
      { name: 'autoplay', type: 'boolean', default: 'true', desc: '自动播放。' },
      { name: 'interval', type: 'number', default: '5000', desc: '自动播放间隔（ms）。' },
      { name: 'duration', type: 'number', default: '300', desc: '滑动动画时长（ms）。' },
      { name: 'loop', type: 'boolean', default: 'true', desc: '循环播放。' },
      { name: 'height', type: 'string | number', default: '320', desc: '`320`' },
      {
        name: 'radius',
        type: 'string | number',
        default: "''",
        desc: 'Corner radius — a bare number is treated as rpx.',
      },
      {
        name: 'animateHeight',
        type: 'boolean',
        default: 'true',
        desc: '切页时是否动画过渡容器高度。',
      },
      { name: 'heightDuration', type: 'number', default: '300', desc: '高度过渡时长（ms）。' },
      {
        name: 'indicator',
        type: 'boolean | SnFitSwiperIndicator',
        default: 'true',
        desc: '指示器样式。',
      },
      {
        name: 'indicatorPosition',
        type: 'FitSwiperIndicatorPosition',
        default: "'bottom'",
        desc: 'Indicator anchor.',
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
      {
        name: 'customPageClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for each page item.',
      },
      {
        name: 'customIndicatorClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the indicator node.',
      },
      {
        name: 'customIndicatorStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the indicator node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'FitSwiper 自适应轮播 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { FitSwiper } from '@snui/uni';",
    chipCopy: "import { FitSwiper } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-fit-swiper', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Swiper', link: '/components/uni/swiper' },
    next: { text: 'CountDown', link: '/components/uni/count-down' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
