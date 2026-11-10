/**
 * LoadMore 加载更多（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-loadmore.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const loadmoreDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'LoadMore 加载更多' },
  ],
  title: 'LoadMore 加载更多',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '三个 ' },
    { t: 'code', s: '*-text' },
    { t: 'text', s: ' 属性覆盖默认文案；' },
    { t: 'code', s: 'loading' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'finished' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'error' },
    { t: 'text', s: ' 插槽可完全自定义该状态的内容。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-loadmore',
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
    fileLabel: 'LoadMore 加载更多.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Loadmore } from '@snui/uni';
</script>

<template>
  <sn-loadmore />
</template>`,
  },
  demos: [
    { name: 'loadmore-mp-basic', title: '基础用法', blurb: '三种状态切换 + 点击重试计数。' },
    { name: 'loadmore-mp-text', title: '自定义文案与插槽', blurb: '自定义文案与 loading 插槽。' },
    {
      name: 'loadmore-mp-custom',
      title: '加载器属性与自定义样式',
      blurb: 'loading-props 换 spinner 形态与颜色 / custom-class 加虚线框 / custom-style 加圆角。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'state',
        type: 'LoadMoreState',
        default: "''",
        desc: 'Current load state; empty renders nothing.',
      },
      {
        name: 'loadingText',
        type: 'string',
        default: "'正在努力加载中...'",
        desc: 'Text shown while loading.',
      },
      {
        name: 'finishedText',
        type: 'string',
        default: "'已加载完毕'",
        desc: 'Text shown once everything is loaded.',
      },
      {
        name: 'errorText',
        type: 'string',
        default: "'加载失败'",
        desc: 'Text shown after a failure.',
      },
      {
        name: 'loadingProps',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: '透传给内部 `sn-loading` 的属性',
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
    copy: 'LoadMore 加载更多 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Loadmore } from '@snui/uni';",
    chipCopy: "import { Loadmore } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-loadmore', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-skeleton', link: '/components/uni/skeleton' },
    next: { text: 'sn-paging', link: '/components/uni/paging' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
