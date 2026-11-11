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
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
  demos: [
    { name: 'qr-code-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'qr-code-web-size', title: '尺寸', blurb: '尺寸' },
    { name: 'qr-code-web-color', title: '颜色', blurb: '颜色' },
    { name: 'qr-code-web-error-correction', title: '纠错等级', blurb: '纠错等级' },
    { name: 'qr-code-web-icon', title: '中心图标', blurb: '中心图标' },
    { name: 'qr-code-web-download', title: '下载', blurb: '下载' },
    { name: 'qr-code-web-type', title: '渲染类型', blurb: '渲染类型' },
    { name: 'qr-code-web-shape', title: '码点形状', blurb: 'shape：方块 / 圆点 / 圆角。' },
    { name: 'qr-code-web-colors', title: '多色码点', blurb: 'colors 调色板给码点上色。' },
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
        desc: '二维码整体尺寸（含 padding，单位 px）',
      },
      { name: 'padding', type: 'number | string', default: '12', desc: '`12`' },
      { name: 'color', type: 'string | undefined', default: 'undefined', desc: '深色模块颜色' },
      {
        name: 'backgroundColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: '定位块 / 取景框的背景色。对应 n-qr-code 的 `background-color`。',
      },
      {
        name: 'iconSrc',
        type: 'string | undefined',
        default: 'undefined',
        desc: '中心图标图片地址。对应 n-qr-code 的 `icon-src`。',
      },
      {
        name: 'iconSize',
        type: 'number',
        default: '40',
        desc: '中心图标尺寸（px）。对应 n-qr-code 的 `icon-size`。',
      },
      {
        name: 'iconBackgroundColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: '图标底板颜色。对应 n-qr-code 的 `icon-background-color`。',
      },
      {
        name: 'iconBorderRadius',
        type: 'number',
        default: '4',
        desc: '图标底板圆角（px）。对应 n-qr-code 的 `icon-border-radius`。',
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
        desc: '多色调色板：数据模块确定性循环取色，定位角保持 color 主色',
      },
      {
        name: 'showToolbar',
        type: 'boolean',
        default: 'true',
        desc: '本库新增：hover / focus 时显示悬浮下载工具条。',
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
