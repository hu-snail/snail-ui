/** QR Code · Web (Web) — English page data. Props from qr-code SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const qrCodeDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'QR Code · Web' },
  ],
  title: 'QR Code · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Renders text as a scannable QR code with error correction levels, custom' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/qr-code',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'QR Code · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { QrCode } from '@snui/vue-web';
</script>

<template>
  <QrCode />
</template>`,
  },
  demos: [
    { name: 'qr-code-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'qr-code-web-size', title: 'Size', blurb: 'Size' },
    { name: 'qr-code-web-color', title: 'Color', blurb: 'Color' },
    { name: 'qr-code-web-error-correction', title: 'Error correction', blurb: 'Error correction' },
    { name: 'qr-code-web-icon', title: 'Icon', blurb: 'Icon' },
    { name: 'qr-code-web-download', title: 'Download', blurb: 'Download' },
    { name: 'qr-code-web-type', title: 'Render type', blurb: 'Render type' },
    {
      name: 'qr-code-web-shape',
      title: 'Shape & multi-color (shape / colors)',
      blurb: 'Shape & multi-color (shape / colors)',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'string',
        default: "''",
        desc: 'Text content encoded into the QR code. Mirrors n-qr-code `value`.',
      },
      {
        name: 'errorCorrectionLevel',
        type: "'L' | 'M' | 'Q' | 'H'",
        default: "'M'",
        desc: 'Error correction level: ~7% (L), 15% (M), 25% (Q), 30% (H). Mirrors n-qr-code `error-correction-level`.',
      },
      {
        name: 'size',
        type: 'number',
        default: '100',
        desc: 'Square side length in px (padding included). Mirrors n-qr-code `size`.',
      },
      {
        name: 'padding',
        type: 'number | string',
        default: '12',
        desc: 'Inner padding around the code; number → px. Mirrors n-qr-code `padding`.',
      },
      {
        name: 'color',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Dark-module color (any CSS color). Mirrors n-qr-code `color`.',
      },
      {
        name: 'backgroundColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Light-module / box background color. Mirrors n-qr-code `background-color`.',
      },
      {
        name: 'iconSrc',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Center icon image url. Mirrors n-qr-code `icon-src`.',
      },
      {
        name: 'iconSize',
        type: 'number',
        default: '40',
        desc: 'Center icon size in px. Mirrors n-qr-code `icon-size`.',
      },
      {
        name: 'iconBackgroundColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Icon backing plate color. Mirrors n-qr-code `icon-background-color`.',
      },
      {
        name: 'iconBorderRadius',
        type: 'number',
        default: '4',
        desc: 'Icon backing plate radius in px. Mirrors n-qr-code `icon-border-radius`.',
      },
      {
        name: 'type',
        type: "'canvas' | 'svg'",
        default: "'canvas'",
        desc: 'Render target. Mirrors n-qr-code `type`.',
      },
      {
        name: 'shape',
        type: "'square' | 'dot' | 'rounded'",
        default: "'square'",
        desc: 'Module shape: `square` (default), `dot` (mini-program-style circles — the three finder eyes stay rounded squares for scannability), or `rounded` (rounded squares). Local addition.',
      },
      {
        name: 'colors',
        type: 'string[] | undefined',
        default: 'undefined',
        desc: 'Multi-color palette — dark data modules cycle through these colors deterministically (`(x * 7 + y * 11) % length`); the finder eyes keep `color` as the contrast anchor. Overrides `color` for data modules.',
      },
      {
        name: 'showToolbar',
        type: 'boolean',
        default: 'true',
        desc: 'Local addition: reveal the floating download toolbar on hover/focus.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'QR Code · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { QrCode } from '@snui/vue-web';",
    chipCopy: "import { QrCode } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'QrCode', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'number-animation', link: '/en/components/web/number-animation' },
    next: { text: 'statistic', link: '/en/components/web/statistic' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
