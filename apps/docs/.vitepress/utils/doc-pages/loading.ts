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
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
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
    { name: 'loading-web-custom', title: '颜色与缩放', blurb: '颜色与缩放' },
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
      {
        name: 'show',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the spinner is visible. Mirrors n-spin `show`.',
      },
      {
        name: 'delay',
        type: 'number',
        default: 'undefined as any',
        desc: 'Defer the spinner by N ms; hiding is always immediate. Mirrors `delay`.',
      },
      {
        name: 'rotate',
        type: 'boolean',
        default: 'true',
        desc: 'Rotate a custom `icon` slot. Ignored for the built-in spinner, which is animated by SMIL. Mirrors n-spin `rotate`.',
      },
      {
        name: 'description',
        type: 'string',
        default: 'undefined as any',
        desc: 'Text under the spinner. Mirrors n-spin `description`.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: 'Class applied to the wrapped content. Mirrors `contentClass`.',
      },
      {
        name: 'contentStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: 'Style applied to the wrapped content. Mirrors `contentStyle`.',
      },
      {
        name: 'stroke',
        type: 'string',
        default: 'undefined as any',
        desc: 'Custom arc colour. Mirrors n-spin `stroke`.',
      },
      {
        name: 'strokeWidth',
        type: 'number',
        default: 'undefined as any',
        desc: 'Arc thickness in SVG units. Mirrors n-spin `strokeWidth`.',
      },
      {
        name: 'scale',
        type: 'number',
        default: 'undefined as any',
        desc: 'Overall scale factor. Mirrors n-spin `scale`.',
      },
      {
        name: 'radius',
        type: 'number',
        default: 'undefined as any',
        desc: 'SVG arc radius in design units. Mirrors n-spin `radius`.',
      },
      {
        name: 'spinning',
        type: 'boolean',
        default: 'undefined as any',
        desc: 'Deprecated upstream alias for `show`; wins when both are set. Mirrors n-spin `spinning`.',
      },
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
