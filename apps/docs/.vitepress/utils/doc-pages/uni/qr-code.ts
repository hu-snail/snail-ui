/**
 * QRCode 二维码（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-qr-code.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const qrCodeDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'QRCode 二维码' },
  ],
  title: 'QRCode 二维码',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '编码器是本仓库自带的 ' },
    { t: 'code', s: 'sn-qr-core.ts' },
    {
      t: 'text',
      s: '（ISO/IEC 18004 Model 2）：版本 1-40、四种纠错级别、数字 / 字母数字 / 字节三种分段模式、8 种掩码 + N1-N4 惩罚评分、GF(2^8) 上的 Reed-Solomon 纠错。**不引入任何依赖**，也不使用 ',
    },
    { t: 'code', s: 'eval' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'new Function' },
    { t: 'text', s: '。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-qr-code',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'QRCode 二维码.vue',
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
    { name: 'qr-code-mp-basic', title: '基础用法', blurb: '默认纠错 H 与纠错 M 的对比。' },
    {
      name: 'qr-code-mp-dot-type',
      title: '码点形状（dotType）',
      blurb: 'square / dots / rounded / liquid 四种码点形状，dot-scale 缩小码点。',
    },
    {
      name: 'qr-code-mp-color',
      title: '自定义颜色（colorDark / colorLight）',
      blurb: 'color-dark 换码点色，color-light 换留白色。',
    },
    {
      name: 'qr-code-mp-export',
      title: '静区与导出',
      blurb: '带静区的二维码 + exportImage 导出临时路径。',
    },
    {
      name: 'qr-code-mp-gradient',
      title: '渐变码（enableGradient）',
      blurb:
        'gradientColors 多色渐变覆盖 gradientColor；gradientDirection 取 diagonal / horizontal / vertical 或角度数值。',
    },
    {
      name: 'qr-code-mp-canvas-id',
      title: '画布 id（canvasId）',
      blurb:
        'canvasId 指定画布 id（默认按实例 uid 生成）；附带 customClass / customStyle 根节点样式。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'text', type: 'string', default: "''", desc: 'Payload encoded into the code.' },
      { name: 'size', type: 'number', default: '200', desc: '画布边长，设计稿 px（钳制 40-1000）' },
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
      { name: 'margin', type: 'number', default: '0', desc: '静区宽度，设计稿 px' },
      { name: 'dotType', type: 'QrDotType', default: "'square'", desc: 'Module shape.' },
      { name: 'dotScale', type: 'number', default: '1', desc: '码点填充比例（钳制 0.4-1）' },
      { name: 'enableGradient', type: 'boolean', default: 'false', desc: '是否启用渐变' },
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
        desc: '多色渐变（2 色以上），优先于 `gradientColor`',
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'QRCode 二维码 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { QrCode } from '@snui/uni';",
    chipCopy: "import { QrCode } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-qr-code', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'ImgCropper', link: '/components/uni/img-cropper' },
    next: { text: 'Table', link: '/components/uni/table' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
