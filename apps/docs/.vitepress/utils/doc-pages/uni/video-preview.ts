/**
 * VideoPreview 视频预览（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-video-preview.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const videoPreviewDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'VideoPreview 视频预览' },
  ],
  title: 'VideoPreview 视频预览',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '实现由 ' },
    { t: 'code', s: 'sn-popup' },
    { t: 'text', s: '（遮罩 / 层级 / 滚动锁 / 进出场动画）包原生 ' },
    { t: 'code', s: '<video>' },
    { t: 'text', s: ' 组成，播放与播放器控件都来自厂商运行时。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-video-preview',
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
    fileLabel: 'VideoPreview 视频预览.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { VideoPreview } from '@snui/uni';
</script>

<template>
  <sn-video-preview />
</template>`,
  },
  demos: [
    {
      name: 'video-preview-mp-basic',
      title: '基础用法',
      blurb: '按钮打开视频层；open / close 事件回传。',
    },
    {
      name: 'video-preview-mp-fullscreen',
      title: '全屏与关闭位置',
      blurb: '全屏模式、右上关闭按钮、自动播放，以及 on-open 回调计数。',
    },
    {
      name: 'video-preview-mp-config',
      title: '层级、样式与回调',
      blurb: '自定义 z-index 与 customStyle、selector 实例标识，以及 on-open / on-close 计数。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'Instance identifier (parity with the reference; useful for logs / telemetry).',
      },
      { name: 'zIndex', type: 'number', default: '1000', desc: 'Stacking level of the layer.' },
      {
        name: 'fullScreen',
        type: 'boolean',
        default: 'false',
        desc: 'Fill the viewport with the video instead of the centred 16:9 stage.',
      },
      {
        name: 'closePosition',
        type: 'VideoPreviewClosePosition',
        default: "'left-top'",
        desc: 'Close-button anchor.',
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
    copy: 'VideoPreview 视频预览 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { VideoPreview } from '@snui/uni';",
    chipCopy: "import { VideoPreview } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-video-preview', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-image-preview', link: '/components/uni/image-preview' },
    next: { text: 'sn-img-cropper', link: '/components/uni/img-cropper' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
