/**
 * Popover 气泡卡片（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-popover.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const popoverDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Popover 气泡卡片' },
  ],
  title: 'Popover 气泡卡片',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '气泡高度由内容决定：长文案在气泡最大宽度内换行、气泡向下增长，内容不会被裁切；菜单项的长文案同样换行。行内图标与关闭图标都走尺寸 token（',
    },
    { t: 'code', s: '--sn-popover-menu-icon-size' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-popover-close-icon-size' },
    { t: 'text', s: '），图标放大时行高随内容增长，不溢出。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-popover',
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
    fileLabel: 'Popover 气泡卡片.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popover } from '@snui/uni';
</script>

<template>
  <sn-popover />
</template>`,
  },
  demos: [
    { name: 'popover-mp-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'popover-mp-height', title: '自适应高度', blurb: '自适应高度' },
    { name: 'popover-mp-menu', title: '菜单模式与图标配置', blurb: '菜单模式与图标配置' },
    {
      name: 'popover-mp-placement',
      title: '弹出位置 / 箭头 / 禁用 / 配色',
      blurb: '弹出位置 / 箭头 / 禁用 / 配色',
    },
    { name: 'popover-mp-theme', title: '暗黑主题', blurb: '暗黑主题' },
    {
      name: 'popover-mp-icon-class',
      title: '兼容图标字段（iconClass）',
      blurb: 'menu 模式下旧字段 iconClass 仍兼容：名称走 SnIcon，图片地址按 image 渲染。',
    },
    {
      name: 'popover-mp-content-slot',
      title: 'content 插槽',
      blurb: '#content 插槽完全替换气泡正文，两种模式都可用。',
    },
    {
      name: 'popover-mp-custom-style',
      title: '节点类名与偏移',
      blurb: 'custom-arrow / custom-pop 追加类名；offset 与 custom-style 作用在根节点。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'boolean', default: 'false', desc: '是否显示（`v-model`）' },
      {
        name: 'content',
        type: 'string | SnPopoverMenuItem[]',
        default: "''",
        desc: 'Bubble body: a string in `normal` mode, a list in `menu` mode.',
      },
      { name: 'mode', type: 'PopoverMode', default: "'normal'", desc: 'Bubble display mode.' },
      { name: 'placement', type: 'PopoverPlacement', default: "'bottom'", desc: 'Bubble anchor.' },
      { name: 'offset', type: 'PopoverOffset', default: '0', desc: '{ x?, y? }`' },
      { name: 'visibleArrow', type: 'boolean', default: 'true', desc: '是否显示箭头' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
      { name: 'showClose', type: 'boolean', default: 'false', desc: '是否显示关闭按钮' },
      {
        name: 'closeOnClickOutside',
        type: 'boolean',
        default: 'true',
        desc: '点击气泡外部是否关闭（走外部关闭队列，不吞点击）',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Extra class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customArrow',
        type: 'string',
        default: "''",
        desc: 'Extra class on the arrow node.',
      },
      { name: 'customPop', type: 'string', default: "''", desc: 'Extra class on the bubble node.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for `wd-popover` parity, NOT implemented — miniprogram has no portal host, so the bubble cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Popover 气泡卡片 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Popover } from '@snui/uni';",
    chipCopy: "import { Popover } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-popover', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-tooltip', link: '/components/uni/tooltip' },
    next: { text: 'sn-form', link: '/components/uni/form' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
