/**
 * Waterfall 瀑布流（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-waterfall.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const waterfallDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '展示组件 Display' },
    { text: 'Waterfall 瀑布流' },
  ],
  title: 'Waterfall 瀑布流',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '核心保证：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-waterfall',
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
    fileLabel: 'Waterfall 瀑布流.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Waterfall } from '@snui/uni';
</script>

<template>
  <sn-waterfall />
</template>`,
  },
  demos: [
    {
      name: 'waterfall-mp-basic',
      title: '基础用法',
      blurb: '双列图片墙：列数、列间距与列内间距，项按最短列优先放置。',
    },
    {
      name: 'waterfall-mp-lazy-load',
      title: '图片懒加载配置',
      blurb: '容器 lazy-load 一处开启，内部图片继承；单张显式关闭仍然优先。',
    },
    {
      name: 'waterfall-mp-responsive',
      title: '响应式列数',
      blurb: 'min-column-width 响应式列数，随容器宽度自动增删列。',
    },
    {
      name: 'waterfall-mp-masonry-off',
      title: '关闭瀑布流',
      blurb: 'masonry=false 退化为一列垂直堆叠。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'columns',
        type: 'number',
        default: '3',
        desc: '逻辑列数（整数 ≥ 1，小数向下取整，`0` / `NaN` / `Infinity` 回退 `1`）。`minColumnWidth` 模式下仅作测量前猜测；`masonry=false` 时忽略。',
      },
      {
        name: 'minColumnWidth',
        type: 'string | number',
        default: "''",
        desc: '最小列宽（数字 = rpx，字符串原样透传）。设置后列数跟随实测容器宽度 （响应式模式），`columns` 仅作测量前的猜测。',
      },
      { name: 'columnGap', type: 'string | number', default: '16', desc: '16' },
      { name: 'rowGap', type: 'string | number', default: '16', desc: '16' },
      {
        name: 'masonry',
        type: 'boolean',
        default: 'true',
        desc: '便捷关闭开关：`false` 渲染普通垂直单列堆叠。',
      },
      {
        name: 'lazyLoad',
        type: 'boolean',
        default: 'false',
        desc: '容器级图片懒加载配置：级联给内部 `sn-img`（未显式传的图片继承，显式传入优先），交原生 `<image lazy-load>`。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Waterfall 瀑布流 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Waterfall } from '@snui/uni';",
    chipCopy: "import { Waterfall } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-waterfall', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-rich-text', link: '/components/uni/rich-text' },
    next: { text: 'sn-liquid', link: '/components/uni/liquid' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
