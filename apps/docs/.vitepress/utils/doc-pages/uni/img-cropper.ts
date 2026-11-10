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
      name: 'img-cropper-mp-ratio',
      title: '裁剪比例（aspectRatio）',
      blurb: '1:1 / 16:9 / 9:16 三种比例切换，confirm 记录上次比例。',
    },
    {
      name: 'img-cropper-mp-rotate',
      title: '禁止旋转与按钮文案（disabledRotate）',
      blurb: 'disabled-rotate 隐藏旋转能力；cancel / confirm-button-text 自定义底栏按钮文案。',
    },
    {
      name: 'img-cropper-mp-frame',
      title: '预览框尺寸（imgWidth / imgHeight）',
      blurb: 'img-width / img-height 以设计稿 px 给出（内部 ×2 换 rpx），决定预览框尺寸。',
    },
    {
      name: 'img-cropper-mp-max-scale',
      title: '缩放上限（maxScale）',
      blurb: 'max-scale 限制双指缩放上限（最小 0.5），2 / 6 两档对比。',
    },
    {
      name: 'img-cropper-mp-export-props',
      title: '导出声明参数',
      blurb:
        'export-scale / quality / file-type 只对齐参考 API：组件不做栅格化，宿主按 confirm 几何自行导出。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: '是否打开裁剪组件（`v-model`）',
      },
      { name: 'imgSrc', type: 'string', default: "''", desc: 'Source image URL.' },
      {
        name: 'imgWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '图片宽度。',
      },
      {
        name: 'imgHeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '图片高度。',
      },
      { name: 'disabledRotate', type: 'boolean', default: 'false', desc: '禁止图片旋转' },
      {
        name: 'maxScale',
        type: 'number',
        default: '3',
        desc: '最大缩放倍数（小于等于 0.5 时回落到 3）',
      },
      {
        name: 'exportScale',
        type: 'number',
        default: '1',
        desc: '导出缩放倍数（已声明，本实现不栅格化）',
      },
      {
        name: 'quality',
        type: 'number',
        default: '0.92',
        desc: '导出质量 0–1（已声明，本实现不栅格化）',
      },
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
