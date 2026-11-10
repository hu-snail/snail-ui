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
    { name: 'video-preview-web-basic', title: '基础用法', blurb: '基础用法' },
    {
      name: 'video-preview-web-controls',
      title: '自定义控制条 vs 原生控制条',
      blurb: '自定义控制条 vs 原生控制条',
    },
    { name: 'video-preview-web-background', title: '背景 / 横幅视频', blurb: '背景 / 横幅视频' },
    { name: 'video-preview-web-overlay', title: '全屏预览', blurb: '全屏预览' },
    {
      name: 'video-preview-web-custom-poster',
      title: '自定义封面与插槽',
      blurb: '自定义封面与插槽',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'src', type: 'string', default: '—', desc: '视频地址（必填）' },
      {
        name: 'poster',
        type: 'string | undefined',
        default: 'undefined',
        desc: '播放前显示的封面（`background` 下不生效）',
      },
      {
        name: 'previewSrc',
        type: 'string | undefined',
        default: 'undefined',
        desc: '单独的（更大）浮层图地址，缺省回退到 `src`。',
      },
      { name: 'width', type: 'string | number', default: '320', desc: '`320`' },
      { name: 'height', type: 'string | number | undefined', default: 'undefined', desc: '高度。' },
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
        desc: '**渲染我们自己的美化控制条**（播放 / 暂停、静音、进度条、时间、全屏）。注意：它**不再**指定浏览器原生控件',
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
        desc: '装饰性横幅 / 背景视频模式：强制关闭 `controls` 与 `native-controls`，强制 `muted` + `autoplay` + `loop` + `object-fit: cover`，媒体框绝对定位铺满父容器，视频 `aria-hidden` 且不接收指针事件',
      },
      {
        name: 'autoplay',
        type: 'boolean',
        default: 'false',
        desc: '挂载后自动播放（浏览器策略要求静音，见「兼容性说明」）',
      },
      { name: 'loop', type: 'boolean', default: 'false', desc: '循环播放' },
      { name: 'muted', type: 'boolean', default: 'false', desc: '静音播放' },
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
        desc: '关闭浮层：不再出现工具条入口，`showPreview()` 变为空操作。',
      },
      { name: 'showToolbar', type: 'boolean', default: 'true', desc: '渲染右上角的浮层入口。' },
      { name: 'closeOnMaskClick', type: 'boolean', default: 'true', desc: '点击遮罩时关闭浮层。' },
      {
        name: 'title',
        type: 'string | undefined',
        default: 'undefined',
        desc: '浮层标题，同时作为无障碍名称的兜底',
      },
      {
        name: 'alt',
        type: 'string | undefined',
        default: 'undefined',
        desc: '视频无障碍说明，优先级高于 `title`',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnVideoPreview.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      { name: 'play', payload: '—', desc: '内联播放开始时触发。' },
      { name: 'pause', payload: '—', desc: '内联播放暂停时触发。' },
      { name: 'ended', payload: '—', desc: '内联播放到结尾时触发。' },
      { name: 'error', payload: 'Event', desc: '视频加载或解码失败时触发。' },
      { name: 'preview', payload: '—', desc: '浮层打开时触发。' },
      {
        name: 'close',
        payload: '—',
        desc: '浮层关闭时触发（ESC / 遮罩 / 关闭按钮 / `closePreview()`）。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnVideoPreview.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'placeholder', props: '—', desc: '无海报或视频未开始时替换海报区域。' },
      { name: 'play-icon', props: '—', desc: '替换居中的播放图标。' },
      {
        name: 'toolbar',
        props: '{ showPreview: () => void }',
        desc: '替换右上角浮层入口，作用域提供打开方法。',
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
