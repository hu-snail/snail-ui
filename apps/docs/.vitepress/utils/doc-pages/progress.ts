/**
 * Progress 进度条 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const progressDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Progress 进度条' },
  ],
  title: 'Progress 进度条',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '展示操作或任务的当前进度，支持线形、环形与多环三种形态。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/progress',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Progress 进度条.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Progress } from '@snui/vue-web';
</script>

<template>
  <Progress />
</template>`,
  },
  demos: [
    { name: 'progress-web-basic', title: '线形与状态色', blurb: '线形与状态色' },
    { name: 'progress-web-indicator', title: '指示器位置对照', blurb: '指示器位置对照' },
    { name: 'progress-web-processing', title: '处理中', blurb: 'processing：线形条纹滚动 / 环形呼吸。' },
    { name: 'progress-web-icon', title: '自定义环形图标', blurb: '#icon 插槽 + SnIcon 定制环形中心。' },
    { name: 'progress-web-dynamic', title: '动态改变进度', blurb: '动态改变进度' },
    { name: 'progress-web-circle', title: '环形进度', blurb: '环形进度' },
    { name: 'progress-web-multiple', title: '多环对照', blurb: '多环对照' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: 'SnProgressType',
        default: "'line'",
        desc: "Progress bar type. Mirrors n-progress `type`. Default 'line'.",
      },
      {
        name: 'percentage',
        type: 'number | number[]',
        default: '0',
        desc: "Progress value(s) in percent, clamped to 0–100. Pass an array for type='multiple-circle'. Mirrors n-progress `percentage`. Default 0.",
      },
      { name: 'height', type: 'number | string | undefined', default: 'undefined', desc: '高度。' },
      {
        name: 'borderRadius',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '圆角。',
      },
      {
        name: 'fillBorderRadius',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '填充条圆角。',
      },
      { name: 'strokeWidth', type: 'number', default: '6', desc: '环形描边宽度（px）' },
      {
        name: 'indicatorPlacement',
        type: 'SnProgressIndicatorPlacement',
        default: "'outside'",
        desc: "Indicator placement for type='line': 'outside' (right of the rail, default), 'inside' (inside the fill), 'top' (above the rail). Mirrors n-progress `indicatorPlacement`.",
      },
      { name: 'color', type: 'ProgressColor | undefined', default: 'undefined', desc: '颜色。' },
      {
        name: 'railColor',
        type: 'string | SnProgressGradientStop[] | undefined',
        default: 'undefined',
        desc: '轨道颜色。',
      },
      { name: 'showIndicator', type: 'boolean', default: 'true', desc: '是否显示指示器与多环图例' },
      {
        name: 'status',
        type: 'SnProgressStatus',
        default: "'default'",
        desc: "Status — drives the default fill color. Mirrors n-progress `status`. Default 'default'.",
      },
      {
        name: 'processing',
        type: 'boolean',
        default: 'false',
        desc: '处理中：线形显示条纹动画，环形填充弧呼吸',
      },
      {
        name: 'offsetDegree',
        type: 'number',
        default: '0',
        desc: "Circle start-angle offset in degrees (0 = 12 o'clock). Mirrors n-progress `offsetDegree`. Default 0.",
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnProgress.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'default',
        props: '{ percentage: number }',
        desc: '自定义指示内容，作用域为 `{ percentage }`。',
      },
      { name: 'icon', props: '—', desc: '圆形成功 / 错误状态的自定义图标。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Progress 进度条 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Progress } from '@snui/vue-web';",
    chipCopy: "import { Progress } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Progress', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'loading-bar', link: '/components/web/loading-bar' },
    next: { text: 'calendar', link: '/components/web/calendar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
