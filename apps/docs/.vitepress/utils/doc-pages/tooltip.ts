/**
 * Tooltip 文字提示 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const tooltipDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Tooltip 文字提示' },
  ],
  title: 'Tooltip 文字提示',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnTooltip' },
    {
      t: 'text',
      s: ' 是轻量的悬浮提示：鼠标悬停、点击或聚焦时，在触发元素旁边弹出一小段说明文字。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tooltip',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Tooltip 文字提示.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tooltip } from '@snui/vue-web';
</script>

<template>
  <Tooltip />
</template>`,
  },
  demos: [{ name: 'tooltip-web-basic', title: '代码演示', blurb: '四方向 + 边缘对齐，按区块分组' }],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Whether to show the tooltip. When `undefined`, falls back to uncontrolled mode using internal state. Mirrors n-tooltip `show`.',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: 'Initial show value for uncontrolled mode. Mirrors n-tooltip `defaultShow`. Default false.',
      },
      {
        name: 'trigger',
        type: "'hover' | 'click' | 'focus' | 'manual'",
        default: "'hover'",
        desc: "What user gesture opens the tooltip. Mirrors n-tooltip `trigger`. Default 'hover'. 'manual' disables any automatic show/hide — only `show` / `update:show` controls the state.",
      },
      {
        name: 'placement',
        type: 'SnTooltipPlacement',
        default: "'top'",
        desc: "Where to render the tooltip relative to the trigger — 12 Arco-style directions: `top` / `tl` / `tr` / `bottom` / `bl` / `br` / `left` / `lt` / `lb` / `right` / `rt` / `rb` (letter 2 = the bubble edge that aligns with the trigger: `tl` = Left edges flush, `lb` = Bottom edges flush). Legacy naive-ui values (`top-start` / …) are accepted as deprecated aliases. Default 'top'.",
      },
      {
        name: 'delay',
        type: 'number | [number, number]',
        default: '100',
        desc: 'Open/close debounce in ms. Single number = same delay for open+close. Use an array `[open, close]` for asymmetric delays (e.g. snappier open, slower close). Mirrors n-tooltip `delay`. Default 100.',
      },
      {
        name: 'arrow',
        type: 'boolean',
        default: 'true',
        desc: 'Show the directional arrow. Mirrors n-tooltip `arrow`. Default true.',
      },
      {
        name: 'content',
        type: 'string | undefined',
        default: "''",
        desc: 'The tooltip body. Can be a plain string or any Vue-renderable value. Mirrors n-tooltip `content`.',
      },
      {
        name: 'wrapped',
        type: 'boolean',
        default: 'true',
        desc: 'Render the trigger inside a wrapper `<span>` that owns the pointer listeners. Set to `false` when the slot already renders a focusable element and the extra wrapper would break layout. Mirrors n-popover `raw` (inverted: this library defaults to wrapping). Default true.',
      },
      {
        name: 'raw',
        type: 'boolean',
        default: 'false',
        desc: "Skip the library's own bubble styling so the caller can paint the popover entirely. Mirrors n-popover `raw`. Default false.",
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'true',
        desc: 'Animate the popover in/out. Mirrors n-popover `animated`. Default true.',
      },
      {
        name: 'arrowPointToCenter',
        type: 'boolean',
        default: 'false',
        desc: "Point the arrow at the trigger's centre rather than its edge. Mirrors n-popover `arrowPointToCenter`. Default false.",
      },
      {
        name: 'arrowClass',
        type: 'string',
        default: 'undefined as any',
        desc: 'Class on the arrow element. Mirrors n-popover `arrowClass`.',
      },
      {
        name: 'arrowStyle',
        type: 'CSSProperties',
        default: 'undefined as any',
        desc: 'Style on the arrow element. Mirrors n-popover `arrowStyle`.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: 'Class on the scrollable body. Mirrors n-popover `contentClass`.',
      },
      {
        name: 'contentStyle',
        type: 'CSSProperties',
        default: 'undefined as any',
        desc: 'Style on the scrollable body. Mirrors n-popover `contentStyle`.',
      },
      {
        name: 'displayDirective',
        type: "'if' | 'show'",
        default: "'if'",
        desc: "`'if'` unmounts the popover on hide; `'show'` keeps the node and toggles `display`. Mirrors n-popover `displayDirective`. Default 'if'.",
      },
      {
        name: 'duration',
        type: 'number',
        default: '100',
        desc: 'How long the popover lingers before closing, in ms. Distinct from `delay`, which gates opening. Mirrors n-popover `duration`. Default 100.',
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
        name: 'overlap',
        type: 'boolean',
        default: 'false',
        desc: 'Let the popover overlap the trigger instead of sitting beside it. Mirrors n-popover `overlap`. Default false.',
      },
      {
        name: 'scrollable',
        type: 'boolean',
        default: 'false',
        desc: 'Make the popover body scrollable once it exceeds `max-height`. Mirrors n-popover `scrollable`. Default false.',
      },
      {
        name: 'to',
        type: 'string | HTMLElement | false',
        default: "'body'",
        desc: "Where to teleport the popover. `false` keeps it inline (useful inside transform-heavy ancestors). Mirrors n-popover `to`. Default 'body'.",
      },
      {
        name: 'width',
        type: "number | 'trigger'",
        default: 'undefined as any',
        desc: "Pin the popover width to the trigger's width. Mirrors n-popover `width` = `'trigger'`; a number sets a fixed width in px.",
      },
      {
        name: 'zIndex',
        type: 'number',
        default: 'undefined as any',
        desc: 'Explicit stacking order. Mirrors n-popover `zIndex`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable showing entirely. Mirrors n-tooltip `disabled`. Default false.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tooltip 文字提示 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tooltip } from '@snui/vue-web';",
    chipCopy: "import { Tooltip } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Tooltip', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'steps', link: '/components/web/steps' },
    next: { text: 'affix', link: '/components/web/affix' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
