/**
 * Scratchcard 刮刮乐（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-scratchcard.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const scratchcardDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '业务组件 Business' },
    { text: 'Scratchcard 刮刮乐' },
  ],
  title: 'Scratchcard 刮刮乐',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '奖品类容放在默认插槽；' },
    { t: 'code', s: 'ratio' },
    { t: 'text', s: ' 控制阈值（刮开面积占比），' },
    { t: 'code', s: 'title' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'watermarkText' },
    { t: 'text', s: ' 定制封面。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-scratchcard',
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
    fileLabel: 'Scratchcard 刮刮乐.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Scratchcard } from '@snui/uni';
</script>

<template>
  <sn-scratchcard />
</template>`,
  },
  demos: [
    {
      name: 'scratchcard-mp-basic',
      title: '基础用法',
      blurb: '真刮擦（指针擦除涂层）、阈值 open 回调与重置。',
    },
    {
      name: 'scratchcard-mp-states',
      title: '状态与事件',
      blurb: 'open 每轮只触发一次，reset() 进入新一轮；双卡独立状态。',
    },
    {
      name: 'scratchcard-mp-cover',
      title: '封面色（coverColor）',
      blurb: 'canvas fillStyle 不解析 CSS 变量，用字面量色值。',
    },
    {
      name: 'scratchcard-mp-ratio',
      title: '刮开阈值（ratio）',
      blurb: '0.3 一刮就开 vs 0.9 刮满才开。',
    },
    {
      name: 'scratchcard-mp-watermark',
      title: '水印（watermark*）',
      blurb: 'watermark-text / watermark-size / watermark-color。',
    },
    {
      name: 'scratchcard-mp-title-style',
      title: '标题样式（titleSize / titleColor）',
      blurb: '标题字号与颜色。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'coverColor',
        type: 'string',
        default: "'#C5C5C5'",
        desc: '封面颜色（coverImg 优先）。',
      },
      { name: 'coverImg', type: 'string', default: "''", desc: '封面图片。' },
      { name: 'ratio', type: 'number', default: '0.8', desc: '刮开比例阈值（0-1）' },
      { name: 'scratchRadius', type: 'number', default: '10', desc: '刮擦半径（px）' },
      { name: 'watermarkText', type: 'string', default: "''", desc: '封面水印文字。' },
      { name: 'watermarkSize', type: 'number', default: '14', desc: '水印字号（px）' },
      { name: 'watermarkColor', type: 'string', default: "'rgba(0", desc: '水印颜色。' },
      { name: 'title', type: 'string', default: "''", desc: '封面标题文字。' },
      { name: 'titleSize', type: 'number', default: '24', desc: '标题字号（px）' },
      { name: 'titleColor', type: 'string', default: "'rgba(0", desc: '标题颜色。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: '根节点自定义样式（至少提供 width / height）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Scratchcard 刮刮乐 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Scratchcard } from '@snui/uni';",
    chipCopy: "import { Scratchcard } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-scratchcard', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Dialer', link: '/components/uni/dialer' },
    next: { text: 'Lucky', link: '/components/uni/lucky' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
