/**
 * 热力图 Heatmap 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const heatmapDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '热力图 Heatmap' },
  ],
  title: '热力图 Heatmap',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '以周为列、周几为行，用颜色深浅展示一段时间内的活跃度的贡献图组件。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/heatmap',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '热力图 Heatmap.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Heatmap } from '@snui/vue-web';
</script>

<template>
  <Heatmap />
</template>`,
  },
  demos: [
    { name: 'heatmap-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'heatmap-web-colors', title: '自定义颜色', blurb: '自定义颜色' },
    { name: 'heatmap-web-slots', title: '插槽用法', blurb: '插槽用法' },
    { name: 'heatmap-web-tooltip', title: '悬浮提示', blurb: '悬浮提示' },
    { name: 'heatmap-web-tooltip-slot', title: '悬浮提示', blurb: '悬浮提示' },
    { name: 'heatmap-web-themes', title: '内置色系', blurb: '内置色系' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'data',
        type: 'SnHeatmapDataItem[] | undefined',
        default: 'undefined',
        desc: 'Data source: `{ timestamp, value }` list (null / absent value renders an empty cell). Mirrors n-heatmap `data`.',
      },
      {
        name: 'loadingData',
        type: 'SnHeatmapDataItem[] | undefined',
        default: 'undefined',
        desc: 'Data shown while loading. Mirrors n-heatmap `loadingData`.',
      },
      {
        name: 'activeColors',
        type: 'string[] | undefined',
        default: 'undefined',
        desc: 'Custom level colors, light → dark; overrides the built-in theme. Mirrors n-heatmap `activeColors`.',
      },
      {
        name: 'minimumColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Custom minimum-level color. Mirrors n-heatmap `minimumColor`.',
      },
      {
        name: 'colorTheme',
        type: 'SnHeatmapColorTheme | undefined',
        default: 'undefined',
        desc: 'Built-in color theme. Mirrors n-heatmap `colorTheme`.',
      },
      {
        name: 'fillCalendarLeading',
        type: 'boolean',
        default: 'false',
        desc: 'Fill the leading empty week cells with 0 instead of blanks. Mirrors n-heatmap `fillCalendarLeading`.',
      },
      {
        name: 'firstDayOfWeek',
        type: 'SnHeatmapFirstDayOfWeek',
        default: '0',
        desc: 'Week start: 0 = Monday … 6 = Sunday. Mirrors n-heatmap `firstDayOfWeek`.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Loading state; without `loadingData` renders a 7 × 53 skeleton. Mirrors n-heatmap `loading`.',
      },
      {
        name: 'showColorIndicator',
        type: 'boolean',
        default: 'true',
        desc: 'Show the bottom color indicator. Mirrors n-heatmap `showColorIndicator`.',
      },
      {
        name: 'showWeekLabels',
        type: 'boolean',
        default: 'true',
        desc: 'Show the left week labels. Mirrors n-heatmap `showWeekLabels`.',
      },
      {
        name: 'showMonthLabels',
        type: 'boolean',
        default: 'true',
        desc: 'Show the top month labels. Mirrors n-heatmap `showMonthLabels`.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Scale preset (rects 10 / 11 / 12 px). Mirrors n-heatmap `size`.',
      },
      {
        name: 'tooltip',
        type: 'boolean | SnHeatmapTooltipConfig | undefined',
        default: 'false',
        desc: 'Per-cell hover tooltip: `false` renders the bare rect (no tooltip instances), `true` uses the SnTooltip defaults, an object forwards a `TooltipProps` subset. Mirrors n-heatmap `tooltip` (1:1).',
      },
      {
        name: 'xGap',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Vertical (row) side of the grid spacing (px number or CSS length; second border-spacing value, like the reference cssr). Mirrors n-heatmap `xGap`.',
      },
      {
        name: 'yGap',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Horizontal (column) side of the grid spacing (px number or CSS length; first border-spacing value, like the reference cssr). Mirrors n-heatmap `yGap`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '热力图 Heatmap 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Heatmap } from '@snui/vue-web';",
    chipCopy: "import { Heatmap } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Heatmap', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'highlight', link: '/components/web/highlight' },
    next: { text: 'watermark', link: '/components/web/watermark' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
