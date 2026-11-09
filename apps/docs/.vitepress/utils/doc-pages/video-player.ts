/**
 * 视频播放器 VideoPlayer 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const videoPlayerDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '视频播放器 VideoPlayer' },
  ],
  title: '视频播放器 VideoPlayer',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '完整视频播放器：弹幕、画中画、小窗播放、分辨率切换、下载、倍速 / 循环、直播模式，全部内置且走 ',
    },
    { t: 'code', s: '--sn-web-*' },
    { t: 'text', s: ' token 主题化。流媒体格式（HLS / DASH / FLV）通过 ' },
    { t: 'code', s: 'sourceBridge' },
    { t: 'text', s: ' 插件边界接入第三方库（如 hls.js）——**组件库本身零流媒体依赖**。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/video-player',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '视频播放器 VideoPlayer.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { VideoPlayer } from '@snui/vue-web';
</script>

<template>
  <VideoPlayer />
</template>`,
  },
  demos: [
    { name: 'video-player-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'video-player-web-danmaku', title: '弹幕', blurb: '弹幕' },
    {
      name: 'video-player-web-quality',
      title: '分辨率切换（渐进式阶梯）',
      blurb: '分辨率切换（渐进式阶梯）',
    },
    { name: 'video-player-web-pip', title: '画中画', blurb: '画中画' },
    {
      name: 'video-player-web-mini',
      title: '小窗播放（滚动自动停靠）',
      blurb: '小窗播放（滚动自动停靠）',
    },
    { name: 'video-player-web-download', title: '下载', blurb: '下载' },
    {
      name: 'video-player-web-hls-live',
      title: '直播模式 + HLS 桥接（hls.js，公开直播源）',
      blurb: '直播模式 + HLS 桥接（hls.js，公开直播源）',
    },
    {
      name: 'video-player-web-hls-vod',
      title: '多码率点播（清晰度来自流）',
      blurb: '多码率点播（清晰度来自流）',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'src',
        type: 'string',
        default: 'undefined as unknown as string',
        desc: 'Media URL (plain mode). Ignored while a bridge owns loading.',
      },
      {
        name: 'poster',
        type: 'string',
        default: 'undefined as unknown as string',
        desc: 'Poster shown before the first frame.',
      },
      {
        name: 'title',
        type: 'string',
        default: 'undefined as unknown as string',
        desc: 'Accessible name for the video; also the mini-window header text.',
      },
      {
        name: 'qualities',
        type: 'SnVideoQuality[]',
        default: '() => []',
        desc: 'Progressive quality ladder (MP4/WebM).',
      },
      {
        name: 'defaultQuality',
        type: 'string | number',
        default: 'undefined as unknown as string | number',
        desc: 'Initially selected ladder entry (`qualities[].value`).',
      },
      {
        name: 'autoplay',
        type: 'boolean',
        default: 'false',
        desc: '自动播放（浏览器要求静音，见「兼容性说明」）',
      },
      { name: 'muted', type: 'boolean', default: 'false', desc: '静音起播' },
      { name: 'loop', type: 'boolean', default: 'false', desc: '循环播放' },
      {
        name: 'preload',
        type: "'none' | 'metadata' | 'auto'",
        default: "'metadata'",
        desc: 'preload',
      },
      { name: 'volume', type: 'number', default: '1', desc: '初始音量 0–1' },
      { name: 'rate', type: 'number', default: '1', desc: '初始倍速' },
      {
        name: 'live',
        type: 'boolean',
        default: 'undefined as unknown as boolean',
        desc: 'Force live mode; `undefined` sniffs `duration === Infinity` / bridge.',
      },
      {
        name: 'shortcuts',
        type: 'boolean',
        default: 'true',
        desc: 'Keyboard shortcuts (Space/K, ←→, ↑↓, M, F, P, D).',
      },
      {
        name: 'danmus',
        type: 'SnVideoDanmu[]',
        default: '() => []',
        desc: '弹幕时间轴 `{ text, time, color?, type?, self? }`',
      },
      { name: 'danmuVisible', type: 'boolean', default: 'true', desc: 'Show the danmu layer.' },
      { name: 'danmuSend', type: 'boolean', default: 'true', desc: 'Show the danmu input box.' },
      { name: 'danmuOpacity', type: 'number', default: '1', desc: '0–1.' },
      { name: 'danmuSpeed', type: 'number', default: '1', desc: 'Velocity multiplier.' },
      {
        name: 'danmuFontSize',
        type: 'number',
        default: '16',
        desc: 'Base font size in px (scales with player width).',
      },
      {
        name: 'danmuArea',
        type: 'number',
        default: '0.75',
        desc: 'Fraction of the height usable for danmu lanes (0–1).',
      },
      {
        name: 'mini',
        type: 'boolean',
        default: 'undefined as unknown as boolean',
        desc: 'Mini floating window (controlled). `undefined` → uncontrolled.',
      },
      {
        name: 'miniOnScrollOut',
        type: 'boolean',
        default: 'false',
        desc: 'Auto-dock into the mini window when scrolled out of view.',
      },
      { name: 'miniWidth', type: 'number', default: '320', desc: 'Docked window width in px.' },
      {
        name: 'pip',
        type: 'boolean',
        default: 'true',
        desc: 'Picture-in-picture toggle (button only renders when supported).',
      },
      {
        name: 'download',
        type: 'boolean',
        default: 'true',
        desc: 'Download button (hidden for live / bridge-owned media).',
      },
      {
        name: 'settings',
        type: 'boolean',
        default: 'true',
        desc: 'Settings menu (quality / rate / loop).',
      },
      {
        name: 'sourceBridge',
        type: 'SnVideoSourceBridge',
        default: 'undefined as unknown as SnVideoSourceBridge',
        desc: 'Third-party streaming bridge (HLS / DASH / FLV) — installed by the host app, never bundled with the library. See the docs guide.',
      },
      {
        name: 'width',
        type: 'string | number',
        default: 'undefined as unknown as string | number',
        desc: 'Player width (number → px).',
      },
      { name: 'aspectRatio', type: 'string', default: "'16 / 9'", desc: 'Player aspect ratio.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '视频播放器 VideoPlayer 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { VideoPlayer } from '@snui/vue-web';",
    chipCopy: "import { VideoPlayer } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'VideoPlayer', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'video-preview', link: '/components/web/video-preview' },
    next: { text: 'list', link: '/components/web/list' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
