/**
 * Watermark 水印（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-watermark.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const watermarkDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'Watermark 水印' },
  ],
  title: 'Watermark 水印',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '无。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-watermark',
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
    fileLabel: 'Watermark 水印.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Watermark } from '@snui/uni';
</script>

<template>
  <sn-watermark />
</template>`,
  },
  demos: [
    { name: 'watermark-mp-basic', title: '基础用法', blurb: '合同预览区域上的文字水印。' },
    {
      name: 'watermark-mp-config',
      title: '瓦片与布局',
      blurb: '三种瓦片尺寸 / 间距 / 旋转 / 错位布局组合。',
    },
    {
      name: 'watermark-mp-image',
      title: '图片水印（image）',
      blurb: 'image 优先于 content，瓦片尺寸由 imageWidth / imageHeight 决定。',
    },
    {
      name: 'watermark-mp-font',
      title: '文字字体（fontFamily 等）',
      blurb:
        'fontFamily / fontStyle / fontWeight / size 作用在渲染出的 text 上；附带 zIndex 与 customClass / customStyle 根节点样式。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'content', type: 'string', default: "''", desc: 'Watermark text.' },
      {
        name: 'image',
        type: 'string',
        default: "''",
        desc: 'Watermark image source (network or base64).',
      },
      { name: 'imageHeight', type: 'number', default: '100', desc: '图片高度（px）' },
      { name: 'imageWidth', type: 'number', default: '100', desc: '图片宽度（px）' },
      { name: 'gutterX', type: 'number', default: '0', desc: 'X 轴间距（px）' },
      { name: 'gutterY', type: 'number', default: '0', desc: 'Y 轴间距（px）' },
      { name: 'width', type: 'number', default: '100', desc: '单个瓦片宽度（px）' },
      { name: 'height', type: 'number', default: '100', desc: '单个瓦片高度（px）' },
      { name: 'fullScreen', type: 'boolean', default: 'true', desc: '是否铺满整个视口' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Text color override (any CSS color value).',
      },
      { name: 'size', type: 'number', default: '14', desc: '水印文字大小（px）' },
      { name: 'fontStyle', type: 'WatermarkFontStyle', default: "'normal'", desc: 'Font style.' },
      { name: 'fontWeight', type: 'string | number', default: "'normal'", desc: 'Font weight.' },
      { name: 'fontFamily', type: 'string', default: "'PingFang SC'", desc: 'Font family.' },
      { name: 'rotate', type: 'number', default: '-25', desc: '水印旋转角度' },
      { name: 'zIndex', type: 'number', default: '1100', desc: '水印层级' },
      {
        name: 'opacity',
        type: 'number | undefined',
        default: 'undefined',
        desc: '水印透明度，0–1',
      },
      { name: 'layout', type: 'WatermarkLayout', default: "'grid'", desc: 'Repeat layout.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Watermark 水印 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Watermark } from '@snui/uni';",
    chipCopy: "import { Watermark } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-watermark', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'CountTo', link: '/components/uni/count-to' },
    next: { text: 'ImagePreview', link: '/components/uni/image-preview' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
