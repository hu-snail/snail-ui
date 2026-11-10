/** Slider · Web (Web) — English page data. Props from slider SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const sliderDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Slider · Web' }],
  title: 'Slider · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Custom-painted slider with range dual handles, marks, step ticks (showSteps), value inputs (showInput), vertical / reverse, tooltip, plus gradient / transparent track and custom tooltip colors. Single-handle mode paints the themed track from ',
    },
    { t: 'code', s: 'min' },
    { t: 'text', s: ' to the handl' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/slider',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Slider · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Slider } from '@snui/vue-web';
</script>

<template>
  <Slider />
</template>`,
  },
  demos: [
    { name: 'slider-web-basic', title: 'Basic', blurb: 'v-model + drag / track click.' },
    { name: 'slider-web-range', title: 'Range', blurb: 'Dual handles, non-crossing (clamp).' },
    {
      name: 'slider-web-step',
      title: 'Step & step ticks (showSteps)',
      blurb: 'step snapping + showSteps ticks (toggle Step / Show steps).',
    },
    { name: 'slider-web-marks', title: 'Marks', blurb: 'Clickable mark labels.' },
    {
      name: 'slider-web-vertical',
      title: 'Vertical / reverse',
      blurb: 'vertical + reverse + vertical mark labels.',
    },
    {
      name: 'slider-web-tooltip',
      title: 'Tooltip',
      blurb: 'Drag bubble + formatTooltip + tooltipBackground.',
    },
    {
      name: 'slider-web-show-input',
      title: 'Value inputs (showInput)',
      blurb:
        'showInput renders number input(s) beside the rail (two + separator in range; commits on blur / Enter).',
    },
    {
      name: 'slider-web-custom',
      title: 'Custom style (gradient / transparent diffuse / thickness)',
      blurb:
        'Rail gradient and transparent diffuse (railBackground / railShadow), trackBackground gradient, railWidth thickness and tooltip colors.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SliderValue',
        default: '—',
        desc: 'Bound value. `[number, number]` when `range`.',
      },
      {
        name: 'defaultValue',
        type: 'SliderValue',
        default: '—',
        desc: 'Uncontrolled initial value (naive-ui `default-value`).',
      },
      { name: 'min', type: 'number', default: '0', desc: 'Lower bound.' },
      { name: 'max', type: 'number', default: '100', desc: 'Upper bound.' },
      {
        name: 'step',
        type: 'number',
        default: '1',
        desc: 'Step increment. Snapping applies to pointer + keyboard.',
      },
      {
        name: 'range',
        type: 'boolean',
        default: 'false',
        desc: 'Dual-handle mode. Value is a `[start, end]` pair.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Value visible but not editable.',
      },
      { name: 'vertical', type: 'boolean', default: 'false', desc: 'Vertical orientation.' },
      {
        name: 'reverse',
        type: 'boolean',
        default: 'false',
        desc: 'Invert the axis (right-to-left / top-to-bottom).',
      },
      {
        name: 'tooltip',
        type: 'boolean',
        default: 'true',
        desc: 'Show the value tooltip on hover / drag.',
      },
      {
        name: 'formatTooltip',
        type: '(value: number) => string | number',
        default: '—',
        desc: 'Formats the drag tooltip and accessible value (naive-ui `format-tooltip`).',
      },
      { name: 'marks', type: 'Marks', default: '—', desc: 'Tick marks keyed by value.' },
      {
        name: 'placement',
        type: 'Placement',
        default: "'top'",
        desc: 'Tooltip position relative to the handle.',
      },
      {
        name: 'showSteps',
        type: 'boolean',
        default: 'false',
        desc: 'Render a tick at every step between min and max.',
      },
      {
        name: 'showInput',
        type: 'boolean',
        default: 'false',
        desc: 'Render number input(s) beside the rail (two + separator in range).',
      },
      {
        name: 'trackBackground',
        type: 'string',
        default: '—',
        desc: 'Fill-track background — any CSS background (solid / gradient / transparent).',
      },
      {
        name: 'railBackground',
        type: 'string',
        default: '—',
        desc: 'Rail background — any CSS background (solid / gradient / transparent).',
      },
      {
        name: 'railWidth',
        type: 'number | string',
        default: '—',
        desc: 'Rail thickness in px (horizontal: height; vertical: width).',
      },
      {
        name: 'railShadow',
        type: 'string',
        default: '—',
        desc: 'Rail diffuse glow — any CSS box-shadow value (blurred translucent halo).',
      },
      {
        name: 'tooltipBackground',
        type: 'string',
        default: '—',
        desc: 'Tooltip bubble background — any CSS background value.',
      },
      { name: 'tooltipTextColor', type: 'string', default: '—', desc: 'Tooltip text color.' },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Accessible name.' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnSlider.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: number | [number, number])',
        desc: '`v-model` sync: fired on every value change.',
      },
      {
        name: 'change',
        payload: '(value: number | [number, number])',
        desc: 'Fired on a committed change (drag end / keyboard / mark click / input commit).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnSlider.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'tooltip',
        props: '{ value: number }',
        desc: 'Custom tooltip content; the scope exposes the current handle value.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Slider · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Slider } from '@snui/vue-web';",
    chipCopy: "import { Slider } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Slider', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'switch', link: '/en/components/web/switch' },
    next: { text: 'slider-bar', link: '/en/components/web/slider-bar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
