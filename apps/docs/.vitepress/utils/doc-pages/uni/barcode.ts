/**
 * Barcode 条形码（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-barcode.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const barcodeDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '业务组件 Business' },
    { text: 'Barcode 条形码' },
  ],
  title: 'Barcode 条形码',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '12 位输入自动补算校验位；13 位输入做校验；非法输入走 ' },
    { t: 'code', s: 'error' },
    { t: 'text', s: ' 事件，绝不输出错误条码。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-barcode',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Barcode 条形码.vue',
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
      name: 'barcode-mp',
      title: '代码演示',
      blurb: '自动校验位 / 显式 13 位与自定义条色 / 非法输入 error。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Barcode 条形码 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Barcode } from '@snui/uni';",
    chipCopy: "import { Barcode } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-barcode', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-liquid', link: '/components/uni/liquid' },
    next: { text: 'sn-dialer', link: '/components/uni/dialer' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
