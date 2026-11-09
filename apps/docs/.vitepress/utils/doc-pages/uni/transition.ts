/**
 * Transition 动画（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-transition.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const transitionDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'Transition 动画' },
  ],
  title: 'Transition 动画',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '动画只改变 ' },
    { t: 'code', s: 'transform' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'opacity' },
    {
      t: 'text',
      s: '，不消费颜色 token，因此暗色下无需额外适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-transition',
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
    fileLabel: 'Transition 动画.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Transition } from '@snui/uni';
</script>

<template>
  <sn-transition />
</template>`,
  },
  demos: [
    {
      name: 'transition-mp-basic',
      title: '基础用法',
      blurb: 'fade / fade-up / zoom-in / slide-up 四种动画切换。',
    },
    {
      name: 'transition-mp-config',
      title: '组合、分时长与销毁',
      blurb: '组合动画、进入 100ms / 离开 600ms、destroy=false，以及事件序列。',
    },
    {
      name: 'transition-mp-custom-class',
      title: '自定义各阶段 class 与根节点样式',
      blurb:
        '六个阶段 class 与事件序列；customClass 虚线框 + customStyle 内联圆角；只给 customClass 的对照。',
    },
    {
      name: 'transition-mp-lazy',
      title: '懒渲染与阻止触摸滚动',
      blurb: 'lazy-render 开 / 关对比与插槽渲染状态；disable-touch-move 配合背景滚动区验证拦截。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'show', type: 'boolean', default: 'false', desc: 'Whether the content is shown.' },
      {
        name: 'duration',
        type: 'TransitionDuration',
        default: 'DEFAULT_DURATION',
        desc: 'Animation duration in ms; `false` disables it, a record sets per-leg.',
      },
      {
        name: 'lazyRender',
        type: 'boolean',
        default: 'false',
        desc: 'Defer the very first render until `show` turns true.',
      },
      {
        name: 'name',
        type: 'TransitionName | TransitionName[] | undefined',
        default: 'undefined',
        desc: 'One animation name, or several to combine.',
      },
      {
        name: 'destroy',
        type: 'boolean',
        default: 'true',
        desc: 'Hide with `display: none` once the leave animation finished.',
      },
      {
        name: 'enterClass',
        type: 'string',
        default: "''",
        desc: 'Class applied on the enter start frame.',
      },
      {
        name: 'enterActiveClass',
        type: 'string',
        default: "''",
        desc: 'Class applied while entering.',
      },
      {
        name: 'enterToClass',
        type: 'string',
        default: "''",
        desc: 'Class applied on the enter end frame.',
      },
      {
        name: 'leaveClass',
        type: 'string',
        default: "''",
        desc: 'Class applied on the leave start frame.',
      },
      {
        name: 'leaveActiveClass',
        type: 'string',
        default: "''",
        desc: 'Class applied while leaving.',
      },
      {
        name: 'leaveToClass',
        type: 'string',
        default: "''",
        desc: 'Class applied on the leave end frame.',
      },
      {
        name: 'disableTouchMove',
        type: 'boolean',
        default: 'false',
        desc: 'Intercept touchmove so the page behind cannot scroll.',
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
    copy: 'Transition 动画 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Transition } from '@snui/uni';",
    chipCopy: "import { Transition } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-transition', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-fab', link: '/components/uni/fab' },
    next: { text: 'sn-resize', link: '/components/uni/resize' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
