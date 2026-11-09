/** ColorPicker · Web (Web) — English page data. Props from color-picker SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const colorPickerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'ColorPicker · Web' },
  ],
  title: 'ColorPicker · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Color picker. SV drag panel + hue / alpha rails + format dropdown (RGB / HSL / HEX) + recent colors + preset swatches, with a panel-only (',
    },
    { t: 'code', s: 'panelOnly' },
    { t: 'text', s: ') inline mode.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/color-picker',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'ColorPicker · Web.vue',
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
    {
      name: 'color-picker-web-basic',
      title: 'Basic',
      blurb: 'Drag to pick; v-model normalized to hex.',
    },
    {
      name: 'color-picker-web-modes',
      title: 'Color format (modes)',
      blurb: 'Hex / RGB / HSL format dropdown with channel inputs.',
    },
    {
      name: 'color-picker-web-alpha',
      title: 'Alpha (showAlpha)',
      blurb: 'Alpha rail + percent input + 8-digit hex / rgba output.',
    },
    { name: 'color-picker-web-swatches', title: 'Swatches', blurb: 'One-click preset colors.' },
    {
      name: 'color-picker-web-panel-only',
      title: 'Panel only (panelOnly)',
      blurb: 'panelOnly inline panels, multiple instances side by side.',
    },
    {
      name: 'color-picker-web-states',
      title: 'Clearable / disabled',
      blurb: 'clearable resets to default; disabled; readonly.',
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'ColorPicker · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { ColorPicker } from '@snui/vue-web';",
    chipCopy: "import { ColorPicker } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'ColorPicker', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'date-picker', link: '/en/components/web/date-picker' },
    next: { text: 'mention', link: '/en/components/web/mention' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
