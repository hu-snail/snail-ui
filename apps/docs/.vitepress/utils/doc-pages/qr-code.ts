/**
 * 二维码 QR Code 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const qrCodeDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '二维码 QR Code' },
  ],
  title: '二维码 QR Code',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '将文本内容渲染为可扫码识别的二维码，支持纠错等级、配色、尺寸、中心图标与下载。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/qr-code',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '二维码 QR Code.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { QrCode } from '@snui/vue-web';
</script>

<template>
  <QrCode />
</template>`,
  },
  demos: [{ name: 'qr-code-web-basic', title: '代码演示', blurb: 'value 生成默认尺寸的二维码。' }],
  tokens: { hint: [], note: '', rows: [] },
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '二维码 QR Code 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { QrCode } from '@snui/vue-web';",
    chipCopy: "import { QrCode } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'QrCode', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'number-animation', link: '/components/web/number-animation' },
    next: { text: 'statistic', link: '/components/web/statistic' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
