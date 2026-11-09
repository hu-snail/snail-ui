/**
 * Slider 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const sliderDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Slider' }],
  title: 'Slider',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '滑块。自绘轨道 + 手柄，支持 range 双柄、marks 刻度、showSteps 步长刻度、showInput 输入框、vertical / reverse、tooltip，以及渐变 / 透明轨道与自定义气泡背景。单柄模式下轨道用主题色从 min 填充到手柄。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/slider',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Slider.vue',
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
    { name: 'slider-web-basic', title: '基础用法', blurb: 'v-model + 拖拽 / 点击轨道更新。' },
    {
      name: 'slider-web-range',
      title: '范围选择（range）',
      blurb: '双柄不交叉，拖拽时另一柄为边界。',
    },
    {
      name: 'slider-web-step',
      title: '步长与步长刻度（showSteps）',
      blurb: 'step 吸附 + showSteps 步长刻度（可切换 Step / Show steps）。',
    },
    { name: 'slider-web-marks', title: '刻度（marks）', blurb: '可点击刻度跳值。' },
    {
      name: 'slider-web-vertical',
      title: '垂直 / 反向',
      blurb: 'vertical + reverse + 垂直刻度标签。',
    },
    {
      name: 'slider-web-tooltip',
      title: 'Tooltip',
      blurb: '拖拽显示气泡，formatTooltip 格式化，tooltipBackground 自定义气泡背景。',
    },
    {
      name: 'slider-web-show-input',
      title: '显示输入框（showInput）',
      blurb:
        'showInput 在轨道旁显示数字输入框（range 为双输入框 + 分隔符，失焦 / Enter 提交生效）。',
    },
    {
      name: 'slider-web-custom',
      title: '自定义样式（渐变 / 透明弥散 / 轨道粗细）',
      blurb:
        '滑轨渐变与透明弥散（railBackground / railShadow）、trackBackground 渐变、railWidth 轨道粗细与 tooltip 配色。',
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
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Slider 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Slider } from '@snui/vue-web';",
    chipCopy: "import { Slider } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Slider', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'switch', link: '/components/web/switch' },
    next: { text: 'slider-bar', link: '/components/web/slider-bar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
