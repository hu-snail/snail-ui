/** Barcode (uni-app) — English page data. Props from sn-barcode.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const barcodeDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Business Components' }, { text: 'Barcode' }],
  title: 'Barcode',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A short EAN/UPC input gets its check digit appended automatically; a full-length input is validated. Invalid input goes through the ',
    },
    { t: 'code', s: 'error' },
    { t: 'text', s: ' event — a wrong barcode is never rendered.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-barcode',
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
    fileLabel: 'Barcode.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Barcode } from '@snui/uni';
</script>

<template>
  <sn-barcode />
</template>`,
  },
  demos: [
    {
      name: 'barcode-mp-basic',
      title: 'Basic usage',
      blurb: 'A 12-digit input auto-completes the check digit.',
    },
    {
      name: 'barcode-mp-states',
      title: 'State & events',
      blurb: 'Three error codes via error + the rendered callback.',
    },
    {
      name: 'barcode-mp-format',
      title: 'Barcode formats',
      blurb: 'CODE128 / CODE39 / EAN13 / CODEBAR / ITF / EAN8 / UPC.',
    },
    {
      name: 'barcode-mp-layout',
      title: 'Layout direction',
      blurb: 'Horizontal (default) / vertical.',
    },
    {
      name: 'barcode-mp-style',
      title: 'Style props',
      blurb: 'line-length / line-color / background / text-align / margin.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'text', type: 'string', default: "''", desc: '条码内容（校验位规则见各格式说明）。' },
      { name: 'format', type: 'SnBarcodeFormat', default: "'EAN13'", desc: '条码格式。' },
      { name: 'showText', type: 'boolean', default: 'true', desc: '是否在条码旁显示文本。' },
      {
        name: 'layout',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: '布局方向：水平条码或垂直（旋转 90°）条码。',
      },
      {
        name: 'textPosition',
        type: "'bottom' | 'top'",
        default: "'bottom'",
        desc: '文本位置（沿布局轴）。',
      },
      {
        name: 'lineColor',
        type: 'string',
        default: "'var(--sn-mp-color-text-primary)'",
        desc: '条的颜色（同时作为文本色）。',
      },
      {
        name: 'background',
        type: 'string',
        default: "'transparent'",
        desc: '背景色（默认透明）。',
      },
      { name: 'moduleWidth', type: 'number', default: '2', desc: '单模块宽度（px）。' },
      {
        name: 'height',
        type: 'string',
        default: "'120rpx'",
        desc: '线条高度（rpx / px 长度字符串）。`lineLength` 的别名，后者优先。',
      },
      {
        name: 'lineLength',
        type: 'string',
        default: "''",
        desc: '线条高度（lime-ui 命名）。优先于 `height`。',
      },
      {
        name: 'margin',
        type: 'string',
        default: "''",
        desc: '整体边距（CSS margin 值，如 `16rpx` / `8rpx 16rpx`）。',
      },
      {
        name: 'textAlign',
        type: "'left' | 'center' | 'right'",
        default: "'center'",
        desc: '文本对齐。',
      },
      {
        name: 'fontSize',
        type: 'string',
        default: "'22rpx'",
        desc: '文本字号（rpx / px 长度字符串）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Barcode ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Barcode } from '@snui/uni';",
    chipCopy: "import { Barcode } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-barcode', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-liquid', link: '/en/components/uni/liquid' },
    next: { text: 'sn-dialer', link: '/en/components/uni/dialer' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
