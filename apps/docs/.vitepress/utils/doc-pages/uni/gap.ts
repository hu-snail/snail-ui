/**
 * Gap 间隔槽（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-gap.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const gapDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Gap 间隔槽' }],
  title: 'Gap 间隔槽',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '默认 14px，可传数字（按 px）或带单位的字符串：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-gap',
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
    fileLabel: 'Gap 间隔槽.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Gap } from '@snui/uni';
</script>

<template>
  <sn-gap />
</template>`,
  },
  demos: [
    {
      name: 'gap-mp-basic',
      title: '基础用法',
      blurb: "默认 14px 间隔；height=24 的数值间隔；height='20px' 带背景色的间隔。",
    },
    {
      name: 'gap-mp-safe-area',
      title: '底部安全区',
      blurb: 'safeAreaBottom 为页面底部叠加手势条安全区，避免最后一行内容被遮挡。',
    },
    {
      name: 'gap-mp-custom',
      title: 'rpx 高度与自定义样式',
      blurb:
        'height=&quot;24rpx&quot; 字符串原样转发；数字仍按 px；customClass / customStyle 与 bg-color 叠加。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'height',
        type: 'string | number',
        default: '14',
        desc: '间隔槽高度：数字按 px，字符串原样转发（如 `20rpx`）。',
      },
      {
        name: 'bgColor',
        type: 'string',
        default: "'transparent'",
        desc: '背景颜色（内联覆盖，默认透明）。',
      },
      {
        name: 'safeAreaBottom',
        type: 'boolean',
        default: 'false',
        desc: '是否开启底部安全区适配（叠加 `env(safe-area-inset-bottom)`）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Gap 间隔槽 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Gap } from '@snui/uni';",
    chipCopy: "import { Gap } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-gap', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-divider', link: '/components/uni/divider' },
    next: { text: 'sn-tag', link: '/components/uni/tag' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
