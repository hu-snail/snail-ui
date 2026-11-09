/**
 * Liquid 水波进度球（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-liquid.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const liquidDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '业务组件 Business' },
    { text: 'Liquid 水波进度球' },
  ],
  title: 'Liquid 水波进度球',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '水位由 ' },
    { t: 'code', s: 'percent' },
    { t: 'text', s: ' 驱动（0-100 自动夹取），' },
    { t: 'code', s: 'v-model:current' },
    { t: 'text', s: ' 拿到过渡值；默认球心显示百分比文字，可用插槽自定义。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-liquid',
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
    fileLabel: 'Liquid 水波进度球.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Liquid } from '@snui/uni';
</script>

<template>
  <sn-liquid />
</template>`,
  },
  demos: [
    {
      name: 'liquid-mp',
      title: '代码演示',
      blurb: '基础 / outline 外圈 / 自定义波浪色，点击按钮渐增进度。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'percent',
        type: 'number',
        default: '0',
        desc: '进度百分比（0-100），超出范围会被夹取。',
      },
      {
        name: 'size',
        type: 'string',
        default: "'160rpx'",
        desc: '球体尺寸（rpx / px 长度字符串）。',
      },
      {
        name: 'duration',
        type: 'number',
        default: '500',
        desc: '水位 / current 过渡时长（ms），0 表示立即到位。',
      },
      { name: 'outline', type: 'boolean', default: 'false', desc: '是否显示外圈描边。' },
      { name: 'radius', type: 'string', default: "'50%'", desc: '圆角（默认正圆）。' },
      {
        name: 'waveColor',
        type: 'string',
        default: "'var(--sn-mp-color-action-primary)'",
        desc: '波浪颜色。',
      },
      {
        name: 'innerColor',
        type: 'string',
        default: "'var(--sn-mp-color-action-primary-soft)'",
        desc: '球内背景色（水面以上区域）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Liquid 水波进度球 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Liquid } from '@snui/uni';",
    chipCopy: "import { Liquid } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-liquid', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-waterfall', link: '/components/uni/waterfall' },
    next: { text: 'sn-barcode', link: '/components/uni/barcode' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
