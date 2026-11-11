/** Segmented · uni-app (uni-app) — English page data. Props from sn-segmented.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const segmentedDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Segmented · uni-app' },
  ],
  title: 'Segmented · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '**The prop name is aligned, the event name is not**: the ' },
    { t: 'code', s: 'value' },
    { t: 'text', s: ' alias accepts the wot-ui spelling, but the component only emits ' },
    { t: 'code', s: 'update:modelValue' },
    { t: 'text', s: ', so a wot-ui-style ' },
    { t: 'code', s: '@update:value' },
    {
      t: 'text',
      s: ' listener never fires — the thumb moves (internal state) while the parent ref',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-segmented',
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
    fileLabel: 'Segmented · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Segmented } from '@snui/uni';
</script>

<template>
  <sn-segmented />
</template>`,
  },
  demos: [
    {
      name: 'segmented-mp-basic',
      title: 'Basic usage',
      blurb: 'v-model binds the selection; string options fall back to String(value) as the label.',
    },
    {
      name: 'segmented-mp-theme',
      title: 'Theme (`theme`)',
      blurb: 'theme=outline gives the outlined look; object options carry custom labels.',
    },
    {
      name: 'segmented-mp-disabled',
      title: 'Disabled (`disabled`)',
      blurb: 'Item-level disabled blocks one option; control-level disabled freezes everything.',
    },
    {
      name: 'segmented-mp-value',
      title: 'The `value` alias (wot-ui migration)',
      blurb: '`:value` alias with `@update:model-value`; value wins over model-value.',
    },
    {
      name: 'segmented-mp-value-alias',
      title: 'Event-name difference (`update:value`)',
      blurb:
        "The wot-ui-style `@update:value` and this component's `@update:model-value` both keep parent and child in sync.",
    },
    {
      name: 'segmented-mp-vibrate',
      title: 'Switch haptics (`vibrate-short`)',
      blurb: 'A short haptic fires on switch; hosts without a motor skip it silently.',
    },
    {
      name: 'segmented-mp-custom-style',
      title: 'Root styling',
      blurb: 'customClass appends a frame; customStyle overrides fill and radius.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '当前选中的值。',
      },
      {
        name: 'value',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'wot-ui `value` 别名 —— `wd-segmented` 把选中值叫 `value`，本组件叫 `modelValue`。两者同时存在时 `value` 优先，便于从 wot-ui 直接迁移。',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用分段器。' },
      {
        name: 'options',
        type: 'SegmentedRawOption[]',
        default: '() => []',
        desc: '数据集合：string[] / number[] / SegmentedOption[]。',
      },
      {
        name: 'theme',
        type: "'card' | 'outline'",
        default: "'card'",
        desc: '分段器主题：card / outline。',
      },
      {
        name: 'vibrateShort',
        type: 'boolean',
        default: 'false',
        desc: '切换选项时是否触发短振动。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Segmented · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Segmented } from '@snui/uni';",
    chipCopy: "import { Segmented } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-segmented', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-tabs', link: '/en/components/uni/tabs' },
    next: { text: 'sn-sidebar', link: '/en/components/uni/sidebar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
