/** Slider · uni-app (uni-app) — English page data. Props from sn-slider.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const sliderDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Slider · uni-app' },
  ],
  title: 'Slider · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Single-knob slider: min / max / step drive the range and granularity; showExtremeValue renders both end captions.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-slider',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Slider · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Slider } from '@snui/uni';
</script>

<template>
  <sn-slider />
</template>`,
  },
  demos: [
    {
      name: 'slider-mp-basic',
      title: 'Basic usage',
      blurb:
        'Single-knob slider: min / max / step drive the range and granularity; showExtremeValue renders both end captions.',
    },
    {
      name: 'slider-mp-range',
      title: 'Range & marks (`range` / `marks`)',
      blurb: '`range` returns a `[start, end]` pair; `marks` accepts a record.',
    },
    {
      name: 'slider-mp-theme',
      title: 'Theme (`theme`)',
      blurb: 'theme=capsule thickens the track.',
    },
    {
      name: 'slider-mp-disabled',
      title: 'Disabled (`disabled`)',
      blurb: '`disabled` blocks dragging.',
    },
    {
      name: 'slider-mp-vertical',
      title: 'Vertical (`vertical`)',
      blurb: '`vertical` stands the track up (400rpx tall by default).',
    },
    {
      name: 'slider-mp-popover',
      title: 'Value bubble (`popoverVisible`)',
      blurb: '`popoverVisible` takes always / normal / never.',
    },
    {
      name: 'slider-mp-color',
      title: 'Track colors (`activeColor`)',
      blurb: '`activeColor` / `inactiveColor` override the filled and unfilled track colors.',
    },
    {
      name: 'slider-mp-custom-style',
      title: 'Root styling',
      blurb: '`customClass` / `customStyle` land on the root node.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SliderValue',
        default: '0',
        desc: 'Current value — `number`, or `[start, end]` in `range` mode.',
      },
      { name: 'min', type: 'number', default: '0', desc: 'Lower bound.' },
      { name: 'max', type: 'number', default: '100', desc: 'Upper bound.' },
      { name: 'step', type: 'number', default: '1', desc: 'Snap granularity.' },
      { name: 'range', type: 'boolean', default: 'false', desc: 'Two-knob mode.' },
      { name: 'vertical', type: 'boolean', default: 'false', desc: 'Vertical orientation.' },
      { name: 'theme', type: 'SliderTheme', default: "'default'", desc: 'Visual style.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables dragging.' },
      {
        name: 'showExtremeValue',
        type: 'boolean',
        default: 'false',
        desc: 'Show the `min` / `max` captions at both ends.',
      },
      {
        name: 'popoverVisible',
        type: 'SliderPopoverVisible',
        default: "'normal'",
        desc: 'When the value bubble is shown.',
      },
      {
        name: 'marks',
        type: 'SliderMarks | undefined',
        default: 'undefined',
        desc: 'Tick marks (array or `{ value: label }` record).',
      },
      {
        name: 'activeColor',
        type: 'string',
        default: "''",
        desc: 'Active track color (CSS color). Empty = token default.',
      },
      {
        name: 'inactiveColor',
        type: 'string',
        default: "''",
        desc: 'Inactive track color (CSS color). Empty = token default.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Slider · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Slider } from '@snui/uni';",
    chipCopy: "import { Slider } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-slider', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-rate', link: '/en/components/uni/rate' },
    next: { text: 'sn-picker', link: '/en/components/uni/picker' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
