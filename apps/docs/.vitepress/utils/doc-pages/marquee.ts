/**
 * Marquee 跑马灯 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const marqueeDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Marquee 跑马灯' },
  ],
  title: 'Marquee 跑马灯',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnMarquee' },
    {
      t: 'text',
      s: ' 把插槽里的**一份**内容在裁剪盒内无缝循环滚动，常用于公告条、促销条、滚动通知。',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/marquee',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Marquee 跑马灯.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Marquee } from '@snui/vue-web';
</script>

<template>
  <Marquee />
</template>`,
  },
  demos: [
    { name: 'marquee-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'marquee-web-direction', title: '四个方向', blurb: '四个方向' },
    { name: 'marquee-web-notice', title: '通知栏形态', blurb: '通知栏形态' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: 'SnMarqueeDirection',
        default: "'left'",
        desc: 'Direction the content travels.',
      },
      {
        name: 'duration',
        type: 'number',
        default: 'DEFAULT_DURATION',
        desc: '一轮完整滚动的秒数。非有限值 / 非正数回退为 `12`。',
      },
      {
        name: 'repeat',
        type: 'number',
        default: 'MIN_COPIES',
        desc: '渲染几份插槽内容。强制取整并至少为 2（`Math.max(2, Math.floor(...))`）。',
      },
      { name: 'gap', type: 'number | string', default: 'DEFAULT_GAP', desc: '`24`' },
      { name: 'pauseOnHover', type: 'boolean', default: 'true', desc: '鼠标悬停时暂停动画。' },
      {
        name: 'playing',
        type: 'boolean',
        default: 'true',
        desc: '是否正在滚动，`false` 时原地冻结。',
      },
      {
        name: 'vertical',
        type: 'boolean',
        default: 'false',
        desc: "Shorthand for a vertical ticker: behaves as `direction=\"up\"` unless `direction` already is `'up'` / `'down'`.",
      },
      { name: 'height', type: 'number | string', default: '—', desc: '高度。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Marquee 跑马灯 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Marquee } from '@snui/vue-web';",
    chipCopy: "import { Marquee } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Marquee', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'carousel', link: '/components/web/carousel' },
    next: { text: 'countdown', link: '/components/web/countdown' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
