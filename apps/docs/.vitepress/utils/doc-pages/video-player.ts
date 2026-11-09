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
        desc: '视频地址（简单模式）；桥接管流时忽略',
      },
      {
        name: 'poster',
        type: 'string',
        default: 'undefined as unknown as string',
        desc: '首帧前封面',
      },
      {
        name: 'title',
        type: 'string',
        default: 'undefined as unknown as string',
        desc: '无障碍名称，同时用作小窗标题',
      },
      {
        name: 'qualities',
        type: 'SnVideoQuality[]',
        default: '() => []',
        desc: '渐进式清晰度阶梯 `{ label, value, src, type? }`',
      },
      {
        name: 'defaultQuality',
        type: 'string | number',
        default: 'undefined as unknown as string | number',
        desc: '初始选中的清晰度档位（`qualities[].value`）。',
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
        desc: '强制直播模式；缺省按 `duration === Infinity` 或桥接回报判定',
      },
      {
        name: 'shortcuts',
        type: 'boolean',
        default: 'true',
        desc: '键盘快捷键（Space/K、←→、↑↓、M、F、P、D）',
      },
      {
        name: 'danmus',
        type: 'SnVideoDanmu[]',
        default: '() => []',
        desc: '弹幕时间轴 `{ text, time, color?, type?, self? }`',
      },
      { name: 'danmuVisible', type: 'boolean', default: 'true', desc: '显示弹幕层。' },
      { name: 'danmuSend', type: 'boolean', default: 'true', desc: '显示弹幕输入框。' },
      { name: 'danmuOpacity', type: 'number', default: '1', desc: '0–1.' },
      { name: 'danmuSpeed', type: 'number', default: '1', desc: '速度倍数。' },
      {
        name: 'danmuFontSize',
        type: 'number',
        default: '16',
        desc: '基准字号（px，随播放器宽度缩放）。',
      },
      {
        name: 'danmuArea',
        type: 'number',
        default: '0.75',
        desc: '弹幕轨道可用的高度占比（0–1）。',
      },
      {
        name: 'mini',
        type: 'boolean',
        default: 'undefined as unknown as boolean',
        desc: '小窗播放（受控），配合 `@update:mini` / `v-model:mini`',
      },
      {
        name: 'miniOnScrollOut',
        type: 'boolean',
        default: 'false',
        desc: '滚出视口时自动收进小窗。',
      },
      { name: 'miniWidth', type: 'number', default: '320', desc: '小窗宽度（px）。' },
      {
        name: 'pip',
        type: 'boolean',
        default: 'true',
        desc: '画中画入口（环境不支持时不渲染按钮）',
      },
      {
        name: 'download',
        type: 'boolean',
        default: 'true',
        desc: '下载按钮（直播 / 桥接管流且未提供 `on-download` 时隐藏）',
      },
      {
        name: 'settings',
        type: 'boolean',
        default: 'true',
        desc: '设置菜单（清晰度 / 倍速 / 循环）',
      },
      {
        name: 'sourceBridge',
        type: 'SnVideoSourceBridge',
        default: 'undefined as unknown as SnVideoSourceBridge',
        desc: '第三方流媒体桥接（HLS / DASH / FLV），由宿主应用安装，不随库打包；用法见文档指南。',
      },
      {
        name: 'width',
        type: 'string | number',
        default: 'undefined as unknown as string | number',
        desc: '宽度。',
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
