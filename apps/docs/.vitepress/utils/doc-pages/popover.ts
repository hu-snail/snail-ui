/**
 * Popover 气泡卡片 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const popoverDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'Popover 气泡卡片' },
  ],
  title: 'Popover 气泡卡片',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnPopover' },
    {
      t: 'text',
      s: ' 是锚定在触发元素上的悬浮卡片：带标题区与内容区，悬停、点击或聚焦时在触发元素旁边弹出，空间不足时自动翻转。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/popover',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Popover 气泡卡片.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popover } from '@snui/vue-web';
</script>

<template>
  <Popover />
</template>`,
  },
  demos: [
    { name: 'popover-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'popover-web-trigger', title: '触发方式与受控模式', blurb: '触发方式与受控模式' },
    { name: 'popover-web-placement', title: '十二个方位', blurb: '十二个方位' },
    { name: 'popover-web-delay', title: '弹出时序', blurb: '弹出时序' },
    { name: 'popover-web-width', title: '宽度控制', blurb: '宽度控制' },
    { name: 'popover-web-scrollable', title: '长内容滚动', blurb: '长内容滚动' },
    { name: 'popover-web-slots', title: '自定义标题与正文', blurb: '自定义标题与正文' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Whether to show the popover. When `undefined`, falls back to uncontrolled mode using internal state. Mirrors n-popover `show`.',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: 'Initial show value for uncontrolled mode. Mirrors n-popover `defaultShow`. Default false.',
      },
      {
        name: 'trigger',
        type: "'hover' | 'click' | 'focus' | 'manual'",
        default: "'hover'",
        desc: "What user gesture opens the popover. Mirrors n-popover `trigger`. Default 'hover'. 'manual' disables any automatic show/hide — only `show` / `update:show` controls the state.",
      },
      {
        name: 'placement',
        type: 'SnPopoverPlacement',
        default: "'top'",
        desc: "Where to render the bubble relative to the trigger. Mirrors n-popover `placement`. Default 'top'.",
      },
      {
        name: 'delay',
        type: 'number | [number, number]',
        default: '100',
        desc: 'Open debounce in ms. Single number = same delay for open+close. Use an array `[open, close]` for asymmetric delays. Mirrors n-popover `delay`. Default 100.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '100',
        desc: 'How long the popover lingers before closing, in ms. Mirrors n-popover `duration`. Default 100.',
      },
      {
        name: 'showArrow',
        type: 'boolean',
        default: 'false',
        desc: 'Show the directional arrow. Mirrors n-popover `showArrow`. Default false (naive convention — tooltips have arrows, popovers opt in).',
      },
      {
        name: 'arrow',
        type: 'boolean',
        default: 'true',
        desc: 'Extra alias of `showArrow` kept for SnTooltip parity. The arrow renders only when both `showArrow` and `arrow` are true.',
      },
      {
        name: 'arrowPointToCenter',
        type: 'boolean',
        default: 'false',
        desc: "Point the arrow at the trigger's centre rather than its edge. Mirrors n-popover `arrowPointToCenter`. Default false.",
      },
      {
        name: 'arrowClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Class on the arrow element. Mirrors n-popover `arrowClass`.',
      },
      {
        name: 'arrowStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: 'Style on the arrow element. Mirrors n-popover `arrowStyle`.',
      },
      {
        name: 'header',
        type: 'string',
        default: "''",
        desc: 'Card title. Rendered in a bold section above the body. Mirrors n-popover `header`.',
      },
      {
        name: 'content',
        type: 'string',
        default: "''",
        desc: 'The bubble body. Plain string or any Vue-renderable value. Mirrors n-popover `content`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable showing entirely. Mirrors n-popover `disabled`. Default false.',
      },
      {
        name: 'raw',
        type: 'boolean',
        default: 'false',
        desc: "Skip the library's own card styling so the caller paints the bubble entirely. Mirrors n-popover `raw`. Default false.",
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'true',
        desc: 'Animate the bubble in/out. Mirrors n-popover `animated`. Default true.',
      },
      {
        name: 'overlap',
        type: 'boolean',
        default: 'false',
        desc: 'Let the bubble overlap the trigger instead of sitting beside it. Mirrors n-popover `overlap`. Default false.',
      },
      {
        name: 'scrollable',
        type: 'boolean',
        default: 'false',
        desc: 'Make the body scrollable once it exceeds `max-height`. Mirrors n-popover `scrollable`. Default false.',
      },
      {
        name: 'displayDirective',
        type: "'if' | 'show'",
        default: "'if'",
        desc: "`'if'` unmounts the bubble on hide; `'show'` keeps the node and toggles `display`. Mirrors n-popover `displayDirective`. Default 'if'.",
      },
      {
        name: 'flip',
        type: 'boolean',
        default: 'true',
        desc: 'Flip to the opposite side when the chosen placement would overflow the viewport. Mirrors n-popover `flip`. Default true.',
      },
      {
        name: 'keepAliveOnHover',
        type: 'boolean',
        default: 'true',
        desc: 'Keep the popover open while the pointer is inside it (hover trigger only). Mirrors n-popover `keepAliveOnHover`. Default true.',
      },
      {
        name: 'width',
        type: "number | 'trigger' | undefined",
        default: 'undefined',
        desc: "Pin the bubble width to the trigger's width. Mirrors n-popover `width` = `'trigger'`; a number sets a fixed width in px.",
      },
      {
        name: 'to',
        type: 'string | HTMLElement | false',
        default: "'body'",
        desc: "Where to teleport the bubble. `false` keeps it inline (useful inside transform-heavy ancestors). Mirrors n-popover `to`. Default 'body'.",
      },
      {
        name: 'zIndex',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit stacking order. Mirrors n-popover `zIndex`.',
      },
      {
        name: 'contentClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Class on the body section. Mirrors n-popover `contentClass`.',
      },
      {
        name: 'contentStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: 'Style on the body section. Mirrors n-popover `contentStyle`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Popover 气泡卡片 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Popover } from '@snui/vue-web';",
    chipCopy: "import { Popover } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Popover', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'dropdown', link: '/components/web/dropdown' },
    next: { text: 'popconfirm', link: '/components/web/popconfirm' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
