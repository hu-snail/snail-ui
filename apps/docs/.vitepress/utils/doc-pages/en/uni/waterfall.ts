/** Waterfall · uni-app (uni-app) — English page data. Props from sn-waterfall.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const waterfallDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'Waterfall · uni-app' },
  ],
  title: 'Waterfall · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Guarantees:' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-waterfall',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Waterfall · uni-app.vue',
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
      title: 'Basic usage',
      blurb:
        'Two-column image wall: column count, column gap and row gap; items pack into the shortest column.',
    },
    {
      name: 'waterfall-mp-lazy-load',
      title: 'Image lazy loading',
      blurb: 'Container lazy-load on, images inherit it; a single image can still opt out.',
    },
    {
      name: 'waterfall-mp-responsive',
      title: 'Responsive column count',
      blurb:
        'min-column-width responsive columns that appear and disappear with the container width.',
    },
    {
      name: 'waterfall-mp-masonry-off',
      title: 'Turning the waterfall off',
      blurb: 'masonry=false degrades to a single stacked column.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'columns',
        type: 'number',
        default: '3',
        desc: '逻辑列数（整数 ≥ 1）；`minColumnWidth` 模式下作为测量前的初始猜测。',
      },
      {
        name: 'minColumnWidth',
        type: 'string | number',
        default: "''",
        desc: '最小列宽（数字 = rpx，字符串原样透传）。设置后列数跟随实测容器宽度 （响应式模式），`columns` 仅作测量前的猜测。',
      },
      { name: 'columnGap', type: 'string | number', default: '16', desc: '列间距（数字 = rpx）。' },
      {
        name: 'rowGap',
        type: 'string | number',
        default: '16',
        desc: '列内项间距（数字 = rpx），作为每列的 row-gap。',
      },
      {
        name: 'masonry',
        type: 'boolean',
        default: 'true',
        desc: '便捷「关闭」开关：false 渲染普通垂直单列堆叠。',
      },
      {
        name: 'lazyLoad',
        type: 'boolean',
        default: 'false',
        desc: '容器级图片懒加载配置：级联给内部 `sn-img`（未显式设置时继承，显式 设置优先），交给原生 `<image lazy-load>`。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Waterfall · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Waterfall } from '@snui/uni';",
    chipCopy: "import { Waterfall } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-waterfall', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-rich-text', link: '/en/components/uni/rich-text' },
    next: { text: 'sn-liquid', link: '/en/components/uni/liquid' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
