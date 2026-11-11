/** QRCode · uni-app (uni-app) — English page data. Props from sn-qr-code.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const qrCodeDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'QRCode · uni-app' },
  ],
  title: 'QRCode · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The encoder is the in-repo ' },
    { t: 'code', s: 'sn-qr-core.ts' },
    {
      t: 'text',
      s: ' (ISO/IEC 18004 Model 2): versions 1-40, four EC levels, numeric / alphanumeric / byte segment modes, 8 masks with the N1-N4 penalty evaluation and Reed-Solomon over GF(2^8). **No dependency is added**, and no ',
    },
    { t: 'code', s: 'eval' },
    { t: 'text', s: ' /' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-qr-code',
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
    fileLabel: 'QRCode · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { QrCode } from '@snui/uni';
</script>

<template>
  <sn-qr-code />
</template>`,
  },
  demos: [
    { name: 'qr-code-mp-basic', title: 'Basic usage', blurb: 'Default EC level H versus level M.' },
    {
      name: 'qr-code-mp-dot-type',
      title: 'Module shapes (`dotType`)',
      blurb: 'The four shapes square / dots / rounded / liquid; dot-scale shrinks the modules.',
    },
    {
      name: 'qr-code-mp-color',
      title: 'Custom colors (`colorDark` / `colorLight`)',
      blurb: 'color-dark recolours the modules; color-light recolours the quiet zone.',
    },
    {
      name: 'qr-code-mp-export',
      title: 'Quiet zone and export',
      blurb: 'A code with a quiet zone plus exportImage resolving to a temp path.',
    },
    {
      name: 'qr-code-mp-gradient',
      title: 'Gradient codes (`enableGradient`)',
      blurb:
        'gradientColors with 2+ colours overrides gradientColor; gradientDirection takes diagonal / horizontal / vertical or an angle.',
    },
    {
      name: 'qr-code-mp-canvas-id',
      title: 'Canvas id (`canvasId`)',
      blurb:
        'canvasId pins the canvas id (default derived from the instance uid); plus customClass / customStyle root styling.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'text', type: 'string', default: "''", desc: 'Payload encoded into the code.' },
      {
        name: 'size',
        type: 'number',
        default: '200',
        desc: 'Canvas side length in design px (`wd-qr-code` `size`).',
      },
      {
        name: 'correctLevel',
        type: 'QrCorrectLevel',
        default: "'H'",
        desc: 'Error correction level: L (~7%) / M (~15%) / Q (~25%) / H (~30%).',
      },
      {
        name: 'colorDark',
        type: 'string',
        default: "''",
        desc: "Dark module color; `''` = the code's own dark color.",
      },
      {
        name: 'colorLight',
        type: 'string',
        default: "''",
        desc: "Light module + quiet-zone color; `''` = the code's own light color.",
      },
      {
        name: 'margin',
        type: 'number',
        default: '0',
        desc: 'Quiet-zone width in design px, painted inside the canvas.',
      },
      { name: 'dotType', type: 'QrDotType', default: "'square'", desc: 'Module shape.' },
      {
        name: 'dotScale',
        type: 'number',
        default: '1',
        desc: 'Module fill ratio inside its cell, `0.4`-`1`.',
      },
      {
        name: 'enableGradient',
        type: 'boolean',
        default: 'false',
        desc: 'Paint dark modules with a linear gradient.',
      },
      {
        name: 'gradientColor',
        type: 'string',
        default: "''",
        desc: "Gradient end color; `''` falls back to `colorDark`.",
      },
      {
        name: 'gradientColors',
        type: 'string[]',
        default: '() => []',
        desc: 'Multi-stop gradient colors (2+); wins over `gradientColor`.',
      },
      {
        name: 'gradientDirection',
        type: 'QrGradientDirection | number',
        default: "'diagonal'",
        desc: 'Gradient direction; a number is an angle in degrees.',
      },
      {
        name: 'canvasId',
        type: 'string',
        default: "''",
        desc: "Canvas id; `''` = auto-generated per instance.",
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'QRCode · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { QrCode } from '@snui/uni';",
    chipCopy: "import { QrCode } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-qr-code', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-img-cropper', link: '/en/components/uni/img-cropper' },
    next: { text: 'sn-table', link: '/en/components/uni/table' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
