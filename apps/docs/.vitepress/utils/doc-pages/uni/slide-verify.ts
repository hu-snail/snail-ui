/**
 * SlideVerify 滑动验证（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-slide-verify.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const slideVerifyDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'SlideVerify 滑动验证' },
  ],
  title: 'SlideVerify 滑动验证',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-slide-verify 拖动验证：滑块拖到最右端（容差 tolerance 内）触发 success，否则 fail 并归位。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-slide-verify',
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
    fileLabel: 'SlideVerify 滑动验证.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SlideVerify } from '@snui/uni';
</script>

<template>
  <sn-slide-verify />
</template>`,
  },
  demos: [
    {
      name: 'slide-verify-mp-basic',
      title: '基础用法',
      blurb:
        'sn-slide-verify 拖动验证：滑块拖到最右端（容差 tolerance 内）触发 success，否则 fail 并归位。',
    },
    {
      name: 'slide-verify-mp-custom',
      title: '文案、颜色与禁用（`text` / `successText` / `backgroundColor` / `disabled`）',
      blurb:
        'text / successText 覆盖内置文案；backgroundColor / activeBackgroundColor 覆盖轨道色；disabled 拦掉拖动。',
    },
    {
      name: 'slide-verify-mp-icons',
      title:
        '图标字形与根节点样式（`icon` / `successIcon` / `iconPrefix` / `cssIcon` / `iconSize` / `successIconSize` / `tolerance` / `customClass` / `customStyle`）',
      blurb:
        'icon / successIcon 走 iconfont 约定；cssIcon 按裸类名渲染；iconSize / successIconSize 独立控制两个字形尺寸；tolerance 放宽容差；customClass / customStyle 落在根节点。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'tolerance', type: 'number', default: '10', desc: '右边缘容差（px）' },
      { name: 'text', type: 'string', default: "''", desc: 'Hint text. Empty = built-in copy.' },
      {
        name: 'successText',
        type: 'string',
        default: "''",
        desc: 'Success text. Empty = built-in copy.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用拖动' },
      {
        name: 'backgroundColor',
        type: 'string',
        default: "''",
        desc: 'Track background color (CSS color). Empty = token default.',
      },
      {
        name: 'activeBackgroundColor',
        type: 'string',
        default: "''",
        desc: 'Track background color once verified (CSS color). Empty = token default.',
      },
      {
        name: 'icon',
        type: 'string',
        default: "''",
        desc: 'Handle glyph name (iconfont). Default `double-right` upstream.',
      },
      {
        name: 'successIcon',
        type: 'string',
        default: "''",
        desc: 'Success glyph name (iconfont). Default `check-circle-fill` upstream.',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "'sn-icon'",
        desc: 'Iconfont class-name prefix.',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: '把名称直接渲染为 CSS 类名（`true` 时同时应用原始名称）。',
      },
      {
        name: 'iconSize',
        type: 'number | string',
        default: '28',
        desc: '手柄图形尺寸——纯数字按 rpx 处理。',
      },
      {
        name: 'successIconSize',
        type: 'number | string',
        default: '28',
        desc: '成功图形尺寸——纯数字按 rpx 处理。',
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
    copy: 'SlideVerify 滑动验证 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { SlideVerify } from '@snui/uni';",
    chipCopy: "import { SlideVerify } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-slide-verify', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-signature', link: '/components/uni/signature' },
    next: { text: 'sn-captcha', link: '/components/uni/captcha' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
