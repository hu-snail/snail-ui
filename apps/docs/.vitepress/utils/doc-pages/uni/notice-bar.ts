/**
 * NoticeBar 通知栏（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-notice-bar.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const noticeBarDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'NoticeBar 通知栏' },
  ],
  title: 'NoticeBar 通知栏',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '三种类型的底色与前景色全部来自语义色 token（' },
    { t: 'code', s: '--sn-mp-color-feedback-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-background-subtle' },
    { t: 'text', s: '），这些都在 ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    {
      t: 'text',
      s: ' 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-notice-bar',
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
    fileLabel: 'NoticeBar 通知栏.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { NoticeBar } from '@snui/uni';
</script>

<template>
  <sn-notice-bar />
</template>`,
  },
  demos: [
    { name: 'notice-bar-mp-basic', title: '基础用法', blurb: '跑马灯 / 静态 / 换行三种模式。' },
    { name: 'notice-bar-mp-type', title: '类型与关闭', blurb: '三种色调 + 可关闭通知（可恢复）。' },
    {
      name: 'notice-bar-mp-vertical',
      title: '纵向轮换',
      blurb: '三条公告轮换展示，并显示当前序号。',
    },
    {
      name: 'notice-bar-mp-marquee',
      title: '图标、延迟与速度',
      blurb: 'prefix 注册表图标 / delay=3 / speed=120。',
    },
    {
      name: 'notice-bar-mp-custom',
      title: '自定义配色与类名',
      blurb: '覆盖文字色与底色 / custom-class 加边框 / custom-style 加圆角。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'text',
        type: 'string | string[]',
        default: "''",
        desc: 'Notice text — a string or an array of lines.',
      },
      {
        name: 'type',
        type: 'NoticeBarType',
        default: "'warning'",
        desc: 'Semantic type — drives the tint.',
      },
      {
        name: 'prefix',
        type: 'string',
        default: "''",
        desc: 'Left icon name (sn-icon registry); empty falls back to the type glyph.',
      },
      {
        name: 'scrollable',
        type: 'boolean',
        default: 'true',
        desc: 'Enable the marquee. `false` shows a static (optionally wrapped) strip.',
      },
      {
        name: 'delay',
        type: 'number',
        default: '1',
        desc: 'Delay before the marquee starts, in seconds.',
      },
      {
        name: 'speed',
        type: 'number',
        default: '50',
        desc: 'Marquee speed in px per second (converted into a cycle duration).',
      },
      { name: 'closable', type: 'boolean', default: 'false', desc: '是否显示关闭按钮' },
      {
        name: 'wrapable',
        type: 'boolean',
        default: 'false',
        desc: 'Wrap long text onto multiple lines; only applies when `scrollable` is false.',
      },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Text and icon color override (any CSS color value).',
      },
      {
        name: 'backgroundColor',
        type: 'string',
        default: "''",
        desc: 'Background color override (any CSS color value).',
      },
      {
        name: 'direction',
        type: 'NoticeBarDirection',
        default: "'horizontal'",
        desc: 'Scroll axis.',
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
    copy: 'NoticeBar 通知栏 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { NoticeBar } from '@snui/uni';",
    chipCopy: "import { NoticeBar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-notice-bar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-notify', link: '/components/uni/notify' },
    next: { text: 'sn-empty', link: '/components/uni/empty' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
