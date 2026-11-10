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
        name: 'listenTo',
        type: 'string | SnAffixScrollTarget | (() => HTMLElement | Document)',
        default: '—',
        desc: '监听的滚动容器；省略时回退到 `document`。',
      },
      {
        name: 'top',
        type: 'number',
        default: 'undefined as any',
        desc: '触发顶部固定后的 CSS `top`。未设定时使用 `triggerTop`。',
      },
      {
        name: 'bottom',
        type: 'number',
        default: 'undefined as any',
        desc: '触发底部固定后的 CSS `bottom`。未设定时使用 `triggerBottom`。',
      },
      {
        name: 'triggerTop',
        type: 'number',
        default: 'undefined as any',
        desc: '触发顶部固定时与目标元素顶部的距离。未设定时使用 `top`。',
      },
      {
        name: 'triggerBottom',
        type: 'number',
        default: 'undefined as any',
        desc: '触发底部固定时与目标元素底部的距离。未设定时使用 `bottom`。',
      },
      {
        name: 'position',
        type: "'fixed' | 'absolute'",
        default: "'fixed'",
        desc: '`fixed` removes the element from flow; `absolute` keeps it in flow.',
      },
      {
        name: 'offsetTop',
        type: 'number',
        default: 'undefined as any',
        desc: '距顶部偏移量（px）。',
      },
      {
        name: 'offsetBottom',
        type: 'number',
        default: 'undefined as any',
        desc: '距底部偏移量（px）。',
      },
      {
        name: 'target (deprecated)',
        type: '() => HTMLElement',
        default: '—',
        desc: '已废弃的滚动目标回调，请改用 `listenTo`；对齐 n-affix `target`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnAffix.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'default', props: '—', desc: '需要吸附的内容元素。' }],
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
