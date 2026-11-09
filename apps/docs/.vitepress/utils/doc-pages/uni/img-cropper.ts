/**
 * ImgCropper 图片裁剪（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-img-cropper.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const imgCropperDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'ImgCropper 图片裁剪' },
  ],
  title: 'ImgCropper 图片裁剪',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '裁剪舞台监听 ' },
    { t: 'code', s: '@touchstart' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '@touchmove' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '@touchend' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '@touchcancel' },
    { t: 'text', s: '：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-img-cropper',
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
    fileLabel: 'ImgCropper 图片裁剪.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ImgCropper } from '@snui/uni';
</script>

<template>
  <sn-img-cropper />
</template>`,
  },
  demos: [
    {
      name: 'img-cropper-mp-basic',
      title: '基础用法',
      blurb: '打开裁剪层、拖拽 / 缩放 / 旋转，确认后展示几何结果。',
    },
    {
      name: 'img-cropper-mp-ratio',
      title: '比例与旋转',
      blurb: '1:1 / 16:9 / 9:16 三种比例切换，禁止旋转与自定义按钮文案。',
    },
    {
      name: 'img-cropper-mp-export',
      title: '声明但对本实现无效的属性',
      blurb:
        'img-width / img-height 预览框、max-scale 上限，以及 export-scale / quality / file-type 代入 confirm 结果。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the cropper layer is visible (`v-model`).',
      },
      { name: 'imgSrc', type: 'string', default: "''", desc: 'Source image URL.' },
      {
        name: 'imgWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Preview image width — a number is rpx, a string is used verbatim.',
      },
      {
        name: 'imgHeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Preview image height — a number is rpx, a string is used verbatim.',
      },
      {
        name: 'disabledRotate',
        type: 'boolean',
        default: 'false',
        desc: 'Disable rotation entirely.',
      },
      { name: 'maxScale', type: 'number', default: '3', desc: 'Maximum zoom factor.' },
      { name: 'exportScale', type: 'number', default: '1', desc: 'Export image scale factor.' },
      { name: 'quality', type: 'number', default: '0.92', desc: 'Export image quality, 0–1.' },
      { name: 'fileType', type: "'png' | 'jpg'", default: "'png'", desc: 'Export image type.' },
      { name: 'cancelButtonText', type: 'string', default: "'取消'", desc: 'Cancel button label.' },
      {
        name: 'confirmButtonText',
        type: 'string',
        default: "'完成'",
        desc: 'Confirm button label.',
      },
      {
        name: 'aspectRatio',
        type: 'string',
        default: "'1:1'",
        desc: 'Crop-frame aspect ratio, `"width:height"`.',
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
    copy: 'ImgCropper 图片裁剪 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { ImgCropper } from '@snui/uni';",
    chipCopy: "import { ImgCropper } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-img-cropper', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-video-preview', link: '/components/uni/video-preview' },
    next: { text: 'sn-qr-code', link: '/components/uni/qr-code' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
