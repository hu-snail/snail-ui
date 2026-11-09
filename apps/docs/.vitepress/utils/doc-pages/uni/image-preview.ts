/**
 * ImagePreview 图片预览（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-image-preview.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const imagePreviewDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'ImagePreview 图片预览' },
  ],
  title: 'ImagePreview 图片预览',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '实现由 ' },
    { t: 'code', s: 'sn-popup' },
    {
      t: 'text',
      s: '（遮罩 / 层级 / 滚动锁 / 进出场动画）承载，图片轨道与微信级手势（翻页 / 捏合缩放 / 双击 / 下滑关闭）为组件内置，见下方「手势」章节。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-image-preview',
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
    fileLabel: 'ImagePreview 图片预览.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ImagePreview } from '@snui/uni';
</script>

<template>
  <sn-image-preview />
</template>`,
  },
  demos: [
    {
      name: 'image-preview-mp-basic',
      title: '基础用法',
      blurb: '点击缩略图从对应位置打开；按钮从第一张打开；事件回传。',
    },
    {
      name: 'image-preview-mp-config',
      title: '配置项',
      blurb: '左上关闭按钮、关闭页码、底部插槽显示当前张数。',
    },
    {
      name: 'image-preview-mp-gestures',
      title: '手势（微信级预览）',
      blurb: '捏合缩放、双击放大、缩放后拖动、下滑关闭——微信图片预览同款手势。',
    },
    {
      name: 'image-preview-mp-behavior',
      title: 'selector 模式',
      blurb:
        'selector 命中区、关闭 loop、隐藏关闭按钮、close-on-click 关闭、自定义 z-index 与长按事件。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'CSS selector whose matched elements open the viewer (see header).',
      },
      { name: 'images', type: 'string[]', default: '() => []', desc: '图片 URL 数组' },
      { name: 'startPosition', type: 'number', default: '0', desc: '起始位置索引' },
      {
        name: 'showIndex',
        type: 'boolean',
        default: 'true',
        desc: 'Show the `current / total` counter.',
      },
      {
        name: 'loop',
        type: 'boolean',
        default: 'true',
        desc: 'Loop from the last image to the first.',
      },
      { name: 'closeable', type: 'boolean', default: 'true', desc: '是否显示关闭按钮' },
      {
        name: 'closeIcon',
        type: 'string',
        default: "'close'",
        desc: 'Close glyph: a sn-icon registry name; unknown names fall back to the built-in X.',
      },
      {
        name: 'closeIconPosition',
        type: 'ImagePreviewClosePosition',
        default: "'top-right'",
        desc: 'Close-button anchor.',
      },
      {
        name: 'closeOnClick',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the image or the scrim closes the viewer.',
      },
      {
        name: 'showMenuByLongpress',
        type: 'boolean',
        default: 'true',
        desc: 'Long-press shows the miniprogram QR menu on the image.',
      },
      { name: 'zIndex', type: 'number', default: '1000', desc: '层级' },
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
    copy: 'ImagePreview 图片预览 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { ImagePreview } from '@snui/uni';",
    chipCopy: "import { ImagePreview } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-image-preview', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-watermark', link: '/components/uni/watermark' },
    next: { text: 'sn-video-preview', link: '/components/uni/video-preview' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
