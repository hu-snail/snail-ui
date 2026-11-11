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
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
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
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
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
      name: 'image-preview-mp-close-position',
      title: '关闭按钮位置（closeIconPosition）',
      blurb: 'closeIconPosition 默认 top-right，这里切到 top-left。',
    },
    {
      name: 'image-preview-mp-index',
      title: '页码与底部插槽',
      blurb: 'showIndex=false 隐藏内置页码；#default 插槽拿到 current 渲染底部自定义文案。',
    },
    {
      name: 'image-preview-mp-gestures',
      title: '手势（微信级预览）',
      blurb: '捏合缩放、双击放大、缩放后拖动、下滑关闭——微信图片预览同款手势。',
    },
    {
      name: 'image-preview-mp-selector',
      title: 'selector 命中区',
      blurb: 'selector=".sn-demo__thumb" 在 open() 时为缩略图铺透明点击区；open / close 事件回传。',
    },
    {
      name: 'image-preview-mp-close-behavior',
      title: '关闭与循环行为',
      blurb: 'loop=false 不循环；closeable=false 无关闭按钮；close-on-click=false 点遮罩不关。',
    },
    {
      name: 'image-preview-mp-longpress',
      title: '长按菜单与事件',
      blurb:
        'show-menu-by-longpress 长按弹出识别小程序码菜单（仅微信小程序），同时抛 long-press 事件。',
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
      { name: 'showIndex', type: 'boolean', default: 'true', desc: '是否显示页码' },
      { name: 'loop', type: 'boolean', default: 'true', desc: '是否循环播放' },
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
      { name: 'closeOnClick', type: 'boolean', default: 'true', desc: '点击图片或遮罩是否关闭' },
      {
        name: 'showMenuByLongpress',
        type: 'boolean',
        default: 'true',
        desc: '长按图片显示识别小程序码菜单',
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
    prev: { text: 'Watermark', link: '/components/uni/watermark' },
    next: { text: 'VideoPreview', link: '/components/uni/video-preview' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
