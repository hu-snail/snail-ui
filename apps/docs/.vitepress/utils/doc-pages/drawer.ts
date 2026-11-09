/**
 * Drawer 抽屉 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const drawerDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Drawer 抽屉' }],
  title: 'Drawer 抽屉',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnDrawer' },
    {
      t: 'text',
      s: ' 是从屏幕四边滑入的浮层外壳：遮罩 + 面板 + 方向定位 + 滚动锁 + 焦点管理。面板内部的标题 / 正文 / 底部由配套的 ',
    },
    { t: 'code', s: 'SnDrawerContent' },
    { t: 'text', s: ' 渲染。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/drawer',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Drawer 抽屉.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Drawer } from '@snui/vue-web';
</script>

<template>
  <Drawer />
</template>`,
  },
  demos: [{ name: 'drawer-web-basic', title: '代码演示', blurb: '右侧滑入的基础抽屉' }],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean',
        default: 'false',
        desc: 'Visibility. Mirrors n-drawer `show`.',
      },
      {
        name: 'width',
        type: 'number | string',
        default: 'undefined as any',
        desc: 'Panel width. Applies to `left`/`right`. Number is px.',
      },
      {
        name: 'height',
        type: 'number | string',
        default: 'undefined as any',
        desc: 'Panel height. Applies to `top`/`bottom`. Number is px.',
      },
      {
        name: 'placement',
        type: 'SnDrawerPlacement',
        default: "'right'",
        desc: 'Which edge the panel slides in from.',
      },
      {
        name: 'maskClosable',
        type: 'boolean',
        default: 'true',
        desc: 'Close the drawer when the mask is clicked.',
      },
      {
        name: 'showMask',
        type: "boolean | 'transparent'",
        default: 'true',
        desc: "Render the mask; `'transparent'` keeps it clickable but invisible.",
      },
      {
        name: 'to',
        type: 'string | HTMLElement',
        default: 'undefined as any',
        desc: 'Teleport target. Mirrors n-drawer `to`.',
      },
      {
        name: 'displayDirective',
        type: 'SnDrawerDisplayDirective',
        default: "'if'",
        desc: "`'if'` unmounts after leaving; `'show'` keeps the node.",
      },
      {
        name: 'nativeScrollbar',
        type: 'boolean',
        default: 'true',
        desc: 'Accepted for API parity. Upstream swaps to a virtual scrollbar when `false`; this version renders the native container either way but still applies the `--native-scrollbar` class hook. See §112 markers.',
      },
      {
        name: 'defaultWidth',
        type: 'number | string',
        default: '251',
        desc: 'Fallback size used before any drag resize happens, and as the initial value when neither `width` nor `height` is set. Number is px. Mirrors n-drawer `defaultWidth` / `defaultHeight` (both 251 upstream).',
      },
      {
        name: 'defaultHeight',
        type: 'number | string',
        default: '251',
        desc: 'Vertical counterpart of `defaultWidth`. See above.',
      },
      {
        name: 'resizable',
        type: 'boolean',
        default: 'false',
        desc: 'Let the user drag the inner edge to resize the panel. Upstream emits `update:width` / `update:height` on drag, which the host binds back so it owns the resulting size. Mirrors n-drawer `resizable`. Default false.',
      },
      {
        name: 'maxWidth',
        type: 'number',
        default: 'undefined as any',
        desc: 'Upper drag bound, in px. Only meaningful with `resizable`.',
      },
      {
        name: 'maxHeight',
        type: 'number',
        default: 'undefined as any',
        desc: 'Upper drag bound, in px. Only meaningful with `resizable`.',
      },
      {
        name: 'minWidth',
        type: 'number',
        default: 'undefined as any',
        desc: 'Lower drag bound, in px. Only meaningful with `resizable`.',
      },
      {
        name: 'minHeight',
        type: 'number',
        default: 'undefined as any',
        desc: 'Lower drag bound, in px. Only meaningful with `resizable`.',
      },
      {
        name: 'autoFocus',
        type: 'boolean',
        default: 'true',
        desc: 'Focus the first focusable element inside the panel once it opens. Mirrors n-drawer `autoFocus`. Default true.',
      },
      {
        name: 'trapFocus',
        type: 'boolean',
        default: 'true',
        desc: 'Cycle Tab / Shift+Tab inside the panel so focus cannot escape to the page behind the mask. Mirrors n-drawer `trapFocus`. Default true; upstream force-disables it when `showMask` is `false`.',
      },
      {
        name: 'scrollbarProps',
        type: 'SnDrawerScrollbarProps',
        default: 'undefined as any',
        desc: 'Passed through to the scroll container. Upstream models a full virtual scrollbar (`ScrollbarProps`); this version applies the scroll-related subset (`trigger` / `xScrollable` / `onScroll`) and ignores the rest.',
      },
      {
        name: 'zIndex',
        type: 'number',
        default: 'undefined as any',
        desc: 'Stacking order of the overlay.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: 'Extra class on the scroll container.',
      },
      {
        name: 'contentStyle',
        type: 'string | CSSProperties',
        default: 'undefined as any',
        desc: 'Extra style on the scroll container.',
      },
      {
        name: 'closeOnEsc',
        type: 'boolean',
        default: 'true',
        desc: 'Close the drawer when Escape is pressed.',
      },
      {
        name: 'blockScroll',
        type: 'boolean',
        default: 'true',
        desc: 'Lock `<html>` scroll while open.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Drawer 抽屉 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Drawer } from '@snui/vue-web';",
    chipCopy: "import { Drawer } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Drawer', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'dialog', link: '/components/web/dialog' },
    next: { text: 'loading', link: '/components/web/loading' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
