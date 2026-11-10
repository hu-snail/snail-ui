/**
 * Slider 滑块（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-slider.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const sliderDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Slider 滑块' }],
  title: 'Slider 滑块',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-slider 单滑块：min / max / step 控制范围与步长，showExtremeValue 显示两端文案。',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-slider',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Slider 滑块.vue',
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
      title: '基础用法',
      blurb: 'sn-slider 单滑块：min / max / step 控制范围与步长，showExtremeValue 显示两端文案。',
    },
    {
      name: 'slider-mp-range',
      title: '区间与刻度（`range` / `marks`）',
      blurb: 'range 双滑块返回 [start, end]；marks 支持对象形式。',
    },
    {
      name: 'slider-mp-theme',
      title: '主题（`theme`）',
      blurb: 'theme=capsule 加粗轨道。',
    },
    {
      name: 'slider-mp-disabled',
      title: '禁用（`disabled`）',
      blurb: 'disabled 拦掉拖动。',
    },
    {
      name: 'slider-mp-vertical',
      title: '竖排（`vertical`）',
      blurb: 'vertical 竖排轨道（默认高度 400rpx）。',
    },
    {
      name: 'slider-mp-popover',
      title: '数值气泡（`popoverVisible`）',
      blurb: 'popoverVisible 取 always / normal / never 控制数值气泡。',
    },
    {
      name: 'slider-mp-color',
      title: '轨道配色（`activeColor`）',
      blurb: 'activeColor / inactiveColor 覆盖已填充与未填充轨道颜色。',
    },
    {
      name: 'slider-mp-custom-style',
      title: '根节点样式',
      blurb: 'customClass / customStyle 落在根节点上。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'SliderValue', default: '0', desc: '`0`' },
      { name: 'min', type: 'number', default: '0', desc: '下界。' },
      { name: 'max', type: 'number', default: '100', desc: '上界。' },
      { name: 'step', type: 'number', default: '1', desc: '步长' },
      { name: 'range', type: 'boolean', default: 'false', desc: '双向滑块模式' },
      { name: 'vertical', type: 'boolean', default: 'false', desc: '垂直展示' },
      { name: 'theme', type: 'SliderTheme', default: "'default'", desc: 'Visual style.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
      { name: 'showExtremeValue', type: 'boolean', default: 'false', desc: '显示两端极值文案' },
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
        desc: '刻度标记（数组或 `{ value: label }`）',
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Slider 滑块 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Slider } from '@snui/uni';",
    chipCopy: "import { Slider } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-slider', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-rate', link: '/components/uni/rate' },
    next: { text: 'sn-picker', link: '/components/uni/picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
