/**
 * Popconfirm 气泡确认框 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const popconfirmDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'Popconfirm 气泡确认框' },
  ],
  title: 'Popconfirm 气泡确认框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnPopconfirm' },
    {
      t: 'text',
      s: ' 是轻量的二次确认弹层：点击触发元素后弹出带警示图标、说明文字与「取消 / 确定」按钮的小卡片，用于替换打断感更强的模态对话框。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/popconfirm',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Popconfirm 气泡确认框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popconfirm } from '@snui/vue-web';
</script>

<template>
  <Popconfirm />
</template>`,
  },
  demos: [
    { name: 'popconfirm-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'popconfirm-web-async', title: '异步确认', blurb: '异步确认' },
    { name: 'popconfirm-web-icon', title: '图标自定义', blurb: '图标自定义' },
    { name: 'popconfirm-web-action', title: '自定义操作区', blurb: '自定义操作区' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Whether to show the popconfirm. When `undefined`, falls back to uncontrolled mode. Mirrors n-popconfirm `show`.',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: 'Initial show value for uncontrolled mode. Mirrors n-popconfirm `defaultShow`. Default false.',
      },
      {
        name: 'trigger',
        type: "'hover' | 'click' | 'focus' | 'manual'",
        default: "'click'",
        desc: "What user gesture opens the bubble. Mirrors n-popconfirm `trigger`. Default 'click'.",
      },
      {
        name: 'placement',
        type: 'SnPopconfirmPlacement',
        default: "'top'",
        desc: "Where to render the bubble relative to the trigger. Mirrors n-popconfirm `placement`. Default 'top'.",
      },
      {
        name: 'delay',
        type: 'number | [number, number]',
        default: '100',
        desc: 'Open debounce in ms. Mirrors n-popover `delay`. Default 100.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '100',
        desc: 'Close debounce in ms. Mirrors n-popover `duration`. Default 100.',
      },
      {
        name: 'showArrow',
        type: 'boolean',
        default: 'false',
        desc: 'Show the directional arrow. Default false.',
      },
      {
        name: 'arrowPointToCenter',
        type: 'boolean',
        default: 'false',
        desc: "Point the arrow at the trigger's centre. Default false.",
      },
      {
        name: 'arrowClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Class on the arrow element.',
      },
      {
        name: 'arrowStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: 'Style on the arrow element.',
      },
      {
        name: 'content',
        type: 'string',
        default: "''",
        desc: 'The confirmation message. Rendered between the icon and the action row.',
      },
      {
        name: 'icon',
        type: 'IconComponent | undefined',
        default: 'undefined',
        desc: 'Leading icon component. Default: lucide `AlertTriangle` in the feedback-warning colour. Mirrors n-popconfirm `icon`.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: 'Show the leading icon at all. Mirrors n-popconfirm `showIcon`. Default true.',
      },
      {
        name: 'negativeText',
        type: 'string',
        default: '—',
        desc: 'Cancel button label. Mirrors n-popconfirm `negativeText`. Default: locale Popconfirm.negativeText.',
      },
      {
        name: 'positiveText',
        type: 'string',
        default: '—',
        desc: 'Confirm button label. Mirrors n-popconfirm `positiveText`. Default: locale Popconfirm.positiveText.',
      },
      {
        name: 'negativeButtonProps',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Extra props forwarded to the cancel SnButton.',
      },
      {
        name: 'positiveButtonProps',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Extra props forwarded to the confirm SnButton.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable showing entirely. Mirrors n-popconfirm `disabled`.',
      },
      {
        name: 'displayDirective',
        type: "'if' | 'show' | undefined",
        default: "'if'",
        desc: "`'if'` unmounts the bubble on hide; `'show'` keeps the node and toggles `display`. Default 'if'.",
      },
      {
        name: 'flip',
        type: 'boolean',
        default: 'true',
        desc: 'Flip to the opposite side when space runs out. Default true.',
      },
      {
        name: 'keepAliveOnHover',
        type: 'boolean',
        default: 'true',
        desc: 'Keep the bubble open while the pointer is inside it (hover).',
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'true',
        desc: 'Animate the bubble in/out. Default true.',
      },
      {
        name: 'width',
        type: "number | 'trigger' | undefined",
        default: 'undefined',
        desc: "Pin the bubble width to the trigger's width, or set a fixed px width. Mirrors n-popover `width`.",
      },
      {
        name: 'to',
        type: 'string | HTMLElement | false | undefined',
        default: "'body'",
        desc: "Teleport target. `false` renders inline. Default 'body'.",
      },
      {
        name: 'zIndex',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit stacking order.',
      },
      {
        name: 'contentClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Class on the inner body.',
      },
      {
        name: 'contentStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: 'Style on the inner body.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Popconfirm 气泡确认框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Popconfirm } from '@snui/vue-web';",
    chipCopy: "import { Popconfirm } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Popconfirm', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'popover', link: '/components/web/popover' },
    next: { text: 'popselect', link: '/components/web/popselect' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
