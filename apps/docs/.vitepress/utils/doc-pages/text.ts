/**
 * Text 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const textDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Text 排版' }],
  title: 'Text 排版',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '文本排版组件。六色 type、depth 色阶、行内样式修饰、code 底色。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/text',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Text.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Text } from '@snui/vue-web';
</script>

<template>
  <Text />
</template>`,
  },
  demos: [
    { name: 'text-web-basic', title: '基础用法', blurb: '默认文本 + 六色 type。' },
    {
      name: 'text-web-styles',
      title: '修饰样式',
      blurb: 'strong / italic / underline / delete / code / disabled。',
    },
    {
      name: 'text-web-depth',
      title: '次级色阶（depth）',
      blurb: "depth='1'-'3' 仅 default 型生效。",
    },
    {
      name: 'text-web-title',
      title: '标题与段落',
      blurb: 'SnTitle level 1-6；SnParagraph 行距档位。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'",
        default: "'default'",
        desc: 'Semantic type — drives the text color. Mirrors n-text `type`.',
      },
      {
        name: 'depth',
        type: "'1' | '2' | '3' | undefined",
        default: 'undefined',
        desc: 'Gray scale — only applied for type="default". Mirrors n-text `depth`.',
      },
      {
        name: 'strong',
        type: 'boolean',
        default: 'false',
        desc: '文本加粗。对应 n-text 的 `strong`。',
      },
      {
        name: 'italic',
        type: 'boolean',
        default: 'false',
        desc: '斜体文本。对应 n-text 的 `italic`。',
      },
      {
        name: 'underline',
        type: 'boolean',
        default: 'false',
        desc: '下划线文本。对应 n-text 的 `underline`。',
      },
      {
        name: 'delete',
        type: 'boolean',
        default: 'false',
        desc: '删除线文本。对应 n-text 的 `delete`。',
      },
      { name: 'code', type: 'boolean', default: 'false', desc: '行内代码底色' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用色' },
      {
        name: 'tag',
        type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'blockquote'",
        default: "'span'",
        desc: 'Rendered element. Mirrors n-text `tag`.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Extra class merged onto the rendered element.',
      },
      {
        name: 'customStyle',
        type: 'string | CSSProperties | undefined',
        default: 'undefined',
        desc: '合并到渲染元素上的内联样式。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnText.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'default', props: '—', desc: '文本内容。' }],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Text 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Text } from '@snui/vue-web';",
    chipCopy: "import { Text } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Text', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'icon', link: '/components/web/icon' },
    next: { text: 'avatar', link: '/components/web/avatar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
