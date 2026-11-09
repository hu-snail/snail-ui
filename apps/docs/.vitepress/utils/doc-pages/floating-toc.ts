/**
 * FloatingToc 悬浮目录 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const floatingTocDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'FloatingToc 悬浮目录' },
  ],
  title: 'FloatingToc 悬浮目录',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnFloatingToc' },
    {
      t: 'text',
      s: ' 是贴在页面边缘的悬浮目录：收起时是一列短横线的浮标，跟随滚动位置高亮当前章节；悬停、聚焦或点击后展开成可点击的章节列表。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/floating-toc',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'FloatingToc 悬浮目录.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { FloatingToc } from '@snui/vue-web';
</script>

<template>
  <FloatingToc />
</template>`,
  },
  demos: [
    { name: 'floating-toc-web-basic', title: '基础用法', blurb: '基础用法' },
    {
      name: 'floating-toc-web-placements',
      title: '左右两侧与触发方式',
      blurb: '左右两侧与触发方式',
    },
    { name: 'floating-toc-web-hierarchical', title: '分层目录', blurb: '分层目录' },
    { name: 'floating-toc-web-preview', title: '单条预览模式', blurb: '单条预览模式' },
    { name: 'floating-toc-web-controlled', title: '受控展开', blurb: '受控展开' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'placement',
        type: "'left' | 'right'",
        default: "'right'",
        desc: 'Side of the page the TOC sits on.',
      },
      {
        name: 'triggerMode',
        type: "'hover' | 'press'",
        default: "'hover'",
        desc: '`hover` opens on pointer / focus entry; `press` toggles on click.',
      },
      {
        name: 'hoverAction',
        type: "'open' | 'preview'",
        default: "'open'",
        desc: 'What resting the pointer on the rail does. `open` (default, HeroUI parity) expands the full panel after `openDelay`. `preview` instead shows a title + summary card for the single bar under the pointer and leaves the panel to click / keyboard — the two are mutually exclusive so they never stack on screen.',
      },
      {
        name: 'open',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Controlled open state. Omit it to keep the TOC uncontrolled.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        default: 'false',
        desc: 'Initial open state when uncontrolled.',
      },
      {
        name: 'openDelay',
        type: 'number',
        default: '200',
        desc: 'Delay before opening on hover / focus, in ms.',
      },
      {
        name: 'closeDelay',
        type: 'number',
        default: '300',
        desc: 'Delay before closing on exit, in ms.',
      },
      {
        name: 'scrollContainer',
        type: 'string | HTMLElement | undefined',
        default: 'undefined',
        desc: 'Scroll container (selector or element). Auto-detected when omitted.',
      },
      {
        name: 'bound',
        type: 'number',
        default: '0',
        desc: 'Distance in px between the container top and the active line.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'FloatingToc 悬浮目录 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { FloatingToc } from '@snui/vue-web';",
    chipCopy: "import { FloatingToc } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'FloatingToc', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'back-top', link: '/components/web/back-top' },
    next: { text: 'float-button', link: '/components/web/float-button' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
