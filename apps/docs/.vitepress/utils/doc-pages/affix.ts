/**
 * Affix 固钉 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const affixDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Affix 固钉' },
  ],
  title: 'Affix 固钉',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnAffix' },
    {
      t: 'text',
      s: ' 把内容吸附在视口（或自定义滚动容器）的顶部/底部，滚动回阈值以上时自动释放。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/affix',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Affix 固钉.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Affix } from '@snui/vue-web';
</script>

<template>
  <Affix />
</template>`,
  },
  demos: [
    { name: 'affix-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'affix-web-position', title: '吸附位置', blurb: '吸附位置' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'top',
        type: 'number',
        default: 'undefined as any',
        desc: 'Offset from the viewport top when stuck.',
      },
      {
        name: 'bottom',
        type: 'number',
        default: 'undefined as any',
        desc: 'Offset from the viewport bottom when stuck.',
      },
      {
        name: 'triggerTop',
        type: 'number',
        default: 'undefined as any',
        desc: 'Scroll threshold that starts top-sticking. Falls back to `top`.',
      },
      {
        name: 'triggerBottom',
        type: 'number',
        default: 'undefined as any',
        desc: 'Scroll threshold that starts bottom-sticking. Falls back to `bottom`.',
      },
      {
        name: 'position',
        type: "'fixed' | 'absolute'",
        default: "'fixed'",
        desc: '`fixed` removes the element from flow; `absolute` keeps it in flow.',
      },
      { name: 'offsetTop', type: 'number', default: 'undefined as any', desc: 'offsetTop' },
      { name: 'offsetBottom', type: 'number', default: 'undefined as any', desc: 'offsetBottom' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Affix 固钉 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Affix } from '@snui/vue-web';",
    chipCopy: "import { Affix } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Affix', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tooltip', link: '/components/web/tooltip' },
    next: { text: 'anchor', link: '/components/web/anchor' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
