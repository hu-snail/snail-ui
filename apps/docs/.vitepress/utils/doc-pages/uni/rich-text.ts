/**
 * RichText 富文本（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-rich-text.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const richTextDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'RichText 富文本' },
  ],
  title: 'RichText 富文本',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '把 HTML 交给 ' },
    { t: 'code', s: 'content' },
    { t: 'text', s: ' 即可；' },
    { t: 'code', s: 'selectable' },
    { t: 'text', s: ' 让文字可选中。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-rich-text',
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
    fileLabel: 'RichText 富文本.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { RichText } from '@snui/uni';
</script>

<template>
  <sn-rich-text />
</template>`,
  },
  demos: [
    { name: 'rich-text-mp-basic', title: '基础图文', blurb: '基础图文' },
    { name: 'rich-text-mp-images', title: '图片与预览', blurb: '图片与预览' },
    { name: 'rich-text-mp-links', title: '链接与图片链接', blurb: '链接与图片链接' },
    { name: 'rich-text-mp-table', title: '表格', blurb: '表格' },
    { name: 'rich-text-mp-media', title: '音视频与媒体控制', blurb: '音视频与媒体控制' },
    {
      name: 'rich-text-mp-styles',
      title: '样式映射、目录与空状态',
      blurb: '样式映射、目录与空状态',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'content', type: 'string', default: "''", desc: 'HTML content to render.' },
      {
        name: 'loadingImage',
        type: 'string',
        default: "''",
        desc: 'Placeholder image shown while a content image loads.',
      },
      {
        name: 'errorImage',
        type: 'string',
        default: "''",
        desc: 'Placeholder image shown after a content image fails.',
      },
      {
        name: 'enableAnchor',
        type: 'boolean',
        default: 'false',
        desc: 'Build the heading outline and enable anchor targeting.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: 'false',
        desc: 'Allow text selection where the platform supports it.',
      },
      {
        name: 'previewImage',
        type: 'boolean',
        default: 'true',
        desc: 'Preview a standalone image on tap (built-in WeChat-style viewer).',
      },
      {
        name: 'lazyLoad',
        type: 'boolean',
        default: 'false',
        desc: 'Let the platform lazy-load content images.',
      },
      {
        name: 'baseUrl',
        type: 'string',
        default: "''",
        desc: 'Absolute HTTP(S) base used to resolve relative resource addresses.',
      },
      {
        name: 'allowDataImage',
        type: 'boolean',
        default: 'false',
        desc: 'Accept ≤64KiB PNG/JPEG/GIF/WebP base64 images (never auto-previewed).',
      },
      {
        name: 'tagStyle',
        type: 'Record<string, string>',
        default: '() => ({})',
        desc: "Per-tag default style overrides (`{ p: 'text-align:center' }`).",
      },
      {
        name: 'classStyles',
        type: 'Record<string, string>',
        default: '() => ({})',
        desc: 'Class-name to inline-style map for classes used inside the content.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Root custom class.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Root custom inline style.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'RichText 富文本 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { RichText } from '@snui/uni';",
    chipCopy: "import { RichText } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-rich-text', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-table', link: '/components/uni/table' },
    next: { text: 'sn-waterfall', link: '/components/uni/waterfall' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
