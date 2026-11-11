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
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
    { name: 'image-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'image-web-group', title: '组内预览', blurb: '组内预览' },
    { name: 'image-web-fallback', title: '加载失败回退', blurb: '加载失败回退' },
    { name: 'image-web-error-slot', title: '自定义加载失败占位', blurb: '自定义加载失败占位' },
    { name: 'image-web-preview-disabled', title: '禁止预览', blurb: '禁止预览' },
    { name: 'image-web-lazy', title: '懒加载', blurb: '懒加载' },
    { name: 'image-web-manual-preview', title: '手动打开预览', blurb: '手动打开预览' },
    { name: 'image-web-previewed-img-props', title: '预览图属性', blurb: '预览图属性' },
    { name: 'image-web-toolbar-tooltip', title: '工具栏提示', blurb: '工具栏提示' },
    { name: 'image-web-custom-toolbar', title: '自定义工具栏', blurb: '自定义工具栏' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'alt',
        type: 'string | undefined',
        default: '—',
        desc: '图片说明，同时作为 alt 与 aria-label',
      },
      { name: 'width', type: 'string | number | undefined', default: '—', desc: '宽度。' },
      { name: 'height', type: 'string | number | undefined', default: '—', desc: '高度。' },
      {
        name: 'imgProps',
        type: 'ImgHTMLAttributes | undefined',
        default: '—',
        desc: '透传到内层 `<img>` 的额外属性。对应 ``img-props``。',
      },
      {
        name: 'lazy',
        type: 'boolean',
        default: '—',
        desc: '进入视口后再加载；单独使用为原生懒加载',
      },
      {
        name: 'intersectionObserverOptions',
        type: 'LazyVisibilityOptions | undefined',
        default: '—',
        desc: '懒加载使用的 IntersectionObserver 配置。对应 ``intersection-observer-options``。',
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
        desc: '单独的（更大）预览图地址，缺省回退到 `src`。对应 ``preview-src``。',
      },
      {
        name: 'fallbackSrc',
        type: 'string | undefined',
        default: '—',
        desc: '缩略图加载失败时显示的占位图。对应 ``fallback-src``。',
      },
      { name: 'src', type: 'string | undefined', default: '—', desc: '图片来源' },
      {
        name: 'previewDisabled',
        type: 'boolean',
        default: '—',
        desc: '禁用点击预览。对应 ``preview-disabled``。',
      },
      {
        name: 'previewedImgProps',
        type: 'ImgHTMLAttributes | undefined',
        default: '—',
        desc: '预览图片的额外属性与样式。对应 ``previewed-img-props``。',
      },
      {
        name: 'renderToolbar',
        type: '((props: { nodes: SnImageToolbarNodes }) => unknown)',
        default: '—',
        desc: '自定义预览工具栏渲染函数，透传给预览层（对齐 naive-ui `render-toolbar`）。',
      },
      {
        name: 'showToolbar',
        type: 'boolean | undefined',
        default: '—',
        desc: '预览中工具条的可见性。对应 ``show-toolbar``。',
      },
      {
        name: 'showToolbarTooltip',
        type: 'boolean | undefined',
        default: '—',
        desc: '工具条按钮的原生 title 提示。对应 ``show-toolbar-tooltip``。',
      },
      {
        name: 'keepDragOffset',
        type: 'boolean | undefined',
        default: '—',
        desc: '释放后保留拖拽偏移。对应 ``keep-drag-offset``。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnImage.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      { name: 'load', payload: 'Event', desc: '缩略图加载完成时触发（对齐 naive-ui `on-load`）。' },
      {
        name: 'error',
        payload: 'Event',
        desc: '缩略图加载失败（已尝试回退图）后触发（对齐 naive-ui `on-error`）。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnImage.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'error', props: '—', desc: '错误态下替换默认 `<img>` 的自定义内容。' },
      { name: 'placeholder', props: '—', desc: '图片未加载完成时渲染（或垫在图片下方）。' },
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
