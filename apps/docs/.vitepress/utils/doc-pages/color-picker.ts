/**
 * ColorPicker 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const colorPickerDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'ColorPicker' }],
  title: 'ColorPicker',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '颜色选择器。SV 拖拽面板 + hue / alpha 条 + 格式下拉（RGB / HSL / HEX）+ 最近使用颜色 + 预设色板，支持只使用面板（',
    },
    { t: 'code', s: 'panelOnly' },
    { t: 'text', s: '）内联形态。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/color-picker',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'ColorPicker.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ColorPicker } from '@snui/vue-web';
</script>

<template>
  <ColorPicker />
</template>`,
  },
  demos: [
    { name: 'color-picker-web-basic', title: '基础用法', blurb: '拖拽选色，v-model 归一 hex。' },
    {
      name: 'color-picker-web-modes',
      title: '颜色格式（modes）',
      blurb: 'Hex / RGB / HSL 格式下拉，通道输入即换算。',
    },
    {
      name: 'color-picker-web-alpha',
      title: '透明度（showAlpha）',
      blurb: 'alpha 条 + 百分比输入 + 8 位 hex / rgba 输出。',
    },
    {
      name: 'color-picker-web-swatches',
      title: '预设色板（swatches）',
      blurb: '预设色块一键选择。',
    },
    {
      name: 'color-picker-web-panel-only',
      title: '只使用面板（panelOnly）',
      blurb: 'panelOnly 内联面板，可多实例并排。',
    },
    {
      name: 'color-picker-web-states',
      title: '可清空 / 禁用',
      blurb: 'clearable 恢复默认色、disabled、readonly。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | null',
        default: 'null',
        desc: 'Bound value: CSS color string, or null when empty.',
      },
      {
        name: 'modes',
        type: 'SnColorPickerMode[]',
        default: "() => ['rgb'",
        desc: 'Edit formats offered in the panel dropdown.',
      },
      {
        name: 'showAlpha',
        type: 'boolean',
        default: 'false',
        desc: 'Alpha rail + rgba/hsla output.',
      },
      {
        name: 'swatches',
        type: 'string[]',
        default: '() => []',
        desc: 'Preset swatch section (hex strings; invalid entries are dropped).',
      },
      {
        name: 'panelOnly',
        type: 'boolean',
        default: 'false',
        desc: 'Render the panel inline without the trigger (always visible).',
      },
      { name: 'size', type: 'SnColorPickerSize', default: "'medium'", desc: 'Visual size preset.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — opens nothing, commits nothing.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Clear restores the default color (#000000) and emits `clear`.',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: 'Open the panel immediately on mount (ignored with panelOnly).',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Please pick a color'",
        desc: 'Empty-state text.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: "Accessible name for the trigger (fallback: 'Color picker').",
      },
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
    copy: 'ColorPicker 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { ColorPicker } from '@snui/vue-web';",
    chipCopy: "import { ColorPicker } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'ColorPicker', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'date-picker', link: '/components/web/date-picker' },
    next: { text: 'mention', link: '/components/web/mention' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
