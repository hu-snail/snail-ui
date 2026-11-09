/** Heatmap · Web (Web) — English page data. Props from heatmap SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const heatmapDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Heatmap · Web' },
  ],
  title: 'Heatmap · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'A GitHub-style contribution heatmap: columns = weeks, rows = weekdays,' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/heatmap',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Heatmap · Web.vue',
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
    { name: 'heatmap-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'heatmap-web-colors', title: 'Custom colors', blurb: 'Custom colors' },
    { name: 'heatmap-web-slots', title: 'Slots', blurb: 'Slots' },
    { name: 'heatmap-web-tooltip', title: 'Tooltip', blurb: 'Tooltip' },
    { name: 'heatmap-web-tooltip-slot', title: 'Tooltip', blurb: 'Tooltip' },
    { name: 'heatmap-web-themes', title: 'Color themes', blurb: 'Color themes' },
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Heatmap · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Heatmap } from '@snui/vue-web';",
    chipCopy: "import { Heatmap } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Heatmap', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'highlight', link: '/en/components/web/highlight' },
    next: { text: 'watermark', link: '/en/components/web/watermark' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
