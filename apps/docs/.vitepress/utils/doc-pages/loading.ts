/**
 * Loading 加载中 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const loadingDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Loading 加载中' },
  ],
  title: 'Loading 加载中',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnLoading' },
    {
      t: 'text',
      s: ' 是加载指示器。单独使用只渲染一个转圈图标；传入默认插槽后变成遮罩层，内容保持挂载、被压暗且不可交互。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/loading',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Loading 加载中.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Loading } from '@snui/vue-web';
</script>

<template>
  <Loading />
</template>`,
  },
  demos: [
    { name: 'loading-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'loading-web-wrapper', title: '遮罩模式', blurb: '遮罩模式' },
    { name: 'loading-web-description', title: '加载文案', blurb: '加载文案' },
    { name: 'loading-web-customize-icon', title: '自定义图形', blurb: '自定义图形' },
    { name: 'loading-web-delay', title: '延迟显示', blurb: '延迟显示' },
    { name: 'loading-web-stroke', title: '描边颜色（stroke）', blurb: 'stroke 重置圆弧颜色。' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'size',
        type: "'tiny' | 'small' | 'medium' | 'large' | 'huge' | number",
        default: "'medium'",
        desc: 'Size tier, or a number treated as px. Mirrors n-spin `size`.',
      },
      { name: 'show', type: 'boolean', default: 'true', desc: '是否显示 spinner。' },
      {
        name: 'delay',
        type: 'number',
        default: 'undefined as any',
        desc: '延后多少毫秒显示；隐藏始终即时。',
      },
      { name: 'rotate', type: 'boolean', default: 'true', desc: '是否旋转自定义 `icon` 内容。' },
      {
        name: 'description',
        type: 'string',
        default: 'undefined as any',
        desc: 'spinner 下方的文字。',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: '施加到被包裹内容上的类名。',
      },
      {
        name: 'contentStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: '内容区样式。',
      },
      {
        name: 'stroke',
        type: 'string',
        default: 'undefined as any',
        desc: '弧线颜色，默认取 `--sn-web-spin-color`。',
      },
      {
        name: 'strokeWidth',
        type: 'number',
        default: 'undefined as any',
        desc: '弧线粗细（SVG 单位）。',
      },
      { name: 'scale', type: 'number', default: 'undefined as any', desc: '整体缩放系数。' },
      {
        name: 'radius',
        type: 'number',
        default: 'undefined as any',
        desc: '弧线半径（设计单位）。',
      },
      {
        name: 'spinning',
        type: 'boolean',
        default: 'undefined as any',
        desc: '**@deprecated**，请使用 `show`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnLoading.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '被包裹的内容；存在时加载动画覆盖其上。' },
      {
        name: 'description',
        props: '—',
        desc: '加载动画下方的富文本描述，优先于 `description` 属性。',
      },
      { name: 'icon', props: '—', desc: '自定义加载图形，替换内置 SVG 圆弧。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Loading 加载中 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Loading } from '@snui/vue-web';",
    chipCopy: "import { Loading } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Loading', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'drawer', link: '/components/web/drawer' },
    next: { text: 'skeleton', link: '/components/web/skeleton' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
