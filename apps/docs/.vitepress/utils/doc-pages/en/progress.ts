/** Progress · Web (Web) — English page data. Props from progress SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const progressDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Progress · Web' },
  ],
  title: 'Progress · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Displays the current progress of an operation or task as a line, a ring, or' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/progress',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Progress · Web.vue',
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
    {
      name: 'progress-web-basic',
      title: 'Line and status colors',
      blurb: 'Line and status colors',
    },
    { name: 'progress-web-indicator', title: 'Indicator placement', blurb: 'Indicator placement' },
    {
      name: 'progress-web-processing',
      title: 'Processing',
      blurb: 'processing: animated stripes on the line, breathing arc on the circle.',
    },
    {
      name: 'progress-web-icon',
      title: 'Custom circle icon',
      blurb: 'The #icon slot + SnIcon restyles the circle center.',
    },
    {
      name: 'progress-web-dynamic',
      title: 'Driving the value at runtime',
      blurb: 'Driving the value at runtime',
    },
    { name: 'progress-web-circle', title: 'Circle', blurb: 'Circle' },
    { name: 'progress-web-multiple', title: 'Multiple circles', blurb: 'Multiple circles' },
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
      {
        name: 'height',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Line rail height (px number or CSS length). Mirrors n-progress `height`.',
      },
      {
        name: 'borderRadius',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Line rail corner radius. Mirrors n-progress `borderRadius`.',
      },
      {
        name: 'fillBorderRadius',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Line fill corner radius; falls back to `borderRadius`. Mirrors n-progress `fillBorderRadius`.',
      },
      {
        name: 'strokeWidth',
        type: 'number',
        default: '6',
        desc: 'Circle ring stroke width in px. Mirrors n-progress `strokeWidth`. Default 6.',
      },
      {
        name: 'indicatorPlacement',
        type: 'SnProgressIndicatorPlacement',
        default: "'outside'",
        desc: "Indicator placement for type='line': 'outside' (right of the rail, default), 'inside' (inside the fill), 'top' (above the rail). Mirrors n-progress `indicatorPlacement`.",
      },
      {
        name: 'color',
        type: 'ProgressColor | undefined',
        default: 'undefined',
        desc: 'Fill color: solid, gradient stops, or `(percentage) => string`. Mirrors n-progress `color`.',
      },
      {
        name: 'railColor',
        type: 'string | SnProgressGradientStop[] | undefined',
        default: 'undefined',
        desc: 'Rail color: solid or gradient stops. Mirrors n-progress `railColor`.',
      },
      {
        name: 'showIndicator',
        type: 'boolean',
        default: 'true',
        desc: 'Whether to render the indicator text. Mirrors n-progress `showIndicator`. Default true.',
      },
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
        desc: 'Animated striped fill (line) / pulsing arc (circle). Mirrors n-progress `processing`. Default false.',
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
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnProgress.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '{ percentage: number }',
        desc: 'Custom indicator content; scope is `{ percentage }`.',
      },
      { name: 'icon', props: '—', desc: 'Custom glyph for the circle success / error state.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Progress · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Progress } from '@snui/vue-web';",
    chipCopy: "import { Progress } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Progress', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'loading-bar', link: '/en/components/web/loading-bar' },
    next: { text: 'calendar', link: '/en/components/web/calendar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
