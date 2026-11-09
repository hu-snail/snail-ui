/**
 * Avatar 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const avatarDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Avatar' }],
  title: 'Avatar',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '头像组件。图片 / 文字缩略 / 图标三态，加载失败自动 fallback。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/avatar',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Avatar.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Avatar } from '@snui/vue-web';
</script>

<template>
  <Avatar />
</template>`,
  },
  demos: [
    { name: 'avatar-web-basic', title: '基础用法', blurb: 'src 图片 + 尺寸。' },
    { name: 'avatar-web-shapes', title: '形状与颜色', blurb: 'round / circle / color。' },
    {
      name: 'avatar-web-fallback',
      title: '失败回退',
      blurb: '加载失败 → fallbackText / icon；换 src 自动复位。',
    },
    {
      name: 'avatar-web-lazy',
      title: '懒加载',
      blurb:
        '长列表 / 可滚动容器内的头像：lazy 走原生 loading=lazy；再加 intersection-observer-options 则进入视口后才请求（注意把 root 指向滚动容器）。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'size',
        type: "number | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Pixel size, or a named scale. Mirrors n-avatar `size`.',
      },
      { name: 'src', type: 'string | undefined', default: 'undefined', desc: 'Image URL.' },
      {
        name: 'color',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Background color (any CSS color value). Mirrors n-avatar `color`.',
      },
      {
        name: 'objectFit',
        type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'",
        default: "'cover'",
        desc: 'Image fit inside the box. Mirrors n-avatar `objectFit`.',
      },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: 'Pill-shaped corners. Mirrors n-avatar `round`.',
      },
      {
        name: 'circle',
        type: 'boolean',
        default: 'false',
        desc: 'Circular. Mirrors n-avatar `circle`.',
      },
      {
        name: 'fallbackText',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Text thumbnail shown when there is no image.',
      },
      {
        name: 'icon',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'SnIcon registry name for the placeholder glyph.',
      },
      {
        name: 'lazy',
        type: 'boolean',
        default: 'false',
        desc: 'Load on viewport entry. Same contract as SnImage `lazy`.',
      },
      {
        name: 'intersectionObserverOptions',
        type: 'LazyVisibilityOptions | undefined',
        default: 'undefined',
        desc: 'IntersectionObserver config for lazy loading (see SnImage).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Avatar 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Avatar } from '@snui/vue-web';",
    chipCopy: "import { Avatar } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Avatar', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'text', link: '/components/web/text' },
    next: { text: 'tag', link: '/components/web/tag' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
