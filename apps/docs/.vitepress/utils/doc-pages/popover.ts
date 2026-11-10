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
        desc: '是否显示。`undefined` 为不受控模式，由内部状态维护。',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: '非受控模式下的初始显示状态。对应 n-popover 的 `defaultShow`，默认 false。',
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
      { name: 'delay', type: 'number | [number, number]', default: '100', desc: '`100`' },
      { name: 'duration', type: 'number', default: '100', desc: '关闭延迟（ms）。' },
      {
        name: 'showArrow',
        type: 'boolean',
        default: 'false',
        desc: '显示方向箭头。对应 n-popover 的 `showArrow`，默认 false（遵循 naive 约定：tooltip 自带箭头，popover 需显式开启）。',
      },
      {
        name: 'arrow',
        type: 'boolean',
        default: 'true',
        desc: '`show-arrow` 的布尔别名，两者都为真时才渲染箭头。',
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
        desc: '箭头元素的类名。对应 n-popover 的 `arrowClass`。',
      },
      {
        name: 'arrowStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: '箭头元素的样式。对应 n-popover 的 `arrowStyle`。',
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
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用弹出。' },
      {
        name: 'raw',
        type: 'boolean',
        default: 'false',
        desc: "Skip the library's own card styling so the caller paints the bubble entirely. Mirrors n-popover `raw`. Default false.",
      },
      { name: 'animated', type: 'boolean', default: 'true', desc: '是否使用进出场动画。' },
      {
        name: 'overlap',
        type: 'boolean',
        default: 'false',
        desc: '是否覆盖触发元素而非并排显示。',
      },
      {
        name: 'scrollable',
        type: 'boolean',
        default: 'false',
        desc: '正文超出高度上限时是否在内部滚动。',
      },
      {
        name: 'displayDirective',
        type: "'if' | 'show'",
        default: "'if'",
        desc: "`'if'` unmounts the bubble on hide; `'show'` keeps the node and toggles `display`. Mirrors n-popover `displayDirective`. Default 'if'.",
      },
      { name: 'flip', type: 'boolean', default: 'true', desc: '空间不足时是否自动翻转到对侧。' },
      {
        name: 'keepAliveOnHover',
        type: 'boolean',
        default: 'true',
        desc: '指针停留在浮层内时保持展开（仅 hover 触发）。对应 n-popover 的 `keepAliveOnHover`，默认 true。',
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
        desc: '显式层级。对应 n-popover 的 `zIndex`。',
      },
      {
        name: 'contentClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: '主体区块的类名。对应 n-popover 的 `contentClass`。',
      },
      {
        name: 'contentStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: '主体区块的样式。对应 n-popover 的 `contentStyle`。',
      },
      {
        name: 'onClickoutside',
        type: '((e: MouseEvent) => void)',
        default: '—',
        desc: '点击气泡与其触发元素之外时调用（对齐 n-popover）。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnPopover.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:show',
        payload: '(show: boolean)',
        desc: '显示状态变化时派发（`v-model:show`）。',
      },
      { name: 'show', payload: '—', desc: '气泡显示时触发（本地新增）。' },
      { name: 'hide', payload: '—', desc: '气泡隐藏时触发（本地新增）。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnPopover.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '触发元素（可见目标，如按钮）。' },
      { name: 'header', props: '—', desc: '卡片标题，覆盖 `header` 属性。' },
      { name: 'content', props: '—', desc: '气泡主体，覆盖 `content` 属性。' },
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
