/**
 * 图片 Image 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const imageDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: '图片 Image' }],
  title: '图片 Image',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '带点击预览的图片展示：全屏浮层内支持缩放、旋转、1:1、拖拽平移、滚轮缩放、下载，组内图片可左右切换。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/image',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '图片 Image.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Image } from '@snui/vue-web';
</script>

<template>
  <Image />
</template>`,
  },
  demos: [
    { name: 'image-web-basic', title: '代码演示', blurb: 'width/height/object-fit 控制缩略图。' },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'alt',
        type: 'string | undefined',
        default: '—',
        desc: 'Image description exposed as alt/aria-label. Mirrors `alt`.',
      },
      {
        name: 'width',
        type: 'string | number | undefined',
        default: '—',
        desc: 'Thumbnail width (number → px). Mirrors `width`.',
      },
      {
        name: 'height',
        type: 'string | number | undefined',
        default: '—',
        desc: 'Thumbnail height (number → px). Mirrors `height`.',
      },
      {
        name: 'imgProps',
        type: 'ImgHTMLAttributes | undefined',
        default: '—',
        desc: 'Extra attributes forwarded to the inner <img>. Mirrors `img-props`.',
      },
      {
        name: 'lazy',
        type: 'boolean',
        default: '—',
        desc: 'Load on viewport entry. Mirrors `lazy`.',
      },
      {
        name: 'intersectionObserverOptions',
        type: 'LazyVisibilityOptions | undefined',
        default: '—',
        desc: 'IntersectionObserver config for lazy loading. Mirrors `intersection-observer-options`.',
      },
      {
        name: 'objectFit',
        type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'",
        default: '—',
        desc: 'Thumbnail fit inside its box. Mirrors `object-fit`.',
      },
      {
        name: 'previewSrc',
        type: 'string | undefined',
        default: '—',
        desc: 'Dedicated (larger) preview url; falls back to `src`. Mirrors `preview-src`.',
      },
      {
        name: 'fallbackSrc',
        type: 'string | undefined',
        default: '—',
        desc: 'Shown when the thumbnail fails to load. Mirrors `fallback-src`.',
      },
      {
        name: 'src',
        type: 'string | undefined',
        default: '—',
        desc: 'Image source. Mirrors `src`.',
      },
      {
        name: 'previewDisabled',
        type: 'boolean',
        default: '—',
        desc: 'Disable click-to-preview. Mirrors `preview-disabled`.',
      },
      {
        name: 'previewedImgProps',
        type: 'ImgHTMLAttributes | undefined',
        default: '—',
        desc: 'Attributes/style for the previewed <img>. Mirrors `previewed-img-props`.',
      },
      {
        name: 'showToolbar',
        type: 'boolean | undefined',
        default: '—',
        desc: 'Toolbar visibility in the preview. Mirrors `show-toolbar`.',
      },
      {
        name: 'showToolbarTooltip',
        type: 'boolean | undefined',
        default: '—',
        desc: 'Native title hints on toolbar buttons. Mirrors `show-toolbar-tooltip`.',
      },
      {
        name: 'keepDragOffset',
        type: 'boolean | undefined',
        default: '—',
        desc: 'Keep the dragged offset after release. Mirrors `keep-drag-offset`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '图片 Image 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Image } from '@snui/vue-web';",
    chipCopy: "import { Image } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Image', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'equation', link: '/components/web/equation' },
    next: { text: 'video-preview', link: '/components/web/video-preview' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
