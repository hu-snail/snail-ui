/** CodeInput · uni-app x (uni-app x) — English page data. Props from sn-code-input.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const codeInputDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'CodeInput · uni-app x' },
  ],
  title: 'CodeInput · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Boxed PIN field: ' },
    { t: 'code', s: 'length' },
    { t: 'text', s: ' sets the box count, ' },
    { t: 'code', s: 'mask' },
    { t: 'text', s: ' toggles the dots, ' },
    { t: 'code', s: 'focused' },
    { t: 'text', s: ' drives the caret and the default ' },
    { t: 'code', s: 'gutter=8' },
    { t: 'text', s: ' (16rpx gap) keeps cells apart — pass ' },
    { t: 'code', s: 'gutter=0' },
    { t: 'text', s: ' for the flush layout.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-code-input',
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
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'CodeInput · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { CodeInput } from '@snui/uni';
</script>

<template>
  <sn-code-input />
</template>`,
  },
  demos: [
    {
      name: 'code-input-mp-basic',
      title: 'Basic usage',
      blurb:
        'Boxed PIN field: `length` sets the box count, `mask` toggles the dots and `focused` drives the caret (pair it with the keyboard visibility).',
    },
    {
      name: 'code-input-mp-shape',
      title: 'Cell shape (`shape`)',
      blurb: "`shape='box'` (default) vs `shape='underline'` cell shapes.",
    },
    {
      name: 'code-input-mp-background',
      title: 'Cell background (`background`)',
      blurb: 'The `background` prop paints custom cell backgrounds (tokens or any CSS color).',
    },
    {
      name: 'code-input-mp-no-border',
      title: 'Cell border (`border`)',
      blurb:
        "`border='none'` strips every cell border (the underline rule included) for background-only cells.",
    },
    {
      name: 'code-input-mp-mask',
      title: 'Plain display (mask)',
      blurb: '`mask=false` shows the characters.',
    },
    {
      name: 'code-input-mp-error-info',
      title: 'Error state (errorInfo)',
      blurb: '`errorInfo` overrides `info` and turns the borders danger-colored.',
    },
    {
      name: 'code-input-mp-gutter',
      title: 'Cell gap (gutter)',
      blurb: 'The default 16rpx gap is tunable via `gutter`.',
    },
    {
      name: 'code-input-mp-custom-style',
      title: 'Root class & inline style (`customClass` / `customStyle`)',
      blurb:
        "`customClass` is appended to the root; `customStyle` is appended after the component's own variables and can override other properties.",
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Current value (`v-model`).' },
      { name: 'mask', type: 'boolean', default: 'true', desc: 'Mask the characters as dots.' },
      { name: 'info', type: 'string', default: "''", desc: 'Helper text below the boxes.' },
      {
        name: 'errorInfo',
        type: 'string',
        default: "''",
        desc: 'Error text below the boxes (takes precedence over `info`).',
      },
      {
        name: 'gutter',
        type: 'number | string',
        default: '8',
        desc: 'Gap between boxes. A number is treated as an rpx design value.',
      },
      {
        name: 'border',
        type: "'all' | 'none'",
        default: "'all'",
        desc: "Cell border: `all` (default) draws the reference frame; `none` strips every border in both shapes — background-only cells (additive). Named after sn-input's `border`.",
      },
      {
        name: 'shape',
        type: "'box' | 'underline'",
        default: "'box'",
        desc: 'Box shape: framed `box` cells or borderless `underline` cells (additive).',
      },
      {
        name: 'background',
        type: 'string',
        default: "''",
        desc: 'Cell background color (any CSS color or `var(--sn-mp-color-*)`, additive).',
      },
      { name: 'length', type: 'number', default: '6', desc: 'Number of boxes.' },
      {
        name: 'focused',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the field is focused (shows the caret).',
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
    copy: 'CodeInput · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { CodeInput } from '@snui/uni';",
    chipCopy: "import { CodeInput } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-code-input', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Textarea', link: '/en/components/uni/textarea' },
    next: { text: 'Keyboard', link: '/en/components/uni/keyboard' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
