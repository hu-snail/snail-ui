/**
 * 视频预览 VideoPreview 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const videoPreviewDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '视频预览 VideoPreview' },
  ],
  title: '视频预览 VideoPreview',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '视频媒体框：封面 + 居中播放按钮，点击后原位内联播放；右上角的「放大」按钮可打开全屏预览浮层（Esc 或点击遮罩关闭）。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/video-preview',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '视频预览 VideoPreview.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { VideoPreview } from '@snui/vue-web';
</script>

<template>
  <VideoPreview />
</template>`,
  },
  demos: [
    {
      name: 'video-preview-web-basic',
      title: '代码演示',
      blurb:
        '默认即为自定义控制条；width / height / aspect-ratio 控制媒体框尺寸，object-fit 控制填充方式。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'src', type: 'string', default: '—', desc: 'Video source. Required.' },
      {
        name: 'poster',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Poster shown before playback starts. Ignored while `background`.',
      },
      {
        name: 'previewSrc',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Dedicated (larger) overlay url; falls back to `src`.',
      },
      {
        name: 'width',
        type: 'string | number',
        default: '320',
        desc: 'Box width (number → px). Ignored while `background` (fills the parent).',
      },
      {
        name: 'height',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Box height (number → px). Explicit `undefined` keeps the ratio.',
      },
      {
        name: 'aspectRatio',
        type: 'string | undefined',
        default: 'undefined',
        desc: "Box aspect ratio applied when no explicit `height` is given, e.g. `'16 / 9'`.",
      },
      {
        name: 'objectFit',
        type: "'contain' | 'cover' | 'fill'",
        default: "'cover'",
        desc: "How the video fits its box. Forced to `'cover'` while `background`.",
      },
      {
        name: 'controls',
        type: 'boolean',
        default: 'true',
        desc: 'Render OUR custom, beautified control bar (never the native one).',
      },
      {
        name: 'nativeControls',
        type: 'boolean',
        default: 'false',
        desc: "Render the browser's own `controls` attribute (unstylable, UA-drawn).",
      },
      {
        name: 'background',
        type: 'boolean',
        default: 'false',
        desc: 'Decorative banner / section-background mode: no controls at all, forced `muted` + `autoplay` + `loop` + `cover`, fills the positioned parent and the video is `aria-hidden` + `pointer-events: none`.',
      },
      {
        name: 'autoplay',
        type: 'boolean',
        default: 'false',
        desc: 'Start inline playback on mount (browsers require `muted` for this).',
      },
      { name: 'loop', type: 'boolean', default: 'false', desc: 'Loop inline playback.' },
      { name: 'muted', type: 'boolean', default: 'false', desc: 'Mute inline playback.' },
      {
        name: 'preload',
        type: "'none' | 'metadata' | 'auto'",
        default: "'metadata'",
        desc: 'Preload strategy.',
      },
      {
        name: 'previewDisabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable the overlay: no toolbar affordance, `showPreview()` is a no-op.',
      },
      {
        name: 'showToolbar',
        type: 'boolean',
        default: 'true',
        desc: 'Render the top-right overlay affordance.',
      },
      {
        name: 'closeOnMaskClick',
        type: 'boolean',
        default: 'true',
        desc: 'Close the overlay when its mask is clicked.',
      },
      {
        name: 'title',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Overlay header text, and the accessible name of the video.',
      },
      {
        name: 'alt',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Accessible description of the video; takes precedence over `title`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '视频预览 VideoPreview 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { VideoPreview } from '@snui/vue-web';",
    chipCopy: "import { VideoPreview } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'VideoPreview', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'image', link: '/components/web/image' },
    next: { text: 'video-player', link: '/components/web/video-player' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
