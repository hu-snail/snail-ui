/**
 * Signature 签名（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-signature.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const signatureDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Signature 签名' }],
  title: 'Signature 签名',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-signature 签名板：touchstart / touchmove 采样点，确认时通过 confirm 返回笔画几何（paths）。',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-signature',
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
    fileLabel: 'Signature 签名.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Signature } from '@snui/uni';
</script>

<template>
  <sn-signature />
</template>`,
  },
  demos: [
    {
      name: 'signature-mp-basic',
      title: '基础用法',
      blurb:
        'sn-signature 签名板：touchstart / touchmove 采样点，确认时通过 confirm 返回笔画几何（paths）。',
    },
    {
      name: 'signature-mp-history',
      title: '撤销与恢复（`enableHistory`）',
      blurb: 'enableHistory 显示撤回 / 恢复按钮，画板自带历史栈。',
    },
    {
      name: 'signature-mp-pen',
      title: '笔迹外观（`penColor` / `lineWidth`）',
      blurb: 'penColor 覆盖笔色，lineWidth 控制笔宽。',
    },
    {
      name: 'signature-mp-disabled',
      title: '禁用（`disabled`）',
      blurb: 'disabled 锁掉画板，不能绘制。',
    },
    {
      name: 'signature-mp-button-labels',
      title:
        '按钮文案（`confirmText` / `clearText` / `revokeText` / `restoreText` / `undoText` / `redoText`）',
      blurb:
        'confirmText / clearText；enableHistory 下 revokeText / restoreText；undoText / redoText 覆盖。',
    },
    {
      name: 'signature-mp-size',
      title: '画板尺寸与底色',
      blurb: 'height（数字按 rpx 设计值）/ width；backgroundColor 覆盖画板底色 token。',
    },
    {
      name: 'signature-mp-scroll',
      title: '画板滚动（`disableScroll`）',
      blurb: 'disableScroll=false 画的时候页面仍可滚动。',
    },
    {
      name: 'signature-mp-step',
      title: '撤回步长（`step`）',
      blurb: 'step=2 一次撤回两笔（需配合 enableHistory）。',
    },
    {
      name: 'signature-mp-export',
      title: '导出参数（`fileType` / `quality` / `exportScale`）',
      blurb: 'fileType / quality / exportScale（宿主导出时使用，本构建不做栅格化）。',
    },
    {
      name: 'signature-mp-stroke',
      title: '笔迹参数（`pressure` / `lineWidth`）',
      blurb:
        'pressure / maxWidth / minWidth / minSpeed（压感模拟未实现）；lineWidth 直接控制笔宽。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'penColor',
        type: 'string',
        default: "''",
        desc: 'Stroke color (CSS color). Empty = `--sn-mp-color-text-primary`.',
      },
      { name: 'lineWidth', type: 'number', default: '3', desc: '笔宽（px 设计值）' },
      { name: 'confirmText', type: 'string', default: "'确认'", desc: 'Confirm button label.' },
      { name: 'clearText', type: 'string', default: "'清空'", desc: 'Clear button label.' },
      { name: 'revokeText', type: 'string', default: "'撤回'", desc: 'Undo button label.' },
      { name: 'restoreText', type: 'string', default: "'恢复'", desc: 'Redo button label.' },
      {
        name: 'undoText',
        type: 'string',
        default: "''",
        desc: 'Undo button label (`undo-text`; wins over `revokeText` when set).',
      },
      {
        name: 'redoText',
        type: 'string',
        default: "''",
        desc: 'Redo button label (`redo-text`; wins over `restoreText` when set).',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用画板与按钮' },
      {
        name: 'height',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '手柄高度，纯数字按 rpx 设计值处理。',
      },
      {
        name: 'width',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '手柄宽度，纯数字按 rpx 设计值处理。',
      },
      {
        name: 'backgroundColor',
        type: 'string',
        default: "''",
        desc: 'Pad background color (CSS color). Empty = token default.',
      },
      { name: 'disableScroll', type: 'boolean', default: 'true', desc: '绘制时拦截 touchmove' },
      { name: 'enableHistory', type: 'boolean', default: 'false', desc: '是否显示撤回 / 恢复' },
      { name: 'step', type: 'number', default: '1', desc: '每次撤回 / 恢复的笔画数' },
      { name: 'fileType', type: "'png' | 'jpg'", default: "'png'", desc: 'Export image type.' },
      { name: 'quality', type: 'number', default: '0.92', desc: '导出图片质量，0–1。' },
      { name: 'exportScale', type: 'number', default: '1', desc: '导出缩放倍数。' },
      { name: 'pressure', type: 'boolean', default: 'false', desc: '启用压感模拟。' },
      { name: 'maxWidth', type: 'number', default: '4', desc: '按压时的最大笔画宽度（设计 px）。' },
      { name: 'minWidth', type: 'number', default: '2', desc: '按压时的最小笔画宽度（设计 px）。' },
      {
        name: 'minSpeed',
        type: 'number',
        default: '1.5',
        desc: '触发压力加宽所需的最小指针速度。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Signature 签名 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Signature } from '@snui/uni';",
    chipCopy: "import { Signature } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-signature', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-sort-button', link: '/components/uni/sort-button' },
    next: { text: 'sn-slide-verify', link: '/components/uni/slide-verify' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
