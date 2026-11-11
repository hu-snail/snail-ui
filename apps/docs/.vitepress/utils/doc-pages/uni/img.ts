/**
 * Img 图片（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-img.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const imgDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '展示组件 Display' }, { text: 'Img 图片' }],
  title: 'Img 图片',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '占位底盘、加载圈与失败文案颜色全部来自语义色 token（' },
    { t: 'code', s: '--sn-mp-color-background-subtle' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-border-default' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-action-primary' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-text-tertiary' },
    { t: 'text', s: '），都在 ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    {
      t: 'text',
      s: ' 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-img',
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
    fileLabel: 'Img 图片.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Img } from '@snui/uni';
</script>

<template>
  <sn-img />
</template>`,
  },
  demos: [
    {
      name: 'img-mp-mode',
      title: '裁剪模式（mode）',
      blurb: 'scaleToFill / aspectFit / aspectFill 三种裁剪模式。',
    },
    {
      name: 'img-mp-shape',
      title: '圆形与圆角（round / radius）',
      blurb: 'round 圆形；radius 自定义圆角；默认直角作对照。',
    },
    {
      name: 'img-mp-state',
      title: '加载与失败态',
      blurb: '正常 / 错误地址切换，自定义失败插槽，关闭内置状态。',
    },
    {
      name: 'img-mp-preview',
      title: '点击预览（enablePreview）',
      blurb:
        '缩略图点击打开大图、preview-src 覆盖；附带 show-menu-by-longpress 长按菜单（仅微信小程序）。',
    },
    {
      name: 'img-mp-lazy-load',
      title: '懒加载（lazyLoad）',
      blurb: 'lazy-load 交给原生 image，进入视口附近才开始加载。',
    },
    {
      name: 'img-mp-custom',
      title: '自定义类名与样式',
      blurb: '根节点类名 / inline style 与内部 image 类名分别生效。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'src', type: 'string', default: "''", desc: 'Image source.' },
      {
        name: 'previewSrc',
        type: 'string',
        default: "''",
        desc: 'Image opened by `enablePreview` (defaults to `src`).',
      },
      {
        name: 'width',
        type: 'string | number',
        default: "''",
        desc: 'Width — a bare number is treated as rpx.',
      },
      {
        name: 'height',
        type: 'string | number',
        default: "''",
        desc: 'Height — a bare number is treated as rpx.',
      },
      { name: 'mode', type: 'ImageMode', default: "'scaleToFill'", desc: 'Crop mode.' },
      { name: 'round', type: 'boolean', default: 'false', desc: '是否显示为圆形' },
      {
        name: 'radius',
        type: 'string | number',
        default: "''",
        desc: 'Corner radius — a bare number is treated as rpx.',
      },
      {
        name: 'lazyLoad',
        type: 'boolean',
        default: 'false',
        desc: "Lazy-load the image (uni `<image lazy-load>`). When the prop is not passed, an ancestor `sn-waterfall`'s container-level `lazyLoad` config is inherited (see the header note).",
      },
      {
        name: 'enablePreview',
        type: 'boolean',
        default: 'false',
        desc: '是否支持点击预览（调用 `uni.previewImage`）',
      },
      {
        name: 'showMenuByLongpress',
        type: 'boolean',
        default: 'false',
        desc: '长按显示识别小程序码菜单（仅微信小程序）',
      },
      { name: 'showLoading', type: 'boolean', default: 'true', desc: '是否展示默认加载态' },
      { name: 'showError', type: 'boolean', default: 'true', desc: '是否展示默认失败态' },
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
        name: 'customImage',
        type: 'string',
        default: "''",
        desc: 'Custom class for the inner `<image>`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Img 图片 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Img } from '@snui/uni';",
    chipCopy: "import { Img } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-img', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Card', link: '/components/uni/card' },
    next: { text: 'Swiper', link: '/components/uni/swiper' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
