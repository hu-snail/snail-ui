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
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
  props: {
    hint: [],
    rows: [
      {
        name: 'size',
        type: "number | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Pixel size, or a named scale. Mirrors n-avatar `size`.',
      },
      { name: 'src', type: 'string | undefined', default: 'undefined', desc: '图片地址' },
      {
        name: 'color',
        type: 'string | undefined',
        default: 'undefined',
        desc: '背景色（fallbackText/icon 时）',
      },
      {
        name: 'objectFit',
        type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'",
        default: "'cover'",
        desc: 'Image fit inside the box. Mirrors n-avatar `objectFit`.',
      },
      { name: 'round', type: 'boolean', default: 'false', desc: '圆角' },
      { name: 'circle', type: 'boolean', default: 'false', desc: '圆形' },
      {
        name: 'fallbackText',
        type: 'string | undefined',
        default: 'undefined',
        desc: '无图/失败时文字缩略',
      },
      { name: 'icon', type: 'string | undefined', default: 'undefined', desc: 'SnIcon 注册名' },
      {
        name: 'lazy',
        type: 'boolean',
        default: 'false',
        desc: '懒加载开关，单独使用走原生 `loading="lazy"`',
      },
      {
        name: 'intersectionObserverOptions',
        type: 'LazyVisibilityOptions | undefined',
        default: 'undefined',
        desc: '与 `lazy` 同时使用时进入视口前不设置 `src`（视口内先渲染 fallback 内容）',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnAvatar.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'error',
        payload: 'Event',
        desc: '图片加载失败时触发，并切换到回退内容。对齐 n-avatar `onError`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnAvatar.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '自定义头像内容，无图片时显示。' },
      { name: 'icon', props: '—', desc: '占位图标，替换 `icon` 属性或内置人形 SVG。' },
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
