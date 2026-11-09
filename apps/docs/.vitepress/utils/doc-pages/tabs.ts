/**
 * Tabs 标签页 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const tabsDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Tabs 标签页' },
  ],
  title: 'Tabs 标签页',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnTabs' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'SnTabPane' },
    { t: 'text', s: ' 把内容分区，一次只展示一个面板，通过标签条切换。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tabs',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Tabs 标签页.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tabs } from '@snui/vue-web';
</script>

<template>
  <Tabs />
</template>`,
  },
  demos: [{ name: 'tabs-web-basic', title: '代码演示', blurb: 'bar 与 line 两种基础样式' }],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'string | number',
        default: '—',
        desc: 'Currently active pane name (controlled, `v-model:value`).',
      },
      {
        name: 'defaultValue',
        type: 'string | number',
        default: '—',
        desc: 'Initial active pane name (uncontrolled).',
      },
      {
        name: 'trigger',
        type: "'click' | 'hover'",
        default: "'click'",
        desc: 'Whether tabs activate on click or hover. Mirrors n-tabs `trigger`.',
      },
      {
        name: 'type',
        type: "'line' | 'card' | 'bar' | 'segment' | 'chrome'",
        default: "'bar'",
        desc: "Tab visual style. Mirrors n-tabs `type` (default `'bar'`) and adds `'chrome'` — a browser-style tab strip. `'chrome'` is an additive divergence from the reference, which has no browser chrome; it is tuned for the horizontal placements (top / bottom).",
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: "Tab strip size. Mirrors n-tabs `size`. Default 'medium'.",
      },
      {
        name: 'placement',
        type: "'top' | 'right' | 'bottom' | 'left' | 'start' | 'end'",
        default: "'top'",
        desc: 'Where the tab strip sits relative to the panes. Mirrors n-tabs `placement`. Deprecated `start` / `end` aliases map to left/right.',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        desc: 'Show a close button on each tab. Mirrors n-tabs `closable`.',
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'false',
        desc: 'Animate the pane height on switch. Mirrors n-tabs `animated`.',
      },
      {
        name: 'justifyContent',
        type: "'space-between' | 'space-around' | 'space-evenly' | 'center' | 'start' | 'end'",
        default: '—',
        desc: 'Distribute tab strip items along the main axis. Mirrors n-tabs `justifyContent`.',
      },
      {
        name: 'tabsPadding',
        type: 'number',
        default: '0',
        desc: 'Extra padding (px) around the tab strip. Mirrors n-tabs `tabsPadding`. Default 0.',
      },
      {
        name: 'showScrollButton',
        type: 'boolean',
        default: 'false',
        desc: 'Show the scroll buttons when the strip overflows. Mirrors n-tabs `showScrollButton`.',
      },
      {
        name: 'tabStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Per-tab inline style. Mirrors n-tabs `tabStyle`.',
      },
      {
        name: 'tabClass',
        type: 'string',
        default: '—',
        desc: 'Per-tab class. Mirrors n-tabs `tabClass`.',
      },
      {
        name: 'addTabStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Add-tab inline style. Mirrors n-tabs `addTabStyle`.',
      },
      {
        name: 'addTabClass',
        type: 'string',
        default: '—',
        desc: 'Add-tab class. Mirrors n-tabs `addTabClass`.',
      },
      {
        name: 'paneClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to every pane wrapper. Mirrors n-tabs `paneClass`.',
      },
      {
        name: 'paneStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to every pane wrapper. Mirrors n-tabs `paneStyle`.',
      },
      {
        name: 'barWidth',
        type: 'number',
        default: '—',
        desc: "Fixed width for the active bar, in px. When omitted the bar matches the active tab's own width. Mirrors n-tabs `barWidth`.",
      },
      {
        name: 'centerActiveTab',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the active tab scrolled to the centre of the strip. Mirrors n-tabs `centerActiveTab`. Only meaningful when the strip overflows.',
      },
      {
        name: 'paneWrapperClass',
        type: 'string',
        default: '—',
        desc: 'Class on the pane wrapper element. Mirrors n-tabs `paneWrapperClass`.',
      },
      {
        name: 'paneWrapperStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Style on the pane wrapper element. Mirrors n-tabs `paneWrapperStyle`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tabs 标签页 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tabs } from '@snui/vue-web';",
    chipCopy: "import { Tabs } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Tabs', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'breadcrumb', link: '/components/web/breadcrumb' },
    next: { text: 'steps', link: '/components/web/steps' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
