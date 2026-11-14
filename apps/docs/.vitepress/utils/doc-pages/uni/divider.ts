/**
 * Divider 分割线（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-divider.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dividerDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Divider 分割线' }],
  title: 'Divider 分割线',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-divider',
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
    fileLabel: 'Divider 分割线.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Divider } from '@snui/uni';
</script>

<template>
  <sn-divider />
</template>`,
  },
  demos: [
    {
      name: 'divider-mp',
      title: '全部形态',
      blurb: '水平 / 虚线 / 带文字 / marginSize / 垂直 等全部 variants 的综合预览。',
    },
    {
      name: 'divider-mp-content-position',
      title: '文字位置（content-position）',
      blurb: 'content-position 三档 left / center / right，可与 dashed / marginSize 叠加。',
    },
    {
      name: 'divider-mp-vertical',
      title: '垂直分割线 + 自定义样式',
      blurb:
        'vertical 与 direction 两种写法；dashed / color；customClass 与 customStyle 覆盖默认 1em 高度。',
    },
    {
      name: 'divider-mp-hairline',
      title: '细线（`hairline`）',
      blurb: 'hairline 开 / 关对比：水平线、带文字、垂直线与细虚线。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: 'Axis: horizontal (full-width line) or vertical (inline line).',
      },
      { name: 'dashed', type: 'boolean', default: 'false', desc: '虚线' },
      { name: 'hairline', type: 'boolean', default: 'true', desc: '细线（1rpx）' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Optional color override (CSS color value).',
      },
      {
        name: 'marginSize',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Vertical margin (only for horizontal direction).',
      },
      {
        name: 'contentPosition',
        type: "'left' | 'center' | 'right'",
        default: "'center'",
        desc: 'Content position along the line (`wd-divider` `content-position`).',
      },
      {
        name: 'vertical',
        type: 'boolean',
        default: 'false',
        desc: "Vertical separator (`wd-divider` `vertical`). Equivalent to `direction: 'vertical'`; either one renders the vertical variant.",
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Extra class on the root node (`wd-divider` `custom-class`).',
      },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Extra inline style on the root node (`wd-divider` `custom-style`).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Divider 分割线 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Divider } from '@snui/uni';",
    chipCopy: "import { Divider } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-divider', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'RootPortal', link: '/components/uni/root-portal' },
    next: { text: 'Gap', link: '/components/uni/gap' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
