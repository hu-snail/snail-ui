/**
 * Tag 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const tagDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Tag' }],
  title: 'Tag',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '标签组件。六色 type、可关闭、可选中（checkable）、异形形态、加载态、自定义颜色（对齐 naive-ui ',
    },
    { t: 'code', s: 'n-tag' },
    { t: 'text', s: '）。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tag',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Tag.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tag } from '@snui/vue-web';
</script>

<template>
  <Tag />
</template>`,
  },
  demos: [
    { name: 'tag-web-basic', title: '基础用法', blurb: '六色 type + 三档 size + 胶囊。' },
    {
      name: 'tag-web-closable',
      title: '可关闭（closable）',
      blurb: 'close 事件 + 内部隐藏 + close-icon 插槽 + loading 阻止关闭。',
    },
    {
      name: 'tag-web-checkable',
      title: '可选中（checkable）',
      blurb: 'v-model:checked + 选中态取 type 色 + 键盘 Enter/Space。',
    },
    {
      name: 'tag-web-shapes',
      title: '异形形态（shape）',
      blurb:
        'shape：square / round / skew / ribbon / fold / ticket，可与 closable / checkable / color 组合。',
    },
    {
      name: 'tag-web-icon',
      title: '图标与头像（icon / avatar）',
      blurb: 'icon 插槽（loading 时被 spinner 替换）+ avatar 插槽。',
    },
    {
      name: 'tag-web-loading',
      title: '加载中状态（loading）',
      blurb: 'loading 显示内联 spinner，关闭与选中均被阻止，aria-busy。',
    },
    {
      name: 'tag-web-color',
      title: '自定义颜色（color）',
      blurb:
        'color 支持 string 或 { color, borderColor, textColor } 对象；未给 textColor 时自动按对比度选字色。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'",
        default: "'default'",
        desc: 'Semantic type — drives colors. Mirrors n-tag `type`.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Tag scale. Mirrors n-tag `size`.',
      },
      {
        name: 'shape',
        type: "'square' | 'round' | 'skew' | 'ribbon' | 'fold' | 'ticket'",
        default: "'square'",
        desc: 'Special-shape variant (AUI additive, §112.3a). `square` is the plain rectangle; `round` is the capsule.',
      },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: "Pill-shaped corners. Mirrors n-tag `round`; sugar for `shape: 'round'`.",
      },
      { name: 'closable', type: 'boolean', default: 'false', desc: '关闭按钮' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: '加载态（AUI 追加；阻止 close/选中）',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
      { name: 'bordered', type: 'boolean', default: 'true', desc: '边框' },
      {
        name: 'color',
        type: 'string | TagCustomColor | undefined',
        default: 'undefined',
        desc: '—',
      },
      { name: 'checkable', type: 'boolean', default: 'false', desc: '可选中' },
      {
        name: 'checked',
        type: 'boolean',
        default: 'false',
        desc: 'v-model:checked（选中态取 type 色）',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tag 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tag } from '@snui/vue-web';",
    chipCopy: "import { Tag } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Tag', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'avatar', link: '/components/web/avatar' },
    next: { text: 'dropdown', link: '/components/web/dropdown' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
