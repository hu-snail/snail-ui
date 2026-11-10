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
  demos: [
    { name: 'tooltip-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'tooltip-web-trigger', title: '触发方式', blurb: '触发方式' },
    { name: 'tooltip-web-placement', title: '全部方位', blurb: '全部方位' },
    { name: 'tooltip-web-appearance', title: '外观控制', blurb: '外观控制' },
    { name: 'tooltip-web-content-slot', title: '富文本内容', blurb: '富文本内容' },
    { name: 'tooltip-web-event', title: '事件回调', blurb: '事件回调' },
    { name: 'tooltip-web-controlled', title: '受控显示', blurb: '受控显示' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: '是否显示。`undefined` 为不受控模式。',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: '不受控模式下的初始显示状态。',
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
      { name: 'delay', type: 'number | [number, number]', default: '100', desc: '`100`' },
      { name: 'arrow', type: 'boolean', default: 'true', desc: '是否显示箭头。' },
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
        desc: '是否用一层 `<span>` 包裹触发内容以承载指针事件。',
      },
      {
        name: 'raw',
        type: 'boolean',
        default: 'false',
        desc: "Skip the library's own bubble styling so the caller can paint the popover entirely. Mirrors n-popover `raw`. Default false.",
      },
      { name: 'animated', type: 'boolean', default: 'true', desc: '是否使用进出场动画。' },
      {
        name: 'arrowPointToCenter',
        type: 'boolean',
        default: 'false',
        desc: "Point the arrow at the trigger's centre rather than its edge. Mirrors n-popover `arrowPointToCenter`. Default false.",
      },
      { name: 'arrowClass', type: 'string', default: 'undefined as any', desc: '箭头元素的类名。' },
      {
        name: 'arrowStyle',
        type: 'CSSProperties',
        default: 'undefined as any',
        desc: '箭头元素的样式。',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: '内容区域的类名。',
      },
      {
        name: 'contentStyle',
        type: 'CSSProperties',
        default: 'undefined as any',
        desc: '内容区域的样式。',
      },
      {
        name: 'displayDirective',
        type: "'if' | 'show'",
        default: "'if'",
        desc: "`'if'` unmounts the popover on hide; `'show'` keeps the node and toggles `display`. Mirrors n-popover `displayDirective`. Default 'if'.",
      },
      { name: 'duration', type: 'number', default: '100', desc: '关闭延迟（ms）。' },
      { name: 'flip', type: 'boolean', default: 'true', desc: '空间不足时是否自动翻转到对侧。' },
      {
        name: 'keepAliveOnHover',
        type: 'boolean',
        default: 'true',
        desc: '`hover` 触发时，指针移入气泡是否保持显示。',
      },
      { name: 'overlap', type: 'boolean', default: 'false', desc: '是否覆盖触发器而非并排。' },
      { name: 'scrollable', type: 'boolean', default: 'false', desc: '内容超出高度时是否可滚动。' },
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
      { name: 'zIndex', type: 'number', default: 'undefined as any', desc: '层级。' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用弹出。' },
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
