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
        desc: '数据源。',
      },
      {
        name: 'loadingData',
        type: 'SnHeatmapDataItem[] | undefined',
        default: 'undefined',
        desc: '加载态展示的占位数据。对应 n-heatmap 的 `loadingData`。',
      },
      {
        name: 'activeColors',
        type: 'string[] | undefined',
        default: 'undefined',
        desc: '自定义层级色阶（由浅到深），覆盖内置主题。对应 n-heatmap 的 `activeColors`。',
      },
      {
        name: 'minimumColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: '自定义最低层级颜色。对应 n-heatmap 的 `minimumColor`。',
      },
      {
        name: 'colorTheme',
        type: 'SnHeatmapColorTheme | undefined',
        default: 'undefined',
        desc: '内置配色主题。对应 n-heatmap 的 `colorTheme`。',
      },
      {
        name: 'fillCalendarLeading',
        type: 'boolean',
        default: 'false',
        desc: '用 0 填充每月首行的空白格，而非留空。对应 n-heatmap 的 `fillCalendarLeading`。',
      },
      {
        name: 'firstDayOfWeek',
        type: 'SnHeatmapFirstDayOfWeek',
        default: '0',
        desc: '每周起始日：0 为周一 …… 6 为周日。对应 n-heatmap 的 `firstDayOfWeek`。',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: '加载态；无 loading-data 时展示 7 × 53 骨架',
      },
      {
        name: 'showColorIndicator',
        type: 'boolean',
        default: 'true',
        desc: '显示底部色阶指示条。对应 n-heatmap 的 `showColorIndicator`。',
      },
      {
        name: 'showWeekLabels',
        type: 'boolean',
        default: 'true',
        desc: '显示左侧周标签。对应 n-heatmap 的 `showWeekLabels`。',
      },
      {
        name: 'showMonthLabels',
        type: 'boolean',
        default: 'true',
        desc: '显示顶部月份标签。对应 n-heatmap 的 `showMonthLabels`。',
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
        desc: '是否显示浮层提示。',
      },
      {
        name: 'xGap',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '网格垂直（行方向）间距（数字为 px 或 CSS 长度；对应 border-spacing 的第二个值）。对应 n-heatmap 的 `xGap`。',
      },
      {
        name: 'yGap',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '网格水平（列方向）间距（数字为 px 或 CSS 长度；对应 border-spacing 的第一个值）。对应 n-heatmap 的 `yGap`。',
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
