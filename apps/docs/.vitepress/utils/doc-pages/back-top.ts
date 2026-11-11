/**
 * BackTop 回到顶部 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const backTopDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'BackTop 回到顶部' },
  ],
  title: 'BackTop 回到顶部',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnBackTop' },
    { t: 'text', s: ' 是滚动超过阈值后浮出的「回到顶部」按钮，点击后带平滑动画滚回容器顶部。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/back-top',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'BackTop 回到顶部.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { BackTop } from '@snui/vue-web';
</script>

<template>
  <BackTop />
</template>`,
  },
  demos: [
    { name: 'back-top-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'back-top-web-visibility-height', title: '显示阈值', blurb: '显示阈值' },
    { name: 'back-top-web-change-position', title: '调整位置', blurb: '调整位置' },
    { name: 'back-top-web-target-container', title: '自动绑定容器', blurb: '自动绑定容器' },
    { name: 'back-top-web-control', title: '受控显示', blurb: 'show 受控，忽略滚动位置。' },
    { name: 'back-top-web-custom-content', title: '自定义内容', blurb: '默认插槽替换图标。' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean',
        default: 'undefined as any',
        desc: '是否显示按钮（受控）。`undefined` 表示由滚动位置决定。',
      },
      { name: 'right', type: 'string | number', default: '40', desc: '`40`' },
      { name: 'bottom', type: 'string | number', default: '40', desc: '`40`' },
      {
        name: 'to',
        type: 'HTMLElement | string',
        default: "'body'",
        desc: 'Element to render the button into. Accepted for API parity.',
      },
      { name: 'visibilityHeight', type: 'number', default: '180', desc: '触发显示的滚动高度。' },
      {
        name: 'listenTo',
        type: 'string | HTMLElement | Document | (() => HTMLElement | Document)',
        default: '—',
        desc: '滚动容器；省略时自动探测最近的滚动祖先。',
      },
      {
        name: 'target (deprecated)',
        type: '() => HTMLElement',
        default: '—',
        desc: '已废弃的滚动目标回调，请改用 `listenTo`；对齐 n-back-top `target`。',
      },
      {
        name: 'onUpdateShow',
        type: '(value: boolean) => void',
        default: '—',
        desc: '可见性变化时以新值调用，对应 `update:show`。',
      },
      {
        name: 'onShow (deprecated)',
        type: '() => void',
        default: '—',
        desc: '已废弃的显示回调，请改用 `onUpdateShow`。',
      },
      {
        name: 'onHide (deprecated)',
        type: '() => void',
        default: '—',
        desc: '已废弃的隐藏回调，请改用 `onUpdateShow`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnBackTop.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'default', props: '—', desc: '自定义按钮内容，替换内置箭头图标。' }],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'BackTop 回到顶部 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { BackTop } from '@snui/vue-web';",
    chipCopy: "import { BackTop } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'BackTop', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'anchor', link: '/components/web/anchor' },
    next: { text: 'floating-toc', link: '/components/web/floating-toc' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
