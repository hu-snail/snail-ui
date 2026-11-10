/**
 * Toast 轻提示（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-toast.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const toastDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Toast 轻提示' },
  ],
  title: 'Toast 轻提示',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '默认居中、横向排版，' },
    { t: 'code', s: 'duration' },
    { t: 'text', s: ' 毫秒后自动关闭；' },
    { t: 'code', s: 'duration=0' },
    { t: 'text', s: ' 表示不自动关闭（点提示可触发 ' },
    { t: 'code', s: 'click' },
    { t: 'text', s: '）。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-toast',
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
    fileLabel: 'Toast 轻提示.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Toast } from '@snui/uni';
</script>

<template>
  <sn-toast />
</template>`,
  },
  demos: [
    {
      name: 'toast-mp-basic',
      title: '基础用法',
      blurb: '纯文案 / 成功图标（顶部）/ 加载图标纵向排版（底部，不自动关闭）。',
    },
    { name: 'toast-mp-icon', title: '图标与加载形态', blurb: '四种状态图标与四种加载形态。' },
    {
      name: 'toast-mp-style',
      title: '图标尺寸与颜色、遮罩与层级',
      blurb: '图标与加载器尺寸颜色 / cover 遮罩 / zIndex + custom-style。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'boolean', default: 'false', desc: '是否显示（`v-model`）' },
      { name: 'msg', type: 'string', default: "''", desc: 'Message text.' },
      {
        name: 'duration',
        type: 'number',
        default: '2000',
        desc: '持续时间（ms）；`0` 表示不自动关闭',
      },
      {
        name: 'direction',
        type: 'ToastDirection',
        default: "'horizontal'",
        desc: 'Layout direction of icon + text.',
      },
      {
        name: 'iconName',
        type: 'ToastIconType',
        default: "''",
        desc: 'Built-in icon kind; empty renders no icon.',
      },
      { name: 'iconSize', type: 'number | string | undefined', default: 'undefined', desc: '—' },
      {
        name: 'loadingType',
        type: 'ToastLoadingType',
        default: "'circular'",
        desc: 'Spinner shape used when `iconName` is `loading`.',
      },
      {
        name: 'loadingColor',
        type: 'string',
        default: "''",
        desc: 'Spinner color (any CSS color value).',
      },
      { name: 'loadingSize', type: 'number | string | undefined', default: 'undefined', desc: '—' },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: 'Status glyph color (any CSS color value).',
      },
      {
        name: 'position',
        type: 'ToastPosition',
        default: "'middle'",
        desc: 'Anchor of the toast box.',
      },
      { name: 'zIndex', type: 'number', default: '100', desc: '层级' },
      { name: 'cover', type: 'boolean', default: 'false', desc: '是否显示阻断式透明遮罩' },
      {
        name: 'iconClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the icon node (parity; uni icons are IconData).',
      },
      {
        name: 'classPrefix',
        type: 'string',
        default: "'wd-icon'",
        desc: 'Icon class prefix (parity; inert on the uni end).',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: '是否按 CSS 图标处理。',
      },
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'Instance id used by the function API (parity only, no effect here).',
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
        desc: 'Custom inline style for the toast box.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Toast 轻提示 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Toast } from '@snui/uni';",
    chipCopy: "import { Toast } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-toast', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-circle', link: '/components/uni/circle' },
    next: { text: 'sn-notify', link: '/components/uni/notify' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
